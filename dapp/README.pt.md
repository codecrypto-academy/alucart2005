# FileHashStorage dApp - Documentação do Frontend

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6-orange)
![License](https://img.shields.io/badge/License-MIT-green)

<div align="center">

**🌐 Idioma / Language / Idioma**

[![Inglês](https://img.shields.io/badge/Inglês-🇬🇧-blue)](README.md) [![Espanhol](https://img.shields.io/badge/Espanhol-🇪🇸-red)](README.es.md) [![Português](https://img.shields.io/badge/Português-🇵🇹-green)](README.pt.md)

</div>

Uma aplicação descentralizada (dApp) moderna e pronta para produção para verificação de documentos na blockchain Ethereum. Construída com Next.js 16, React 19 e TypeScript, esta aplicação fornece uma interface fluida para armazenar e verificar hashes de documentos com assinaturas criptográficas.

## 📋 Índice

- [Visão Geral do Projeto](#-visão-geral-do-projeto)
- [Características Principais](#-características-principais)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Instruções de Uso](#-instruções-de-uso)
- [Integração de API](#-integração-de-api)
- [Cenários do Mundo Real](#-cenários-do-mundo-real)
- [Diretrizes de Implantação](#-diretrizes-de-implantação)
- [Arquitetura](#-arquitetura)
- [Contribuição](#-contribuição)
- [Solução de Problemas](#-solução-de-problemas)

## 🎯 Visão Geral do Projeto

FileHashStorage dApp é uma aplicação do lado do cliente que permite aos usuários:

- **Armazenar hashes de documentos** na blockchain Ethereum com assinaturas criptográficas
- **Verificar a autenticidade de documentos** comparando hashes de arquivos com registros da blockchain
- **Rastrear o histórico de documentos** com timestamps imutáveis e informações do signatário
- **Gerenciar múltiplas carteiras** com um seletor de carteira integrado para testes e desenvolvimento

### Casos de Uso

Esta dApp é projetada para aplicações práticas em:

- **E-commerce**: Verificar certificados de produtos, garantias e documentos de autenticidade
- **Finanças**: Armazenar e verificar documentos financeiros, contratos e registros de conformidade
- **Legal**: Timestamp de documentos legais e contratos com prova criptográfica
- **Educação**: Verificar credenciais acadêmicas e certificados
- **Saúde**: Armazenamento seguro de registros médicos e formulários de consentimento
- **Cadeia de Suprimentos**: Rastrear e verificar documentação de produtos e certificações

## ✨ Características Principais

### 🔐 Segurança e Autenticação

- **Assinaturas ECDSA**: Todos os documentos são assinados usando o esquema de assinatura padrão do Ethereum
- **Hashing SHA-256**: Hashing criptográfico padrão da indústria para integridade de documentos
- **Integração de Carteiras**: Suporte para múltiplas carteiras de teste com troca fluida
- **Verificação de Assinaturas**: Verificação em tempo real da autenticidade de documentos

### 🎨 Experiência do Usuário

- **UI Moderna**: Construída com Tailwind CSS 4 para design responsivo e acessível
- **Atualizações em Tempo Real**: Lista de documentos ao vivo com ouvintes de eventos da blockchain
- **Tratamento de Erros**: Diálogos de erro abrangentes com soluções acionáveis
- **Estados de Carregamento**: Feedback claro durante transações na blockchain
- **Modo Escuro**: Suporte completo para temas escuros e claros

### 🛠️ Experiência do Desenvolvedor

- **TypeScript**: Segurança de tipos completa em toda a aplicação
- **Context API**: Gerenciamento de estado centralizado para dados de carteira e documentos
- **Hooks Personalizados**: Hooks reutilizáveis para interação com contratos e configuração
- **Implantação Automatizada**: Scripts para implantação fluida de contratos
- **Hot Reload**: Desenvolvimento rápido com substituição de módulos em tempo real do Next.js

## 🚀 Instalação

### Pré-requisitos

Antes de instalar, certifique-se de ter:

- **Node.js** v18 ou superior ([Baixar](https://nodejs.org/))
- **npm** ou **yarn** como gerenciador de pacotes
- **Foundry** instalado ([Guia de Instalação](https://book.getfoundry.sh/getting-started/installation))
- **Anvil** (incluído com Foundry) para desenvolvimento de blockchain local

### Instalação Passo a Passo

1. **Navegar para o diretório dApp**:

   ```bash
   cd dapp
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Verificar instalação**:

   ```bash
   npm run check-anvil
   ```

   Este comando verifica se o Anvil está em execução. Se não, você precisará iniciá-lo (veja [Configuração](#-configuração)).

## ⚙️ Configuração

### Iniciar a Blockchain Local

A aplicação requer que o Anvil (nó Ethereum local) esteja em execução. Você tem duas opções:

#### Opção 1: Início Manual

```bash
# Em um terminal separado
cd ../sc
anvil
```

O Anvil será iniciado em `http://localhost:8545` com 10 contas de teste pré-financiadas.

#### Opção 2: Implantação Automatizada

A aplicação inclui um script de implantação automatizado que:

- Verifica se o Anvil está em execução
- Inicia o Anvil se necessário
- Implanta o contrato automaticamente
- Atualiza arquivos de configuração

```bash
npm run deploy
```

### Configuração do Contrato

O endereço do contrato é configurado automaticamente durante a implantação. A configuração é armazenada em:

```
dapp/config/contract-config.json
```

Exemplo de configuração:

```json
{
  "contractAddress": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  "rpcUrl": "http://localhost:8545",
  "network": "anvil",
  "chainId": 31337,
  "deployedAt": "2025-01-17T03:44:54.076Z"
}
```

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local` no diretório `dapp` para configuração personalizada:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xSeuEnderecoDoContrato
NEXT_PUBLIC_ANVIL_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

### Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

O script de implantação é executado automaticamente antes de iniciar o servidor de desenvolvimento (via hook `predev`).

## 💻 Instruções de Uso

### Fluxo de Trabalho Básico

1. **Conectar Carteira**: A aplicação se conecta automaticamente ao Anvil e carrega 10 carteiras de teste
2. **Selecionar Carteira**: Escolha do menu suspenso para alternar entre contas de teste
3. **Enviar Documento**: Selecione um arquivo para calcular seu hash
4. **Assinar e Armazenar**: Assine o hash com sua carteira e armazene-o na blockchain
5. **Verificar Documento**: Envie qualquer arquivo para verificar se está armazenado na blockchain

### Exemplos de Código

#### Usando o Contexto da Carteira

```typescript
import { useWallet } from "@/contexts/WalletContext";

function MyComponent() {
  const { currentWallet, contract, isConnected, selectWallet } = useWallet();

  if (!isConnected) {
    return <div>Conectando à blockchain...</div>;
  }

  return (
    <div>
      <p>Carteira Atual: {currentWallet?.address}</p>
      <button onClick={() => selectWallet(1)}>Mudar para Carteira 2</button>
    </div>
  );
}
```

#### Calculando o Hash de um Arquivo

```typescript
import { calculateFileHash } from "@/lib/utils";

async function handleFileUpload(file: File) {
  try {
    const hash = await calculateFileHash(file);
    console.log("Hash do arquivo:", hash);
    // formato do hash: "0x" + 64 caracteres hexadecimais
  } catch (error) {
    console.error("Erro ao calcular hash:", error);
  }
}
```

#### Assinando um Hash

```typescript
import { signHash } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";

async function signDocument(hash: string) {
  const { currentWallet } = useWallet();

  if (!currentWallet) {
    throw new Error("Nenhuma carteira conectada");
  }

  try {
    const signature = await signHash(hash, currentWallet);
    console.log("Assinatura:", signature);
    return signature;
  } catch (error) {
    console.error("Erro ao assinar:", error);
  }
}
```

#### Armazenando um Documento na Blockchain

```typescript
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash, signHash } from "@/lib/utils";

async function storeDocument(file: File) {
  const { contract, currentWallet } = useWallet();

  if (!contract || !currentWallet) {
    throw new Error("Carteira ou contrato não disponível");
  }

  try {
    // 1. Calcular hash do arquivo
    const hash = await calculateFileHash(file);

    // 2. Assinar o hash
    const signature = await signHash(hash, currentWallet);

    // 3. Obter timestamp atual
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Armazenar na blockchain
    const tx = await contract.storeDocumentHash(hash, timestamp, signature);

    // 5. Aguardar confirmação
    await tx.wait();

    console.log("Documento armazenado com sucesso!");
    return tx.hash;
  } catch (error) {
    console.error("Erro ao armazenar documento:", error);
    throw error;
  }
}
```

#### Verificando um Documento

```typescript
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash } from "@/lib/utils";

async function verifyDocument(file: File, expectedSigner: string) {
  const { contract } = useWallet();

  if (!contract) {
    throw new Error("Contrato não disponível");
  }

  try {
    // 1. Calcular hash do arquivo
    const hash = await calculateFileHash(file);

    // 2. Verificar se o documento existe
    const exists = await contract.isDocumentStored(hash);

    if (!exists) {
      return { valid: false, reason: "Documento não encontrado" };
    }

    // 3. Obter informações do documento
    const [docHash, timestamp, signer, signature] =
      await contract.getDocumentInfo(hash);

    // 4. Verificar assinatura
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
    console.error("Erro ao verificar documento:", error);
    throw error;
  }
}
```

#### Escutando Eventos da Blockchain

```typescript
import { useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";

function DocumentListener() {
  const { contract } = useWallet();

  useEffect(() => {
    if (!contract) return;

    // Escutar eventos de armazenamento de documentos
    const filter = contract.filters.DocumentStored();

    contract.on(filter, (hash, signer, timestamp, event) => {
      console.log("Novo documento armazenado:", {
        hash,
        signer,
        timestamp: new Date(Number(timestamp) * 1000),
        transactionHash: event.transactionHash,
      });
    });

    // Limpar listener ao desmontar
    return () => {
      contract.removeAllListeners(filter);
    };
  }, [contract]);

  return null;
}
```

## 🔌 Integração de API

### ABI do Contrato

O ABI do contrato é exportado de `lib/contract.ts`:

```typescript
import { FILE_HASH_STORAGE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
```

### Métodos do Contrato Disponíveis

#### `storeDocumentHash(hash, timestamp, signature)`

Armazena um hash de documento na blockchain.

**Parâmetros**:

- `hash` (bytes32): Hash SHA-256 do documento
- `timestamp` (uint256): Timestamp Unix
- `signature` (bytes): Assinatura ECDSA (65 bytes)

**Retorna**: Recibo de transação

**Exemplo**:

```typescript
const tx = await contract.storeDocumentHash(
  "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
  1704067200,
  "0x1234..."
);
await tx.wait();
```

#### `verifyDocument(hash, signer, signature)`

Verifica uma assinatura de documento.

**Parâmetros**:

- `hash` (bytes32): Hash do documento
- `signer` (address): Endereço do signatário esperado
- `signature` (bytes): Assinatura a verificar

**Retorna**: `boolean` - true se a assinatura é válida

**Exemplo**:

```typescript
const isValid = await contract.verifyDocument(
  hash,
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  signature
);
```

#### `getDocumentInfo(hash)`

Recupera informações completas do documento.

**Parâmetros**:

- `hash` (bytes32): Hash do documento

**Retorna**: `[bytes32, uint256, address, bytes]` - [hash, timestamp, signer, signature]

**Exemplo**:

```typescript
const [docHash, timestamp, signer, signature] = await contract.getDocumentInfo(
  hash
);
```

#### `isDocumentStored(hash)`

Verifica se um documento existe.

**Parâmetros**:

- `hash` (bytes32): Hash do documento

**Retorna**: `boolean` - true se o documento existe

**Exemplo**:

```typescript
const exists = await contract.isDocumentStored(hash);
```

### API de Configuração

A aplicação fornece uma rota API para buscar a configuração do contrato:

**Endpoint**: `GET /api/config`

**Resposta**:

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

## 🌍 Cenários do Mundo Real

### Cenário 1: Verificação de Produtos E-Commerce

**Caso de Uso**: Um marketplace online precisa verificar certificados de autenticidade de produtos.

**Implementação**:

```typescript
// Componente para verificação de certificados de produtos
async function verifyProductCertificate(
  productId: string,
  certificateFile: File
) {
  const { contract, currentWallet } = useWallet();

  // Calcular hash do certificado
  const hash = await calculateFileHash(certificateFile);

  // Verificar se o certificado está registrado
  const exists = await contract.isDocumentStored(hash);

  if (!exists) {
    throw new Error("Certificado não encontrado na blockchain");
  }

  // Obter detalhes do certificado
  const [_, timestamp, signer, signature] = await contract.getDocumentInfo(
    hash
  );

  // Verificar que foi assinado pelo fabricante
  const manufacturerAddress = "0x..."; // Endereço conhecido do fabricante
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

**Benefícios**:

- Clientes podem verificar a autenticidade do produto instantaneamente
- Reduz produtos falsificados
- Gera confiança no marketplace
- Prova imutável de emissão de certificado

### Cenário 2: Conformidade de Documentos Financeiros

**Caso de Uso**: Uma instituição financeira precisa armazenar e verificar documentos de conformidade.

**Implementação**:

```typescript
// Armazenamento em lote de documentos para conformidade
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

**Benefícios**:

- Rastro de auditoria imutável para conformidade regulatória
- Prova com timestamp de existência de documentos
- Verificação fácil por auditores
- Custos de armazenamento reduzidos (apenas hashes são armazenados)

### Cenário 3: Documentação de Cadeia de Suprimentos

**Caso de Uso**: Rastrear documentos de envio e certificados em uma cadeia de suprimentos.

**Implementação**:

```typescript
// Rastreamento de documentos de cadeia de suprimentos
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
      return { valid: false, reason: "Documento não registrado" };
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

**Benefícios**:

- Documentação transparente de cadeia de suprimentos
- Previne manipulação de documentos
- Verificação rápida em qualquer ponto de controle
- Reduz papelada e tempo de processamento

### Cenário 4: Verificação de Credenciais Acadêmicas

**Caso de Uso**: Universidades emitindo diplomas e certificados verificáveis.

**Implementação**:

```typescript
// Sistema de credenciais acadêmicas
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

// Verificação por empregador
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

**Benefícios**:

- Verificação instantânea de credenciais
- Reduz fraudes
- Elimina a necessidade de verificação manual
- Acessibilidade global

## 🚢 Diretrizes de Implantação

### Implantação de Desenvolvimento

Para desenvolvimento local, o script automatizado gerencia tudo:

```bash
npm run dev
```

Isso fará:

1. Verificar se o Anvil está em execução
2. Iniciar o Anvil se necessário
3. Implantar o contrato
4. Atualizar configuração
5. Iniciar o servidor de desenvolvimento do Next.js

### Build de Produção

Construir a aplicação para produção:

```bash
npm run build
```

Isso cria um build de produção otimizado no diretório `.next`.

### Implantação de Produção

#### Opção 1: Implantar em Mainnet/Testnet

1. **Atualizar Configuração**:

   ```typescript
   // Atualizar lib/contract.ts ou usar variáveis de ambiente
   export const CONTRACT_ADDRESS = "0xSeuEnderecoMainnet";
   export const ANVIL_RPC_URL = "https://mainnet.infura.io/v3/SUA_CHAVE";
   ```

2. **Construir**:

   ```bash
   npm run build
   ```

3. **Implantar** (usando seu hosting preferido):
   ```bash
   npm start
   ```

#### Opção 2: Implantar no Vercel

1. **Instalar Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Implantar**:

   ```bash
   vercel
   ```

3. **Configurar Variáveis de Ambiente** no dashboard do Vercel:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ANVIL_RPC_URL`
   - `NEXT_PUBLIC_CHAIN_ID`

#### Opção 3: Implantação com Docker

Criar um `Dockerfile`:

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

Construir e executar:

```bash
docker build -t filehash-dapp .
docker run -p 3000:3000 filehash-dapp
```

### Configuração Específica por Ambiente

Para diferentes ambientes, use variáveis de ambiente:

**`.env.development`**:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
NEXT_PUBLIC_ANVIL_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

**`.env.production`**:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xSeuEnderecoMainnet
NEXT_PUBLIC_ANVIL_RPC_URL=https://mainnet.infura.io/v3/SUA_CHAVE
NEXT_PUBLIC_CHAIN_ID=1
```

## 🏗️ Arquitetura

### Estrutura do Projeto

```
dapp/
├── app/
│   ├── api/                    # Rotas API
│   │   ├── check-anvil/        # Verificação de saúde do Anvil
│   │   ├── config/             # API de configuração do contrato
│   │   └── deploy/             # API de implantação
│   ├── layout.tsx              # Layout raiz com providers
│   ├── page.tsx                # Página principal da aplicação
│   └── globals.css             # Estilos globais
├── components/
│   ├── WalletSelector.tsx      # Componente de seleção de carteira
│   ├── FileUpload.tsx          # Envio e armazenamento de documentos
│   ├── DocumentVerifier.tsx    # Verificação de documentos
│   ├── DocumentList.tsx        # Lista de documentos armazenados
│   ├── ConnectionStatus.tsx    # Indicador de status de conexão
│   ├── ContractStatus.tsx      # Status de implantação do contrato
│   ├── AnvilErrorDialog.tsx    # Diálogo de tratamento de erros
│   ├── HelpButton.tsx          # Ajuda e documentação
│   ├── HelpModal.tsx           # Componente modal de ajuda
│   └── Providers.tsx           # Wrapper de providers de contexto
├── contexts/
│   ├── WalletContext.tsx       # Estado de carteira e contrato
│   ├── DocumentContext.tsx     # Estado de lista de documentos
│   └── ErrorDialogContext.tsx  # Estado de diálogo de erros
├── hooks/
│   └── useContractConfig.ts    # Hook de configuração do contrato
├── lib/
│   ├── contract.ts             # ABI e configuração do contrato
│   └── utils.ts                # Funções utilitárias (hash, sign, format)
├── config/
│   └── contract-config.json    # Arquivo de configuração do contrato
├── scripts/
│   ├── deploy-automated.js     # Script de implantação automatizado
│   ├── check-anvil.js          # Script de verificação do Anvil
│   └── deploy-contract.sh      # Script de implantação de contrato
└── public/                     # Assets estáticos
```

### Gerenciamento de Estado

A aplicação usa React Context API para gerenciamento de estado:

- **WalletContext**: Gerencia conexão de carteira, instância do contrato e seleção de carteira
- **DocumentContext**: Gerencia lista de documentos armazenados e operações de documentos
- **ErrorDialogContext**: Gerencia diálogos de erro e notificações de usuário

### Fluxo de Dados

```
Ação do Usuário
    ↓
Componente (ex., FileUpload)
    ↓
Hook de Contexto (ex., useWallet)
    ↓
Método do Contrato (via ethers.js)
    ↓
Blockchain (Anvil/Mainnet)
    ↓
Ouvinte de Eventos
    ↓
Atualização de Contexto
    ↓
Re-renderização de UI
```

## 🤝 Contribuição

Aceitamos contribuições! Por favor, siga estas diretrizes:

### Configuração de Desenvolvimento

1. **Fazer fork do repositório**

2. **Criar uma ramificação de funcionalidade**:

   ```bash
   git checkout -b feature/funcionalidade-incrivel
   ```

3. **Fazer suas alterações**:

   - Seguir melhores práticas do TypeScript
   - Escrever código claro e autodocumentado
   - Adicionar comentários para lógica complexa
   - Atualizar documentação conforme necessário

4. **Testar suas alterações**:

   ```bash
   npm run build
   npm run dev
   ```

5. **Fazer commit de suas alterações**:

   ```bash
   git commit -m "feat: adicionar funcionalidade incrível"
   ```

6. **Enviar para sua ramificação**:

   ```bash
   git push origin feature/funcionalidade-incrivel
   ```

7. **Abrir um Pull Request**

### Diretrizes de Estilo de Código

- **TypeScript**: Usar modo estrito, evitar tipos `any`
- **React**: Usar componentes funcionais e hooks
- **Nomenclatura**: Usar nomes descritivos em camelCase
- **Comentários**: Documentar lógica complexa e regras de negócio
- **Formatação**: Usar Prettier (configurado no projeto)

### Checklist de Pull Request

- [ ] O código segue as diretrizes de estilo do projeto
- [ ] Auto-revisão concluída
- [ ] Comentários adicionados para código complexo
- [ ] Documentação atualizada
- [ ] Sem declarações console.log (usar logging apropriado)
- [ ] Os testes passam (se aplicável)
- [ ] O build é concluído sem erros

## 🔧 Solução de Problemas

### Problemas Comuns e Soluções

#### Problema: "Erro ao conectar ao Anvil"

**Sintomas**: Aplicação mostra diálogo de erro de conexão

**Soluções**:

1. **Verificar se o Anvil está em execução**:

   ```bash
   npm run check-anvil
   ```

2. **Iniciar Anvil manualmente**:

   ```bash
   cd ../sc
   anvil
   ```

3. **Verificar porta 8545**:

   ```bash
   # Windows
   netstat -ano | findstr :8545

   # Linux/Mac
   lsof -i :8545
   ```

4. **Encerrar processo se a porta estiver em uso**:

   ```bash
   # Windows
   taskkill /PID <PID> /F

   # Linux/Mac
   kill -9 <PID>
   ```

#### Problema: "Contrato não implantado"

**Sintomas**: Diálogo de erro mostrando que o contrato não foi encontrado

**Soluções**:

1. **Implantar contrato manualmente**:

   ```bash
   cd ../sc
   forge script script/FileHashStorage.s.sol:FileHashStorageScript \
     --rpc-url http://localhost:8545 --broadcast
   ```

2. **Atualizar configuração**:

   - Copiar endereço do contrato da saída da implantação
   - Atualizar `config/contract-config.json`

3. **Usar implantação automatizada**:
   ```bash
   npm run deploy
   ```

#### Problema: "Assinatura inválida"

**Sintomas**: Verificação de assinatura falha

**Soluções**:

1. **Verificar formato do hash**: Deve ser `0x` + 64 caracteres hexadecimais

   ```typescript
   // Correto
   const hash =
     "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730";

   // Incorreto
   const hash =
     "7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730";
   ```

2. **Verificar que a carteira está conectada**:

   ```typescript
   const { currentWallet, isConnected } = useWallet();
   if (!isConnected || !currentWallet) {
     // Tratar erro
   }
   ```

3. **Verificar comprimento da assinatura**: Deve ser 65 bytes
   ```typescript
   if (signature.length !== 130) {
     // 65 bytes = 130 caracteres hex
     throw new Error("Comprimento de assinatura inválido");
   }
   ```

#### Problema: "Transação falhou"

**Sintomas**: Transação na blockchain falha

**Soluções**:

1. **Verificar saldo da carteira**:

   ```typescript
   const balance = await provider.getBalance(wallet.address);
   console.log("Saldo:", ethers.formatEther(balance));
   ```

2. **Verificar limite de gas**: O Anvil deve ter gas suficiente

   ```bash
   # Reiniciar Anvil com limite de gas mais alto
   anvil --gas-limit 10000000
   ```

3. **Verificar estado do contrato**: Verificar que o contrato está implantado e acessível

#### Problema: "Erros de build"

**Sintomas**: `npm run build` falha

**Soluções**:

1. **Limpar cache**:

   ```bash
   rm -rf .next
   rm -rf node_modules
   npm install
   ```

2. **Verificar erros do TypeScript**:

   ```bash
   npx tsc --noEmit
   ```

3. **Verificar dependências faltantes**:
   ```bash
   npm install
   ```

#### Problema: "Hot reload não funciona"

**Sintomas**: Alterações não são refletidas no navegador

**Soluções**:

1. **Reiniciar servidor de desenvolvimento**:

   ```bash
   # Parar servidor (Ctrl+C)
   npm run dev
   ```

2. **Limpar cache do navegador**: Hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)

3. **Verificar file watchers**: Garantir que o sistema de arquivos suporte watching

### Obter Ajuda

Se você encontrar problemas não cobertos aqui:

1. **Verificar os logs**: Console do navegador e saída do terminal
2. **Revisar documentação**: Este README e comentários no código
3. **Abrir um issue**: Fornecer mensagens de erro, passos para reproduzir e detalhes do ambiente
4. **Verificar dependências**: Garantir que todos os pacotes estejam atualizados

### Modo Debug

Habilitar logging detalhado:

```typescript
// Em lib/contract.ts ou utils.ts
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Info de debug:", data);
}
```

## 📚 Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Ethers.js](https://docs.ethers.org/)
- [Documentação do Foundry](https://book.getfoundry.sh/)
- [Documentação do Solidity](https://docs.soliditylang.org/)
- [Recursos para Desenvolvedores Ethereum](https://ethereum.org/developers/)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- **Foundry**: Pelo excelente framework de desenvolvimento
- **Ethers.js**: Pela robusta interação com Ethereum
- **Equipe do Next.js**: Pelo incrível framework React
- **Tailwind CSS**: Pelo framework CSS utility-first

---

**Construído com ❤️ para a comunidade blockchain**

Para perguntas, problemas ou contribuições, por favor abra um issue ou pull request no GitHub.
