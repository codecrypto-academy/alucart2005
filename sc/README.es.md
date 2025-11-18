# FileHashStorage - Backend de Smart Contracts

![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-blue)
![License](https://img.shields.io/badge/License-UNLICENSED-red)

<div align="center">

**🌐 Idioma / Language / Idioma**

[![Inglés](https://img.shields.io/badge/Inglés-🇬🇧-blue)](README.md) [![Español](https://img.shields.io/badge/Español-🇪🇸-red)](README.es.md) [![Portugués](https://img.shields.io/badge/Portugués-🇵🇹-green)](README.pt.md)

</div>

Sistema de almacenamiento y verificación de documentos basado en blockchain Ethereum. Este contrato inteligente permite almacenar hashes de documentos con timestamps inmutables y firmas criptográficas ECDSA, proporcionando una solución descentralizada para verificación de autenticidad de documentos.

## 📋 Tabla de Contenidos

- [Introducción](#-introducción)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API del Contrato](#-api-del-contrato)
- [Ejemplos Prácticos](#-ejemplos-prácticos)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

## 🎯 Introducción

FileHashStorage es un contrato inteligente diseñado para proporcionar un sistema inmutable de registro y verificación de documentos. Utiliza hashing criptográfico (SHA-256) y firmas digitales ECDSA para garantizar la integridad y autenticidad de los documentos.

### Características Principales

- **Almacenamiento Inmutable**: Los hashes de documentos se almacenan permanentemente en la blockchain
- **Verificación Criptográfica**: Sistema de verificación basado en firmas ECDSA
- **Timestamps**: Cada documento incluye un timestamp Unix para rastreo temporal
- **Eventos**: Emisión de eventos para integración con frontends y APIs
- **Gas Optimizado**: Diseño eficiente para minimizar costos de transacción

### Casos de Uso

Este contrato es ideal para:

- **E-commerce**: Verificación de certificados de productos, garantías y documentos de autenticidad
- **APIs de Verificación**: Backend para servicios de verificación de documentos
- **Cumplimiento Legal**: Registro inmutable de contratos y documentos legales
- **Cadena de Suministro**: Trazabilidad de documentos de envío y certificaciones
- **Educación**: Verificación de credenciales académicas y certificados

## 🚀 Instalación

### Prerrequisitos

- **Rust** (para Foundry) - [Instalar Rust](https://rustup.rs/)
- **Git** - Control de versiones
- **Node.js** (opcional) - Para scripts de automatización

### Instalar Foundry

Foundry es un toolkit rápido y modular para desarrollo de aplicaciones Ethereum.

#### Linux y macOS

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Windows

```powershell
# Usando Git Bash o PowerShell
irm https://foundry.paradigm.xyz | iex
foundryup
```

O descarga desde: [Releases de Foundry](https://github.com/foundry-rs/foundry/releases)

### Verificar Instalación

```bash
forge --version
cast --version
anvil --version
```

### Instalar Dependencias del Proyecto

```bash
cd sc
forge install
```

Esto instalará `forge-std` y otras dependencias necesarias.

## ⚙️ Configuración

### Estructura del Proyecto

```
sc/
├── src/                    # Contratos fuente
│   └── FileHashStorage.sol
├── test/                   # Tests
│   └── FileHashStorage.t.sol
├── script/                 # Scripts de despliegue
│   └── FileHashStorage.s.sol
├── lib/                    # Dependencias
│   └── forge-std/
├── out/                    # Artefactos compilados
├── cache/                  # Caché de compilación
└── foundry.toml           # Configuración de Foundry
```

### Configuración de Foundry

El archivo `foundry.toml` contiene la configuración del proyecto:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
```

Para personalizar la configuración, edita `foundry.toml` según tus necesidades. Consulta la [documentación de Foundry](https://book.getfoundry.sh/reference/config) para más opciones.

## 💻 Uso

### Compilar Contratos

```bash
forge build
```

Los artefactos compilados se generan en el directorio `out/`.

### Ejecutar Tests

```bash
# Ejecutar todos los tests
forge test

# Ejecutar tests con logs detallados
forge test -vvv

# Ejecutar un test específico
forge test --match-test test_StoreDocumentHash

# Ejecutar tests con cobertura de gas
forge test --gas-report
```

### Formatear Código

```bash
forge fmt
```

### Análisis de Gas

```bash
# Generar snapshot de gas
forge snapshot

# Comparar snapshots
forge snapshot --diff
```

### Iniciar Anvil (Blockchain Local)

```bash
anvil
```

Anvil iniciará una blockchain local en `http://localhost:8545` con 10 cuentas prefinanciadas.

## 📚 API del Contrato

### Funciones Principales

#### `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes calldata signature)`

Almacena el hash de un documento en la blockchain con su timestamp y firma.

**Parámetros**:

- `hash` (bytes32): Hash del documento (SHA-256, Keccak-256, etc.)
- `timestamp` (uint256): Timestamp Unix de registro
- `signature` (bytes): Firma ECDSA del hash (65 bytes)

**Retorna**: `bool` - `true` si el almacenamiento fue exitoso

**Eventos**: Emite `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

**Revertirá si**:

- El hash es `bytes32(0)`
- El documento ya está almacenado
- La firma es inválida o no tiene 65 bytes

**Ejemplo de uso**:

```solidity
bytes32 documentHash = keccak256("mi_documento.pdf");
uint256 timestamp = block.timestamp;
bytes memory signature = /* firma ECDSA de 65 bytes */;

bool success = fileHashStorage.storeDocumentHash(
    documentHash,
    timestamp,
    signature
);
```

#### `verifyDocument(bytes32 hash, address signer, bytes calldata signature)`

Verifica que una firma corresponde a un documento y signer específicos.

**Parámetros**:

- `hash` (bytes32): Hash del documento a verificar
- `signer` (address): Dirección del signer esperado
- `signature` (bytes): Firma a verificar

**Retorna**: `bool` - `true` si la firma es válida y corresponde al signer

**Revertirá si**:

- El documento no existe
- El signer es `address(0)`

**Ejemplo de uso**:

```solidity
bytes32 documentHash = keccak256("mi_documento.pdf");
address expectedSigner = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb;
bytes memory signature = /* firma del documento */;

bool isValid = fileHashStorage.verifyDocument(
    documentHash,
    expectedSigner,
    signature
);
```

#### `getDocumentInfo(bytes32 hash)`

Obtiene toda la información almacenada de un documento.

**Parámetros**:

- `hash` (bytes32): Hash del documento

**Retorna**:

- `bytes32 documentHash`: Hash del documento
- `uint256 timestamp`: Timestamp de registro
- `address signer`: Dirección del firmante
- `bytes memory signature`: Firma del documento

**Revertirá si**: El documento no existe

**Ejemplo de uso**:

```solidity
bytes32 documentHash = keccak256("mi_documento.pdf");

(
    bytes32 docHash,
    uint256 timestamp,
    address signer,
    bytes memory signature
) = fileHashStorage.getDocumentInfo(documentHash);
```

#### `isDocumentStored(bytes32 hash)`

Verifica si un documento existe en el sistema.

**Parámetros**:

- `hash` (bytes32): Hash del documento

**Retorna**: `bool` - `true` si el documento está almacenado

**Ejemplo de uso**:

```solidity
bytes32 documentHash = keccak256("mi_documento.pdf");
bool exists = fileHashStorage.isDocumentStored(documentHash);
```

#### `getDocumentSignature(bytes32 hash)`

Obtiene la firma almacenada de un documento específico.

**Parámetros**:

- `hash` (bytes32): Hash del documento

**Retorna**: `bytes memory` - Firma del documento

**Revertirá si**: El documento no existe

### Eventos

#### `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

Emitido cuando un documento es almacenado exitosamente.

**Parámetros**:

- `hash`: Hash del documento almacenado
- `signer`: Dirección del firmante
- `timestamp`: Timestamp de registro

## 🌍 Ejemplos Prácticos

### Ejemplo 1: Integración con API de E-Commerce

**Escenario**: Un marketplace necesita verificar certificados de autenticidad de productos.

```solidity
// Contrato wrapper para e-commerce
contract ECommerceVerification {
    FileHashStorage public fileHashStorage;

    mapping(bytes32 => string) public productCertificates;

    constructor(address _fileHashStorage) {
        fileHashStorage = FileHashStorage(_fileHashStorage);
    }

    function registerProductCertificate(
        string memory productId,
        bytes32 documentHash,
        uint256 timestamp,
        bytes calldata signature
    ) external {
        // Almacenar certificado en FileHashStorage
        fileHashStorage.storeDocumentHash(
            documentHash,
            timestamp,
            signature
        );

        // Vincular certificado con producto
        productCertificates[documentHash] = productId;
    }

    function verifyProductCertificate(
        bytes32 documentHash,
        address manufacturer
    ) external view returns (bool) {
        // Verificar que el certificado existe
        if (!fileHashStorage.isDocumentStored(documentHash)) {
            return false;
        }

        // Obtener información del certificado
        (, , address signer, bytes memory signature) =
            fileHashStorage.getDocumentInfo(documentHash);

        // Verificar que fue firmado por el fabricante
        return fileHashStorage.verifyDocument(
            documentHash,
            manufacturer,
            signature
        ) && signer == manufacturer;
    }
}
```

**Uso en API REST**:

```javascript
// Endpoint: POST /api/products/:id/verify-certificate
async function verifyProductCertificate(productId, certificateFile) {
  // 1. Calcular hash del certificado
  const hash = calculateSHA256(certificateFile);

  // 2. Obtener dirección del fabricante desde la base de datos
  const manufacturer = await getManufacturerAddress(productId);

  // 3. Verificar en blockchain
  const isValid = await ecommerceContract.verifyProductCertificate(
    hash,
    manufacturer
  );

  return {
    productId,
    valid: isValid,
    verifiedAt: new Date(),
  };
}
```

### Ejemplo 2: Sistema de Verificación de Documentos para API

**Escenario**: Backend API que permite a clientes verificar documentos.

```solidity
// Contrato para servicio de verificación
contract DocumentVerificationService {
    FileHashStorage public fileHashStorage;

    struct VerificationResult {
        bool valid;
        uint256 timestamp;
        address signer;
        bool exists;
    }

    constructor(address _fileHashStorage) {
        fileHashStorage = FileHashStorage(_fileHashStorage);
    }

    function verifyDocument(
        bytes32 hash,
        address expectedSigner
    ) external view returns (VerificationResult memory) {
        bool exists = fileHashStorage.isDocumentStored(hash);

        if (!exists) {
            return VerificationResult({
                valid: false,
                timestamp: 0,
                signer: address(0),
                exists: false
            });
        }

        (
            ,
            uint256 timestamp,
            address signer,
            bytes memory signature
        ) = fileHashStorage.getDocumentInfo(hash);

        bool valid = fileHashStorage.verifyDocument(
            hash,
            expectedSigner,
            signature
        );

        return VerificationResult({
            valid: valid,
            timestamp: timestamp,
            signer: signer,
            exists: true
        });
    }

    function batchVerify(
        bytes32[] calldata hashes,
        address[] calldata expectedSigners
    ) external view returns (VerificationResult[] memory) {
        require(
            hashes.length == expectedSigners.length,
            "Arrays length mismatch"
        );

        VerificationResult[] memory results =
            new VerificationResult[](hashes.length);

        for (uint i = 0; i < hashes.length; i++) {
            results[i] = this.verifyDocument(
                hashes[i],
                expectedSigners[i]
            );
        }

        return results;
    }
}
```

**Integración con API REST**:

```javascript
// Endpoint: POST /api/documents/verify
app.post("/api/documents/verify", async (req, res) => {
  const { documentHash, expectedSigner } = req.body;

  try {
    const result = await verificationService.verifyDocument(
      documentHash,
      expectedSigner
    );

    res.json({
      success: true,
      data: {
        valid: result.valid,
        exists: result.exists,
        timestamp: result.timestamp,
        signer: result.signer,
        verifiedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint: POST /api/documents/batch-verify
app.post("/api/documents/batch-verify", async (req, res) => {
  const { hashes, expectedSigners } = req.body;

  try {
    const results = await verificationService.batchVerify(
      hashes,
      expectedSigners
    );

    res.json({
      success: true,
      data: results.map((r, i) => ({
        hash: hashes[i],
        valid: r.valid,
        exists: r.exists,
        timestamp: r.timestamp,
        signer: r.signer,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
```

### Ejemplo 3: Sistema de Timestamp para Contratos Legales

**Escenario**: Notaría que necesita registrar contratos con timestamp inmutable.

```solidity
// Contrato para registro legal
contract LegalDocumentRegistry {
    FileHashStorage public fileHashStorage;

    struct LegalDocument {
        bytes32 hash;
        string documentType;
        string reference;
        uint256 registeredAt;
    }

    mapping(bytes32 => LegalDocument) public documents;
    mapping(address => bytes32[]) public userDocuments;

    event LegalDocumentRegistered(
        bytes32 indexed hash,
        address indexed registrant,
        string documentType,
        string reference
    );

    constructor(address _fileHashStorage) {
        fileHashStorage = FileHashStorage(_fileHashStorage);
    }

    function registerLegalDocument(
        bytes32 hash,
        uint256 timestamp,
        bytes calldata signature,
        string memory documentType,
        string memory reference
    ) external {
        // Registrar en FileHashStorage
        fileHashStorage.storeDocumentHash(hash, timestamp, signature);

        // Almacenar metadatos adicionales
        documents[hash] = LegalDocument({
            hash: hash,
            documentType: documentType,
            reference: reference,
            registeredAt: block.timestamp
        });

        // Vincular con usuario
        userDocuments[msg.sender].push(hash);

        emit LegalDocumentRegistered(
            hash,
            msg.sender,
            documentType,
            reference
        );
    }

    function getDocumentHistory(
        address user
    ) external view returns (LegalDocument[] memory) {
        bytes32[] memory userHashes = userDocuments[user];
        LegalDocument[] memory history = new LegalDocument[](userHashes.length);

        for (uint i = 0; i < userHashes.length; i++) {
            history[i] = documents[userHashes[i]];
        }

        return history;
    }
}
```

### Ejemplo 4: Integración con Web3 Frontend

**Escenario**: Frontend que interactúa directamente con el contrato.

```javascript
// Integración con ethers.js
import { ethers } from "ethers";
import FileHashStorageABI from "./abis/FileHashStorage.json";

class DocumentStorageService {
  constructor(contractAddress, provider) {
    this.contract = new ethers.Contract(
      contractAddress,
      FileHashStorageABI,
      provider
    );
  }

  async storeDocument(file, wallet) {
    // 1. Calcular hash del archivo
    const fileHash = await this.calculateFileHash(file);

    // 2. Firmar el hash
    const signature = await wallet.signMessage(ethers.getBytes(fileHash));

    // 3. Obtener timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Almacenar en blockchain
    const tx = await this.contract
      .connect(wallet)
      .storeDocumentHash(fileHash, timestamp, signature);

    // 5. Esperar confirmación
    const receipt = await tx.wait();

    return {
      hash: fileHash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  }

  async verifyDocument(file, expectedSigner) {
    const fileHash = await this.calculateFileHash(file);

    // Verificar existencia
    const exists = await this.contract.isDocumentStored(fileHash);

    if (!exists) {
      return { valid: false, reason: "Document not found" };
    }

    // Obtener información
    const [hash, timestamp, signer, signature] =
      await this.contract.getDocumentInfo(fileHash);

    // Verificar firma
    const isValid = await this.contract.verifyDocument(
      fileHash,
      expectedSigner,
      signature
    );

    return {
      valid: isValid,
      exists: true,
      timestamp: new Date(Number(timestamp) * 1000),
      signer: signer,
      matches: signer.toLowerCase() === expectedSigner.toLowerCase(),
    };
  }

  async calculateFileHash(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex =
      "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  // Escuchar eventos
  onDocumentStored(callback) {
    this.contract.on("DocumentStored", (hash, signer, timestamp, event) => {
      callback({
        hash,
        signer,
        timestamp: new Date(Number(timestamp) * 1000),
        transactionHash: event.transactionHash,
      });
    });
  }
}
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
forge test

# Tests con logs detallados
forge test -vvv

# Tests con cobertura
forge test --gas-report
```

### Estructura de Tests

Los tests están ubicados en `test/FileHashStorage.t.sol` y cubren:

- ✅ Almacenamiento de documentos
- ✅ Verificación de documentos
- ✅ Validación de firmas
- ✅ Manejo de errores
- ✅ Eventos emitidos
- ✅ Casos límite (hashes duplicados, firmas inválidas, etc.)

### Ejemplo de Test

```solidity
function test_StoreAndVerifyDocument() public {
    bytes32 hash = keccak256("test_document.pdf");
    uint256 timestamp = block.timestamp;
    bytes memory signature = createSignature(hash, signer1Key);

    // Almacenar
    bool success = fileHashStorage.storeDocumentHash(
        hash,
        timestamp,
        signature
    );
    assertTrue(success);

    // Verificar
    bool isValid = fileHashStorage.verifyDocument(
        hash,
        signer1,
        signature
    );
    assertTrue(isValid);
}
```

## 🚢 Despliegue

### Despliegue a Red Local (Anvil)

```bash
# 1. Iniciar Anvil
anvil

# 2. En otra terminal, desplegar
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast
```

### Despliegue a Testnet (Sepolia)

```bash
# Configurar variables de entorno
export PRIVATE_KEY=tu_clave_privada
export RPC_URL=https://sepolia.infura.io/v3/TU_PROJECT_ID

# Desplegar
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key TU_ETHERSCAN_API_KEY
```

### Despliegue a Mainnet

```bash
# ⚠️ ADVERTENCIA: Solo para producción
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url https://mainnet.infura.io/v3/TU_PROJECT_ID \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key TU_ETHERSCAN_API_KEY \
    --slow
```

### Verificar Contrato en Etherscan

```bash
forge verify-contract \
    CONTRACT_ADDRESS \
    FileHashStorage \
    --etherscan-api-key TU_API_KEY \
    --chain-id 1
```

## 🤝 Contribución

### Guías de Desarrollo

1. **Fork el repositorio**

2. **Crear una rama de feature**:

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Desarrollar y probar**:

   ```bash
   forge build
   forge test
   forge fmt
   ```

4. **Hacer commit**:

   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   ```

5. **Push y crear Pull Request**

### Estándares de Código

- **Solidity Style Guide**: Seguir [Style Guide de Solidity](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Natspec**: Documentar todas las funciones públicas con comentarios Natspec
- **Tests**: Escribir tests para todas las nuevas funcionalidades
- **Gas Optimization**: Considerar optimización de gas en nuevas funciones

### Checklist de Pull Request

- [ ] Código compila sin errores (`forge build`)
- [ ] Todos los tests pasan (`forge test`)
- [ ] Código formateado (`forge fmt`)
- [ ] Documentación actualizada
- [ ] Tests agregados para nuevas funcionalidades
- [ ] Sin advertencias del compilador

## 📖 Recursos Adicionales

- [Documentación de Foundry](https://book.getfoundry.sh/)
- [Documentación de Solidity](https://docs.soliditylang.org/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 📄 Licencia

Este proyecto está sin licencia (UNLICENSED). Ver el archivo de licencia para más detalles.

## ⚠️ Advertencias

- **Seguridad**: Este contrato ha sido diseñado para casos de uso específicos. Realiza una auditoría de seguridad antes de usar en producción.
- **Gas Costs**: Considera los costos de gas al almacenar documentos. Cada transacción consume gas.
- **Escalabilidad**: Para grandes volúmenes de documentos, considera usar eventos y almacenamiento off-chain.

---

**Desarrollado con Foundry para la comunidad blockchain**

Para preguntas o problemas, abre un issue en el repositorio.
