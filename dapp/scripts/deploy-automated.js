#!/usr/bin/env node

/**
 * Script automatizado para:
 * 1. Verificar si Anvil está corriendo
 * 2. Si no está corriendo, iniciarlo automáticamente
 * 3. Desplegar el contrato FileHashStorage
 * 4. Capturar la dirección del contrato desplegado
 * 5. Actualizar el archivo de configuración con la nueva dirección
 */

const http = require("http");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const ANVIL_URL = "http://localhost:8545";
const ANVIL_PORT = 8545;
const ANVIL_HOST = "0.0.0.0";
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const SCRIPT_PATH = "script/FileHashStorage.s.sol:FileHashStorageScript";
const RPC_URL = `http://localhost:${ANVIL_PORT}`;

// Rutas de archivos
const SC_DIR = path.join(__dirname, "..", "..", "sc");
const CONFIG_DIR = path.join(__dirname, "..", "config");
const CONFIG_FILE = path.join(CONFIG_DIR, "contract-config.json");
const BROADCAST_DIR = path.join(
  SC_DIR,
  "broadcast",
  "FileHashStorage.s.sol",
  "31337"
);

let anvilProcess = null;

/**
 * Verifica si Anvil está corriendo
 */
function checkAnvil() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });

    const options = {
      hostname: "localhost",
      port: ANVIL_PORT,
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 3000,
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.result) {
            resolve(true);
          } else {
            reject(new Error("Invalid response from Anvil"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Connection timeout"));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Inicia Anvil en background
 */
function startAnvil() {
  return new Promise((resolve, reject) => {
    console.log("🚀 Iniciando Anvil...");

    // Verificar si anvil está disponible
    exec("which anvil", (error) => {
      if (error) {
        reject(new Error("Anvil no está instalado. Instálalo con: foundryup"));
        return;
      }

      anvilProcess = spawn(
        "anvil",
        ["--host", ANVIL_HOST, "--port", ANVIL_PORT.toString()],
        {
          cwd: SC_DIR,
          stdio: "pipe",
          detached: false,
        }
      );

      let output = "";
      anvilProcess.stdout.on("data", (data) => {
        output += data.toString();
        // Anvil está listo cuando muestra "Listening on"
        if (output.includes("Listening on")) {
          console.log("✅ Anvil iniciado correctamente");
          // Esperar un poco más para asegurar que esté completamente listo
          setTimeout(() => resolve(), 2000);
        }
      });

      anvilProcess.stderr.on("data", (data) => {
        const errorMsg = data.toString();
        // Ignorar warnings comunes de Anvil
        if (!errorMsg.includes("Warning") && !errorMsg.includes("warn")) {
          console.error("⚠️  Anvil stderr:", errorMsg);
        }
      });

      anvilProcess.on("error", (error) => {
        reject(new Error(`Error al iniciar Anvil: ${error.message}`));
      });

      anvilProcess.on("exit", (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error(`Anvil terminó con código ${code}`));
        }
      });

      // Timeout de seguridad
      setTimeout(() => {
        if (!output.includes("Listening on")) {
          reject(new Error("Timeout esperando que Anvil inicie"));
        }
      }, 10000);
    });
  });
}

/**
 * Espera a que Anvil esté disponible
 */
function waitForAnvil(maxAttempts = 10, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      attempts++;
      checkAnvil()
        .then(() => resolve())
        .catch((error) => {
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `Anvil no está disponible después de ${maxAttempts} intentos: ${error.message}`
              )
            );
          } else {
            setTimeout(check, delay);
          }
        });
    };

    check();
  });
}

/**
 * Encuentra el ejecutable de forge
 */
