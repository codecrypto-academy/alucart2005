// ABI del contrato FileHashStorage
export const FILE_HASH_STORAGE_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "hash", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "storeDocumentHash",
    outputs: [{ internalType: "bool", name: "success", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "hash", type: "bytes32" },
      { internalType: "address", name: "signer", type: "address" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "verifyDocument",
    outputs: [{ internalType: "bool", name: "isValid", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "hash", type: "bytes32" }],
    name: "getDocumentInfo",
    outputs: [
      { internalType: "bytes32", name: "documentHash", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "address", name: "signer", type: "address" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "hash", type: "bytes32" }],
    name: "isDocumentStored",
    outputs: [{ internalType: "bool", name: "exists", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "hash", type: "bytes32" }],
    name: "getDocumentSignature",
    outputs: [{ internalType: "bytes", name: "signature", type: "bytes" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "hash", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "signer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DocumentStored",
    type: "event",
  },
] as const;

// Valores por defecto (fallback)
function getDefaultContractAddress(): string {
  return (
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  );
}

function getDefaultRpcUrl(): string {
  return process.env.NEXT_PUBLIC_ANVIL_RPC_URL || "http://localhost:8545";
}

// Función para cargar la configuración del contrato (sincrónica, para compatibilidad)
function loadContractConfigSync() {
  // En el cliente (browser), usar variables de entorno o valores por defecto
  if (typeof window !== "undefined") {
    return {
      contractAddress: getDefaultContractAddress(),
      rpcUrl: getDefaultRpcUrl(),
    };
  }

  // En el servidor (Node.js), leer desde el archivo de configuración
  try {
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(
      process.cwd(),
      "config",
      "contract-config.json"
    );

    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, "utf8");
      const config = JSON.parse(configData);
      return {
        contractAddress: config.contractAddress || getDefaultContractAddress(),
        rpcUrl: config.rpcUrl || getDefaultRpcUrl(),
      };
    }
  } catch (error) {
    console.warn(
      "No se pudo leer el archivo de configuración, usando valores por defecto:",
      error
    );
  }

  return {
    contractAddress: getDefaultContractAddress(),
    rpcUrl: getDefaultRpcUrl(),
  };
}

// Función para leer la configuración dinámicamente (siempre lee el archivo más reciente)
export function getContractConfig() {
  // En el cliente, no podemos leer archivos directamente
  // Se debe usar el hook useContractConfig() que llama al API
  if (typeof window !== "undefined") {
    return {
      contractAddress: getDefaultContractAddress(),
      rpcUrl: getDefaultRpcUrl(),
    };
  }

  // En el servidor, leer siempre el archivo más reciente
  try {
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(
      process.cwd(),
      "config",
      "contract-config.json"
    );

    if (fs.existsSync(configPath)) {
      // Leer el archivo cada vez (sin cache)
      const configData = fs.readFileSync(configPath, "utf8");
      const config = JSON.parse(configData);
      return {
        contractAddress: config.contractAddress || getDefaultContractAddress(),
        rpcUrl: config.rpcUrl || getDefaultRpcUrl(),
      };
    }
  } catch (error) {
    console.warn(
      "No se pudo leer el archivo de configuración, usando valores por defecto:",
      error
    );
  }

  return {
    contractAddress: getDefaultContractAddress(),
    rpcUrl: getDefaultRpcUrl(),
  };
}

// Cargar configuración inicial (para compatibilidad con código existente)
const config = loadContractConfigSync();

// Dirección del contrato desplegado en Anvil (valores por defecto, usar getContractConfig() para valores actualizados)
export const CONTRACT_ADDRESS = config.contractAddress;

// URL de Anvil (valores por defecto, usar getContractConfig() para valores actualizados)
export const ANVIL_RPC_URL = config.rpcUrl;

// Claves privadas de las 10 wallets de prueba de Anvil (por defecto)
// Estas son las claves privadas estándar que Anvil usa cuando se inicia sin parámetros
export const ANVIL_PRIVATE_KEYS = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  "0x047e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e39c4d98e0e0c0",
  "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9f0af8fda5cb2a4078cb2da",
  "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
  "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
] as const;

// Función para validar y normalizar una clave privada
export function normalizePrivateKey(key: string): string {
  // Remover espacios
  let normalized = key.trim();
  // Asegurar que tenga el prefijo 0x
  if (!normalized.startsWith("0x")) {
    normalized = "0x" + normalized;
  }

  // Remover el prefijo 0x temporalmente para trabajar con la parte hex
  const hexPart = normalized.slice(2);

  // Si tiene menos de 64 caracteres, rellenar con ceros al inicio
  if (hexPart.length < 64) {
    const paddedHex = hexPart.padStart(64, "0");
    normalized = "0x" + paddedHex;
    // Solo mostrar warning en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.debug(
        `Clave privada normalizada: ${hexPart.length} -> 64 caracteres`
      );
    }
  }

  // Validar longitud final (0x + 64 caracteres hex = 66 caracteres)
  if (normalized.length !== 66) {
    throw new Error(
      `Clave privada inválida: después de normalización debe tener 64 caracteres hex (tiene ${
        normalized.length - 2
      })`
    );
  }

  // Validar que sean caracteres hex válidos
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error(
      "Clave privada inválida: contiene caracteres no hexadecimales"
    );
  }

  return normalized.toLowerCase();
}
