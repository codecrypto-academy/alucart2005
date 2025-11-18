#!/bin/bash

# Script para desplegar el contrato FileHashStorage en Anvil
# Uso: ./deploy-contract.sh

echo "🚀 Desplegando contrato FileHashStorage a Anvil..."
echo ""

# Cambiar al directorio de smart contracts
cd ../sc

# Verificar que Anvil esté corriendo
echo "📡 Verificando conexión con Anvil..."
if ! curl -s -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' > /dev/null 2>&1; then
  echo "❌ Error: Anvil no está corriendo en http://localhost:8545"
  echo "💡 Inicia Anvil con: cd sc && anvil"
  exit 1
fi

echo "✅ Anvil está corriendo"
echo ""

# Desplegar el contrato
echo "📦 Desplegando contrato..."
DEPLOY_OUTPUT=$(forge script script/FileHashStorage.s.sol:FileHashStorageScript \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 2>&1)

# Extraer la dirección del contrato
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Contract deployed to: \K0x[a-fA-F0-9]{40}' || \
  echo "$DEPLOY_OUTPUT" | grep -oP 'Deployed to: \K0x[a-fA-F0-9]{40}' || \
  echo "$DEPLOY_OUTPUT" | grep -oP '0x[a-fA-F0-9]{40}' | head -1)

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "❌ Error: No se pudo extraer la dirección del contrato"
  echo "Salida del deployment:"
  echo "$DEPLOY_OUTPUT"
  exit 1
fi

echo ""
echo "✅ Contrato desplegado exitosamente!"
echo "📍 Dirección del contrato: $CONTRACT_ADDRESS"
echo ""
echo "📝 Actualiza CONTRACT_ADDRESS en dapp/lib/contract.ts con:"
echo "   export const CONTRACT_ADDRESS = \"$CONTRACT_ADDRESS\";"
echo ""

