import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

/**
 * API route para ejecutar el deployment del contrato
 * Esto permite que el frontend pueda disparar el deployment automáticamente
 */
export async function POST() {
  try {
    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "deploy-automated.js"
    );

    // Verificar que el script existe
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        {
          success: false,
          message: "Script de deployment no encontrado",
        },
        { status: 404 }
      );
    }

    console.log("🚀 Ejecutando deployment desde API...");

    // Ejecutar el script de deployment
    // Usar shell: true para mejor compatibilidad en Windows
    const { stdout, stderr } = await execAsync(`node "${scriptPath}"`, {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      shell: true,
    });

    // Leer la configuración actualizada
    const configPath = path.join(
      process.cwd(),
      "config",
      "contract-config.json"
    );
    let config = null;

    if (fs.existsSync(configPath)) {
      try {
        const configData = fs.readFileSync(configPath, "utf8");
        config = JSON.parse(configData);
      } catch (configError) {
        console.warn("Error leyendo configuración:", configError);
      }
    }

    // Verificar si el deployment fue exitoso
    const deploymentSuccess =
      stdout.includes("Deployment automatizado completado") ||
      stdout.includes("Contrato desplegado") ||
      stdout.includes("ONCHAIN EXECUTION COMPLETE");

    return NextResponse.json({
      success: deploymentSuccess,
      message: deploymentSuccess
        ? "Deployment ejecutado exitosamente"
        : "Deployment completado con advertencias",
      output: stdout,
      stderr: stderr,
      config: config,
    });
  } catch (error: any) {
    console.error("Error ejecutando deployment:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error ejecutando deployment",
        error: error.stderr || error.stdout || String(error),
      },
      { status: 500 }
    );
  }
}
