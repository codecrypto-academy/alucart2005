#!/usr/bin/env node

/**
 * Script para verificar si Anvil está corriendo en http://localhost:8545
 */

const http = require("http");

const ANVIL_URL = "http://localhost:8545";

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
      port: 8545,
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

checkAnvil()
  .then(() => {
    console.log("✅ Anvil está corriendo en http://localhost:8545");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error conectando a Anvil:");
    console.error(`   ${error.message}`);
    console.error("\n💡 Para iniciar Anvil, ejecuta:");
    console.error("   cd sc && anvil");
    process.exit(1);
  });


