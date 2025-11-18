import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * API route para obtener la configuración del contrato
 * Esto permite que el cliente acceda a la configuración actualizada
 */
export async function GET() {
  try {
    const configPath = path.join(
      process.cwd(),
      "config",
      "contract-config.json"
    );

    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, "utf8");
      const config = JSON.parse(configData);
      return NextResponse.json(config);
    }

    // Retornar valores por defecto si no existe el archivo
    return NextResponse.json({
      contractAddress:
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
        "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      rpcUrl: process.env.NEXT_PUBLIC_ANVIL_RPC_URL || "http://localhost:8545",
      network: "anvil",
      chainId: 31337,
    });
  } catch (error) {
    console.error("Error leyendo configuración:", error);
    return NextResponse.json(
      {
        error: "Error al leer la configuración",
        contractAddress:
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
          "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        rpcUrl:
          process.env.NEXT_PUBLIC_ANVIL_RPC_URL || "http://localhost:8545",
      },
      { status: 500 }
    );
  }
}