function findForgeCommand() {
  return new Promise((resolve, reject) => {
    const os = require("os");
    const platform = os.platform();

    // Función para buscar forge en Windows usando 'where'
    const findInWindows = () => {
      return new Promise((resolveWin) => {
        exec("where forge", { timeout: 3000 }, (error, stdout) => {
          if (!error && stdout && stdout.trim()) {
            const forgePath = stdout.trim().split("\n")[0].trim();
            if (fs.existsSync(forgePath)) {
              resolveWin(forgePath);
              return;
            }
          }
          resolveWin(null);
        });
      });
    };

    // Función para buscar forge en Unix usando 'which'
    const findInUnix = () => {
      return new Promise((resolveUnix) => {
        exec("which forge", { timeout: 3000 }, (error, stdout) => {
          if (!error && stdout && stdout.trim()) {
            const forgePath = stdout.trim();
            if (fs.existsSync(forgePath)) {
              resolveUnix(forgePath);
              return;
            }
          }
          resolveUnix(null);
        });
      });
    };

    // Primero intentar con 'forge' directamente
    exec("forge --version", { timeout: 3000 }, async (error) => {
      if (!error) {
        resolve("forge");
        return;
      }

      // Si falla, buscar en el sistema
      let foundPath = null;

      if (platform === "win32") {
        // Buscar usando 'where' en Windows
        foundPath = await findInWindows();

        // Si no se encuentra, buscar en ubicaciones comunes
        if (!foundPath) {
          const possiblePaths = [
            path.join(os.homedir(), ".foundry", "bin", "forge.exe"),
            path.join(os.homedir(), ".cargo", "bin", "forge.exe"),
            path.join(
              process.env.USERPROFILE || os.homedir(),
              ".foundry",
              "bin",
              "forge.exe"
            ),
            "C:\\Program Files\\Foundry\\bin\\forge.exe",
          ];

          for (const forgePath of possiblePaths) {
            if (fs.existsSync(forgePath)) {
              foundPath = forgePath;
              break;
            }
          }
        }
      } else {
        // Buscar usando 'which' en Unix
        foundPath = await findInUnix();

        // Si no se encuentra, buscar en ubicaciones comunes de Unix
        if (!foundPath) {
          const possiblePaths = [
            path.join(os.homedir(), ".foundry", "bin", "forge"),
            path.join(os.homedir(), ".cargo", "bin", "forge"),
            "/usr/local/bin/forge",
            "/usr/bin/forge",
          ];

          for (const forgePath of possiblePaths) {
            if (fs.existsSync(forgePath)) {
              foundPath = forgePath;
              break;
            }
          }
        }
      }

      if (foundPath) {
        resolve(foundPath);
      } else {
        // Si no se encuentra, intentar con 'forge' de todas formas
        // (puede estar en PATH pero no responder a --version)
        resolve("forge");
      }
    });
  });
}

/**
 * Despliega el contrato usando forge script
 */
function deployContract() {
  return new Promise(async (resolve, reject) => {
    console.log("📦 Desplegando contrato FileHashStorage...");

    try {
      // Encontrar el comando forge
      const forgeCommand = await findForgeCommand();
      const command = `${forgeCommand} script ${SCRIPT_PATH} --rpc-url ${RPC_URL} --broadcast --private-key ${PRIVATE_KEY}`;

      exec(
        command,
        {
          cwd: SC_DIR,
          maxBuffer: 10 * 1024 * 1024, // 10MB buffer
          shell: true, // Usar shell para mejor compatibilidad en Windows
        },
        (error, stdout, stderr) => {
          // Forge script puede escribir información en stderr aunque sea exitoso
          const output = stdout + stderr;

          if (error) {
            console.error("❌ Error durante el deployment:");
            console.error(output);

            // Mensaje de error más útil si forge no se encuentra
            if (
              output.includes("no se reconoce") ||
              output.includes("not recognized") ||
              output.includes("not found")
            ) {
              console.error("\n💡 Forge no se encontró en el PATH.");
              console.error(
                "   Por favor asegúrate de que Foundry esté instalado:"
              );
              console.error(
                "   1. Instala Foundry: https://book.getfoundry.sh/getting-started/installation"
              );
              console.error("   2. O ejecuta: foundryup");
              console.error(
                "   3. Verifica que forge esté en el PATH ejecutando: forge --version"
              );
            }

            reject(error);
            return;
          }

          console.log(stdout);
          if (stderr && !stderr.includes("Warning")) {
            console.log(stderr);
          }
          resolve(output);
        }
      );
    } catch (findError) {
      reject(new Error(`Error encontrando forge: ${findError.message}`));
    }
  });
}

/**
 * Extrae la dirección del contrato desde la salida de forge script o archivos de broadcast
 */
