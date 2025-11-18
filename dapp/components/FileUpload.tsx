"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { calculateFileHash, signHash } from "@/lib/utils";
import { useContractConfig } from "@/hooks/useContractConfig";

export default function FileUpload() {
  const { currentWallet, contract, isConnected } = useWallet();
  const { config: contractConfig } = useContractConfig();
  const { addDocument } = useDocuments();
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [copiedTxHash, setCopiedTxHash] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setHash(""); // Limpiar hash anterior
    setStatus(null);
  };

  const handleStore = async () => {
    if (!file || !currentWallet || !contract) {
      setStatus({ type: "error", message: "Por favor selecciona un archivo" });
      return;
    }

    // Calcular hash antes de mostrar el modal
    try {
      setLoading(true);
      setStatus(null);
      setProcessingStep("Calculando hash del archivo...");

      const fileHash = await calculateFileHash(file);
      setHash(fileHash);
      setProcessingStep("");

      // Mostrar modal de confirmación
      setShowConfirmModal(true);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error calculando hash del archivo",
      });
      console.error(error);
    } finally {
      setLoading(false);
      setProcessingStep("");
    }
  };

  const handleConfirmStore = async () => {
    if (!file || !hash || !currentWallet || !contract) {
      setStatus({ type: "error", message: "Por favor selecciona un archivo" });
      setShowConfirmModal(false);
      return;
    }

    setShowConfirmModal(false);

    try {
      setLoading(true);
      setStatus(null);
      setProcessingStep("Verificando contrato...");

      // Verificar que el contrato esté desplegado
      // En ethers.js v6, el provider está en contract.runner.provider o podemos usar currentWallet.provider
      const provider = contract.runner?.provider || currentWallet?.provider;
      if (!provider) {
        throw new Error("Provider no disponible");
      }

      // Usar la configuración dinámica del contrato
      setProcessingStep("Verificando despliegue del contrato...");
      const code = await provider.getCode(contractConfig.contractAddress);
      if (!code || code === "0x" || code === "0x0") {
        throw new Error(
          "El contrato no está desplegado. " +
            "Por favor despliega el contrato primero usando: " +
            "forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast"
        );
      }

      // Verificar si el documento ya está almacenado antes de intentar almacenarlo
      setProcessingStep("Verificando si el documento ya existe...");
      const alreadyStored = await contract.isDocumentStored(hash);
      if (alreadyStored) {
        // Obtener información del documento existente
        try {
          const [documentHash, timestamp, signer, signature] =
            await contract.getDocumentInfo(hash);
          const storedDate = new Date(
            Number(timestamp) * 1000
          ).toLocaleString();
          throw new Error(
            `Este documento ya está almacenado en la blockchain.\n\n` +
              `Hash: ${documentHash}\n` +
              `Almacenado por: ${signer}\n` +
              `Fecha: ${storedDate}\n\n` +
              `No puedes almacenar el mismo documento dos veces.`
          );
        } catch (infoError: any) {
          // Si no podemos obtener la info, mostrar mensaje genérico
          if (!infoError.message.includes("ya está almacenado")) {
            throw new Error(
              "Este documento ya está almacenado en la blockchain. " +
                "No puedes almacenar el mismo documento dos veces."
            );
          }
          throw infoError;
        }
      }

      // Firmar el hash
      setProcessingStep("Firmando documento con tu wallet...");
      const signature = await signHash(hash, currentWallet);

      // Obtener timestamp actual
      const timestamp = Math.floor(Date.now() / 1000);

      // Almacenar en el contrato
      setProcessingStep("Enviando transacción a la blockchain...");
      const tx = await contract.storeDocumentHash(hash, timestamp, signature);

      setProcessingStep("Esperando confirmación de la transacción...");
      await tx.wait();

      // Obtener información del documento almacenado para guardarlo localmente
      setProcessingStep("Obteniendo información del documento almacenado...");
      const [documentHash, documentTimestamp, signer, documentSignature] =
        await contract.getDocumentInfo(hash);

      // Guardar en el contexto local
      addDocument({
        hash: documentHash,
        timestamp: documentTimestamp,
        signer: signer,
        signature: documentSignature,
        fileName: file.name,
        fileSize: file.size,
        txHash: tx.hash,
      });

      setStatus({
        type: "success",
        message: `Documento almacenado exitosamente! TX: ${tx.hash}`,
      });

      // Limpiar formulario
      setFile(null);
      setHash("");
      setProcessingStep("");
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      // Detectar errores específicos del contrato
      let errorMessage = "Error al almacenar el documento";

      if (error?.reason) {
        // Error revertido del contrato
        errorMessage = error.reason;
      } else if (error?.data?.message) {
        // Error con data.message
        errorMessage = error.data.message;
      } else if (error?.message) {
        // Error estándar
        errorMessage = error.message;

        // Detectar específicamente el error "document already stored"
        if (
          error.message.includes("document already stored") ||
          error.message.includes("ya está almacenado")
        ) {
          errorMessage = error.message;
        }
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
      setProcessingStep("");
      console.error("Error almacenando documento:", error);
    } finally {
      setLoading(false);
      setProcessingStep("");
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
    <div className="bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-lg border-2 border-emerald-200 dark:border-lapis-lazuli-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-keppel-50 dark:from-emerald-900/20 dark:to-keppel-900/20 px-6 py-4 border-b-2 border-emerald-200 dark:border-lapis-lazuli-700 relative">
        <h2 className="text-2xl font-bold text-indigo-dye dark:text-emerald-200 flex items-center gap-3">
          <span className="text-3xl">📄</span>
          <span>Subir y Almacenar Documento</span>
          <div className="ml-auto">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-110"
              title="Ayuda - Cómo subir y almacenar documentos"
              aria-label="Mostrar ayuda"
            >
              ?
            </button>
          </div>
        </h2>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-indigo-dye-600 dark:text-keppel-300 mb-2">
            Seleccionar Archivo
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Input de archivo - Examinar */}
            <div className="flex-1 min-w-0">
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-keppel-600 dark:text-keppel-300
                  file:mr-4 file:py-2.5 file:px-5
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-emerald-500 file:text-white
                  hover:file:bg-emerald-600 file:transition-all
                  file:shadow-md hover:file:shadow-lg file:cursor-pointer
                  dark:file:bg-emerald-600 dark:hover:file:bg-emerald-700"
                disabled={loading}
              />
            </div>

            {/* Botón Firmar y Almacenar */}
            <button
              onClick={handleStore}
              disabled={!file || loading}
              className="flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-5 sm:px-6 bg-gradient-to-r from-emerald-500 to-keppel-500 hover:from-emerald-600 hover:to-keppel-600 disabled:from-indigo-dye-300 disabled:to-indigo-dye-300 
                text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none
                whitespace-nowrap text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <span>⏳</span>
                  <span className="hidden sm:inline">Procesando...</span>
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span className="hidden sm:inline">Firmar y Almacenar</span>
                  <span className="sm:hidden">Firmar</span>
                  <span className="hidden sm:inline">⛓️</span>
                </>
              )}
            </button>
          </div>
        </div>

        {file && (
          <div className="p-4 bg-light-green-50 dark:bg-keppel-900/20 rounded-xl border border-light-green-200 dark:border-keppel-700">
            <p className="text-sm text-indigo-dye-700 dark:text-keppel-200 mb-1">
              <span className="font-semibold">Archivo:</span> {file.name}
            </p>
            <p className="text-sm text-indigo-dye-600 dark:text-keppel-300">
              <span className="font-semibold">Tamaño:</span>{" "}
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {hash && (
          <div className="p-4 bg-keppel-50 dark:bg-keppel-900/20 rounded-xl border border-keppel-200 dark:border-keppel-700">
            <p className="text-sm font-semibold text-indigo-dye-700 dark:text-keppel-200 mb-2">
              Hash SHA-256:
            </p>
            <p className="text-xs font-mono text-indigo-dye dark:text-keppel-100 break-all bg-white dark:bg-lapis-lazuli-800 p-2 rounded border border-keppel-200 dark:border-keppel-700">
              {hash}
            </p>
          </div>
        )}

        {/* Indicador de progreso durante el procesamiento */}
        {loading && processingStep && (
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-keppel-50 dark:from-emerald-900/20 dark:to-keppel-900/20 rounded-xl border-2 border-emerald-300 dark:border-emerald-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                {processingStep}
              </p>
            </div>
            <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
              <div
                className="bg-emerald-600 dark:bg-emerald-400 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        )}

        {status && (
          <div
            className={`p-5 rounded-xl border-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
              status.type === "success"
                ? "bg-gradient-to-r from-emerald-50 to-keppel-50 dark:from-emerald-900/30 border-emerald-400 dark:border-emerald-600 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50"
                : "bg-gradient-to-r from-bondi-blue-50 to-cerulean-50 dark:from-bondi-blue-900/30 dark:to-cerulean-900/30 border-bondi-blue-400 dark:border-bondi-blue-600 shadow-lg shadow-bondi-blue-200/50 dark:shadow-bondi-blue-900/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`text-2xl flex-shrink-0 ${
                  status.type === "success"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-bondi-blue-600 dark:text-bondi-blue-400"
                }`}
              >
                {status.type === "success" ? "✓" : "⚠️"}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    status.type === "success"
                      ? "text-emerald-800 dark:text-emerald-200"
                      : "text-bondi-blue-800 dark:text-bondi-blue-200"
                  }`}
                >
                  {status.type === "success" ? "¡Éxito!" : "Error"}
                </p>
                <p
                  className={`text-sm ${
                    status.type === "success"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-bondi-blue-700 dark:text-bondi-blue-300"
                  } break-words`}
                >
                  {status.message}
                </p>
                {status.type === "success" &&
                  status.message.includes("TX:") && (
                    <button
                      onClick={async () => {
                        const txHash = status.message.split("TX:")[1]?.trim();
                        if (txHash) {
                          try {
                            await navigator.clipboard.writeText(txHash);
                            setCopiedTxHash(true);
                            setTimeout(() => setCopiedTxHash(false), 2000);
                          } catch (err) {
                            console.error("Error al copiar:", err);
                          }
                        }
                      }}
                      className="mt-2 text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      {copiedTxHash ? (
                        <>
                          <span>✓</span>
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copiar TX Hash</span>
                        </>
                      )}
                    </button>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && file && hash && currentWallet && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setShowConfirmModal(false)}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-lapis-lazuli-900 rounded-2xl shadow-2xl border-2 border-emerald-200 dark:border-lapis-lazuli-700 z-50 max-w-lg w-full mx-4 animate-in fade-in zoom-in-95 duration-300">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-emerald-500 to-keppel-500 px-6 py-5 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  <span>Confirmar Firma y Almacenamiento</span>
                </h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-all transform hover:scale-110"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-5">
              <div className="bg-keppel-50 dark:bg-keppel-900/20 rounded-xl p-4 border border-keppel-200 dark:border-keppel-700">
                <p className="text-sm text-indigo-dye-700 dark:text-keppel-200 mb-3">
                  Estás a punto de firmar y almacenar este documento en la
                  blockchain. Esta acción es{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    permanente e irreversible
                  </strong>
                  .
                </p>
              </div>

              {/* Información del Documento */}
              <div className="space-y-3">
                <div className="bg-light-green-50 dark:bg-keppel-900/20 rounded-lg p-4 border border-light-green-200 dark:border-keppel-700">
                  <p className="text-xs font-semibold text-indigo-dye-600 dark:text-keppel-300 mb-2 uppercase tracking-wide">
                    📄 Archivo
                  </p>
                  <p className="text-sm font-medium text-indigo-dye-700 dark:text-keppel-200 break-all">
                    {file.name}
                  </p>
                  <p className="text-xs text-indigo-dye-600 dark:text-keppel-300 mt-1">
                    Tamaño: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <div className="bg-keppel-50 dark:bg-keppel-900/20 rounded-lg p-4 border border-keppel-200 dark:border-keppel-700">
                  <p className="text-xs font-semibold text-indigo-dye-600 dark:text-keppel-300 mb-2 uppercase tracking-wide">
                    🔐 Hash SHA-256
                  </p>
                  <p className="text-xs font-mono text-indigo-dye dark:text-keppel-100 break-all bg-white dark:bg-lapis-lazuli-800 p-2 rounded border border-keppel-200 dark:border-keppel-700">
                    {hash}
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
                  <p className="text-xs font-semibold text-indigo-dye-600 dark:text-keppel-300 mb-2 uppercase tracking-wide">
                    💼 Wallet
                  </p>
                  <p className="text-sm font-mono text-emerald-700 dark:text-emerald-300 break-all">
                    {currentWallet.address}
                  </p>
                </div>
              </div>

              {/* Advertencia */}
              <div className="bg-bondi-blue-50 dark:bg-bondi-blue-900/20 rounded-lg p-4 border-l-4 border-bondi-blue-400 dark:border-bondi-blue-600">
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div className="text-xs text-bondi-blue-700 dark:text-bondi-blue-300 space-y-1">
                    <p className="font-semibold mb-1">Importante:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>El documento será firmado con tu wallet activa</li>
                      <li>
                        La transacción consumirá gas (gratis en Anvil local)
                      </li>
                      <li>No podrás almacenar el mismo documento dos veces</li>
                      <li>
                        El hash se almacenará permanentemente en la blockchain
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 dark:bg-lapis-lazuli-800 px-6 py-4 rounded-b-2xl border-t border-gray-200 dark:border-lapis-lazuli-700 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-lapis-lazuli-700 dark:hover:bg-lapis-lazuli-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmStore}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-keppel-500 hover:from-emerald-600 hover:to-keppel-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🔒</span>
                <span>Confirmar y Firmar</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Ayuda */}
      {showHelp && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowHelp(false)}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-2xl border-2 border-emerald-200 dark:border-lapis-lazuli-700 z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-emerald-500 to-keppel-500 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>ℹ️</span>
                <span>Guía de Uso - Subir y Almacenar Documento</span>
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
                  Este componente te permite subir documentos, calcular su hash
                  SHA-256, firmarlos digitalmente con tu wallet activa y
                  almacenarlos permanentemente en la blockchain. Una vez
                  almacenados, los documentos son inmutables y verificables.
                </p>
              </div>

              {/* Funcionalidades */}
              <div className="space-y-4">
                {/* Instrucciones paso a paso */}
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <span>📋</span>
                    <span>Instrucciones Paso a Paso</span>
                  </h4>
                  <ol className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        1.
                      </span>
                      <span>
                        <strong>Selecciona un archivo:</strong> Haz clic en el
                        botón{" "}
                        <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          "Examinar"
                        </span>{" "}
                        y elige el documento que deseas almacenar en la
                        blockchain.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        2.
                      </span>
                      <span>
                        <strong>Cálculo automático del hash:</strong> Una vez
                        seleccionado, el sistema calculará automáticamente el
                        hash SHA-256 del archivo y lo mostrará en pantalla. Este
                        hash identifica de forma única el contenido del
                        documento.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        3.
                      </span>
                      <span>
                        <strong>Firma y almacenamiento:</strong> Haz clic en el
                        botón{" "}
                        <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          "🔒 Firmar y Almacenar"
                        </span>
                        . Se te pedirá confirmación antes de proceder.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        4.
                      </span>
                      <span>
                        <strong>Confirmación y transacción:</strong> Revisa la
                        información del documento (archivo, hash, wallet) y
                        confirma. Se creará una transacción en la blockchain
                        para almacenar el documento.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        5.
                      </span>
                      <span>
                        <strong>Resultado:</strong> Una vez confirmada la
                        transacción, el documento se almacenará permanentemente
                        en la blockchain y aparecerá automáticamente en tu lista
                        de documentos locales.
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Qué se almacena */}
                <div className="border-l-4 border-keppel-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-keppel-200 mb-2 flex items-center gap-2">
                    <span>💾</span>
                    <span>¿Qué se Almacena en la Blockchain?</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Hash del documento:</strong> El hash SHA-256 que
                        identifica de forma única el contenido del archivo.
                        Cualquier modificación cambiará este hash.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Timestamp:</strong> La fecha y hora exacta en
                        que el documento fue almacenado en la blockchain (Unix
                        timestamp).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Firma digital:</strong> La firma ECDSA del hash
                        realizada con tu wallet activa. Esto prueba que tú eres
                        quien almacenó el documento.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Dirección del firmante:</strong> La dirección de
                        tu wallet activa que firmó el documento. Esta
                        información se recupera de la firma digital.
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 ml-6 bg-keppel-50 dark:bg-keppel-900/20 p-3 rounded-lg border border-keppel-200 dark:border-keppel-700">
                    <p className="text-xs text-keppel-600 dark:text-keppel-300">
                      <strong>⚠️ Importante:</strong> El archivo en sí{" "}
                      <strong>NO se almacena</strong>
                      en la blockchain, solo su hash y metadatos. Esto mantiene
                      los costos de transacción bajos y garantiza la privacidad,
                      mientras que el hash permite verificar la integridad del
                      documento.
                    </p>
                  </div>
                </div>

                {/* Seguridad y verificación */}
                <div className="border-l-4 border-cerulean-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-cerulean-200 mb-2 flex items-center gap-2">
                    <span>🔒</span>
                    <span>Seguridad y Verificación</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Inmutabilidad:</strong> Una vez almacenado en la
                        blockchain, el hash del documento no puede ser
                        modificado, garantizando la integridad permanente.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Firma digital:</strong> La firma ECDSA prueba
                        que el documento fue almacenado por el propietario de la
                        wallet, proporcionando autenticación.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Prevención de duplicados:</strong> El sistema
                        verifica si el documento ya está almacenado antes de
                        permitir su almacenamiento, evitando duplicados.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Verificación posterior:</strong> Puedes
                        verificar la autenticidad e integridad del documento en
                        cualquier momento usando el componente "Verificar
                        Documento".
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Información importante */}
                <div className="border-l-4 border-bondi-blue-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-bondi-blue-200 mb-2 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Información Importante</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Wallet activa:</strong> El documento será
                        firmado con la wallet actualmente activa. Asegúrate de
                        haber seleccionado la wallet correcta antes de
                        almacenar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Una sola vez:</strong> No puedes almacenar el
                        mismo documento dos veces. Si intentas almacenar un
                        documento que ya existe, recibirás un mensaje de error.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Costo de transacción:</strong> Almacenar un
                        documento requiere una transacción en la blockchain, que
                        consume gas. En Anvil (local), esto es gratuito, pero en
                        redes principales tendría un costo.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Lista local:</strong> Una vez almacenado, el
                        documento se agregará automáticamente a tu lista local
                        con estado "activo" por defecto.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Consejos */}
                <div className="bg-bondi-blue-50 dark:bg-bondi-blue-900/20 rounded-lg p-4 border border-bondi-blue-200 dark:border-bondi-blue-700">
                  <h4 className="font-bold text-sm text-bondi-blue-700 dark:text-bondi-blue-200 mb-2">
                    💡 Consejos Importantes
                  </h4>
                  <ul className="space-y-1 text-xs text-bondi-blue-600 dark:text-bondi-blue-300 ml-4">
                    <li>
                      • <strong>Verifica el archivo</strong> antes de
                      almacenarlo. Una vez en la blockchain, no puede ser
                      modificado.
                    </li>
                    <li>
                      • El <strong>hash SHA-256</strong> se calcula de forma
                      local antes de enviar cualquier dato a la blockchain,
                      garantizando tu privacidad.
                    </li>
                    <li>
                      • Mantén una <strong>copia del archivo original</strong>{" "}
                      fuera de la blockchain, ya que solo se almacena el hash.
                    </li>
                    <li>
                      • Usa el componente <strong>"Verificar Documento"</strong>{" "}
                      después de almacenar para confirmar que todo se guardó
                      correctamente.
                    </li>
                    <li>
                      • Los documentos almacenados aparecerán automáticamente en
                      la lista de documentos con el hash de la transacción para
                      referencia.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 dark:bg-lapis-lazuli-800 px-6 py-3 rounded-b-xl border-t border-gray-200 dark:border-lapis-lazuli-700 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
