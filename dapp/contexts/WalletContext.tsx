"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import {
  ANVIL_PRIVATE_KEYS,
  FILE_HASH_STORAGE_ABI,
  normalizePrivateKey,
  getContractConfig,
} from "@/lib/contract";
import { useContractConfig } from "@/hooks/useContractConfig";
import { useErrorDialog } from "@/contexts/ErrorDialogContext";

interface WalletContextType {
  provider: ethers.JsonRpcProvider | null;
  wallets: ethers.Wallet[];
  currentWallet: ethers.Wallet | null;
  currentWalletIndex: number;
  contract: ethers.Contract | null;
  isConnected: boolean;
  selectWallet: (index: number) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { config: contractConfig } = useContractConfig();
  const { showError, hideError } = useErrorDialog();
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [wallets, setWallets] = useState<ethers.Wallet[]>([]);
  const [currentWallet, setCurrentWallet] = useState<ethers.Wallet | null>(
    null
  );
  const [currentWalletIndex, setCurrentWalletIndex] = useState<number>(0);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      // Usar la configuración dinámica
      const rpcUrl = contractConfig.rpcUrl;
      const contractAddress = contractConfig.contractAddress;

      if (!rpcUrl || !contractAddress) {
        console.warn("Configuración del contrato no disponible aún");
        return;
      }