function extractContractAddress(deployOutput) {
  return new Promise((resolve, reject) => {
    // Primero intentar extraer desde la salida de forge script
    const addressPatterns = [
      /Contract deployed to: (0x[a-fA-F0-9]{40})/i,
      /Deployed to: (0x[a-fA-F0-9]{40})/i,
      /contractAddress["\s:]+(0x[a-fA-F0-9]{40})/i,
    ];

    for (const pattern of addressPatterns) {
      const matches = deployOutput.match(pattern);
      if (matches && matches[1]) {
        const address = matches[1];
        console.log(
          `✅ Dirección del contrato encontrada en salida: ${address}`
        );
        resolve(address);
        return;
      }
    }

    // Último recurso: buscar cualquier dirección hex de 40 caracteres después de palabras clave
    const fallbackPattern =
      /(?:deployed|contract|address)[:\s]+(0x[a-fA-F0-9]{40})/i;
    const fallbackMatch = deployOutput.match(fallbackPattern);
    if (fallbackMatch && fallbackMatch[1]) {
      const address = fallbackMatch[1];
      console.log(
        `✅ Dirección del contrato encontrada (fallback): ${address}`
      );
      resolve(address);
      return;
    }

    // Si no se encuentra en la salida, buscar en archivos de broadcast
    console.log("📄 Buscando dirección en archivos de broadcast...");

    if (!fs.existsSync(BROADCAST_DIR)) {
      reject(new Error(`Directorio de broadcast no existe: ${BROADCAST_DIR}`));
      return;
    }

    try {
      const broadcastFiles = fs
        .readdirSync(BROADCAST_DIR, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".json"))
        .map((dirent) => dirent.name)
        .sort()
        .reverse(); // Más reciente primero

      if (broadcastFiles.length === 0) {
        reject(new Error("No se encontraron archivos de broadcast"));
        return;
      }

      const latestFile = path.join(BROADCAST_DIR, broadcastFiles[0]);
      console.log(`📄 Leyendo archivo de broadcast: ${latestFile}`);

      const broadcastData = JSON.parse(fs.readFileSync(latestFile, "utf8"));

      // Buscar la dirección del contrato en las transacciones
      if (
        broadcastData.transactions &&
        Array.isArray(broadcastData.transactions)
      ) {
        for (const tx of broadcastData.transactions) {
          if (tx.contractAddress) {
            console.log(
              `✅ Dirección del contrato encontrada en broadcast: ${tx.contractAddress}`
            );
            resolve(tx.contractAddress);
            return;
          }
          // También buscar en tx.transaction.contractAddress
          if (tx.transaction && tx.transaction.contractAddress) {
            console.log(
              `✅ Dirección del contrato encontrada en broadcast: ${tx.transaction.contractAddress}`
            );
            resolve(tx.transaction.contractAddress);
            return;
          }
        }
      }

      // Buscar en summary.transactions
      if (broadcastData.summary && broadcastData.summary.transactions) {
        for (const tx of broadcastData.summary.transactions) {
          if (tx.contractAddress) {
            console.log(
              `✅ Dirección del contrato encontrada en summary: ${tx.contractAddress}`
            );
            resolve(tx.contractAddress);
            return;
          }
        }
      }

      reject(
        new Error("No se encontró contractAddress en el archivo de broadcast")
      );
    } catch (error) {
      reject(new Error(`Error leyendo archivo de broadcast: ${error.message}`));
    }
  });
}

/**
 * Crea el directorio de configuración si no existe
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Actualiza el archivo de configuración con la dirección del contrato
 */
