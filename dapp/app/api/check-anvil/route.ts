import { NextResponse } from "next/server";

const ANVIL_URL =
  process.env.NEXT_PUBLIC_ANVIL_RPC_URL || "http://localhost:8545";

export async function GET() {
  try {
    const url = new URL(ANVIL_URL);
    const hostname = url.hostname;
    const port = parseInt(url.port) || 8545;

    const postData = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });

    // Use fetch for better browser compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(ANVIL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: postData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
          { status: 200 } // Return 200 to show error in UI, not as HTTP error
        );
      }

      const data = await response.json();

      if (data.error) {
        return NextResponse.json({
          success: false,
          message: `Error de Anvil: ${
            data.error.message || "Error desconocido"
          }`,
        });
      }

      if (data.result) {
        const blockNumber = parseInt(data.result, 16);
        return NextResponse.json({
          success: true,
          message: "Anvil está corriendo correctamente",
          blockNumber,
          rpcUrl: ANVIL_URL,
        });
      }

      return NextResponse.json({
        success: false,
        message: "Respuesta inválida de Anvil",
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        return NextResponse.json({
          success: false,
          message: "Timeout: Anvil no respondió en 3 segundos",
        });
      }

      // Network errors
      if (
        fetchError.message?.includes("fetch failed") ||
        fetchError.message?.includes("NetworkError") ||
        fetchError.cause?.code === "ECONNREFUSED"
      ) {
        return NextResponse.json({
          success: false,
          message: `No se pudo conectar a ${ANVIL_URL}. Asegúrate de que Anvil esté corriendo.`,
        });
      }

      return NextResponse.json({
        success: false,
        message: `Error al verificar Anvil: ${
          fetchError.message || "Error desconocido"
        }`,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Error inesperado: ${error.message || "Error desconocido"}`,
      },
      { status: 500 }
    );
  }
}
