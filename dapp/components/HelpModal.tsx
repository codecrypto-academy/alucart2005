"use client";

import React, { useEffect, useRef } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Focus first element
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] transition-opacity"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
      >
        <div
          ref={modalRef}
          className="bg-white dark:bg-lapis-lazuli-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-lapis-lazuli-200 dark:border-lapis-lazuli-700 my-8"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-emerald-50 via-keppel-50 to-verdigris-50 dark:from-emerald-900/20 dark:via-keppel-900/20 dark:to-verdigris-900/20 px-6 py-5 border-b-2 border-emerald-200 dark:border-emerald-700/50 backdrop-blur-sm z-10">
            <div className="flex items-start gap-4">
              {/* Help Icon */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center ring-2 ring-emerald-200 dark:ring-emerald-700"
                aria-hidden="true"
              >
                <svg
                  className="w-7 h-7 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="help-modal-title"
                  className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-1"
                >
                  Guía de Uso
                </h2>
                <p
                  id="help-modal-description"
                  className="text-sm text-emerald-700 dark:text-emerald-300"
                >
                  Aprende a usar FileHashStorage dApp de manera eficiente
                </p>
              </div>

              {/* Close Button */}
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900"
                aria-label="Cerrar ayuda"
              >
                <svg
                  className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
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
          <div className="px-6 py-6 space-y-6">
            {/* Navegación Básica */}
            <section className="bg-bondi-blue-50 dark:bg-bondi-blue-900/20 rounded-xl p-5 border-l-4 border-bondi-blue-500 dark:border-bondi-blue-400">
              <h3 className="text-lg font-bold text-bondi-blue-800 dark:text-bondi-blue-200 mb-3 flex items-center gap-2">
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Navegación Básica
              </h3>
              <ul className="space-y-2 text-sm text-bondi-blue-700 dark:text-bondi-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-bondi-blue-500 dark:text-bondi-blue-400 font-bold mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Selector de Wallet:</strong> Ubicado en la esquina
                    superior izquierda, permite cambiar entre las 10 wallets de
                    prueba de Anvil
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bondi-blue-500 dark:text-bondi-blue-400 font-bold mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Subir Documento:</strong> Usa el componente de carga
                    de archivos para seleccionar y almacenar documentos en la
                    blockchain
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bondi-blue-500 dark:text-bondi-blue-400 font-bold mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Verificar Documento:</strong> Selecciona un archivo
                    para verificar si está almacenado y autenticado en la
                    blockchain
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bondi-blue-500 dark:text-bondi-blue-400 font-bold mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Lista de Documentos:</strong> Visualiza y busca
                    documentos almacenados usando su hash SHA-256
                  </span>
                </li>
              </ul>
            </section>

            {/* Funciones Principales */}
            <section className="bg-verdigris-50 dark:bg-verdigris-900/20 rounded-xl p-5 border-l-4 border-verdigris-500 dark:border-verdigris-400">
              <h3 className="text-lg font-bold text-verdigris-800 dark:text-verdigris-200 mb-3 flex items-center gap-2">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Funciones Principales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-verdigris-700 dark:text-verdigris-300">
                <div className="bg-verdigris-100 dark:bg-verdigris-900/30 rounded-lg p-3">
                  <h4 className="font-semibold text-verdigris-800 dark:text-verdigris-200 mb-2">
                    🔐 Almacenamiento Seguro
                  </h4>
                  <p>
                    Los documentos se almacenan como hashes SHA-256 en la
                    blockchain, garantizando integridad y autenticidad
                  </p>
                </div>
                <div className="bg-verdigris-100 dark:bg-verdigris-900/30 rounded-lg p-3">
                  <h4 className="font-semibold text-verdigris-800 dark:text-verdigris-200 mb-2">
                    ✍️ Firmas Digitales
                  </h4>
                  <p>
                    Cada documento se firma con ECDSA usando la wallet activa,
                    proporcionando no repudio y autenticación
                  </p>
                </div>
                <div className="bg-verdigris-100 dark:bg-verdigris-900/30 rounded-lg p-3">
                  <h4 className="font-semibold text-verdigris-800 dark:text-verdigris-200 mb-2">
                    🔍 Búsqueda Avanzada
                  </h4>
                  <p>
                    Busca documentos por hash completo o filtra la lista local
                    en tiempo real
                  </p>
                </div>
                <div className="bg-verdigris-100 dark:bg-verdigris-900/30 rounded-lg p-3">
                  <h4 className="font-semibold text-verdigris-800 dark:text-verdigris-200 mb-2">
                    ⚡ Tiempo Real
                  </h4>
                  <p>
                    Escucha eventos de la blockchain para actualizaciones
                    instantáneas de nuevos documentos
                  </p>
                </div>
              </div>
            </section>

            {/* Atajos de Teclado */}
            <section className="bg-keppel-50 dark:bg-keppel-900/20 rounded-xl p-5 border-l-4 border-keppel-500 dark:border-keppel-400">
              <h3 className="text-lg font-bold text-keppel-800 dark:text-keppel-200 mb-3 flex items-center gap-2">
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Atajos de Teclado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between bg-keppel-100 dark:bg-keppel-900/30 rounded-lg p-3">
                  <span className="text-keppel-700 dark:text-keppel-300">
                    Abrir ayuda
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-keppel-800 border border-keppel-300 dark:border-keppel-600 rounded text-xs font-mono text-keppel-800 dark:text-keppel-200 shadow-sm">
                    F1
                  </kbd>
                </div>
                <div className="flex items-center justify-between bg-keppel-100 dark:bg-keppel-900/30 rounded-lg p-3">
                  <span className="text-keppel-700 dark:text-keppel-300">
                    Cerrar modal/diálogo
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-keppel-800 border border-keppel-300 dark:border-keppel-600 rounded text-xs font-mono text-keppel-800 dark:text-keppel-200 shadow-sm">
                    Esc
                  </kbd>
                </div>
                <div className="flex items-center justify-between bg-keppel-100 dark:bg-keppel-900/30 rounded-lg p-3">
                  <span className="text-keppel-700 dark:text-keppel-300">
                    Buscar documento
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-keppel-800 border border-keppel-300 dark:border-keppel-600 rounded text-xs font-mono text-keppel-800 dark:text-keppel-200 shadow-sm">
                    Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between bg-keppel-100 dark:bg-keppel-900/30 rounded-lg p-3">
                  <span className="text-keppel-700 dark:text-keppel-300">
                    Navegación por pestañas
                  </span>
                  <kbd className="px-2 py-1 bg-white dark:bg-keppel-800 border border-keppel-300 dark:border-keppel-600 rounded text-xs font-mono text-keppel-800 dark:text-keppel-200 shadow-sm">
                    Tab
                  </kbd>
                </div>
              </div>
            </section>

            {/* Enlaces a Documentación */}
            <section className="bg-cerulean-50 dark:bg-cerulean-900/20 rounded-xl p-5 border-l-4 border-cerulean-500 dark:border-cerulean-400">
              <h3 className="text-lg font-bold text-cerulean-800 dark:text-cerulean-200 mb-3 flex items-center gap-2">
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
                Documentación y Recursos
              </h3>
              <div className="space-y-3 text-sm">
                <a
                  href="https://book.getfoundry.sh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-cerulean-100 dark:bg-cerulean-900/30 rounded-lg hover:bg-cerulean-200 dark:hover:bg-cerulean-900/50 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-cerulean-600 dark:text-cerulean-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-cerulean-800 dark:text-cerulean-200">
                      Foundry Book
                    </p>
                    <p className="text-xs text-cerulean-600 dark:text-cerulean-400">
                      Documentación oficial de Foundry
                    </p>
                  </div>
                </a>
                <a
                  href="https://docs.ethers.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-cerulean-100 dark:bg-cerulean-900/30 rounded-lg hover:bg-cerulean-200 dark:hover:bg-cerulean-900/50 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-cerulean-600 dark:text-cerulean-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-cerulean-800 dark:text-cerulean-200">
                      Ethers.js Documentation
                    </p>
                    <p className="text-xs text-cerulean-600 dark:text-cerulean-400">
                      Guía completa de Ethers.js v6
                    </p>
                  </div>
                </a>
                <a
                  href="https://nextjs.org/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-cerulean-100 dark:bg-cerulean-900/30 rounded-lg hover:bg-cerulean-200 dark:hover:bg-cerulean-900/50 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-cerulean-600 dark:text-cerulean-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-cerulean-800 dark:text-cerulean-200">
                      Next.js Documentation
                    </p>
                    <p className="text-xs text-cerulean-600 dark:text-cerulean-400">
                      Documentación de Next.js 16
                    </p>
                  </div>
                </a>
              </div>
            </section>

            {/* Tips y Consejos */}
            <section className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border-l-4 border-emerald-500 dark:border-emerald-400">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
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
                Tips y Consejos
              </h3>
              <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold mt-0.5">
                    💡
                  </span>
                  <span>
                    Asegúrate de que <strong>Anvil esté corriendo</strong> antes
                    de usar la aplicación
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold mt-0.5">
                    💡
                  </span>
                  <span>
                    El <strong>hash SHA-256</strong> se calcula automáticamente
                    al seleccionar un archivo
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold mt-0.5">
                    💡
                  </span>
                  <span>
                    Puedes <strong>copiar el hash</strong> haciendo clic en él
                    en la lista de documentos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold mt-0.5">
                    💡
                  </span>
                  <span>
                    Los <strong>eventos de blockchain</strong> se actualizan en
                    tiempo real sin necesidad de recargar
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gradient-to-r from-emerald-50 via-keppel-50 to-verdigris-50 dark:from-emerald-900/20 dark:via-keppel-900/20 dark:to-verdigris-900/20 px-6 py-4 border-t-2 border-emerald-200 dark:border-emerald-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Presiona{" "}
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-600 rounded text-xs font-mono">
                  Esc
                </kbd>{" "}
                o haz clic fuera para cerrar
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-lapis-lazuli-900"
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
