"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash, formatAddress, formatTimestamp } from "@/lib/utils";
import { useContractConfig } from "@/hooks/useContractConfig";

export default function DocumentVerifier() {
  const { contract, isConnected } = useWallet();
  const { config: contractConfig } = useContractConfig();
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    documentInfo: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setVerificationResult(null);
    setStatus(null);

    try {
      setLoading(true);
      const fileHash = await calculateFileHash(selectedFile);
      setHash(fileHash);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error calculando hash del archivo",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!hash || !contract) {
      setStatus({
        type: "error",
        message: "Por favor selecciona un archivo primero",
      });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      // Verificar que el contrato esté desplegado
      // En ethers.js v6, el provider está en contract.runner.provider
      const provider = contract.runner?.provider;
      if (!provider) {
        throw new Error(
          "Provider no disponible. Asegúrate de estar conectado a Anvil."
        );
      }

      // Usar la configuración dinámica del contrato
      // Verificar si el contrato tiene código
      const code = await provider.getCode(contractConfig.contractAddress);
      if (!code || code === "0x" || code === "0x0") {
        throw new Error(
          "El contrato no está desplegado en la dirección especificada. " +
            "Por favor despliega el contrato primero usando: " +
            "forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast"
        );
      }

      // Verificar si el documento existe
      let exists: boolean;
      try {
        exists = await contract.isDocumentStored(hash);
      } catch (callError: any) {
        // Si el error es BAD_DATA con value="0x", el contrato no está desplegado
        if (
          callError?.code === "BAD_DATA" ||
          callError?.message?.includes("could not decode result data")
        ) {
          throw new Error(
            "El contrato no está desplegado o la dirección es incorrecta. " +
              `Dirección actual: ${contractConfig.contractAddress}. ` +
              "Por favor verifica que el contrato esté desplegado."
          );
        }
        throw callError;
      }

      if (!exists) {
        setStatus({
          type: "error",
          message: "El documento no está almacenado en la blockchain",
        });
        setVerificationResult(null);
        return;
      }

      // Obtener información del documento
      const [documentHash, timestamp, signer, signature] =
        await contract.getDocumentInfo(hash);

      // Verificar la firma
      const isValid = await contract.verifyDocument(hash, signer, signature);

      setVerificationResult({
        isValid,
        documentInfo: {
          hash: documentHash,
          timestamp,
          signer,
          signature,
        },
      });
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error?.message || "Error al verificar el documento",
      });
      console.error(error);
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
    <div className="bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-lg border-2 border-verdigris-200 dark:border-lapis-lazuli-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-verdigris-50 to-bondi-blue-50 dark:from-verdigris-900/20 dark:to-bondi-blue-900/20 px-6 py-4 border-b-2 border-verdigris-200 dark:border-lapis-lazuli-700 relative">
        <h2 className="text-2xl font-bold text-indigo-dye dark:text-verdigris-200 flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <span>Verificar Documento</span>
          <div className="ml-auto">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-verdigris-500 hover:bg-verdigris-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-110"
              title="Ayuda - Cómo verificar documentos"
              aria-label="Mostrar ayuda"
            >
              ?
            </button>
          </div>
        </h2>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-indigo-dye-600 dark:text-verdigris-300 mb-2">
            Seleccionar Archivo para Verificar
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-keppel-600 dark:text-verdigris-300
              file:mr-4 file:py-2.5 file:px-5
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-verdigris-500 file:text-white
              hover:file:bg-verdigris-600 file:transition-all
              file:shadow-md hover:file:shadow-lg file:cursor-pointer
              dark:file:bg-verdigris-600 dark:hover:file:bg-verdigris-700"
            disabled={loading}
          />
        </div>

        {file && (
          <div className="p-4 bg-verdigris-50 dark:bg-verdigris-900/20 rounded-xl border border-verdigris-200 dark:border-verdigris-700">
            <p className="text-sm text-indigo-dye-700 dark:text-verdigris-200">
              <span className="font-semibold">Archivo seleccionado:</span>{" "}
              {file.name}
            </p>
            <p className="text-xs text-keppel-600 dark:text-keppel-400 mt-2">
              El hash del documento se mostrará después de la verificación
              exitosa.
            </p>
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={!hash || loading}
          className="w-full py-3.5 px-5 bg-gradient-to-r from-verdigris-500 to-bondi-blue-500 hover:from-verdigris-600 hover:to-bondi-blue-600 disabled:from-indigo-dye-300 disabled:to-indigo-dye-300 
            text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none"
        >
          {loading ? "⏳ Verificando..." : "✓ Verificar Documento"}
        </button>

        {verificationResult && (
          <div className="p-5 bg-light-green-50 dark:bg-keppel-900/20 rounded-xl border border-light-green-200 dark:border-keppel-700 space-y-4">
            <div
              className={`p-4 rounded-xl border-2 ${
                verificationResult.isValid
                  ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600"
                  : "bg-bondi-blue-100 dark:bg-bondi-blue-900/30 border-bondi-blue-400 dark:border-bondi-blue-600"
              }`}
            >
              <p
                className={`font-bold text-lg ${
                  verificationResult.isValid
                    ? "text-emerald-800 dark:text-emerald-200"
                    : "text-bondi-blue-800 dark:text-bondi-blue-200"
                }`}
              >
                {verificationResult.isValid ? "✓ Válido" : "✗ Inválido"}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              {/* Hash del documento - Solo visible después de verificación exitosa */}
              <div className="bg-white dark:bg-lapis-lazuli-800 rounded-lg p-3 border border-verdigris-200 dark:border-verdigris-700">
                <p className="text-xs font-medium text-keppel-600 dark:text-keppel-400 mb-1">
                  Hash del documento:
                </p>
                <p className="text-sm font-mono text-indigo-dye dark:text-keppel-100 break-all select-all">
                  {verificationResult.documentInfo.hash}
                </p>
              </div>
              <p className="text-indigo-dye-700 dark:text-keppel-200">
                <span className="font-semibold">Timestamp:</span>{" "}
                <span className="text-indigo-dye dark:text-keppel-100">
                  {formatTimestamp(verificationResult.documentInfo.timestamp)}
                </span>
              </p>
              <p className="text-indigo-dye-700 dark:text-keppel-200">
                <span className="font-semibold">Signer:</span>{" "}
                <span className="font-mono text-indigo-dye dark:text-keppel-100">
                  {formatAddress(verificationResult.documentInfo.signer)}
                </span>
              </p>
            </div>
          </div>
        )}

        {status && status.type === "error" && !verificationResult && (
          <div className="p-4 rounded-xl border-2 bg-bondi-blue-50 dark:bg-bondi-blue-900/30 border-bondi-blue-300 dark:border-bondi-blue-600">
            <p className="text-sm font-medium text-bondi-blue-800 dark:text-bondi-blue-200">
              ⚠ {status.message}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Ayuda */}
      {showHelp && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowHelp(false)}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-2xl border-2 border-verdigris-200 dark:border-lapis-lazuli-700 z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-verdigris-500 to-bondi-blue-500 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>ℹ️</span>
                <span>Guía de Uso - Verificar Documento</span>
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
                  Este componente te permite verificar la autenticidad e
                  integridad de documentos previamente almacenados en la
                  blockchain. Puedes verificar que un documento no ha sido
                  modificado y confirmar su firma digital.
                </p>
              </div>

              {/* Funcionalidades */}
              <div className="space-y-4">
                {/* Instrucciones paso a paso */}
                <div className="border-l-4 border-verdigris-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-verdigris-200 mb-2 flex items-center gap-2">
                    <span>📋</span>
                    <span>Instrucciones Paso a Paso</span>
                  </h4>
                  <ol className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-verdigris-600 dark:text-verdigris-400">
                        1.
                      </span>
                      <span>
                        <strong>Selecciona un archivo:</strong> Haz clic en el
                        botón{" "}
                        <span className="font-mono bg-verdigris-100 dark:bg-verdigris-900/30 px-2 py-1 rounded text-verdigris-700 dark:text-verdigris-300 border border-verdigris-300 dark:border-verdigris-700">
                          "Examinar"
                        </span>{" "}
                        y elige el documento que deseas verificar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-verdigris-600 dark:text-verdigris-400">
                        2.
                      </span>
                      <span>
                        <strong>Verifica el archivo:</strong> Una vez
                        seleccionado, haz clic en el botón{" "}
                        <span className="font-mono bg-verdigris-100 dark:bg-verdigris-900/30 px-2 py-1 rounded text-verdigris-700 dark:text-verdigris-300 border border-verdigris-300 dark:border-verdigris-700">
                          "✓ Verificar Documento"
                        </span>{" "}
                        para iniciar el proceso de verificación.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-verdigris-600 dark:text-verdigris-400">
                        3.
                      </span>
                      <span>
                        <strong>Revisa los resultados:</strong> Después de la
                        verificación, se mostrará si el documento es{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          ✓ Válido
                        </strong>{" "}
                        o{" "}
                        <strong className="text-red-600 dark:text-red-400">
                          ✗ Inválido
                        </strong>
                        , junto con información detallada como el hash,
                        timestamp y el signer.
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Qué se verifica */}
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <span>✅</span>
                    <span>¿Qué se Verifica?</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 text-sm mb-1">
                        🔒 Integridad
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Confirma que el documento no ha sido modificado desde su
                        almacenamiento
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 text-sm mb-1">
                        ✍️ Autenticidad
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Verifica la firma digital del documento usando ECDSA
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 text-sm mb-1">
                        📍 Existencia
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Confirma que el documento está almacenado en la
                        blockchain
                      </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 text-sm mb-1">
                        📅 Timestamp
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Muestra cuándo fue almacenado el documento originalmente
                      </p>
                    </div>
                  </div>
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
                        El documento{" "}
                        <strong>debe haber sido previamente almacenado</strong>{" "}
                        en la blockchain para poder ser verificado. Si intentas
                        verificar un documento que no está almacenado, recibirás
                        un error.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        El hash del documento solo se muestra después de una
                        verificación exitosa para mantener la privacidad y
                        confirmar que el documento existe.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        La verificación confirma tanto la{" "}
                        <strong>existencia del documento</strong>
                        en la blockchain como la{" "}
                        <strong>validez de su firma digital</strong> usando
                        recuperación ECDSA.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Si el documento no está almacenado, recibirás un mensaje
                        de error indicando que no se encontró en la blockchain.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Ejemplos de uso */}
                <div className="border-l-4 border-keppel-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-keppel-200 mb-2 flex items-center gap-2">
                    <span>📄</span>
                    <span>Ejemplos de Uso</span>
                  </h4>
                  <div className="space-y-3 ml-6">
                    <div className="bg-keppel-50 dark:bg-keppel-900/20 p-4 rounded-lg border border-keppel-200 dark:border-keppel-700">
                      <p className="font-semibold text-indigo-dye-700 dark:text-keppel-200 mb-2 text-sm">
                        Verificar un documento almacenado:
                      </p>
                      <p className="text-xs text-keppel-600 dark:text-keppel-300">
                        Si ya has almacenado un documento previamente usando la
                        función "Subir Documento", puedes verificar su
                        integridad seleccionando el mismo archivo y haciendo
                        clic en "✓ Verificar Documento".
                      </p>
                    </div>
                    <div className="bg-keppel-50 dark:bg-keppel-900/20 p-4 rounded-lg border border-keppel-200 dark:border-keppel-700">
                      <p className="font-semibold text-indigo-dye-700 dark:text-keppel-200 mb-2 text-sm">
                        Verificar autenticidad:
                      </p>
                      <p className="text-xs text-keppel-600 dark:text-keppel-300">
                        El sistema verifica que el documento no haya sido
                        modificado desde su almacenamiento original, comparando
                        el hash SHA-256 del archivo con el hash almacenado en la
                        blockchain.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consejos */}
                <div className="bg-bondi-blue-50 dark:bg-bondi-blue-900/20 rounded-lg p-4 border border-bondi-blue-200 dark:border-bondi-blue-700">
                  <h4 className="font-bold text-sm text-bondi-blue-700 dark:text-bondi-blue-200 mb-2">
                    💡 Consejos Importantes
                  </h4>
                  <ul className="space-y-1 text-xs text-bondi-blue-600 dark:text-bondi-blue-300 ml-4">
                    <li>
                      • Asegúrate de seleccionar{" "}
                      <strong>exactamente el mismo archivo</strong> que fue
                      almacenado originalmente. Cualquier modificación, por
                      mínima que sea, resultará en un hash diferente y la
                      verificación fallará.
                    </li>
                    <li>
                      • El hash se calcula usando SHA-256, por lo que incluso un
                      cambio de un solo byte cambiará completamente el hash.
                    </li>
                    <li>
                      • Si la verificación es exitosa, se mostrará la dirección
                      del firmante, el timestamp de almacenamiento y el hash
                      completo del documento.
                    </li>
                    <li>
                      • La verificación se realiza consultando directamente la
                      blockchain, por lo que requiere que el contrato esté
                      desplegado y funcionando.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 dark:bg-lapis-lazuli-800 px-6 py-3 rounded-b-xl border-t border-gray-200 dark:border-lapis-lazuli-700 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-verdigris-500 hover:bg-verdigris-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
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
