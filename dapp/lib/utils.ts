import CryptoJS from "crypto-js";
import { ethers } from "ethers";

/**
 * Calcula el hash SHA-256 de un archivo
 */
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        const hash = CryptoJS.SHA256(wordArray);
        const hashHex = hash.toString(CryptoJS.enc.Hex);
        // Convertir a bytes32 (prefijo 0x + 64 caracteres hex)
        resolve("0x" + hashHex);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Firma un hash usando ethers.Wallet
 * El contrato espera que la firma sea del hash con prefijo "\x19Ethereum Signed Message:\n32"
 * ethers.js signMessage aplica este prefijo automáticamente
 */
export async function signHash(
  hash: string,
  wallet: ethers.Wallet
): Promise<string> {
  // Asegurarse de que el hash tenga el formato correcto (0x + 64 caracteres)
  const cleanHash = hash.startsWith("0x") ? hash : "0x" + hash;
  if (cleanHash.length !== 66) {
    throw new Error("Hash must be 32 bytes (64 hex characters + 0x prefix)");
  }

  // Convertir hash a array de bytes (32 bytes)
  const hashBytes = ethers.getBytes(cleanHash);

  // signMessage aplica automáticamente el prefijo "\x19Ethereum Signed Message:\n32"
  // y firma el mensaje, que es exactamente lo que el contrato espera
  const signature = await wallet.signMessage(hashBytes);
  return signature;
}

/**
 * Formatea una dirección para mostrar
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formatea un timestamp a fecha legible
 */
export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

/**
 * Convierte bytes a string hexadecimal
 */
export function bytesToHex(bytes: string): string {
  if (bytes.startsWith("0x")) return bytes;
  return "0x" + bytes;
}

/**
 * Valida que un hash sea un bytes32 válido (0x + 64 caracteres hexadecimales)
 */
export function isValidHash(hash: string): boolean {
  if (!hash || typeof hash !== "string") return false;

  // Debe empezar con 0x
  if (!hash.startsWith("0x")) return false;

  // Debe tener exactamente 66 caracteres (0x + 64 hex)
  if (hash.length !== 66) return false;

  // Debe contener solo caracteres hexadecimales después de 0x
  const hexPart = hash.slice(2);
  return /^[0-9a-fA-F]{64}$/.test(hexPart);
}
