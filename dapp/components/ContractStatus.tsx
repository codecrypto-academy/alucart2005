"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useContractConfig } from "@/hooks/useContractConfig";
import { formatAddress } from "@/lib/utils";

export default function ContractStatus() {
  const { provider, contract, isConnected } = useWallet();
  const { config: contractConfig } = useContractConfig();
  const [isDeployed, setIsDeployed] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const checkContract = async () => {
    if (!provider || !contract || !contractConfig.contractAddress) return;

    setChecking(true);
    try {
      // En ethers.js v6, podemos usar provider directamente o contract.runner.provider
      const contractProvider = contract.runner?.provider || provider;
      const code = await contractProvider.getCode(
        contractConfig.contractAddress
      );
      setIsDeployed(code !== "0x" && code !== "0x0" && code.length > 2);
    } catch (error) {
      console.error("Error checking contract:", error);
      setIsDeployed(false);
    } finally {
      setChecking(false);
    }
  };

  const deployContract = async () => {
    setDeploying(true);
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

      // Esperar un poco para que la configuración se actualice
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Recargar la configuración y verificar el contrato
      window.location.reload(); // Recargar para obtener la nueva configuración
    } catch (error: any) {
      console.error("Error ejecutando deployment:", error);
      alert(
        `Error ejecutando deployment:\n\n${error.message}\n\n` +
          `Por favor verifica que:\n` +
          `1. Anvil esté corriendo\n` +
          `2. Forge esté instalado y en el PATH\n` +
          `3. El script de deployment tenga permisos de ejecución`
      );
    } finally {
      setDeploying(false);
    }
  };

  useEffect(() => {
    if (isConnected && provider && contract && contractConfig.contractAddress) {
      checkContract();
    }
  }, [isConnected, provider, contract, contractConfig.contractAddress]);

  // Re-verificar cuando cambie la configuración del contrato
  useEffect(() => {
    if (
      isConnected &&
      provider &&
      contract &&
      contractConfig.contractAddress &&
      !checking
    ) {
      // Pequeño delay para asegurar que la configuración se haya actualizado
      const timer = setTimeout(() => {
        checkContract();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [contractConfig.contractAddress]);

  if (!isConnected) {
    return null;
  }

  if (isDeployed === null || checking) {
    return (
      <div className="bg-verdigris-50 dark:bg-verdigris-900/20 rounded-xl shadow-md p-4 border-2 border-verdigris-200 dark:border-verdigris-700 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-verdigris-500 rounded-full animate-pulse shadow-lg shadow-verdigris-400"></div>
          <p className="text-sm font-medium text-verdigris-700 dark:text-verdigris-300">
            Verificando estado del contrato...
          </p>
        </div>
      </div>
    );
  }

  if (!isDeployed) {
    return (
      <div className="bg-bondi-blue-50 dark:bg-bondi-blue-900/30 rounded-xl shadow-lg p-6 border-2 border-bondi-blue-300 dark:border-bondi-blue-700 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-bondi-blue-800 dark:text-bondi-blue-200 mb-3">
              Contrato No Desplegado
            </h3>
            <p className="text-sm text-bondi-blue-700 dark:text-bondi-blue-300 mb-3">
              El contrato no está desplegado en la dirección:
            </p>
            <p className="text-xs font-mono bg-bondi-blue-100 dark:bg-bondi-blue-800 p-3 rounded-lg mb-4 text-bondi-blue-900 dark:text-bondi-blue-100 border border-bondi-blue-200 dark:border-bondi-blue-700">
              {contractConfig.contractAddress}
            </p>
            <div className="space-y-2 text-sm text-bondi-blue-700 dark:text-bondi-blue-300">
              <p className="font-semibold">Para desplegar el contrato:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Asegúrate de que Anvil esté corriendo</li>
                <li>Ejecuta en otra terminal:</li>
              </ol>
              <code className="block bg-bondi-blue-100 dark:bg-bondi-blue-800 p-3 rounded-lg text-xs mt-2 border border-bondi-blue-200 dark:border-bondi-blue-700 font-mono">
                cd sc
                <br />
                forge script script/FileHashStorage.s.sol:FileHashStorageScript
                --rpc-url http://localhost:8545 --broadcast --private-key
                0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
              </code>
              <p className="mt-2">
                3. Copia la dirección del contrato desplegado
              </p>
              <p>4. Actualiza CONTRACT_ADDRESS en dapp/lib/contract.ts</p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={checkContract}
                disabled={checking}
                className="px-5 py-2.5 bg-bondi-blue-500 hover:bg-bondi-blue-600 disabled:bg-bondi-blue-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {checking ? "Verificando..." : "Verificar Nuevamente"}
              </button>
              <button
                onClick={deployContract}
                disabled={deploying || checking}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {deploying ? "Desplegando..." : "🚀 Desplegar Contrato"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl shadow-lg p-4 border-2 border-emerald-300 dark:border-emerald-600 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-400"></div>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
          <span className="font-bold">Contrato desplegado:</span>{" "}
          <span className="font-mono bg-emerald-100 dark:bg-emerald-800 px-2 py-1 rounded text-emerald-800 dark:text-emerald-100">
            {formatAddress(contractConfig.contractAddress)}
          </span>
        </p>
        <button
          onClick={checkContract}
          className="ml-auto text-xs text-emerald-600 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-100 hover:underline font-medium transition-colors"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
