# FileHashStorage - Backend de Smart Contracts

![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-blue)
![License](https://img.shields.io/badge/License-UNLICENSED-red)

<div align="center">

**🌐 Idioma / Language / Idioma**

[![Inglês](https://img.shields.io/badge/Inglês-🇬🇧-blue)](README.md) [![Espanhol](https://img.shields.io/badge/Espanhol-🇪🇸-red)](README.es.md) [![Português](https://img.shields.io/badge/Português-🇵🇹-green)](README.pt.md)

</div>

Sistema de armazenamento e verificação de documentos baseado em blockchain Ethereum. Este contrato inteligente permite armazenar hashes de documentos com timestamps imutáveis e assinaturas criptográficas ECDSA, fornecendo uma solução descentralizada para verificação de autenticidade de documentos.

## 📋 Índice

- [Introdução](#-introdução)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API do Contrato](#-api-do-contrato)
- [Exemplos Práticos](#-exemplos-práticos)
- [Testes](#-testes)
- [Implantação](#-implantação)
- [Contribuição](#-contribuição)

## 🎯 Introdução

FileHashStorage é um contrato inteligente projetado para fornecer um sistema imutável de registro e verificação de documentos. Utiliza hash criptográfico (SHA-256) e assinaturas digitais ECDSA para garantir a integridade e autenticidade dos documentos.

### Características Principais

- **Armazenamento Imutável**: Os hashes de documentos são armazenados permanentemente na blockchain
- **Verificação Criptográfica**: Sistema de verificação baseado em assinaturas ECDSA
- **Timestamps**: Cada documento inclui um timestamp Unix para rastreamento temporal
- **Eventos**: Emissão de eventos para integração com frontends e APIs
- **Otimizado para Gas**: Design eficiente para minimizar custos de transação

### Casos de Uso

Este contrato é ideal para:

- **E-commerce**: Verificação de certificados de produtos, garantias e documentos de autenticidade
- **APIs de Verificação**: Backend para serviços de verificação de documentos
- **Conformidade Legal**: Registro imutável de contratos e documentos legais
- **Cadeia de Suprimentos**: Rastreabilidade de documentos de envio e certificações
- **Educação**: Verificação de credenciais acadêmicas e certificados

## 🚀 Instalação

### Pré-requisitos

- **Rust** (para Foundry) - [Instalar Rust](https://rustup.rs/)
- **Git** - Controle de versão
- **Node.js** (opcional) - Para scripts de automação

### Instalar Foundry

Foundry é um toolkit rápido e modular para desenvolvimento de aplicações Ethereum.

#### Linux e macOS

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Windows

```powershell
# Usando Git Bash ou PowerShell
irm https://foundry.paradigm.xyz | iex
foundryup
```

Ou baixe de: [Releases do Foundry](https://github.com/foundry-rs/foundry/releases)

### Verificar Instalação

```bash
forge --version
cast --version
anvil --version
```

### Instalar Dependências do Projeto

```bash
cd sc
forge install
```

Isso instalará `forge-std` e outras dependências necessárias.

## ⚙️ Configuração

### Estrutura do Projeto

```
sc/
├── src/                    # Contratos fonte
│   └── FileHashStorage.sol
├── test/                   # Testes
│   └── FileHashStorage.t.sol
├── script/                 # Scripts de implantação
│   └── FileHashStorage.s.sol
├── lib/                    # Dependências
│   └── forge-std/
├── out/                    # Artefatos compilados
├── cache/                  # Cache de compilação
└── foundry.toml           # Configuração do Foundry
```

### Configuração do Foundry

O arquivo `foundry.toml` contém a configuração do projeto:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
```

Para personalizar a configuração, edite `foundry.toml` de acordo com suas necessidades. Consulte a [documentação do Foundry](https://book.getfoundry.sh/reference/config) para mais opções.

## 💻 Uso

### Compilar Contratos

```bash
forge build
```

Os artefatos compilados são gerados no diretório `out/`.

### Executar Testes

```bash
# Executar todos os testes
forge test

# Executar testes com logs detalhados
forge test -vvv

# Executar um teste específico
forge test --match-test test_StoreDocumentHash

# Executar testes com cobertura de gas
forge test --gas-report
```

### Formatar Código

```bash
forge fmt
```

### Análise de Gas

```bash
# Gerar snapshot de gas
forge snapshot

# Comparar snapshots
forge snapshot --diff
```

### Iniciar Anvil (Blockchain Local)

```bash
anvil
```

O Anvil iniciará uma blockchain local em `http://localhost:8545` com 10 contas pré-financiadas.

## 📚 API do Contrato

### Funções Principais

#### `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes calldata signature)`

Armazena o hash de um documento na blockchain com seu timestamp e assinatura.

**Parâmetros**:

- `hash` (bytes32): Hash do documento (SHA-256, Keccak-256, etc.)
- `timestamp` (uint256): Timestamp Unix de registro
- `signature` (bytes): Assinatura ECDSA do hash (65 bytes)

**Retorna**: `bool` - `true` se o armazenamento foi bem-sucedido

**Eventos**: Emite `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

**Reverterá se**:

- O hash é `bytes32(0)`
- O documento já está armazenado
- A assinatura é inválida ou não tem 65 bytes

**Exemplo de uso**:

```solidity
bytes32 documentHash = keccak256("meu_documento.pdf");
uint256 timestamp = block.timestamp;
bytes memory signature = /* assinatura ECDSA de 65 bytes */;

bool success = fileHashStorage.storeDocumentHash(
    documentHash,
    timestamp,
    signature
);
```

#### `verifyDocument(bytes32 hash, address signer, bytes calldata signature)`

Verifica que uma assinatura corresponde a um documento e signatário específicos.

**Parâmetros**:

- `hash` (bytes32): Hash do documento a verificar
- `signer` (address): Endereço do signatário esperado
- `signature` (bytes): Assinatura a verificar

**Retorna**: `bool` - `true` se a assinatura é válida e corresponde ao signatário

**Reverterá se**:

- O documento não existe
- O signatário é `address(0)`

**Exemplo de uso**:

```solidity
bytes32 documentHash = keccak256("meu_documento.pdf");
address expectedSigner = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb;
bytes memory signature = /* assinatura do documento */;

bool isValid = fileHashStorage.verifyDocument(
    documentHash,
    expectedSigner,
    signature
);
```

#### `getDocumentInfo(bytes32 hash)`

Obtém todas as informações armazenadas de um documento.

**Parâmetros**:

- `hash` (bytes32): Hash do documento

**Retorna**:

- `bytes32 documentHash`: Hash do documento
- `uint256 timestamp`: Timestamp de registro
- `address signer`: Endereço do signatário
- `bytes memory signature`: Assinatura do documento

**Reverterá se**: O documento não existe

**Exemplo de uso**:

```solidity
bytes32 documentHash = keccak256("meu_documento.pdf");

(
    bytes32 docHash,
    uint256 timestamp,
    address signer,
    bytes memory signature
) = fileHashStorage.getDocumentInfo(documentHash);
```

#### `isDocumentStored(bytes32 hash)`

Verifica se um documento existe no sistema.

**Parâmetros**:

- `hash` (bytes32): Hash do documento

**Retorna**: `bool` - `true` se o documento está armazenado

**Exemplo de uso**:

```solidity
bytes32 documentHash = keccak256("meu_documento.pdf");
bool exists = fileHashStorage.isDocumentStored(documentHash);
```

#### `getDocumentSignature(bytes32 hash)`

Obtém a assinatura armazenada de um documento específico.

**Parâmetros**:

- `hash` (bytes32): Hash do documento

**Retorna**: `bytes memory` - Assinatura do documento

**Reverterá se**: O documento não existe

### Eventos

#### `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

Emitido quando um documento é armazenado com sucesso.

**Parâmetros**:

- `hash`: Hash do documento armazenado
- `signer`: Endereço do signatário
- `timestamp`: Timestamp de registro

## 🌍 Exemplos Práticos

### Exemplo 1: Integração com API de E-Commerce

**Cenário**: Um marketplace precisa verificar certificados de autenticidade de produtos.

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
        // Armazenar certificado no FileHashStorage
        fileHashStorage.storeDocumentHash(
            documentHash,
            timestamp,
            signature
        );

        // Vincular certificado com produto
        productCertificates[documentHash] = productId;
    }

    function verifyProductCertificate(
        bytes32 documentHash,
        address manufacturer
    ) external view returns (bool) {
        // Verificar que o certificado existe
        if (!fileHashStorage.isDocumentStored(documentHash)) {
            return false;
        }

        // Obter informações do certificado
        (, , address signer, bytes memory signature) =
            fileHashStorage.getDocumentInfo(documentHash);

        // Verificar que foi assinado pelo fabricante
        return fileHashStorage.verifyDocument(
            documentHash,
            manufacturer,
            signature
        ) && signer == manufacturer;
    }
}
```

**Uso em API REST**:

```javascript
// Endpoint: POST /api/products/:id/verify-certificate
async function verifyProductCertificate(productId, certificateFile) {
  // 1. Calcular hash do certificado
  const hash = calculateSHA256(certificateFile);

  // 2. Obter endereço do fabricante do banco de dados
  const manufacturer = await getManufacturerAddress(productId);

  // 3. Verificar na blockchain
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

### Exemplo 2: Sistema de Verificação de Documentos para API

**Cenário**: Backend API que permite aos clientes verificar documentos.

```solidity
// Contrato para serviço de verificação
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

**Integração com API REST**:

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

### Exemplo 3: Sistema de Timestamp para Contratos Legais

**Cenário**: Cartório que precisa registrar contratos com timestamp imutável.

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
        // Registrar no FileHashStorage
        fileHashStorage.storeDocumentHash(hash, timestamp, signature);

        // Armazenar metadados adicionais
        documents[hash] = LegalDocument({
            hash: hash,
            documentType: documentType,
            reference: reference,
            registeredAt: block.timestamp
        });

        // Vincular com usuário
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

### Exemplo 4: Integração com Frontend Web3

**Cenário**: Frontend que interage diretamente com o contrato.

```javascript
// Integração com ethers.js
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
    // 1. Calcular hash do arquivo
    const fileHash = await this.calculateFileHash(file);

    // 2. Assinar o hash
    const signature = await wallet.signMessage(ethers.getBytes(fileHash));

    // 3. Obter timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Armazenar na blockchain
    const tx = await this.contract
      .connect(wallet)
      .storeDocumentHash(fileHash, timestamp, signature);

    // 5. Aguardar confirmação
    const receipt = await tx.wait();

    return {
      hash: fileHash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  }

  async verifyDocument(file, expectedSigner) {
    const fileHash = await this.calculateFileHash(file);

    // Verificar existência
    const exists = await this.contract.isDocumentStored(fileHash);

    if (!exists) {
      return { valid: false, reason: "Document not found" };
    }

    // Obter informações
    const [hash, timestamp, signer, signature] =
      await this.contract.getDocumentInfo(fileHash);

    // Verificar assinatura
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

  // Escutar eventos
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

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
forge test

# Testes com logs detalhados
forge test -vvv

# Testes com cobertura
forge test --gas-report
```

### Estrutura de Testes

Os testes estão localizados em `test/FileHashStorage.t.sol` e cobrem:

- ✅ Armazenamento de documentos
- ✅ Verificação de documentos
- ✅ Validação de assinaturas
- ✅ Tratamento de erros
- ✅ Eventos emitidos
- ✅ Casos extremos (hashes duplicados, assinaturas inválidas, etc.)

### Exemplo de Teste

```solidity
function test_StoreAndVerifyDocument() public {
    bytes32 hash = keccak256("test_document.pdf");
    uint256 timestamp = block.timestamp;
    bytes memory signature = createSignature(hash, signer1Key);

    // Armazenar
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

## 🚢 Implantação

### Implantar em Rede Local (Anvil)

```bash
# 1. Iniciar Anvil
anvil

# 2. Em outro terminal, implantar
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast
```

### Implantar em Testnet (Sepolia)

```bash
# Configurar variáveis de ambiente
export PRIVATE_KEY=sua_chave_privada
export RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID

# Implantar
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key SUA_ETHERSCAN_API_KEY
```

### Implantar em Mainnet

```bash
# ⚠️ AVISO: Apenas para produção
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url https://mainnet.infura.io/v3/SEU_PROJECT_ID \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key SUA_ETHERSCAN_API_KEY \
    --slow
```

### Verificar Contrato no Etherscan

```bash
forge verify-contract \
    ENDERECO_DO_CONTRATO \
    FileHashStorage \
    --etherscan-api-key SUA_API_KEY \
    --chain-id 1
```

## 🤝 Contribuição

### Diretrizes de Desenvolvimento

1. **Fazer fork do repositório**

2. **Criar uma ramificação de funcionalidade**:

   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

3. **Desenvolver e testar**:

   ```bash
   forge build
   forge test
   forge fmt
   ```

4. **Fazer commit**:

   ```bash
   git commit -m "feat: adicionar nova funcionalidade"
   ```

5. **Enviar e criar Pull Request**

### Padrões de Código

- **Solidity Style Guide**: Seguir [Guia de Estilo do Solidity](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Natspec**: Documentar todas as funções públicas com comentários Natspec
- **Testes**: Escrever testes para todas as novas funcionalidades
- **Otimização de Gas**: Considerar otimização de gas em novas funções

### Checklist de Pull Request

- [ ] Código compila sem erros (`forge build`)
- [ ] Todos os testes passam (`forge test`)
- [ ] Código formatado (`forge fmt`)
- [ ] Documentação atualizada
- [ ] Testes adicionados para novas funcionalidades
- [ ] Sem avisos do compilador

## 📖 Recursos Adicionais

- [Documentação do Foundry](https://book.getfoundry.sh/)
- [Documentação do Solidity](https://docs.soliditylang.org/)
- [Recursos para Desenvolvedores Ethereum](https://ethereum.org/developers/)
- [Contratos OpenZeppelin](https://docs.openzeppelin.com/contracts/)

## 📄 Licença

Este projeto está sem licença (UNLICENSED). Consulte o arquivo de licença para mais detalhes.

## ⚠️ Avisos

- **Segurança**: Este contrato foi projetado para casos de uso específicos. Realize uma auditoria de segurança antes de usar em produção.
- **Custos de Gas**: Considere os custos de gas ao armazenar documentos. Cada transação consome gas.
- **Escalabilidade**: Para grandes volumes de documentos, considere usar eventos e armazenamento off-chain.

---

**Desenvolvido com Foundry para a comunidade blockchain**

Para perguntas ou problemas, abra um issue no repositório.
