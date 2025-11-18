# FileHashStorage dApp - Documentación del Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6-orange)
![License](https://img.shields.io/badge/License-MIT-green)

<div align="center">

**🌐 Idioma / Language / Idioma**

[![Inglés](https://img.shields.io/badge/Inglés-🇬🇧-blue)](README.md) [![Español](https://img.shields.io/badge/Español-🇪🇸-red)](README.es.md) [![Portugués](https://img.shields.io/badge/Portugués-🇵🇹-green)](README.pt.md)

</div>

Una aplicación descentralizada (dApp) moderna y lista para producción para la verificación de documentos en la blockchain de Ethereum. Construida con Next.js 16, React 19 y TypeScript, esta aplicación proporciona una interfaz fluida para almacenar y verificar hashes de documentos con firmas criptográficas.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Instrucciones de Uso](#-instrucciones-de-uso)
- [Integración de API](#-integración-de-api)
- [Escenarios del Mundo Real](#-escenarios-del-mundo-real)
- [Guías de Despliegue](#-guías-de-despliegue)
- [Arquitectura](#-arquitectura)
- [Contribución](#-contribución)
- [Solución de Problemas](#-solución-de-problemas)

## 🎯 Descripción del Proyecto

FileHashStorage dApp es una aplicación del lado del cliente que permite a los usuarios:

- **Almacenar hashes de documentos** en la blockchain de Ethereum con firmas criptográficas
- **Verificar la autenticidad de documentos** comparando hashes de archivos con registros de blockchain
- **Rastrear el historial de documentos** con timestamps inmutables e información del firmante
- **Gestionar múltiples wallets** con un selector de wallet integrado para pruebas y desarrollo

### Casos de Uso

Esta dApp está diseñada para aplicaciones prácticas en:

- **E-commerce**: Verificar certificados de productos, garantías y documentos de autenticidad
- **Finanzas**: Almacenar y verificar documentos financieros, contratos y registros de cumplimiento
- **Legal**: Timestamp de documentos legales y contratos con prueba criptográfica
- **Educación**: Verificar credenciales académicas y certificados
- **Salud**: Almacenamiento seguro de registros médicos y formularios de consentimiento
- **Cadena de Suministro**: Rastrear y verificar documentación de productos y certificaciones

## ✨ Características Principales

### 🔐 Seguridad y Autenticación

- **Firmas ECDSA**: Todos los documentos se firman usando el esquema de firma estándar de Ethereum
- **Hashing SHA-256**: Hashing criptográfico estándar de la industria para integridad de documentos
- **Integración de Wallets**: Soporte para múltiples wallets de prueba con cambio fluido
- **Verificación de Firmas**: Verificación en tiempo real de la autenticidad de documentos

### 🎨 Experiencia de Usuario

- **UI Moderna**: Construida con Tailwind CSS 4 para diseño responsivo y accesible
- **Actualizaciones en Tiempo Real**: Lista de documentos en vivo con escuchadores de eventos de blockchain
- **Manejo de Errores**: Diálogos de error completos con soluciones accionables
- **Estados de Carga**: Retroalimentación clara durante transacciones de blockchain
- **Modo Oscuro**: Soporte completo para temas oscuros y claros

### 🛠️ Experiencia del Desarrollador

- **TypeScript**: Seguridad de tipos completa en toda la aplicación
- **Context API**: Gestión de estado centralizada para datos de wallet y documentos
- **Hooks Personalizados**: Hooks reutilizables para interacción con contratos y configuración
- **Despliegue Automatizado**: Scripts para despliegue fluido de contratos
- **Hot Reload**: Desarrollo rápido con reemplazo de módulos en caliente de Next.js

## 🚀 Instalación

### Prerrequisitos

Antes de instalar, asegúrate de tener:

- **Node.js** v18 o superior ([Descargar](https://nodejs.org/))
- **npm** o **yarn** como gestor de paquetes
- **Foundry** instalado ([Guía de Instalación](https://book.getfoundry.sh/getting-started/installation))
- **Anvil** (incluido con Foundry) para desarrollo de blockchain local

### Instalación Paso a Paso

1. **Navegar al directorio dApp**:

   ```bash
   cd dapp
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Verificar instalación**:

   ```bash
   npm run check-anvil
   ```

   Este comando verifica si Anvil está corriendo. Si no, necesitarás iniciarlo (ver [Configuración](#-configuración)).

## ⚙️ Configuración

### Iniciar la Blockchain Local

La aplicación requiere que Anvil (nodo Ethereum local) esté corriendo. Tienes dos opciones:

#### Opción 1: Inicio Manual

```bash
# En una terminal separada
cd ../sc
anvil
```

Anvil se iniciará en `http://localhost:8545` con 10 cuentas de prueba prefinanciadas.

#### Opción 2: Despliegue Automatizado

La aplicación incluye un script de despliegue automatizado que:

- Verifica si Anvil está corriendo
- Inicia Anvil si es necesario
- Despliega el contrato automáticamente
- Actualiza archivos de configuración

```bash
npm run deploy
```

### Configuración del Contrato

La dirección del contrato se configura automáticamente durante el despliegue. La configuración se almacena en:

```
dapp/config/contract-config.json
```

Ejemplo de configuración:

```json
{
  "contractAddress": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  "rpcUrl": "http://localhost:8545",
  "network": "anvil",
  "chainId": 31337,
  "deployedAt": "2025-01-17T03:44:54.076Z"
}
```

### Variables de Entorno (Opcional)

Crea un archivo `.env.local` en el directorio `dapp` para configuración personalizada:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTuDireccionDelContrato
NEXT_PUBLIC_ANVIL_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

El script de despliegue se ejecuta automáticamente antes de iniciar el servidor de desarrollo (mediante el hook `predev`).

## 💻 Instrucciones de Uso

### Flujo de Trabajo Básico

1. **Conectar Wallet**: La aplicación se conecta automáticamente a Anvil y carga 10 wallets de prueba
2. **Seleccionar Wallet**: Elige del menú desplegable para cambiar entre cuentas de prueba
3. **Subir Documento**: Selecciona un archivo para calcular su hash
4. **Firmar y Almacenar**: Firma el hash con tu wallet y almacénalo en la blockchain
5. **Verificar Documento**: Sube cualquier archivo para verificar si está almacenado en la blockchain

### Ejemplos de Código

#### Usando el Contexto de Wallet

```typescript
import { useWallet } from "@/contexts/WalletContext";

function MyComponent() {
  const { currentWallet, contract, isConnected, selectWallet } = useWallet();

  if (!isConnected) {
    return <div>Conectando a la blockchain...</div>;
  }

  return (
    <div>
      <p>Wallet Actual: {currentWallet?.address}</p>
      <button onClick={() => selectWallet(1)}>Cambiar a Wallet 2</button>
    </div>
  );
}
```

#### Calculando el Hash de un Archivo

```typescript
import { calculateFileHash } from "@/lib/utils";

async function handleFileUpload(file: File) {
  try {
    const hash = await calculateFileHash(file);
    console.log("Hash del archivo:", hash);
    // formato del hash: "0x" + 64 caracteres hexadecimales
  } catch (error) {
    console.error("Error calculando hash:", error);
  }
}
```

#### Firmando un Hash

```typescript
import { signHash } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";

async function signDocument(hash: string) {
  const { currentWallet } = useWallet();

  if (!currentWallet) {
    throw new Error("No hay wallet conectada");
  }

  try {
    const signature = await signHash(hash, currentWallet);
    console.log("Firma:", signature);
    return signature;
  } catch (error) {
    console.error("Error firmando:", error);
  }
}
```

#### Almacenando un Documento en la Blockchain

```typescript
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash, signHash } from "@/lib/utils";

async function storeDocument(file: File) {
  const { contract, currentWallet } = useWallet();

  if (!contract || !currentWallet) {
    throw new Error("Wallet o contrato no disponible");
  }

  try {
    // 1. Calcular hash del archivo
    const hash = await calculateFileHash(file);

    // 2. Firmar el hash
    const signature = await signHash(hash, currentWallet);

    // 3. Obtener timestamp actual
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Almacenar en la blockchain
    const tx = await contract.storeDocumentHash(hash, timestamp, signature);

    // 5. Esperar confirmación
    await tx.wait();

    console.log("¡Documento almacenado exitosamente!");
    return tx.hash;
  } catch (error) {
    console.error("Error almacenando documento:", error);
    throw error;
  }
}
```

#### Verificando un Documento

```typescript
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash } from "@/lib/utils";

async function verifyDocument(file: File, expectedSigner: string) {
  const { contract } = useWallet();

  if (!contract) {
    throw new Error("Contrato no disponible");
  }

  try {
    // 1. Calcular hash del archivo
    const hash = await calculateFileHash(file);

    // 2. Verificar si el documento existe
    const exists = await contract.isDocumentStored(hash);

    if (!exists) {
      return { valid: false, reason: "Documento no encontrado" };
    }

    // 3. Obtener información del documento
    const [docHash, timestamp, signer, signature] =
      await contract.getDocumentInfo(hash);

    // 4. Verificar firma
    const isValid = await contract.verifyDocument(
      hash,
      expectedSigner,
      signature
    );

    return {
      valid: isValid,
      timestamp: new Date(Number(timestamp) * 1000),
      signer: signer,
      matches: signer.toLowerCase() === expectedSigner.toLowerCase(),
    };
  } catch (error) {
    console.error("Error verificando documento:", error);
    throw error;
  }
}
```

#### Escuchando Eventos de la Blockchain

```typescript
import { useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";

function DocumentListener() {
  const { contract } = useWallet();

  useEffect(() => {
    if (!contract) return;

    // Escuchar eventos de almacenamiento de documentos
    const filter = contract.filters.DocumentStored();

    contract.on(filter, (hash, signer, timestamp, event) => {
      console.log("Nuevo documento almacenado:", {
        hash,
        signer,
        timestamp: new Date(Number(timestamp) * 1000),
        transactionHash: event.transactionHash,
      });
    });

    // Limpiar listener al desmontar
    return () => {
      contract.removeAllListeners(filter);
    };
  }, [contract]);

  return null;
}
```

## 🔌 Integración de API

### ABI del Contrato

El ABI del contrato se exporta desde `lib/contract.ts`:

```typescript
import { FILE_HASH_STORAGE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
```

### Métodos del Contrato Disponibles

#### `storeDocumentHash(hash, timestamp, signature)`

Almacena un hash de documento en la blockchain.

**Parámetros**:

- `hash` (bytes32): Hash SHA-256 del documento
- `timestamp` (uint256): Timestamp Unix
- `signature` (bytes): Firma ECDSA (65 bytes)

**Retorna**: Recibo de transacción

**Ejemplo**:

```typescript
const tx = await contract.storeDocumentHash(
  "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
  1704067200,
  "0x1234..."
);
await tx.wait();
```

#### `verifyDocument(hash, signer, signature)`

Verifica una firma de documento.

**Parámetros**:

- `hash` (bytes32): Hash del documento
- `signer` (address): Dirección del firmante esperado
- `signature` (bytes): Firma a verificar

**Retorna**: `boolean` - true si la firma es válida

**Ejemplo**:

```typescript
const isValid = await contract.verifyDocument(
  hash,
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  signature
);
```

#### `getDocumentInfo(hash)`

Recupera información completa del documento.

**Parámetros**:

- `hash` (bytes32): Hash del documento

**Retorna**: `[bytes32, uint256, address, bytes]` - [hash, timestamp, signer, signature]

**Ejemplo**:

```typescript
const [docHash, timestamp, signer, signature] = await contract.getDocumentInfo(
  hash
);
```

#### `isDocumentStored(hash)`

Verifica si un documento existe.

**Parámetros**:

- `hash` (bytes32): Hash del documento

**Retorna**: `boolean` - true si el documento existe

**Ejemplo**:

```typescript
const exists = await contract.isDocumentStored(hash);
```

### API de Configuración

La aplicación proporciona una ruta API para obtener la configuración del contrato:

**Endpoint**: `GET /api/config`

**Respuesta**:

```json
{
  "contractAddress": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  "rpcUrl": "http://localhost:8545",
  "network": "anvil",
  "chainId": 31337,
  "deployedAt": "2025-01-17T03:44:54.076Z"
}
```

**Uso**:

```typescript
const response = await fetch("/api/config");
const config = await response.json();
```

## 🌍 Escenarios del Mundo Real

### Escenario 1: Verificación de Productos E-Commerce

**Caso de Uso**: Un marketplace en línea necesita verificar certificados de autenticidad de productos.

**Implementación**:

```typescript
// Componente para verificación de certificados de productos
async function verifyProductCertificate(
  productId: string,
  certificateFile: File
) {
  const { contract, currentWallet } = useWallet();

  // Calcular hash del certificado
  const hash = await calculateFileHash(certificateFile);

  // Verificar si el certificado está registrado
  const exists = await contract.isDocumentStored(hash);

  if (!exists) {
    throw new Error("Certificado no encontrado en la blockchain");
  }

  // Obtener detalles del certificado
  const [_, timestamp, signer, signature] = await contract.getDocumentInfo(
    hash
  );

  // Verificar que fue firmado por el fabricante
  const manufacturerAddress = "0x..."; // Dirección conocida del fabricante
  const isValid = await contract.verifyDocument(
    hash,
    manufacturerAddress,
    signature
  );

  return {
    productId,
    certificateValid: isValid,
    issuedBy: signer,
    issuedAt: new Date(Number(timestamp) * 1000),
  };
}
```

**Beneficios**:

- Los clientes pueden verificar la autenticidad del producto instantáneamente
- Reduce productos falsificados
- Genera confianza en el marketplace
- Prueba inmutable de emisión de certificado

### Escenario 2: Cumplimiento de Documentos Financieros

**Caso de Uso**: Una institución financiera necesita almacenar y verificar documentos de cumplimiento.

**Implementación**:

```typescript
// Almacenamiento por lotes de documentos para cumplimiento
async function storeComplianceDocuments(
  documents: Array<{ file: File; documentType: string }>
) {
  const { contract, currentWallet } = useWallet();
  const results = [];

  for (const doc of documents) {
    try {
      const hash = await calculateFileHash(doc.file);
      const signature = await signHash(hash, currentWallet!);
      const timestamp = Math.floor(Date.now() / 1000);

      const tx = await contract.storeDocumentHash(hash, timestamp, signature);

      await tx.wait();

      results.push({
        documentType: doc.documentType,
        hash,
        transactionHash: tx.hash,
        status: "stored",
      });
    } catch (error) {
      results.push({
        documentType: doc.documentType,
        status: "error",
        error: error.message,
      });
    }
  }

  return results;
}
```

**Beneficios**:

- Rastro de auditoría inmutable para cumplimiento regulatorio
- Prueba con timestamp de existencia de documentos
- Verificación fácil por auditores
- Costos de almacenamiento reducidos (solo se almacenan hashes)

### Escenario 3: Documentación de Cadena de Suministro

**Caso de Uso**: Rastrear documentos de envío y certificados en una cadena de suministro.

**Implementación**:

```typescript
// Rastreo de documentos de cadena de suministro
class SupplyChainTracker {
  private contract: ethers.Contract;

  async registerShipmentDocument(
    shipmentId: string,
    document: File,
    documentType: "invoice" | "certificate" | "manifest"
  ) {
    const hash = await calculateFileHash(document);
    const signature = await signHash(hash, this.wallet);
    const timestamp = Math.floor(Date.now() / 1000);

    const tx = await this.contract.storeDocumentHash(
      hash,
      timestamp,
      signature
    );

    await tx.wait();

    return {
      shipmentId,
      documentType,
      hash,
      registeredAt: new Date(timestamp * 1000),
      txHash: tx.hash,
    };
  }

  async verifyShipmentDocument(
    shipmentId: string,
    document: File,
    expectedSigner: string
  ) {
    const hash = await calculateFileHash(document);
    const exists = await this.contract.isDocumentStored(hash);

    if (!exists) {
      return { valid: false, reason: "Documento no registrado" };
    }

    const [_, timestamp, signer, signature] =
      await this.contract.getDocumentInfo(hash);

    const isValid = await this.contract.verifyDocument(
      hash,
      expectedSigner,
      signature
    );

    return {
      shipmentId,
      valid: isValid,
      registeredBy: signer,
      registeredAt: new Date(Number(timestamp) * 1000),
      matchesExpectedSigner:
        signer.toLowerCase() === expectedSigner.toLowerCase(),
    };
  }
}
```

**Beneficios**:

- Documentación transparente de cadena de suministro
- Previene la manipulación de documentos
- Verificación rápida en cualquier punto de control
- Reduce papeleo y tiempo de procesamiento

### Escenario 4: Verificación de Credenciales Académicas

**Caso de Uso**: Universidades emitiendo diplomas y certificados verificables.

**Implementación**:

```typescript
// Sistema de credenciales académicas
async function issueDiploma(
  studentId: string,
  diplomaFile: File,
  universityWallet: ethers.Wallet
) {
  const hash = await calculateFileHash(diplomaFile);
  const signature = await signHash(hash, universityWallet);
  const timestamp = Math.floor(Date.now() / 1000);

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    FILE_HASH_STORAGE_ABI,
    universityWallet
  );

  const tx = await contract.storeDocumentHash(hash, timestamp, signature);

  await tx.wait();

  return {
    studentId,
    diplomaHash: hash,
    issuedBy: universityWallet.address,
    issuedAt: new Date(timestamp * 1000),
    verificationUrl: `/verify/${hash}`,
    txHash: tx.hash,
  };
}

// Verificación por empleador
async function verifyDiploma(diplomaFile: File, expectedUniversity: string) {
  const hash = await calculateFileHash(diplomaFile);
  const [_, timestamp, signer, signature] = await contract.getDocumentInfo(
    hash
  );

  const isValid = await contract.verifyDocument(
    hash,
    expectedUniversity,
    signature
  );

  return {
    valid: isValid,
    university: signer,
    issuedAt: new Date(Number(timestamp) * 1000),
    verifiedAt: new Date(),
  };
}
```

**Beneficios**:

- Verificación instantánea de credenciales
- Reduce el fraude
- Elimina la necesidad de verificación manual
- Accesibilidad global

## 🚢 Guías de Despliegue

### Despliegue de Desarrollo

Para desarrollo local, el script automatizado maneja todo:

```bash
npm run dev
```

Esto hará:

1. Verificar si Anvil está corriendo
2. Iniciar Anvil si es necesario
3. Desplegar el contrato
4. Actualizar configuración
5. Iniciar el servidor de desarrollo de Next.js

### Build de Producción

Construir la aplicación para producción:

```bash
npm run build
```

Esto crea un build de producción optimizado en el directorio `.next`.

### Despliegue de Producción

#### Opción 1: Desplegar a Mainnet/Testnet

1. **Actualizar Configuración**:

   ```typescript
   // Actualizar lib/contract.ts o usar variables de entorno
   export const CONTRACT_ADDRESS = "0xTuDireccionMainnet";
   export const ANVIL_RPC_URL = "https://mainnet.infura.io/v3/TU_CLAVE";
   ```

2. **Construir**:

   ```bash
   npm run build
   ```

3. **Desplegar** (usando tu hosting preferido):
   ```bash
   npm start
   ```

#### Opción 2: Desplegar a Vercel

1. **Instalar Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Desplegar**:

   ```bash
   vercel
   ```

3. **Configurar Variables de Entorno** en el dashboard de Vercel:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ANVIL_RPC_URL`
   - `NEXT_PUBLIC_CHAIN_ID`

#### Opción 3: Despliegue con Docker

Crear un `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Construir y ejecutar:

```bash
docker build -t filehash-dapp .
docker run -p 3000:3000 filehash-dapp
```

### Configuración Específica por Entorno

Para diferentes entornos, usa variables de entorno:

**`.env.development`**:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
NEXT_PUBLIC_ANVIL_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

**`.env.production`**:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTuDireccionMainnet
NEXT_PUBLIC_ANVIL_RPC_URL=https://mainnet.infura.io/v3/TU_CLAVE
NEXT_PUBLIC_CHAIN_ID=1
```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
dapp/
├── app/
│   ├── api/                    # Rutas API
│   │   ├── check-anvil/        # Verificación de salud de Anvil
│   │   ├── config/             # API de configuración del contrato
│   │   └── deploy/             # API de despliegue
│   ├── layout.tsx              # Layout raíz con providers
│   ├── page.tsx                # Página principal de la aplicación
│   └── globals.css             # Estilos globales
├── components/
│   ├── WalletSelector.tsx      # Componente de selección de wallet
│   ├── FileUpload.tsx          # Subida y almacenamiento de documentos
│   ├── DocumentVerifier.tsx    # Verificación de documentos
│   ├── DocumentList.tsx        # Lista de documentos almacenados
│   ├── ConnectionStatus.tsx    # Indicador de estado de conexión
│   ├── ContractStatus.tsx      # Estado de despliegue del contrato
│   ├── AnvilErrorDialog.tsx    # Diálogo de manejo de errores
│   ├── HelpButton.tsx          # Ayuda y documentación
│   ├── HelpModal.tsx           # Componente modal de ayuda
│   └── Providers.tsx           # Wrapper de providers de contexto
├── contexts/
│   ├── WalletContext.tsx       # Estado de wallet y contrato
│   ├── DocumentContext.tsx     # Estado de lista de documentos
│   └── ErrorDialogContext.tsx  # Estado de diálogo de errores
├── hooks/
│   └── useContractConfig.ts    # Hook de configuración del contrato
├── lib/
│   ├── contract.ts             # ABI y configuración del contrato
│   └── utils.ts                # Funciones de utilidad (hash, sign, format)
├── config/
│   └── contract-config.json    # Archivo de configuración del contrato
├── scripts/
│   ├── deploy-automated.js     # Script de despliegue automatizado
│   ├── check-anvil.js          # Script de verificación de Anvil
│   └── deploy-contract.sh      # Script de despliegue de contrato
└── public/                     # Assets estáticos
```

### Gestión de Estado

La aplicación usa React Context API para gestión de estado:

- **WalletContext**: Gestiona la conexión de wallet, instancia del contrato y selección de wallet
- **DocumentContext**: Gestiona la lista de documentos almacenados y operaciones de documentos
- **ErrorDialogContext**: Gestiona diálogos de error y notificaciones de usuario

### Flujo de Datos

```
Acción del Usuario
    ↓
Componente (ej., FileUpload)
    ↓
Hook de Contexto (ej., useWallet)
    ↓
Método del Contrato (vía ethers.js)
    ↓
Blockchain (Anvil/Mainnet)
    ↓
Escuchador de Eventos
    ↓
Actualización de Contexto
    ↓
Re-renderizado de UI
```

## 🤝 Contribución

¡Aceptamos contribuciones! Por favor sigue estas guías:

### Configuración de Desarrollo

1. **Hacer fork del repositorio**

2. **Crear una rama de feature**:

   ```bash
   git checkout -b feature/caracteristica-increible
   ```

3. **Hacer tus cambios**:

   - Seguir mejores prácticas de TypeScript
   - Escribir código claro y autodocumentado
   - Agregar comentarios para lógica compleja
   - Actualizar documentación según sea necesario

4. **Probar tus cambios**:

   ```bash
   npm run build
   npm run dev
   ```

5. **Hacer commit de tus cambios**:

   ```bash
   git commit -m "feat: agregar característica increíble"
   ```

6. **Hacer push a tu rama**:

   ```bash
   git push origin feature/caracteristica-increible
   ```

7. **Abrir un Pull Request**

### Guías de Estilo de Código

- **TypeScript**: Usar modo estricto, evitar tipos `any`
- **React**: Usar componentes funcionales y hooks
- **Nomenclatura**: Usar nombres descriptivos en camelCase
- **Comentarios**: Documentar lógica compleja y reglas de negocio
- **Formato**: Usar Prettier (configurado en el proyecto)

### Checklist de Pull Request

- [ ] El código sigue las guías de estilo del proyecto
- [ ] Auto-revisión completada
- [ ] Comentarios agregados para código complejo
- [ ] Documentación actualizada
- [ ] Sin declaraciones console.log (usar logging apropiado)
- [ ] Los tests pasan (si aplica)
- [ ] El build se completa sin errores

## 🔧 Solución de Problemas

### Problemas Comunes y Soluciones

#### Problema: "Error conectando a Anvil"

**Síntomas**: La aplicación muestra un diálogo de error de conexión

**Soluciones**:

1. **Verificar si Anvil está corriendo**:

   ```bash
   npm run check-anvil
   ```

2. **Iniciar Anvil manualmente**:

   ```bash
   cd ../sc
   anvil
   ```

3. **Verificar puerto 8545**:

   ```bash
   # Windows
   netstat -ano | findstr :8545

   # Linux/Mac
   lsof -i :8545
   ```

4. **Terminar proceso si el puerto está en uso**:

   ```bash
   # Windows
   taskkill /PID <PID> /F

   # Linux/Mac
   kill -9 <PID>
   ```

#### Problema: "Contrato no desplegado"

**Síntomas**: Diálogo de error mostrando que el contrato no se encontró

**Soluciones**:

1. **Desplegar contrato manualmente**:

   ```bash
   cd ../sc
   forge script script/FileHashStorage.s.sol:FileHashStorageScript \
     --rpc-url http://localhost:8545 --broadcast
   ```

2. **Actualizar configuración**:

   - Copiar dirección del contrato de la salida del despliegue
   - Actualizar `config/contract-config.json`

3. **Usar despliegue automatizado**:
   ```bash
   npm run deploy
   ```

#### Problema: "Firma inválida"

**Síntomas**: La verificación de firma falla

**Soluciones**:

1. **Verificar formato del hash**: Debe ser `0x` + 64 caracteres hexadecimales

   ```typescript
   // Correcto
   const hash =
     "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730";

   // Incorrecto
   const hash =
     "7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730";
   ```

2. **Verificar que la wallet esté conectada**:

   ```typescript
   const { currentWallet, isConnected } = useWallet();
   if (!isConnected || !currentWallet) {
     // Manejar error
   }
   ```

3. **Verificar longitud de la firma**: Debe ser 65 bytes
   ```typescript
   if (signature.length !== 130) {
     // 65 bytes = 130 caracteres hex
     throw new Error("Longitud de firma inválida");
   }
   ```

#### Problema: "Transacción fallida"

**Síntomas**: La transacción de blockchain falla

**Soluciones**:

1. **Verificar balance de la wallet**:

   ```typescript
   const balance = await provider.getBalance(wallet.address);
   console.log("Balance:", ethers.formatEther(balance));
   ```

2. **Verificar límite de gas**: Anvil debe tener gas suficiente

   ```bash
   # Reiniciar Anvil con límite de gas más alto
   anvil --gas-limit 10000000
   ```

3. **Verificar estado del contrato**: Verificar que el contrato esté desplegado y accesible

#### Problema: "Errores de build"

**Síntomas**: `npm run build` falla

**Soluciones**:

1. **Limpiar caché**:

   ```bash
   rm -rf .next
   rm -rf node_modules
   npm install
   ```

2. **Verificar errores de TypeScript**:

   ```bash
   npx tsc --noEmit
   ```

3. **Verificar dependencias faltantes**:
   ```bash
   npm install
   ```

#### Problema: "Hot reload no funciona"

**Síntomas**: Los cambios no se reflejan en el navegador

**Soluciones**:

1. **Reiniciar servidor de desarrollo**:

   ```bash
   # Detener servidor (Ctrl+C)
   npm run dev
   ```

2. **Limpiar caché del navegador**: Hard refresh (Ctrl+Shift+R o Cmd+Shift+R)

3. **Verificar file watchers**: Asegurar que el sistema de archivos soporte watching

### Obtener Ayuda

Si encuentras problemas no cubiertos aquí:

1. **Revisar los logs**: Consola del navegador y salida de terminal
2. **Revisar documentación**: Este README y comentarios en el código
3. **Abrir un issue**: Proporcionar mensajes de error, pasos para reproducir y detalles del entorno
4. **Verificar dependencias**: Asegurar que todos los paquetes estén actualizados

### Modo Debug

Habilitar logging detallado:

```typescript
// En lib/contract.ts o utils.ts
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Info de debug:", data);
}
```

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Ethers.js](https://docs.ethers.org/)
- [Documentación de Foundry](https://book.getfoundry.sh/)
- [Documentación de Solidity](https://docs.soliditylang.org/)
- [Recursos para Desarrolladores de Ethereum](https://ethereum.org/developers/)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🙏 Agradecimientos

- **Foundry**: Por el excelente framework de desarrollo
- **Ethers.js**: Por la robusta interacción con Ethereum
- **Equipo de Next.js**: Por el increíble framework de React
- **Tailwind CSS**: Por el framework CSS utility-first

---

**Construido con ❤️ para la comunidad blockchain**

Para preguntas, problemas o contribuciones, por favor abre un issue o pull request en GitHub.
