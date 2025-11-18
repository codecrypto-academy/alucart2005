# Guía Completa para Recuperar la Dirección de Despliegue de un Contrato Inteligente Usando Foundry's Anvil

Esta guía proporciona instrucciones paso a paso para usar el nodo local de Ethereum de Foundry (Anvil) y recuperar la dirección de un contrato inteligente después de su despliegue. Incluye comandos, métodos, prerrequisitos, posibles problemas y ejemplos basados en un proyecto típico de Foundry.

## Prerrequisitos

Antes de comenzar, asegúrate de tener lo siguiente:

- **Foundry instalado**: Foundry debe estar instalado en tu sistema. Si no lo tienes, instala desde [getfoundry.sh](https://getfoundry.sh/).
- **Proyecto Foundry configurado**: Un directorio con `foundry.toml`, contratos en `src/`, scripts en `script/` y pruebas en `test/`.
- **Script de despliegue**: Un script de Solidity que herede de `Script` y use `vm.startBroadcast()` para desplegar el contrato (ejemplo: `FileHashStorage.s.sol`).
- **Anvil ejecutándose**: El nodo local debe estar activo para simular la red Ethereum.
- **Conocimientos básicos**: Familiaridad con comandos de terminal, Ethereum y Solidity.

## Configuración de Anvil

Anvil es el nodo local de Foundry, similar a Ganache o Hardhat Network.

1. **Inicia Anvil**:
   ```
   anvil
   ```
   Esto inicia el nodo en `http://localhost:8545` por defecto. Verás 10 cuentas predeterminadas con ETH preminado. **Importante**: Deja esta terminal abierta; Anvil debe estar corriendo para que los comandos funcionen.

2. **Verifica que esté corriendo**:
   Abre otra terminal y ejecuta:
   ```
   curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```
   Deberías recibir un número de bloque (ej. `"result": "0x0"`). Si no, Anvil no está iniciado o hay un problema de conexión (ver sección de problemas).

3. **Opciones útiles de Anvil**:
   - Cambiar puerto: `anvil --port 8546`
   - Configurar cuentas: `anvil --accounts 5` (para menos cuentas)
   - Ver logs detallados: `anvil --verbose`

Deja Anvil corriendo en una terminal separada mientras trabajas.

## Despliegue del Contrato

Para desplegar un contrato en Anvil, usa `forge script`.

1. **Comando básico**:
   ```
   forge script script/TuScript.s.sol:TuContractScript --rpc-url http://localhost:8545 --broadcast --private-key TU_CLAVE_PRIVADA
   ```
   - `script/TuScript.s.sol`: Ruta al script.
   - `TuContractScript`: Nombre del contrato en el script.
   - `--rpc-url http://localhost:8545`: Apunta a Anvil.
   - `--broadcast`: Envía la transacción real.
   - `--private-key`: Clave privada de una cuenta con ETH (requerida para evitar errores de remitente).

2. **Ejemplo con tu proyecto**:
   ```
   forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   - Usa la clave privada predeterminada de Anvil (cuenta 0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`).

3. **Salida exitosa**:
   - El script imprime estimaciones de gas y confirma el despliegue.
   - Las transacciones se guardan en `broadcast/TuScript.s.sol/31337/run-latest.json`.

## Métodos para Recuperar la Dirección del Contrato

Una vez desplegado, hay varias formas de obtener la dirección.

### Método 1: Desde la Salida del Script
La forma más simple es leer la consola después del despliegue.

1. Ejecuta el comando de despliegue (ver arriba).
2. Busca en la salida: `Deployed to: 0x...`
3. Copia esa dirección.

**Ventaja**: Inmediata. **Desventaja**: Solo disponible en la sesión actual.

### Método 2: Desde los Archivos de Broadcast
Foundry guarda automáticamente los detalles en JSON.

1. Ve al directorio: `broadcast/TuScript.s.sol/31337/`.
2. Abre `run-latest.json`.
3. Busca `"transactions"` y localiza `"contractAddress"`: `"0x..."`.

**Ejemplo en tu proyecto**:
- Archivo: `sc/broadcast/FileHashStorage.s.sol/31337/run-latest.json`
- Busca el campo `contractAddress` en la transacción de despliegue.

**Ventaja**: Persistente. **Desventaja**: Requiere leer JSON manualmente.

### Método 3: Usando `cast receipt`
Si tienes el hash de la transacción, usa Cast.

1. Obtén el hash desde el archivo de broadcast (campo `"hash"`).
2. Ejecuta:
   ```
   cast receipt TX_HASH --rpc-url http://localhost:8545
   ```
3. Busca `"contractAddress"` en la salida JSON.

**Ejemplo**:
```
cast receipt 0x1234567890abcdef... --rpc-url http://localhost:8545
```

**Ventaja**: Preciso. **Desventaja**: Necesitas el hash primero.

### Método 4: Consultando el Nodo Directamente
Usa llamadas RPC a Anvil.

1. Obtén el hash de la transacción (desde broadcast).
2. Usa `cast` o curl:
   ```
   cast call --rpc-url http://localhost:8545 TX_HASH "contractAddress()(address)"
   ```
   O con curl:
   ```
   curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["TX_HASH"],"id":1}'
   ```
   Busca `"contractAddress"` en el resultado.

**Ventaja**: Programático. **Desventaja**: Más complejo.

## Posibles Problemas y Soluciones

- **Error "default sender"**: Agrega `--private-key` con una clave válida de Anvil (ver ejemplo arriba).
- **Sin ETH en la cuenta**: Anvil premina cuentas; usa la primera por defecto.
- **Puerto ocupado**: Cambia el puerto de Anvil con `--port`.
- **Script falla**: Verifica que el contrato compile (`forge build`) y que Anvil esté corriendo.
- **Dirección no aparece**: Asegúrate de que el despliegue creó un contrato (no solo llamó a uno existente).
- **Broadcast no se guarda**: El flag `--broadcast` es obligatorio.
- **Problemas de red**: Reinicia Anvil si hay inconsistencias.

## Ejemplos Prácticos

### Ejemplo 1: Despliegue Completo con Recuperación
```
# Inicia Anvil en una terminal
anvil

# En otra terminal, despliega
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Recupera desde broadcast
cat broadcast/FileHashStorage.s.sol/31337/run-latest.json | jq '.transactions[0].contractAddress'
```

### Ejemplo 2: Usando Cast para Verificar
Después del despliegue, verifica el contrato:
```
cast call CONTRACT_ADDRESS "owner()(address)" --rpc-url http://localhost:8545
```

### Ejemplo 3: Automatización en Script
En un script Bash:
```bash
#!/bin/bash
anvil &
sleep 2
forge script ... --broadcast --private-key ...
ADDRESS=$(jq -r '.transactions[0].contractAddress' broadcast/.../run-latest.json)
echo "Contrato desplegado en: $ADDRESS"
```

Esta guía cubre todo lo necesario para trabajar con Anvil y recuperar direcciones de contratos. Para más detalles, consulta la [documentación de Foundry](https://book.getfoundry.sh/).