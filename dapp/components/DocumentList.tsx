"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { formatAddress, formatTimestamp, isValidHash } from "@/lib/utils";
import { useContractConfig } from "@/hooks/useContractConfig";

interface DocumentInfo {
  hash: string;
  timestamp: bigint;
  signer: string;
  signature: string;
}

export default function DocumentList() {
  const { contract, provider, isConnected } = useWallet();
  const { config: contractConfig } = useContractConfig();
  const {
    documents: localDocuments,
    toggleDocumentActive,
    addDocument,
  } = useDocuments();
  const [loading, setLoading] = useState(false);
  const [searchHash, setSearchHash] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showHelp, setShowHelp] = useState(false);

  // Filter documents based on searchHash and activeFilter
  const filteredDocuments = localDocuments.filter((doc) => {
    // Filter by hash if search field is not empty
    if (searchHash.trim()) {
      const searchLower = searchHash.trim().toLowerCase();
      const matchesHash = doc.hash.toLowerCase().includes(searchLower);
      if (!matchesHash) return false;
    }

    // Filter by active status
    if (activeFilter === "active") {
      return doc.activo === true;
    } else if (activeFilter === "inactive") {
      return doc.activo === false;
    }
    // activeFilter === "all" - show all documents
    return true;
  });

  const loadDocument = useCallback(
    async (hash: string) => {
      if (!contract) return null;

      // Validar hash antes de hacer cualquier llamada
      if (!hash || !isValidHash(hash)) {
        console.warn("Hash inválido:", hash);
        return null;
      }

      try {
        // Verificar que el contrato esté desplegado
        // En ethers.js v6, el provider está en contract.runner.provider
        const contractProvider = contract.runner?.provider || provider;
        if (contractProvider) {
          // Usar la configuración dinámica del contrato
          const code = await contractProvider.getCode(
            contractConfig.contractAddress
          );
          if (!code || code === "0x" || code === "0x0") {
            console.warn(
              "Contrato no desplegado en",
              contractConfig.contractAddress
            );
            return null;
          }
        }

        const exists = await contract.isDocumentStored(hash);
        if (!exists) {
          return null;
        }

        const [documentHash, timestamp, signer, signature] =
          await contract.getDocumentInfo(hash);

        return {
          hash: documentHash,
          timestamp,
          signer,
          signature,
        };
      } catch (error: any) {
        // Ignorar errores BAD_DATA (contrato no desplegado)
        if (
          error?.code === "BAD_DATA" ||
          error?.message?.includes("could not decode result data")
        ) {
          console.warn(
            "Contrato no desplegado o error de decodificación:",
            error
          );
          return null;
        }
        console.error("Error loading document:", error);
        return null;
      }
    },
    [contract, provider]
  );

  // Escuchar eventos de nuevos documentos
  useEffect(() => {
    if (!contract || !provider) return;

    const filter = contract.filters.DocumentStored();

    // En ethers.js v6, los eventos pueden venir en diferentes formatos
    // Necesitamos manejar tanto el formato de argumentos directos como el formato de evento completo
    const handleNewDocument = (...args: any[]) => {
      try {
        // Si el primer argumento es un objeto con 'args', es un evento completo
        let hash: string;
        if (args[0] && typeof args[0] === "object" && args[0].args) {
          // Formato de evento completo: extraer args
          const eventArgs = args[0].args;
          hash = eventArgs[0]; // Primer argumento es el hash
          const signer = eventArgs[1];
          const timestamp = eventArgs[2];
          console.log("Nuevo documento almacenado (evento completo):", {
            hash,
            signer,
            timestamp,
          });
        } else {
          // Formato de argumentos directos
          hash = args[0];
          const signer = args[1];
          const timestamp = args[2];
          console.log("Nuevo documento almacenado (argumentos directos):", {
            hash,
            signer,
            timestamp,
          });
        }

        // Validar hash antes de cargar
        if (hash && isValidHash(hash)) {
          loadDocument(hash).then((doc) => {
            if (doc) {
              // Verificar si ya existe en el contexto local
              const existsInLocal = localDocuments.some(
                (d) => d.hash.toLowerCase() === doc.hash.toLowerCase()
              );
              if (!existsInLocal) {
                addDocument({
                  hash: doc.hash,
                  timestamp: doc.timestamp,
                  signer: doc.signer,
                  signature: doc.signature,
                });
              }
            }
          });
        } else {
          console.warn("Hash inválido recibido del evento:", hash);
        }
      } catch (error) {
        console.error("Error procesando evento DocumentStored:", error);
      }
    };

    contract.on(filter, handleNewDocument);

    return () => {
      contract.off(filter, handleNewDocument);
    };
  }, [contract, provider, loadDocument, localDocuments, addDocument]);

  const handleSearch = async () => {
    if (!searchHash.trim() || !contract) return;

    const trimmedHash = searchHash.trim();

    // Validar formato del hash antes de hacer la búsqueda
    if (!isValidHash(trimmedHash)) {
      alert(
        "Hash inválido. Por favor ingresa un hash válido en formato hexadecimal (0x + 64 caracteres).\n\n" +
          `Ejemplo: 0x61dd80061de1c2c91755198a43173949493499f1dbadcb6319653640d51092b7`
      );
      setSearchHash("");
      return;
    }

    setLoading(true);
    try {
      // Verificar que el contrato esté desplegado
      // En ethers.js v6, el provider está en contract.runner.provider
      const contractProvider = contract.runner?.provider || provider;
      if (contractProvider) {
        // Usar la configuración dinámica del contrato
        const code = await contractProvider.getCode(
          contractConfig.contractAddress
        );
        if (!code || code === "0x" || code === "0x0") {
          alert(
            "El contrato no está desplegado. " +
              "Por favor despliega el contrato primero usando: " +
              "forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast"
          );
          return;
        }
      }

      const doc = await loadDocument(trimmedHash);
      if (doc) {
        // Guardar en el contexto local si no existe
        const existsInLocal = localDocuments.some(
          (d) => d.hash.toLowerCase() === doc.hash.toLowerCase()
        );
        if (!existsInLocal) {
          addDocument({
            hash: doc.hash,
            timestamp: doc.timestamp,
            signer: doc.signer,
            signature: doc.signature,
          });
        }
        // Keep the search field active to show the filtered result
        // Don't clear the search field after successful search
      } else {
        alert("Documento no encontrado");
        // Clear search field if document not found
        setSearchHash("");
      }
    } catch (error: any) {
      console.error("Error searching document:", error);
      if (
        error?.code === "BAD_DATA" ||
        error?.message?.includes("could not decode result data")
      ) {
        alert(
          "El contrato no está desplegado o la dirección es incorrecta. " +
            "Por favor verifica el deployment del contrato."
        );
      } else {
        alert(
          `Error al buscar el documento: ${
            error?.message || "Error desconocido"
          }`
        );
      }
      // Clear search field on error
      setSearchHash("");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-lg p-6 border-2 border-verdigris-200 dark:border-lapis-lazuli-700">
        <p className="text-verdigris-700 dark:text-verdigris-300 font-medium">
          Conectando a Anvil...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-lg border-2 border-cerulean-200 dark:border-lapis-lazuli-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cerulean-50 to-lapis-lazuli-50 dark:from-cerulean-900/20 dark:to-lapis-lazuli-900/20 px-6 py-4 border-b-2 border-cerulean-200 dark:border-lapis-lazuli-700 relative">
        <h2 className="text-2xl font-bold text-indigo-dye dark:text-cerulean-200 flex items-center gap-3">
          <span className="text-3xl">📚</span>
          <span>Documentos en Blockchain</span>
          <div className="ml-auto flex items-center gap-3">
            {localDocuments.length > 0 && (
              <span className="text-sm font-normal bg-white dark:bg-lapis-lazuli-800 px-3 py-1 rounded-full border border-cerulean-300 dark:border-lapis-lazuli-600 text-cerulean-700 dark:text-cerulean-300">
                {localDocuments.length} documento
                {localDocuments.length !== 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-cerulean-500 hover:bg-cerulean-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-110"
              title="Ayuda - Cómo usar este componente"
              aria-label="Mostrar ayuda"
            >
              ?
            </button>
          </div>
        </h2>

        {/* Modal de Ayuda */}
        {showHelp && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowHelp(false)}
            ></div>

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-2xl border-2 border-cerulean-200 dark:border-lapis-lazuli-700 z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header del Modal */}
              <div className="bg-gradient-to-r from-cerulean-500 to-lapis-lazuli-500 px-6 py-4 rounded-t-xl flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>Guía de Uso - Documentos en Blockchain</span>
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-all transform hover:scale-110"
                  aria-label="Cerrar ayuda"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6">
                {/* Introducción */}
                <div className="bg-light-green-50 dark:bg-keppel-900/20 rounded-lg p-4 border border-light-green-200 dark:border-keppel-700">
                  <p className="text-sm text-indigo-dye-700 dark:text-keppel-200">
                    Este componente te permite gestionar y visualizar documentos
                    almacenados en la blockchain. Puedes filtrar, buscar y
                    gestionar el estado de tus documentos fácilmente.
                  </p>
                </div>

                {/* Funcionalidades */}
                <div className="space-y-4">
                  {/* Búsqueda y Filtrado por Hash */}
                  <div className="border-l-4 border-cerulean-500 pl-4">
                    <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-cerulean-200 mb-2 flex items-center gap-2">
                      <span>🔍</span>
                      <span>Búsqueda y Filtrado por Hash</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Filtrado en tiempo real:</strong> Escribe un
                          hash en el campo de búsqueda para filtrar los
                          documentos localmente mostrados. El filtrado ocurre
                          automáticamente mientras escribes.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Búsqueda en Blockchain:</strong> Ingresa un
                          hash válido (formato 0x + 64 caracteres hex) y haz
                          clic en "🔍 Buscar" o presiona Enter para buscar el
                          documento en la blockchain. Si se encuentra, se
                          agregará a tu lista local.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Limpiar filtro:</strong> Haz clic en el botón
                          "✕" para limpiar el campo de búsqueda y ver todos los
                          documentos nuevamente.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Filtrado por Estado */}
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-cerulean-200 mb-2 flex items-center gap-2">
                      <span>🎯</span>
                      <span>Filtrado por Estado</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Todos:</strong> Muestra todos los documentos
                          sin filtrar por estado.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Activos:</strong> Muestra solo los documentos
                          marcados como activos. Los botones muestran el conteo
                          de documentos en cada categoría.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Inactivos:</strong> Muestra solo los
                          documentos marcados como inactivos.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Filtros combinados:</strong> Puedes combinar
                          el filtro de hash con el filtro de estado para
                          encontrar documentos específicos más fácilmente.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Gestión de Documentos */}
                  <div className="border-l-4 border-keppel-500 pl-4">
                    <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-cerulean-200 mb-2 flex items-center gap-2">
                      <span>📄</span>
                      <span>Gestión de Documentos</span>
                    </h4>
                    <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Activar/Desactivar:</strong> Cada documento
                          tiene un botón en su header que te permite cambiar su
                          estado entre activo e inactivo. Esto solo afecta la
                          visualización local,
                          <strong className="text-indigo-dye-700 dark:text-cerulean-200">
                            {" "}
                            no modifica la blockchain
                          </strong>
                          .
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Información del documento:</strong> Cada
                          tarjeta muestra el hash, el firmante, la fecha de
                          registro, y si está disponible, el nombre del archivo
                          y el hash de la transacción.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          <strong>Actualización automática:</strong> Los
                          documentos almacenados en la blockchain se agregan
                          automáticamente a tu lista local mediante eventos del
                          contrato.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Consejos */}
                  <div className="bg-bondi-blue-50 dark:bg-bondi-blue-900/20 rounded-lg p-4 border border-bondi-blue-200 dark:border-bondi-blue-700">
                    <h4 className="font-bold text-sm text-bondi-blue-700 dark:text-bondi-blue-200 mb-2">
                      💡 Consejos
                    </h4>
                    <ul className="space-y-1 text-xs text-bondi-blue-600 dark:text-bondi-blue-300 ml-4">
                      <li>
                        • El filtrado por hash es parcial y no distingue entre
                        mayúsculas y minúsculas.
                      </li>
                      <li>
                        • Para buscar en blockchain, el hash debe estar en
                        formato completo (0x + 64 caracteres).
                      </li>
                      <li>
                        • Los cambios de estado (activo/inactivo) son locales y
                        se pierden al recargar la página.
                      </li>
                      <li>
                        • Usa los contadores en los botones de filtro para saber
                        cuántos documentos hay en cada categoría.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="bg-gray-50 dark:bg-lapis-lazuli-800 px-6 py-3 rounded-b-xl border-t border-gray-200 dark:border-lapis-lazuli-700 flex justify-end">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 bg-cerulean-500 hover:bg-cerulean-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                >
                  Entendido
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Sección de Filtros y Búsqueda */}
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="bg-light-green-50 dark:bg-keppel-900/10 rounded-xl p-4 border border-light-green-200 dark:border-keppel-700">
            <label className="block text-sm font-semibold text-indigo-dye-700 dark:text-keppel-300 mb-2">
              🔍 Buscar o Filtrar por Hash
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Ingresa hash para filtrar (0x...)"
                className="flex-1 px-4 py-2.5 border-2 border-cerulean-200 dark:border-lapis-lazuli-600 rounded-lg
                  bg-white dark:bg-lapis-lazuli-800 text-indigo-dye dark:text-cerulean-100
                  focus:outline-none focus:ring-2 focus:ring-cerulean-400 focus:border-cerulean-400
                  transition-all text-sm"
                onKeyPress={(e) => {
                  if (
                    e.key === "Enter" &&
                    searchHash.trim() &&
                    isValidHash(searchHash.trim())
                  ) {
                    handleSearch();
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={
                    loading ||
                    !searchHash.trim() ||
                    !isValidHash(searchHash.trim())
                  }
                  className="px-4 py-2.5 bg-gradient-to-r from-cerulean-500 to-lapis-lazuli-500 hover:from-cerulean-600 hover:to-lapis-lazuli-600 disabled:from-indigo-dye-300 disabled:to-indigo-dye-300
                    text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none text-sm whitespace-nowrap"
                  title={
                    searchHash.trim() && !isValidHash(searchHash.trim())
                      ? "Ingresa un hash válido para buscar en blockchain"
                      : "Buscar documento en blockchain"
                  }
                >
                  {loading ? "⏳" : "🔍"} Buscar
                </button>
                {searchHash.trim() && (
                  <button
                    onClick={() => setSearchHash("")}
                    className="px-4 py-2.5 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                    title="Limpiar filtro de hash"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="bg-light-green-50 dark:bg-keppel-900/10 rounded-xl p-4 border border-light-green-200 dark:border-keppel-700">
            <label className="block text-sm font-semibold text-indigo-dye-700 dark:text-keppel-300 mb-3">
              🎯 Filtrar por Estado
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-cerulean-500 to-lapis-lazuli-500 text-white shadow-md"
                    : "bg-white dark:bg-lapis-lazuli-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-cerulean-400 dark:hover:border-cerulean-600"
                }`}
                title="Mostrar todos los documentos"
              >
                Todos ({localDocuments.length})
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md ${
                  activeFilter === "active"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600"
                }`}
                title="Mostrar solo documentos activos"
              >
                ✓ Activos ({localDocuments.filter((d) => d.activo).length})
              </button>
              <button
                onClick={() => setActiveFilter("inactive")}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md ${
                  activeFilter === "inactive"
                    ? "bg-gray-500 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-600"
                }`}
                title="Mostrar solo documentos inactivos"
              >
                ✗ Inactivos ({localDocuments.filter((d) => !d.activo).length})
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {(searchHash.trim() || activeFilter !== "all") &&
          filteredDocuments.length > 0 && (
            <div className="p-3 bg-cerulean-50 dark:bg-cerulean-900/20 rounded-lg border border-cerulean-200 dark:border-cerulean-700">
              <p className="text-sm text-cerulean-700 dark:text-cerulean-300 font-medium">
                📊 Mostrando {filteredDocuments.length} de{" "}
                {localDocuments.length} documento
                {localDocuments.length !== 1 ? "s" : ""}
                {searchHash.trim() && ` que coinciden con "${searchHash}"`}
                {activeFilter === "active" && " (solo activos)"}
                {activeFilter === "inactive" && " (solo inactivos)"}
              </p>
            </div>
          )}

        {/* Lista de documentos */}
        {localDocuments.length === 0 ? (
          <div className="p-12 text-center bg-light-green-50 dark:bg-keppel-900/20 rounded-xl border-2 border-light-green-200 dark:border-keppel-700">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-indigo-dye-600 dark:text-keppel-300 font-semibold text-lg mb-2">
              No hay documentos cargados
            </p>
            <p className="text-sm text-indigo-dye-500 dark:text-keppel-400">
              Sube un documento usando el componente de carga o busca uno por su
              hash en la blockchain
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center bg-bondi-blue-50 dark:bg-bondi-blue-900/20 rounded-xl border-2 border-bondi-blue-200 dark:border-bondi-blue-700">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-bondi-blue-600 dark:text-bondi-blue-300 font-semibold text-lg mb-2">
              No se encontraron documentos
            </p>
            <p className="text-sm text-bondi-blue-500 dark:text-bondi-blue-400 mb-4">
              No hay documentos que coincidan con los filtros aplicados
            </p>
            <button
              onClick={() => {
                setSearchHash("");
                setActiveFilter("all");
              }}
              className="px-4 py-2 bg-bondi-blue-500 hover:bg-bondi-blue-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
            >
              Limpiar todos los filtros
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc, index) => (
              <div
                key={`${doc.hash}-${index}`}
                className={`rounded-xl border-2 shadow-md hover:shadow-lg transition-all overflow-hidden ${
                  doc.activo
                    ? "bg-gradient-to-br from-light-green-50 to-keppel-50 dark:from-keppel-900/20 dark:to-lapis-lazuli-800 border-light-green-200 dark:border-keppel-700"
                    : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-lapis-lazuli-800 border-gray-300 dark:border-gray-700 opacity-75"
                }`}
              >
                {/* Header del documento */}
                <div
                  className={`px-5 py-3 border-b-2 ${
                    doc.activo
                      ? "bg-light-green-100 dark:bg-keppel-900/30 border-light-green-200 dark:border-keppel-700"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          doc.activo
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {doc.activo ? "✓ ACTIVO" : "✗ INACTIVO"}
                      </span>
                      {doc.fileName && (
                        <span className="text-sm font-semibold text-indigo-dye-700 dark:text-keppel-200">
                          📄 {doc.fileName}
                          {doc.fileSize && (
                            <span className="text-xs text-indigo-dye-600 dark:text-keppel-400 ml-2">
                              ({(doc.fileSize / 1024).toFixed(2)} KB)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleDocumentActive(doc.hash)}
                      className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                        doc.activo
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-gray-500 hover:bg-gray-600 text-white"
                      }`}
                      title={
                        doc.activo
                          ? "Desactivar documento"
                          : "Activar documento"
                      }
                    >
                      {doc.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>

                {/* Contenido del documento */}
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-indigo-dye-600 dark:text-keppel-400 mb-1 uppercase tracking-wide">
                        Hash del Documento
                      </label>
                      <div className="font-mono text-sm text-indigo-dye dark:text-keppel-100 break-all bg-white dark:bg-lapis-lazuli-900 px-3 py-2 rounded-lg border border-keppel-200 dark:border-keppel-700">
                        {doc.hash}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-indigo-dye-600 dark:text-keppel-400 mb-1 uppercase tracking-wide">
                        Firmado por
                      </label>
                      <div className="font-mono text-sm text-indigo-dye dark:text-keppel-100 bg-white dark:bg-lapis-lazuli-900 px-3 py-2 rounded-lg border border-keppel-200 dark:border-keppel-700">
                        {formatAddress(doc.signer)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-indigo-dye-600 dark:text-keppel-400 mb-1 uppercase tracking-wide">
                        Fecha de Registro
                      </label>
                      <div className="text-sm text-indigo-dye dark:text-keppel-100 bg-white dark:bg-lapis-lazuli-900 px-3 py-2 rounded-lg border border-keppel-200 dark:border-keppel-700">
                        📅 {formatTimestamp(doc.timestamp)}
                      </div>
                    </div>

                    {doc.txHash && (
                      <div>
                        <label className="block text-xs font-bold text-indigo-dye-600 dark:text-keppel-400 mb-1 uppercase tracking-wide">
                          Transacción
                        </label>
                        <div className="font-mono text-xs text-indigo-dye dark:text-keppel-100 break-all bg-white dark:bg-lapis-lazuli-900 px-3 py-2 rounded-lg border border-keppel-200 dark:border-keppel-700">
                          🔗 {doc.txHash}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
