"use client";

import { useState, useRef, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { formatAddress } from "@/lib/utils";
import { ethers } from "ethers";

export default function WalletSelector() {
  const {
    wallets,
    currentWallet,
    currentWalletIndex,
    selectWallet,
    isConnected,
    provider,
  } = useWallet();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener saldo de la wallet activa
  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || !currentWallet) return;

      setIsLoadingBalance(true);
      try {
        const balanceWei = await provider.getBalance(currentWallet.address);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      } catch (error) {
        console.error("Error obteniendo saldo:", error);
        setBalance("Error");
      } finally {
        setIsLoadingBalance(false);
      }
    };

    if (isConnected && currentWallet && provider) {
      fetchBalance();
    }
  }, [isConnected, currentWallet, provider, currentWalletIndex]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isConnected || !currentWallet) {
    return (
      <div className="p-4 bg-verdigris-50 dark:bg-verdigris-900/20 border-2 border-verdigris-200 dark:border-verdigris-700 rounded-xl">
        <p className="text-verdigris-700 dark:text-verdigris-300 font-medium">
          Conectando a Anvil...
        </p>
      </div>
    );
  }

  const handleWalletSelect = (index: number) => {
    selectWallet(index);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-lg border-2 border-emerald-200 dark:border-lapis-lazuli-700">
      {/* Header con título y botón de ayuda */}
      <div className="bg-gradient-to-r from-emerald-50 to-keppel-50 dark:from-emerald-900/20 dark:to-keppel-900/20 px-6 py-4 border-b-2 border-emerald-200 dark:border-lapis-lazuli-700 relative">
        <h2 className="text-2xl font-bold text-indigo-dye dark:text-emerald-200 flex items-center gap-3">
          <span className="text-3xl">👛</span>
          <span>Wallet Activa</span>
          <div className="ml-auto">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-110"
              title="Ayuda - Cómo usar las wallets"
              aria-label="Mostrar ayuda"
            >
              ?
            </button>
          </div>
        </h2>
      </div>

      {/* Elemento unificado: Wallet activa con dropdown integrado */}
      <div className="p-6" ref={dropdownRef}>
        <div className="relative">
          {/* Contenedor principal de la wallet activa */}
          <div
            className={`rounded-xl border-2 transition-all duration-200 ${
              isDropdownOpen
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 shadow-lg"
                : "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 dark:border-emerald-500 shadow-md hover:shadow-lg"
            }`}
          >
            {/* Información de la wallet activa */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                        Wallet {currentWalletIndex + 1}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1">
                        <span>✓</span>
                        <span>Activa</span>
                      </span>
                    </div>
                    {/* Saldo de la cuenta al lado derecho */}
                    <div className="bg-gradient-to-r from-emerald-500 to-keppel-500 rounded-lg px-4 py-2 border border-emerald-400 dark:border-emerald-600 shadow-md">
                      <div className="flex items-baseline gap-2">
                        {isLoadingBalance ? (
                          <span className="text-sm font-bold text-white animate-pulse">
                            ...
                          </span>
                        ) : balance !== null ? (
                          <>
                            <span className="text-lg font-bold text-white">
                              {balance}
                            </span>
                            <span className="text-sm font-semibold text-emerald-100">
                              ETH
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-white">
                            -
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Dirección completa prominente */}
                  <div className="bg-white dark:bg-lapis-lazuli-800 rounded-lg p-3 border border-emerald-200 dark:border-lapis-lazuli-600">
                    <p className="text-xs font-medium text-keppel-600 dark:text-keppel-400 mb-1">
                      Dirección completa:
                    </p>
                    <p className="text-base font-mono text-indigo-dye dark:text-emerald-200 break-all select-all">
                      {currentWallet.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón para abrir/cerrar dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full mt-3 px-4 py-2.5 rounded-lg bg-white dark:bg-lapis-lazuli-800 border-2 border-emerald-300 dark:border-lapis-lazuli-600 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all flex items-center justify-between group"
                aria-expanded={isDropdownOpen}
                aria-label="Cambiar wallet"
              >
                <span className="font-medium text-indigo-dye dark:text-emerald-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {isDropdownOpen ? "Ocultar wallets" : "Cambiar wallet"}
                </span>
                <span
                  className={`text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
            </div>

            {/* Dropdown de wallets */}
            {isDropdownOpen && (
              <div className="px-5 pb-5">
                <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-lapis-lazuli-600">
                  <p className="text-xs font-semibold text-keppel-600 dark:text-keppel-400 mb-2 uppercase tracking-wide">
                    Seleccionar wallet:
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {wallets.map((wallet, index) => (
                      <button
                        key={index}
                        onClick={() => handleWalletSelect(index)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          index === currentWalletIndex
                            ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-500 shadow-sm"
                            : "bg-white dark:bg-lapis-lazuli-800 border-keppel-200 dark:border-lapis-lazuli-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-indigo-dye dark:text-emerald-200">
                                Wallet {index + 1}
                              </span>
                              {index === currentWalletIndex && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                  (Actual)
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-keppel-600 dark:text-keppel-300 font-mono">
                              {formatAddress(wallet.address)}
                            </p>
                          </div>
                          {index === currentWalletIndex && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg ml-2">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-lapis-lazuli-900 rounded-xl shadow-2xl border-2 border-emerald-200 dark:border-lapis-lazuli-700 z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-emerald-500 to-keppel-500 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>ℹ️</span>
                <span>Guía de Uso - Wallet Activa</span>
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
                  Este componente te permite gestionar y cambiar entre las
                  diferentes wallets de prueba conectadas a Anvil. Puedes
                  seleccionar qué wallet usar para firmar y almacenar documentos
                  en la blockchain.
                </p>
              </div>

              {/* Funcionalidades */}
              <div className="space-y-4">
                {/* Cómo cambiar de wallet */}
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <span>🔄</span>
                    <span>Cómo Cambiar de Wallet</span>
                  </h4>
                  <ol className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        1.
                      </span>
                      <span>
                        Haz clic en el botón{" "}
                        <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          "Cambiar wallet"
                        </span>{" "}
                        dentro del contenedor de la wallet activa
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        2.
                      </span>
                      <span>
                        Se desplegará un menú deslizante con todas las wallets
                        disponibles (10 wallets de prueba de Anvil)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        3.
                      </span>
                      <span>
                        Selecciona la wallet que deseas usar haciendo clic en
                        ella
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        4.
                      </span>
                      <span>
                        La wallet seleccionada se marcará con un{" "}
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                          ✓
                        </span>{" "}
                        y se convertirá en la wallet activa
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Qué son estas wallets */}
                <div className="border-l-4 border-keppel-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <span>👛</span>
                    <span>¿Qué son estas Wallets?</span>
                  </h4>
                  <div className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <p className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Estas son las <strong>10 wallets de prueba</strong> que
                        Anvil genera por defecto cuando se inicia el servidor
                        local.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Cada wallet tiene un{" "}
                        <strong>balance inicial de 10,000 ETH</strong> para
                        realizar transacciones de prueba en tu blockchain local.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        Las claves privadas de estas wallets son{" "}
                        <strong>públicas y conocidas</strong>, por lo que solo
                        deben usarse para desarrollo y pruebas, nunca para
                        fondos reales.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Por qué cambiar de wallet */}
                <div className="border-l-4 border-cerulean-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>¿Por qué Cambiar de Wallet?</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Probar diferentes escenarios:</strong> Simula
                        múltiples usuarios en tu aplicación descentralizada sin
                        necesidad de múltiples navegadores o cuentas.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>
                          Firmar documentos con diferentes identidades:
                        </strong>{" "}
                        Cada wallet tiene su propia dirección, permitiéndote
                        verificar qué usuario firmó cada documento.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Gestionar balances:</strong> Puedes distribuir
                        fondos entre wallets para probar diferentes estados
                        financieros.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Información de la wallet activa */}
                <div className="border-l-4 border-bondi-blue-500 pl-4">
                  <h4 className="font-bold text-lg text-indigo-dye-700 dark:text-emerald-200 mb-2 flex items-center gap-2">
                    <span>📊</span>
                    <span>Información de la Wallet Activa</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-dye-600 dark:text-keppel-300 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Dirección completa:</strong> Se muestra la
                        dirección completa (0x...) que puedes copiar fácilmente
                        haciendo clic y seleccionando el texto.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Balance:</strong> Se muestra el balance actual
                        en ETH de la wallet activa. El balance se actualiza
                        automáticamente cuando cambias de wallet.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>
                        <strong>Indicador visual:</strong> La wallet activa
                        muestra un badge verde con "✓ Activa" y un fondo
                        destacado para identificarla fácilmente.
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
                      • La wallet activa se usa automáticamente para todas las
                      operaciones de firma y almacenamiento.
                    </li>
                    <li>
                      • Puedes hacer clic fuera del dropdown para cerrarlo sin
                      cambiar de wallet.
                    </li>
                    <li>
                      • El balance se actualiza automáticamente cuando cambias
                      de wallet o cuando se realizan transacciones.
                    </li>
                    <li>
                      • Estas wallets solo funcionan con tu instancia local de
                      Anvil - no son válidas en otras redes.
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
