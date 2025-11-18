# FileHashStorage - Sistema de Verificación de Documentos en Blockchain

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/License-MIT-green)

<div align="center">

**🌐 Idioma / Language / Idioma**

[![Inglés](https://img.shields.io/badge/Inglés-🇬🇧-blue)](README.md) [![Español](https://img.shields.io/badge/Español-🇪🇸-red)](README.es.md) [![Portugués](https://img.shields.io/badge/Portugués-🇵🇹-green)](README.pt.md)

</div>

<p align="center">
  <img src="https://github.com/alucart2005/documentSighHash/blob/main/dapp/public/Capture.jpg?raw=true" alt="FileHashStorage dApp">
</p>

## 📋 Descripción del Proyecto

**FileHashStorage** es una aplicación descentralizada (dApp) completa que permite almacenar y verificar la autenticidad de documentos utilizando la tecnología blockchain de Ethereum. El sistema combina smart contracts desarrollados con Foundry y una interfaz web moderna construida con Next.js.

### ¿Qué Problema Resuelve?

En el mundo actual, verificar la autenticidad de documentos digitales es un desafío constante. Este proyecto ofrece una solución blockchain que permite:

- **Inmutabilidad**: Una vez registrado un documento, su hash no puede ser modificado
- **Trazabilidad**: Cada documento incluye timestamp y firma digital verificable
- **Transparencia**: Cualquier persona puede verificar la autenticidad de un documento
- **Descentralización**: No depende de una autoridad central

### Casos de Uso Reales

1. **Verificación de Títulos Académicos**: Universidades pueden registrar los hashes de diplomas para que empleadores verifiquen su autenticidad
2. **Certificación de Documentos Legales**: Notarios pueden registrar contratos y documentos legales con timestamp inmutable
3. **Protección de Propiedad Intelectual**: Artistas y creadores pueden registrar sus obras para demostrar autoría
4. **Auditoría de Documentos Corporativos**: Empresas pueden mantener un registro inmutable de documentos importantes
5. **Verificación de Identidad**: Documentos de identidad pueden ser verificados sin revelar información sensible

## 🏗️ Arquitectura del Proyecto

El proyecto está estructurado en dos componentes principales:

```
alucart2005/
├── sc/                    # Smart Contracts (Foundry)
│   ├── src/              # Contratos Solidity
│   ├── test/             # Tests de contratos
│   └── script/           # Scripts de despliegue
└── dapp/                  # Aplicación Frontend (Next.js)
    ├── app/              # Páginas y rutas
    ├── components/       # Componentes React
    ├── contexts/         # Contextos de React
    └── lib/              # Utilidades y configuración
```

## 🚀 Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior) - [Descargar Node.js](https://nodejs.org/)
- **Foundry** - Framework para desarrollo de smart contracts
- **Git** - Control de versiones
- **Anvil** (incluido con Foundry) - Red local de Ethereum para desarrollo

### Instalación de Foundry

Si aún no tienes Foundry instalado, ejecuta:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Para Windows (usando Git Bash o PowerShell):

```bash
# Descargar e instalar desde: https://github.com/foundry-rs/foundry/releases
# O usar chocolatey:
choco install foundry
```

### Configuración del Proyecto

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/alucart2005/alucart2005.git
cd alucart2005
```

#### 2. Configurar Smart Contracts

```bash
# Navegar al directorio de contratos
cd sc

# Instalar dependencias (forge-std)
forge install

# Compilar los contratos
forge build

# Ejecutar los tests
forge test
```

#### 3. Configurar la Aplicación Frontend

```bash
# Navegar al directorio de la dApp
cd ../dapp

# Instalar dependencias de Node.js
npm install

# Verificar que Anvil esté corriendo
npm run check-anvil
```

## ⚙️ Configuración

### Configuración del Entorno de Desarrollo

#### 1. Iniciar Anvil (Red Local de Ethereum)

En una terminal separada, inicia Anvil:

```bash
anvil
```

Esto iniciará una blockchain local en `http://localhost:8545` con 10 cuentas prefinanciadas para pruebas.

#### 2. Desplegar el Contrato

El contrato se despliega automáticamente cuando inicias la aplicación, pero también puedes hacerlo manualmente:

```bash
cd sc
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast
```

#### 3. Configurar la Dirección del Contrato

Después del despliegue, copia la dirección del contrato y actualiza el archivo de configuración:

```bash
# Editar dapp/config/contract-config.json
{
  "address": "0xTU_DIRECCION_DEL_CONTRATO_AQUI",
  "chainId": 31337
}
```

### Variables de Entorno (Opcional)

Puedes crear un archivo `.env.local` en el directorio `dapp/` para configuraciones adicionales:

```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## 💻 Uso

### Iniciar la Aplicación

```bash
# Desde el directorio dapp/
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Flujo de Trabajo Básico

1. **Conectar Wallet**: Conecta tu wallet de MetaMask o usa una de las cuentas de Anvil
2. **Subir Documento**: Selecciona un archivo y calcula su hash
3. **Firmar y Registrar**: Firma el hash con tu wallet y regístralo en la blockchain
4. **Verificar Documento**: Verifica la autenticidad de cualquier documento registrado

## 📚 Ejemplos de Uso en Escenarios Reales

### Ejemplo 1: Registro de un Contrato de Trabajo

**Situación**: Un empleador necesita registrar un contrato de trabajo para demostrar su existencia en una fecha específica.

**Pasos**:

1. **Preparar el documento**:

   ```bash
   # El documento "contrato_trabajo_2024.pdf" está listo para ser registrado
   ```

2. **Desde la interfaz web**:

   - Conecta tu wallet (cuenta del empleador)
   - Sube el archivo `contrato_trabajo_2024.pdf`
   - El sistema calcula automáticamente el hash SHA-256
   - Firma el hash con tu wallet
   - Confirma la transacción para registrar el documento

3. **Verificación posterior**:
   - Cualquier persona puede verificar el documento subiendo el mismo archivo
   - El sistema comparará el hash y mostrará:
     - ✅ Si el documento es auténtico
     - 📅 Fecha y hora de registro
     - 👤 Dirección de la wallet que lo registró

**Beneficio**: El empleador tiene prueba inmutable de que el contrato existía en una fecha específica, útil en disputas laborales.

### Ejemplo 2: Certificación de un Diploma Universitario

**Situación**: Una universidad quiere emitir diplomas verificables en blockchain.

**Proceso**:

1. **La universidad registra el diploma**:

   ```javascript
   // Hash del diploma: 0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730
   // Timestamp: 1704067200 (1 de enero de 2024)
   // Firma: Firma criptográfica de la universidad
   ```

2. **El graduado verifica su diploma**:

   - El graduado sube su archivo PDF del diploma
   - El sistema verifica que el hash coincide
   - Muestra la información de registro (fecha, institución)

3. **Un empleador verifica la autenticidad**:
   - El empleador recibe el diploma del candidato
   - Lo sube al sistema de verificación
   - Obtiene confirmación inmediata de autenticidad

**Beneficio**: Elimina la necesidad de contactar a la universidad para verificar diplomas, ahorrando tiempo y recursos.

### Ejemplo 3: Protección de Propiedad Intelectual

**Situación**: Un fotógrafo quiere proteger sus fotografías antes de publicarlas.

**Implementación**:

1. **Registro de la obra original**:

   ```bash
   # El fotógrafo registra el hash de "foto_original.jpg"
   # Esto crea un registro inmutable de que la foto existía en una fecha específica
   ```

2. **En caso de plagio**:
   - El fotógrafo puede demostrar que registró la obra antes
   - El timestamp en blockchain es prueba legal de autoría
   - La firma criptográfica confirma la identidad del autor

**Beneficio**: Prueba legal de autoría sin necesidad de registros costosos en oficinas de patentes.

### Ejemplo 4: Auditoría de Documentos Corporativos

**Situación**: Una empresa necesita mantener un registro auditado de documentos financieros.

**Flujo**:

1. **Registro mensual de estados financieros**:

   ```javascript
   // Cada mes, el CFO registra:
   // - Balance general
   // - Estado de resultados
   // - Flujo de caja
   ```

2. **Verificación por auditores**:

   - Los auditores pueden verificar que los documentos no han sido alterados
   - El timestamp garantiza la secuencia temporal
   - La firma del CFO es verificable

3. **Cumplimiento regulatorio**:
   - Las autoridades pueden verificar documentos sin acceso a sistemas internos
   - Transparencia sin comprometer la privacidad

**Beneficio**: Cumplimiento regulatorio mejorado y procesos de auditoría más eficientes.

### Ejemplo 5: Verificación de Documentos de Identidad

**Situación**: Una institución necesita verificar documentos de identidad sin almacenar datos personales.

**Solución**:

1. **El usuario registra su documento**:

   - Sube una copia de su documento de identidad
   - El sistema registra solo el hash (no los datos personales)
   - El usuario firma con su wallet

2. **Verificación por la institución**:
   - La institución recibe el documento del usuario
   - Calcula el hash y lo verifica en blockchain
   - Confirma autenticidad sin almacenar datos sensibles

**Beneficio**: Privacidad mejorada (solo se almacena el hash) y verificación rápida.

## 🧪 Testing

### Ejecutar Tests de Smart Contracts

```bash
cd sc
forge test
```

### Ejecutar Tests con Verbosidad

```bash
forge test -vvv  # Muestra logs detallados
```

### Ejecutar un Test Específico

```bash
forge test --match-test test_StoreDocumentHash
```

## 🔧 Comandos Útiles

### Smart Contracts

```bash
# Compilar contratos
forge build

# Ejecutar tests
forge test

# Desplegar a red local
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast

# Verificar contrato en un explorador de bloques
forge verify-contract <DIRECCION> FileHashStorage --chain-id 1
```

### Frontend

```bash
# Desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar que Anvil esté corriendo
npm run check-anvil

# Desplegar contrato manualmente
npm run deploy
```

## 📖 Documentación de la API del Contrato

### Funciones Principales

#### `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes calldata signature)`

Almacena el hash de un documento con su timestamp y firma.

**Parámetros**:

- `hash`: Hash del documento (SHA-256, Keccak-256, etc.)
- `timestamp`: Fecha de registro (Unix timestamp)
- `signature`: Firma ECDSA del hash (65 bytes)

**Retorna**: `bool` - `true` si el almacenamiento fue exitoso

**Ejemplo de uso**:

```solidity
bytes32 docHash = keccak256("mi_documento.pdf");
uint256 timestamp = block.timestamp;
bytes memory signature = /* firma del hash */;

fileHashStorage.storeDocumentHash(docHash, timestamp, signature);
```

#### `verifyDocument(bytes32 hash, address signer, bytes calldata signature)`

Verifica que una firma corresponde a un documento y signer específicos.

**Parámetros**:

- `hash`: Hash del documento a verificar
- `signer`: Dirección del signer esperado
- `signature`: Firma a verificar

**Retorna**: `bool` - `true` si la firma es válida

#### `getDocumentInfo(bytes32 hash)`

Obtiene toda la información de un documento registrado.

**Retorna**:

- `bytes32`: Hash del documento
- `uint256`: Timestamp de registro
- `address`: Dirección del signer
- `bytes`: Firma del documento

#### `isDocumentStored(bytes32 hash)`

Verifica si un documento existe en el sistema.

**Retorna**: `bool` - `true` si el documento está registrado

### Eventos

#### `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

Emitido cuando un documento es registrado exitosamente.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Este proyecto es parte de materiales de aprendizaje de Codecrypto Academy.

### Cómo Contribuir

1. **Fork el repositorio**

   ```bash
   git clone https://github.com/alucart2005/alucart2005.git
   ```

2. **Crea una rama para tu feature**

   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```

3. **Realiza tus cambios**

   - Sigue las mejores prácticas de Solidity
   - Escribe tests para nuevas funcionalidades
   - Actualiza la documentación

4. **Ejecuta los tests**

   ```bash
   cd sc && forge test
   cd ../dapp && npm run lint
   ```

5. **Commit tus cambios**

   ```bash
   git commit -m "feat: agregar nueva funcionalidad de verificación"
   ```

6. **Push a tu rama**

   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```

7. **Abre un Pull Request**

### Guías de Desarrollo

- **Solidity**: Sigue las [mejores prácticas de Solidity](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Testing**: Escribe tests comprehensivos para todas las nuevas funcionalidades
- **Documentación**: Actualiza la documentación para cualquier cambio en la API
- **Código Limpio**: Mantén el código legible y bien comentado

### Estructura de Commits

Usa mensajes de commit descriptivos siguiendo el formato:

```
tipo: descripción breve

Descripción detallada (opcional)
```

Tipos comunes:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `test`: Agregar o modificar tests
- `refactor`: Refactorización de código

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔗 Enlaces Útiles

- [Documentación de Foundry](https://book.getfoundry.sh/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Solidity](https://docs.soliditylang.org/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)

## 📞 Contacto

- **GitHub**: [@alucart2005](https://github.com/alucart2005)
- **Proyecto**: Parte de Codecrypto Academy

## 🙏 Agradecimientos

Este proyecto utiliza las siguientes tecnologías y herramientas:

- [Foundry](https://github.com/foundry-rs/foundry) - Framework de desarrollo de smart contracts
- [Next.js](https://nextjs.org/) - Framework de React para producción
- [Ethers.js](https://ethers.org/) - Biblioteca para interactuar con Ethereum
- [Anvil](https://github.com/foundry-rs/foundry/tree/master/anvil) - Cliente de Ethereum para desarrollo local

---

**Nota**: Este proyecto está diseñado para fines educativos y de práctica. Para uso en producción, asegúrate de realizar auditorías de seguridad completas y considerar las implicaciones legales y regulatorias.
