"use client";

import { useWallet } from "@/contexts/WalletContext";

export default function ConnectionStatus() {
  const { isConnected, connect, provider } = useWallet();

  const handleReconnect = async () => {
    await connect();
  };

  // Connected state - using emerald/keppel for success
  if (isConnected && provider) {
    return (
      <div className="fixed top-4 right-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-600 rounded-xl shadow-lg z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-400"></div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
            Conectado a Anvil
          </p>
        </div>
      </div>
    );
  }

  // Disconnected state - using bondi-blue/cerulean for warnings
  return (
    <div className="fixed top-4 right-4 p-4 bg-bondi-blue-50 dark:bg-bondi-blue-900/30 border-2 border-bondi-blue-300 dark:border-bondi-blue-600 rounded-xl shadow-lg z-50 max-w-sm backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 bg-bondi-blue-500 rounded-full mt-1 shadow-lg shadow-bondi-blue-400"></div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-bondi-blue-800 dark:text-bondi-blue-200 mb-2">
            No conectado a Anvil
          </p>
          <p className="text-xs text-bondi-blue-700 dark:text-bondi-blue-300 mb-3">
            Asegúrate de que Anvil esté corriendo en http://localhost:8545
          </p>
          <button
            onClick={handleReconnect}
            className="px-4 py-2 text-xs font-semibold bg-bondi-blue-500 hover:bg-bondi-blue-600 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    </div>
  );
}
