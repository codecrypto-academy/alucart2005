"use client";

import React, { useState, useEffect, useRef } from "react";

interface AnvilErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  rpcUrl: string;
  onRetry: () => Promise<void>;
  isContractNotDeployed?: boolean;
  contractAddress?: string;
}

export default function AnvilErrorDialog({
  isOpen,
  onClose,
  errorMessage,
  rpcUrl,
  onRetry,
  isContractNotDeployed = false,
  contractAddress = "",
}: AnvilErrorDialogProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<{
    isDeploying: boolean;
    result: "success" | "error" | null;
    message: string;
  }>({ isDeploying: false, result: null, message: "" });
  const [diagnosticStatus, setDiagnosticStatus] = useState<{
    isChecking: boolean;
    result: "success" | "error" | null;
    message: string;
  }>({ isChecking: false, result: null, message: "" });
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && firstButtonRef.current) {
      // Small delay to ensure dialog is rendered
      setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Trap focus within dialog
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
      // If retry succeeds, the dialog will close automatically via onClose
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleCheckStatus = async () => {
    setDiagnosticStatus({ isChecking: true, result: null, message: "" });
    try {
      const response = await fetch("/api/check-anvil", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setDiagnosticStatus({
          isChecking: false,
          result: "success",
          message: `Anvil está corriendo correctamente. Block number: ${data.blockNumber}`,
        });
      } else {
        setDiagnosticStatus({
          isChecking: false,
          result: "error",
          message: data.message || "No se pudo conectar a Anvil",
        });
      }
    } catch (error: any) {
      setDiagnosticStatus({
        isChecking: false,
        result: "error",
        message: `Error al verificar: ${error.message}`,
      });
    }
  };

  const handleOpenDocs = () => {
    // Open documentation in new tab
    window.open(
      "https://book.getfoundry.sh/anvil/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDeployContract = async () => {
    setIsDeploying(true);
    setDeploymentStatus({ isDeploying: true, result: null, message: "" });
    try {
      console.log("🚀 Iniciando deployment del contrato...");

      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error ejecutando deployment");
      }

      console.log("✅ Deployment completado:", data);

      setDeploymentStatus({
        isDeploying: false,
        result: "success",
        message: `Contrato desplegado exitosamente. Nueva dirección: ${
          data.config?.contractAddress || contractAddress
        }`,
      });

      // Esperar un poco para que la configuración se actualice
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Intentar reconectar después del despliegue
      await onRetry();
    } catch (error: any) {
      console.error("Error ejecutando deployment:", error);
      setDeploymentStatus({
        isDeploying: false,
        result: "error",
        message: `Error al desplegar: ${error.message || "Error desconocido"}`,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <div
          ref={dialogRef}
          className="bg-white dark:bg-lapis-lazuli-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-lapis-lazuli-200 dark:border-lapis-lazuli-700"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-lapis-lazuli-50 to-cerulean-50 dark:from-lapis-lazuli-800/40 dark:to-cerulean-900/30 px-6 py-5 border-b-2 border-lapis-lazuli-200 dark:border-lapis-lazuli-700">
            <div className="flex items-start gap-4">
              {/* Warning Icon */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full bg-lapis-lazuli-100 dark:bg-lapis-lazuli-800/50 flex items-center justify-center ring-2 ring-lapis-lazuli-200 dark:ring-lapis-lazuli-700"
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7 text-lapis-lazuli-600 dark:text-lapis-lazuli-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-label="Warning icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="error-dialog-title"
                  className="text-xl font-bold text-lapis-lazuli-800 dark:text-lapis-lazuli-200 mb-1"
                >
                  {isContractNotDeployed
                    ? "Contrato No Desplegado"
                    : "Error de Conexión con Anvil"}
                </h2>
                <p
                  id="error-dialog-description"
                  className="text-sm text-lapis-lazuli-600 dark:text-lapis-lazuli-400"
                >
                  {isContractNotDeployed
                    ? "El contrato inteligente no está desplegado en la red"
                    : "No se pudo establecer conexión con el nodo local de desarrollo"}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-lapis-lazuli-100 dark:hover:bg-lapis-lazuli-800/50 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-lapis-lazuli-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900"
                aria-label="Cerrar diálogo"
              >
                <svg
                  className="w-5 h-5 text-lapis-lazuli-600 dark:text-lapis-lazuli-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Error Message */}
            <div className="bg-slate-50 dark:bg-slate-800/30 border-l-4 border-lapis-lazuli-500 dark:border-lapis-lazuli-400 rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-lapis-lazuli-600 dark:text-lapis-lazuli-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                    Detalles del Error
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 break-words">
                    {errorMessage}
                  </p>
                  {isContractNotDeployed && contractAddress && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
                      Dirección esperada: {contractAddress}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-mono bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
                    URL: {rpcUrl}
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting Steps */}
            <div className="bg-bondi-blue-50 dark:bg-bondi-blue-900/20 border-l-4 border-bondi-blue-500 dark:border-bondi-blue-400 rounded-r-lg p-4">
              <h3 className="text-sm font-semibold text-bondi-blue-800 dark:text-bondi-blue-200 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Pasos para Resolver
              </h3>
              <ol className="space-y-2 text-sm text-bondi-blue-700 dark:text-bondi-blue-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bondi-blue-500 dark:bg-bondi-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    1
                  </span>
                  <span>
                    <strong>Verifica que Anvil esté corriendo:</strong> Abre una
                    terminal y ejecuta{" "}
                    <code className="bg-bondi-blue-100 dark:bg-bondi-blue-900/40 px-1.5 py-0.5 rounded font-mono text-xs">
                      cd sc && anvil
                    </code>
                    . Deberías ver "Listening on http://127.0.0.1:8545"
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bondi-blue-500 dark:bg-bondi-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    2
                  </span>
                  <span>
                    <strong>Verifica el puerto:</strong> Asegúrate de que el
                    puerto 8545 no esté siendo usado por otro proceso. Puedes
                    verificar con{" "}
                    <code className="bg-bondi-blue-100 dark:bg-bondi-blue-900/40 px-1.5 py-0.5 rounded font-mono text-xs">
                      netstat -ano | findstr :8545
                    </code>{" "}
                    (Windows) o{" "}
                    <code className="bg-bondi-blue-100 dark:bg-bondi-blue-900/40 px-1.5 py-0.5 rounded font-mono text-xs">
                      lsof -i :8545
                    </code>{" "}
                    (Mac/Linux)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bondi-blue-500 dark:bg-bondi-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    3
                  </span>
                  <span>
                    <strong>Revisa problemas de CORS:</strong> Si estás usando
                    un navegador, verifica la consola del desarrollador para
                    errores de CORS. Anvil debería permitir conexiones desde
                    localhost por defecto.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bondi-blue-500 dark:bg-bondi-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    4
                  </span>
                  <span>
                    <strong>Reinicia Anvil:</strong> Si Anvil está corriendo
                    pero aún hay problemas, intenta detenerlo (Ctrl+C) y
                    reiniciarlo.
                  </span>
                </li>
              </ol>
            </div>

            {/* Diagnostic Status */}
            {diagnosticStatus.isChecking && (
              <div className="bg-cerulean-50 dark:bg-cerulean-900/20 border-l-4 border-cerulean-500 dark:border-cerulean-400 rounded-r-lg p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin w-5 h-5 text-cerulean-600 dark:text-cerulean-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-sm text-cerulean-700 dark:text-cerulean-300">
                    Verificando estado de Anvil...
                  </p>
                </div>
              </div>
            )}

            {diagnosticStatus.result && (
              <div
                className={`border-l-4 rounded-r-lg p-4 ${
                  diagnosticStatus.result === "success"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400"
                    : "bg-slate-100 dark:bg-slate-800/40 border-lapis-lazuli-500 dark:border-lapis-lazuli-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  {diagnosticStatus.result === "success" ? (
                    <svg
                      className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-lapis-lazuli-600 dark:text-lapis-lazuli-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <p
                    className={`text-sm ${
                      diagnosticStatus.result === "success"
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {diagnosticStatus.message}
                  </p>
                </div>
              </div>
            )}

            {/* Deployment Status */}
            {deploymentStatus.isDeploying && (
              <div className="bg-cerulean-50 dark:bg-cerulean-900/20 border-l-4 border-cerulean-500 dark:border-cerulean-400 rounded-r-lg p-4">
                <div className="flex items-center gap-3">
                  <svg
                    className="animate-spin w-5 h-5 text-cerulean-600 dark:text-cerulean-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-sm text-cerulean-700 dark:text-cerulean-300">
                    Desplegando contrato... Esto puede tomar unos momentos.
                  </p>
                </div>
              </div>
            )}

            {deploymentStatus.result && (
              <div
                className={`border-l-4 rounded-r-lg p-4 ${
                  deploymentStatus.result === "success"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-400"
                    : "bg-slate-100 dark:bg-slate-800/40 border-lapis-lazuli-500 dark:border-lapis-lazuli-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  {deploymentStatus.result === "success" ? (
                    <svg
                      className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-lapis-lazuli-600 dark:text-lapis-lazuli-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <p
                    className={`text-sm ${
                      deploymentStatus.result === "success"
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {deploymentStatus.message}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {isContractNotDeployed && (
                <button
                  ref={firstButtonRef}
                  onClick={handleDeployContract}
                  disabled={isDeploying || deploymentStatus.isDeploying}
                  className="flex-1 min-w-[140px] px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:disabled:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900 flex items-center justify-center gap-2"
                >
                  {isDeploying || deploymentStatus.isDeploying ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Desplegando...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Desplegar Contrato</span>
                    </>
                  )}
                </button>
              )}

              <button
                ref={!isContractNotDeployed ? firstButtonRef : undefined}
                onClick={handleRetry}
                disabled={isRetrying || isDeploying}
                className="flex-1 min-w-[140px] px-5 py-3 bg-lapis-lazuli-600 hover:bg-lapis-lazuli-700 disabled:bg-lapis-lazuli-400 dark:bg-lapis-lazuli-500 dark:hover:bg-lapis-lazuli-600 dark:disabled:bg-lapis-lazuli-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-lapis-lazuli-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900 flex items-center justify-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Reintentando...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Reintentar Conexión</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCheckStatus}
                disabled={diagnosticStatus.isChecking}
                className="flex-1 min-w-[140px] px-5 py-3 bg-bondi-blue-600 hover:bg-bondi-blue-700 disabled:bg-bondi-blue-400 dark:bg-bondi-blue-500 dark:hover:bg-bondi-blue-600 dark:disabled:bg-bondi-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-bondi-blue-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Verificar Estado</span>
              </button>

              <button
                onClick={handleOpenDocs}
                className="flex-1 min-w-[140px] px-5 py-3 bg-verdigris-600 hover:bg-verdigris-700 dark:bg-verdigris-500 dark:hover:bg-verdigris-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-verdigris-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>Documentación</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-lapis-lazuli-700 dark:hover:bg-lapis-lazuli-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
