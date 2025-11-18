"use client";

import { useState, useEffect } from "react";

interface ContractConfig {
  contractAddress: string;
  rpcUrl: string;
  network?: string;
  chainId?: number;
  deployedAt?: string;
}

const DEFAULT_CONFIG: ContractConfig = {
  contractAddress:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  rpcUrl: process.env.NEXT_PUBLIC_ANVIL_RPC_URL || "http://localhost:8545",
};

/**
 * Hook para obtener la configuración del contrato dinámicamente
 * Lee desde el API route /api/config que obtiene la configuración actualizada
 */
export function useContractConfig() {
  const [config, setConfig] = useState<ContractConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchConfig() {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (mounted) {
          setConfig(data);
          setError(null);
        }
      } catch (err) {
        console.warn("Error obteniendo configuración del contrato:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error desconocido");
          // Usar valores por defecto en caso de error
          setConfig(DEFAULT_CONFIG);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchConfig();

    // Opcional: refrescar la configuración periódicamente
    const interval = setInterval(fetchConfig, 3000); // Cada 3 segundos (más frecuente)

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { config, loading, error };
}