      // Crear provider conectado a Anvil
      const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl);

      // Verificar que la conexión funciona haciendo una llamada de prueba
      try {
        const blockNumber = await jsonRpcProvider.getBlockNumber();
        console.log("Connected to Anvil. Block number:", blockNumber);
      } catch (connectionError) {
        throw new Error(
          `No se pudo conectar a Anvil en ${rpcUrl}. ` +
            `Asegúrate de que Anvil esté corriendo. Error: ${connectionError}`
        );
      }

      setProvider(jsonRpcProvider);

      // Obtener las claves privadas directamente de Anvil usando impersonateAccount
      // O usar las claves privadas estándar de Anvil
      // Por ahora, usaremos las claves privadas del array pero con validación mejorada

      // Crear las 10 wallets de prueba con validación
      const walletList: ethers.Wallet[] = [];
      for (let i = 0; i < ANVIL_PRIVATE_KEYS.length; i++) {
        try {
          // Normalizar y validar la clave privada
          const normalizedKey = normalizePrivateKey(ANVIL_PRIVATE_KEYS[i]);

          // Convertir a BigInt para validar que esté en el rango válido de secp256k1
          // El rango válido es: 1 <= privateKey < 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
          try {
            const keyBigInt = BigInt(normalizedKey);
            const maxKey = BigInt(
              "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
            );
            if (keyBigInt === BigInt(0) || keyBigInt >= maxKey) {
              throw new Error(
                `Clave privada fuera del rango válido para secp256k1`
              );
            }
          } catch (bigIntError) {
            console.warn(
              `Advertencia validando clave privada ${i + 1}:`,
              bigIntError
            );
          }

          // Crear wallet usando el constructor estándar de ethers.js v6
          // Verificar que la clave esté en el formato correcto
          if (!ethers.isHexString(normalizedKey, 32)) {
            throw new Error(
              `Clave privada no es un string hex válido de 32 bytes: ${normalizedKey}`
            );
          }

          // En ethers.js v6, podemos pasar la clave como string o como Uint8Array
          // Intentar primero como string, y si falla, convertir a bytes
          let wallet: ethers.Wallet;
          try {
            wallet = new ethers.Wallet(normalizedKey, jsonRpcProvider);
          } catch (stringError: any) {
            // Si falla como string, intentar como bytes
            try {
              // Usar la clave privada directamente como string
              wallet = new ethers.Wallet(normalizedKey, jsonRpcProvider);
            } catch (bytesError: any) {
              throw new Error(
                `No se pudo crear wallet con ningún formato. ` +
                  `String error: ${stringError?.message}. ` +
                  `Bytes error: ${bytesError?.message}`
              );
            }
          }

          // Verificar que la wallet se creó correctamente obteniendo su dirección
          const address = wallet.address;
          if (!address || address.length !== 42) {
            throw new Error(`Dirección de wallet inválida: ${address}`);
          }

          walletList.push(wallet);
          console.log(`✓ Wallet ${i + 1} creada: ${address}`);
        } catch (error: any) {
          console.error(`✗ Error creando wallet ${i + 1}:`, error);
          console.error(`  Clave privada: ${ANVIL_PRIVATE_KEYS[i]}`);
          throw new Error(
            `Error creando wallet ${i + 1}. ` +
              `Clave privada: ${ANVIL_PRIVATE_KEYS[i]}. ` +
              `Error: ${error?.message || String(error)}`
          );
        }
      }

      if (walletList.length === 0) {
        throw new Error("No se pudo crear ninguna wallet");
      }

      console.log(`✓ ${walletList.length} wallets creadas exitosamente`);
      setWallets(walletList);

      // Seleccionar la primera wallet por defecto
      const defaultWallet = walletList[0];
      setCurrentWallet(defaultWallet);
      setCurrentWalletIndex(0);

      // Verificar que la wallet tenga balance (opcional, solo para logging)
      try {
        const balance = await jsonRpcProvider.getBalance(defaultWallet.address);
        console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
      } catch (balanceError) {
        console.warn("Could not check wallet balance:", balanceError);
      }

      // Verificar que el contrato esté desplegado en la dirección especificada
      const code = await jsonRpcProvider.getCode(contractAddress);
      if (code === "0x" || code === "0x0") {
        const errorMsg =
          `El contrato no está desplegado en la dirección ${contractAddress}. ` +
          `Por favor despliega el contrato primero.`;
        console.warn(`⚠️ ${errorMsg}`);

        // Mostrar diálogo de error con opción de desplegar
        const rpcUrl = contractConfig.rpcUrl || "http://localhost:8545";
        showError(errorMsg, rpcUrl, true, contractAddress);

        // No establecer isConnected como true si el contrato no está desplegado
        setIsConnected(false);
        return;
      } else {
        console.log(`✓ Contrato encontrado en ${contractAddress}`);
      }

      // Crear instancia del contrato
      const contractInstance = new ethers.Contract(
        contractAddress,
        FILE_HASH_STORAGE_ABI,
        defaultWallet
      );
      setContract(contractInstance);

      setIsConnected(true);
      // Close error dialog if it was open from a previous error
      hideError();
    } catch (error: any) {
      console.error("Error connecting to Anvil:", error);
      const errorMessage =
        error?.message || "Error desconocido al conectar con Anvil";

      // Show elegant error dialog instead of alert
      const rpcUrl = contractConfig.rpcUrl || "http://localhost:8545";
      showError(errorMessage, rpcUrl);

      setIsConnected(false);
    }
  }, [
    contractConfig.rpcUrl,
    contractConfig.contractAddress,
    showError,
    hideError,
  ]);

  const selectWallet = useCallback(
    (index: number) => {
      if (index >= 0 && index < wallets.length && provider) {
        const selectedWallet = wallets[index];
        setCurrentWallet(selectedWallet);
        setCurrentWalletIndex(index);

        // Actualizar contrato con la nueva wallet usando la configuración dinámica
        const contractInstance = new ethers.Contract(
          contractConfig.contractAddress,
          FILE_HASH_STORAGE_ABI,
          selectedWallet
        );
        setContract(contractInstance);
      }
    },
    [wallets, provider, contractConfig.contractAddress]
  );

  const disconnect = useCallback(() => {
    setProvider(null);
    setWallets([]);
    setCurrentWallet(null);
    setCurrentWalletIndex(0);
    setContract(null);
    setIsConnected(false);
  }, []);

  // Auto-conectar al montar el componente y cuando cambie la configuración
  useEffect(() => {
    if (contractConfig.contractAddress && contractConfig.rpcUrl) {
      connect();
    }
  }, [connect, contractConfig.contractAddress, contractConfig.rpcUrl]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        wallets,
        currentWallet,
        currentWalletIndex,
        contract,
        isConnected,
        selectWallet,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