function updateConfig(contractAddress) {
  ensureConfigDir();

  const config = {
    contractAddress: contractAddress,
    rpcUrl: RPC_URL,
    network: "anvil",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
  console.log(`✅ Configuración actualizada en: ${CONFIG_FILE}`);
  console.log(`   CONTRACT_ADDRESS: ${contractAddress}`);
  console.log(`   RPC_URL: ${RPC_URL}`);
}

/**
 * Verifica si el contrato está desplegado en la dirección especificada
 */
function verifyContractDeployed(contractAddress) {
  return new Promise((resolve, reject) => {
    // Normalizar la dirección (asegurar que tenga 0x y esté en minúsculas)
    const normalizedAddress = contractAddress.toLowerCase().startsWith("0x")
      ? contractAddress.toLowerCase()
      : "0x" + contractAddress.toLowerCase();

    const postData = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getCode",
      params: [normalizedAddress, "latest"],
      id: 1,
    });

    const options = {
      hostname: "localhost",
      port: ANVIL_PORT,
      path: "/",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      timeout: 5000, // Aumentar timeout
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);

          // Verificar si hay error en la respuesta
          if (response.error) {
            console.warn("Error en respuesta RPC:", response.error);
            resolve(false);
            return;
          }

          // Verificar si hay código desplegado
          const code = response.result;
          if (code && code !== "0x" && code !== "0x0" && code.length > 2) {
            console.log(
              `✅ Contrato verificado: código encontrado (${code.length} caracteres)`
            );
            resolve(true); // Contrato desplegado
          } else {
            console.log(`⚠️  Contrato no desplegado: código = ${code}`);
            resolve(false); // Contrato no desplegado
          }
        } catch (error) {
          console.warn("Error parseando respuesta:", error);
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Connection timeout"));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Verifica si el contrato necesita ser redesplegado
 */
async function checkAndRedeployIfNeeded() {
  try {
    // Leer la configuración actual si existe
    let currentConfig = null;
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const configData = fs.readFileSync(CONFIG_FILE, "utf8");
        currentConfig = JSON.parse(configData);
      } catch (error) {
        console.log(
          "⚠️  No se pudo leer la configuración existente, se desplegará nuevo contrato"
        );
      }
    }

    // Si hay configuración, verificar si el contrato está desplegado
    if (currentConfig && currentConfig.contractAddress) {
      console.log(
        `🔍 Verificando si el contrato está desplegado en ${currentConfig.contractAddress}...`
      );

      try {
        const isDeployed = await verifyContractDeployed(
          currentConfig.contractAddress
        );
        if (isDeployed) {
          console.log(
            "✅ El contrato ya está desplegado en la dirección configurada"
          );
          console.log(`📍 Dirección: ${currentConfig.contractAddress}`);
          return false; // No necesita redesplegar
        } else {
          console.log(
            "⚠️  El contrato no está desplegado en la dirección configurada"
          );
          console.log("🔄 Se procederá a redesplegar el contrato...");
          return true; // Necesita redesplegar
        }
      } catch (error) {
        console.log(
          "⚠️  No se pudo verificar el estado del contrato:",
          error.message
        );
        console.log("🔄 Se procederá a desplegar el contrato...");
        return true; // En caso de error, redesplegar
      }
    }

    // Si no hay configuración, necesita desplegar
    return true;
  } catch (error) {
    console.log("⚠️  Error verificando contrato:", error.message);
    return true; // En caso de error, redesplegar
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    // 1. Verificar si Anvil está corriendo
    console.log("🔍 Verificando si Anvil está corriendo...");
    let anvilRunning = false;

    try {
      await checkAnvil();
      anvilRunning = true;
      console.log("✅ Anvil ya está corriendo");
    } catch (error) {
      console.log("⚠️  Anvil no está corriendo, iniciándolo...");
      await startAnvil();
      await waitForAnvil();
      anvilRunning = true;
    }

    // 2. Verificar si el contrato necesita ser redesplegado
    const needsDeploy = await checkAndRedeployIfNeeded();

    if (!needsDeploy) {
      console.log(
        "\n✅ No se requiere deployment, el contrato ya está desplegado"
      );
      process.exit(0);
      return;
    }

    // 3. Desplegar el contrato
    const deployOutput = await deployContract();

    // 4. Extraer la dirección del contrato
    const contractAddress = await extractContractAddress(deployOutput);

    // 5. Verificar que el contrato se desplegó correctamente
    console.log("🔍 Verificando que el contrato se desplegó correctamente...");
    try {
      // Esperar un poco para que la transacción se procese
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isDeployed = await verifyContractDeployed(contractAddress);
      if (!isDeployed) {
        console.warn(
          "⚠️  El contrato fue desplegado pero la verificación falló. Esto puede ser normal si Anvil se reinició."
        );
        console.warn(
          "   El contrato debería estar disponible en la próxima verificación."
        );
      } else {
        console.log(
          "✅ Contrato verificado correctamente después del deployment"
        );
      }
    } catch (verifyError) {
      console.warn(
        "⚠️  No se pudo verificar el contrato después del deployment:",
        verifyError.message
      );
      console.warn(
        "   El contrato debería estar desplegado, pero la verificación falló."
      );
    }

    // 6. Actualizar el archivo de configuración
    updateConfig(contractAddress);

    console.log("\n🎉 Deployment automatizado completado exitosamente!");
    console.log(`📍 Contrato desplegado en: ${contractAddress}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error en el deployment automatizado:");
    console.error(`   ${error.message}`);

    // Limpiar proceso de Anvil si lo iniciamos
    if (anvilProcess) {
      console.log("🛑 Deteniendo Anvil...");
      anvilProcess.kill();
    }

    process.exit(1);
  }
}

// Manejar señales de terminación
process.on("SIGINT", () => {
  console.log("\n⚠️  Interrupción recibida, limpiando...");
  if (anvilProcess) {
    anvilProcess.kill();
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (anvilProcess) {
    anvilProcess.kill();
  }
  process.exit(0);
});

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkAnvil,
  startAnvil,
  deployContract,
  extractContractAddress,
};
