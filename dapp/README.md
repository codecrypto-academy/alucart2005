# FileHashStorage dApp - Frontend Documentation

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6-orange)
![License](https://img.shields.io/badge/License-MIT-green)

<div align="center">

**🌐 Language / Idioma / Idioma**

[![English](https://img.shields.io/badge/English-🇬🇧-blue)](README.md) [![Spanish](https://img.shields.io/badge/Spanish-🇪🇸-red)](README.es.md) [![Portuguese](https://img.shields.io/badge/Portuguese-🇵🇹-green)](README.pt.md)

</div>

A modern, production-ready decentralized application (dApp) frontend for document verification on the Ethereum blockchain. Built with Next.js 16, React 19, and TypeScript, this application provides a seamless interface for storing and verifying document hashes with cryptographic signatures.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Installation](#-installation)
- [Setup & Configuration](#-setup--configuration)
- [Usage Instructions](#-usage-instructions)
- [API Integration](#-api-integration)
- [Real-World Scenarios](#-real-world-scenarios)
- [Deployment Guidelines](#-deployment-guidelines)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

## 🎯 Project Overview

FileHashStorage dApp is a client-side application that enables users to:

- **Store document hashes** on the Ethereum blockchain with cryptographic signatures
- **Verify document authenticity** by comparing file hashes against blockchain records
- **Track document history** with immutable timestamps and signer information
- **Manage multiple wallets** with an integrated wallet selector for testing and development

### Use Cases

This dApp is designed for practical applications in:

- **E-commerce**: Verify product certificates, warranties, and authenticity documents
- **Finance**: Store and verify financial documents, contracts, and compliance records
- **Legal**: Timestamp legal documents and contracts with cryptographic proof
- **Education**: Verify academic credentials and certificates
- **Healthcare**: Secure storage of medical records and consent forms
- **Supply Chain**: Track and verify product documentation and certifications

## ✨ Key Features

### 🔐 Security & Authentication

- **ECDSA Signatures**: All documents are signed using Ethereum's standard signature scheme
- **SHA-256 Hashing**: Industry-standard cryptographic hashing for document integrity
- **Wallet Integration**: Support for multiple test wallets with seamless switching
- **Signature Verification**: Real-time verification of document authenticity

### 🎨 User Experience

- **Modern UI**: Built with Tailwind CSS 4 for responsive, accessible design
- **Real-time Updates**: Live document list with blockchain event listeners
- **Error Handling**: Comprehensive error dialogs with actionable solutions
- **Loading States**: Clear feedback during blockchain transactions
- **Dark Mode**: Full support for dark and light themes

### 🛠️ Developer Experience

- **TypeScript**: Full type safety throughout the application
- **Context API**: Centralized state management for wallet and document data
- **Custom Hooks**: Reusable hooks for contract interaction and configuration
- **Automated Deployment**: Scripts for seamless contract deployment
- **Hot Reload**: Fast development with Next.js hot module replacement

## 🚀 Installation

### Prerequisites

Before installing, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Foundry** installed ([Installation Guide](https://book.getfoundry.sh/getting-started/installation))
- **Anvil** (included with Foundry) for local blockchain development

### Step-by-Step Installation

1. **Navigate to the dApp directory**:

   ```bash
   cd dapp
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Verify installation**:

   ```bash
   npm run check-anvil
   ```

   This command checks if Anvil is running. If not, you'll need to start it (see [Setup & Configuration](#-setup--configuration)).

## ⚙️ Setup & Configuration

### Starting the Local Blockchain

The application requires Anvil (local Ethereum node) to be running. You have two options:

#### Option 1: Manual Start

```bash
# In a separate terminal
cd ../sc
anvil
```

Anvil will start on `http://localhost:8545` with 10 pre-funded test accounts.

#### Option 2: Automated Deployment

The application includes an automated deployment script that:

- Checks if Anvil is running
- Starts Anvil if needed
- Deploys the contract automatically
- Updates configuration files

```bash
npm run deploy
```

### Contract Configuration

The contract address is automatically configured during deployment. The configuration is stored in:

```
dapp/config/contract-config.json
```

Example configuration:

```json
{
  "contractAddress": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  "rpcUrl": "http://localhost:8545",
  "network": "anvil",
  "chainId": 31337,
  "deployedAt": "2025-01-17T03:44:54.076Z"
}
```

### Environment Variables (Optional)

Create a `.env.local` file in the `dapp` directory for custom configuration:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_ANVIL_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

### Starting the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

The deployment script runs automatically before starting the dev server (via `predev` hook).

## 💻 Usage Instructions

### Basic Workflow

1. **Connect Wallet**: The application automatically connects to Anvil and loads 10 test wallets
2. **Select Wallet**: Choose from the dropdown to switch between test accounts
3. **Upload Document**: Select a file to calculate its hash
4. **Sign & Store**: Sign the hash with your wallet and store it on the blockchain
5. **Verify Document**: Upload any file to verify if it's stored in the blockchain

### Code Examples

#### Using the Wallet Context

```typescript
import { useWallet } from "@/contexts/WalletContext";

function MyComponent() {
  const { currentWallet, contract, isConnected, selectWallet } = useWallet();

  if (!isConnected) {
    return <div>Connecting to blockchain...</div>;
  }

  return (
    <div>
      <p>Current Wallet: {currentWallet?.address}</p>
      <button onClick={() => selectWallet(1)}>Switch to Wallet 2</button>
    </div>
  );
}
```

#### Calculating File Hash

```typescript
import { calculateFileHash } from "@/lib/utils";

async function handleFileUpload(file: File) {
  try {
    const hash = await calculateFileHash(file);
    console.log("File hash:", hash);
    // hash format: "0x" + 64 hex characters
  } catch (error) {
    console.error("Error calculating hash:", error);
  }
}
```

#### Signing a Hash

```typescript
import { signHash } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";

async function signDocument(hash: string) {
  const { currentWallet } = useWallet();

  if (!currentWallet) {
    throw new Error("No wallet connected");
  }

  try {
    const signature = await signHash(hash, currentWallet);
    console.log("Signature:", signature);
    return signature;
  } catch (error) {
    console.error("Error signing:", error);
  }
}
```

#### Storing a Document on Blockchain

```typescript
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash, signHash } from "@/lib/utils";

async function storeDocument(file: File) {
  const { contract, currentWallet } = useWallet();

  if (!contract || !currentWallet) {
    throw new Error("Wallet or contract not available");
  }

  try {
    // 1. Calculate file hash
    const hash = await calculateFileHash(file);

    // 2. Sign the hash
    const signature = await signHash(hash, currentWallet);

    // 3. Get current timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Store on blockchain
    const tx = await contract.storeDocumentHash(hash, timestamp, signature);

    // 5. Wait for confirmation
    await tx.wait();

    console.log("Document stored successfully!");
    return tx.hash;
  } catch (error) {
    console.error("Error storing document:", error);
    throw error;
  }
}
```

#### Verifying a Document

```typescript
import { useWallet } from "@/contexts/WalletContext";
import { calculateFileHash } from "@/lib/utils";

async function verifyDocument(file: File, expectedSigner: string) {
  const { contract } = useWallet();

  if (!contract) {
    throw new Error("Contract not available");
  }

  try {
    // 1. Calculate file hash
    const hash = await calculateFileHash(file);

    // 2. Check if document exists
    const exists = await contract.isDocumentStored(hash);

    if (!exists) {
      return { valid: false, reason: "Document not found" };
    }

    // 3. Get document info
    const [docHash, timestamp, signer, signature] =
      await contract.getDocumentInfo(hash);

    // 4. Verify signature
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
    console.error("Error verifying document:", error);
    throw error;
  }
}
```

#### Listening to Blockchain Events

```typescript
import { useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";

function DocumentListener() {
  const { contract } = useWallet();

  useEffect(() => {
    if (!contract) return;

    // Listen for new document storage events
    const filter = contract.filters.DocumentStored();

    contract.on(filter, (hash, signer, timestamp, event) => {
      console.log("New document stored:", {
        hash,
        signer,
        timestamp: new Date(Number(timestamp) * 1000),
        transactionHash: event.transactionHash,
      });
    });

    // Cleanup listener on unmount
    return () => {
      contract.removeAllListeners(filter);
    };
  }, [contract]);

  return null;
}
```

## 🔌 API Integration

### Contract ABI

The contract ABI is exported from `lib/contract.ts`:

```typescript
import { FILE_HASH_STORAGE_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
```

### Available Contract Methods

#### `storeDocumentHash(hash, timestamp, signature)`

Stores a document hash on the blockchain.

**Parameters**:

- `hash` (bytes32): SHA-256 hash of the document
- `timestamp` (uint256): Unix timestamp
- `signature` (bytes): ECDSA signature (65 bytes)

**Returns**: Transaction receipt

**Example**:

```typescript
const tx = await contract.storeDocumentHash(
  "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
  1704067200,
  "0x1234..."
);
await tx.wait();
```

#### `verifyDocument(hash, signer, signature)`

Verifies a document signature.

**Parameters**:

- `hash` (bytes32): Document hash
- `signer` (address): Expected signer address
- `signature` (bytes): Signature to verify

**Returns**: `boolean` - true if signature is valid

**Example**:

```typescript
const isValid = await contract.verifyDocument(
  hash,
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  signature
);
```

#### `getDocumentInfo(hash)`

Retrieves complete document information.

**Parameters**:

- `hash` (bytes32): Document hash

**Returns**: `[bytes32, uint256, address, bytes]` - [hash, timestamp, signer, signature]

**Example**:

```typescript
const [docHash, timestamp, signer, signature] = await contract.getDocumentInfo(
  hash
);
```

#### `isDocumentStored(hash)`

Checks if a document exists.

**Parameters**:

- `hash` (bytes32): Document hash

**Returns**: `boolean` - true if document exists

**Example**:

```typescript
const exists = await contract.isDocumentStored(hash);
```

### Configuration API

The application provides an API route to fetch contract configuration:

**Endpoint**: `GET /api/config`

**Response**:

```json
{
  "contractAddress": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  "rpcUrl": "http://localhost:8545",
  "network": "anvil",
  "chainId": 31337,
  "deployedAt": "2025-01-17T03:44:54.076Z"
}
```

**Usage**:

```typescript
const response = await fetch("/api/config");
const config = await response.json();
```

## 🌍 Real-World Scenarios

### Scenario 1: E-Commerce Product Verification

**Use Case**: An online marketplace needs to verify product authenticity certificates.

**Implementation**:

```typescript
// Component for product certificate verification
async function verifyProductCertificate(
  productId: string,
  certificateFile: File
) {
  const { contract, currentWallet } = useWallet();

  // Calculate hash of certificate
  const hash = await calculateFileHash(certificateFile);

  // Check if certificate is registered
  const exists = await contract.isDocumentStored(hash);

  if (!exists) {
    throw new Error("Certificate not found in blockchain");
  }

  // Get certificate details
  const [_, timestamp, signer, signature] = await contract.getDocumentInfo(
    hash
  );

  // Verify it was signed by the manufacturer
  const manufacturerAddress = "0x..."; // Known manufacturer address
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

**Benefits**:

- Customers can verify product authenticity instantly
- Reduces counterfeit products
- Builds trust in the marketplace
- Immutable proof of certificate issuance

### Scenario 2: Financial Document Compliance

**Use Case**: A financial institution needs to store and verify compliance documents.

**Implementation**:

```typescript
// Batch document storage for compliance
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

**Benefits**:

- Immutable audit trail for regulatory compliance
- Timestamped proof of document existence
- Easy verification by auditors
- Reduced storage costs (only hashes stored)

### Scenario 3: Supply Chain Documentation

**Use Case**: Tracking shipping documents and certificates in a supply chain.

**Implementation**:

```typescript
// Supply chain document tracking
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
      return { valid: false, reason: "Document not registered" };
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

**Benefits**:

- Transparent supply chain documentation
- Prevents document tampering
- Quick verification at any checkpoint
- Reduces paperwork and processing time

### Scenario 4: Academic Credential Verification

**Use Case**: Universities issuing verifiable diplomas and certificates.

**Implementation**:

```typescript
// Academic credential system
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

// Employer verification
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

**Benefits**:

- Instant credential verification
- Reduces fraud
- Eliminates need for manual verification
- Global accessibility

## 🚢 Deployment Guidelines

### Development Deployment

For local development, the automated script handles everything:

```bash
npm run dev
```

This will:

1. Check if Anvil is running
2. Start Anvil if needed
3. Deploy the contract
4. Update configuration
5. Start the Next.js dev server

### Production Build

Build the application for production:

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Production Deployment

#### Option 1: Deploy to Mainnet/Testnet

1. **Update Configuration**:

   ```typescript
   // Update lib/contract.ts or use environment variables
   export const CONTRACT_ADDRESS = "0xYourMainnetAddress";
   export const ANVIL_RPC_URL = "https://mainnet.infura.io/v3/YOUR_KEY";
   ```

2. **Build**:

   ```bash
   npm run build
   ```

3. **Deploy** (using your preferred hosting):
   ```bash
   npm start
   ```

#### Option 2: Deploy to Vercel

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_ANVIL_RPC_URL`
   - `NEXT_PUBLIC_CHAIN_ID`

#### Option 3: Docker Deployment

Create a `Dockerfile`:

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

Build and run:

```bash
docker build -t filehash-dapp .
docker run -p 3000:3000 filehash-dapp
```

### Environment-Specific Configuration

For different environments, use environment variables:

**`.env.development`**:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
NEXT_PUBLIC_ANVIL_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

**`.env.production`**:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourMainnetAddress
NEXT_PUBLIC_ANVIL_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=1
```

## 🏗️ Architecture

### Project Structure

```
dapp/
├── app/
│   ├── api/                    # API routes
│   │   ├── check-anvil/        # Anvil health check
│   │   ├── config/             # Contract configuration API
│   │   └── deploy/             # Deployment API
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main application page
│   └── globals.css             # Global styles
├── components/
│   ├── WalletSelector.tsx      # Wallet selection component
│   ├── FileUpload.tsx          # Document upload and storage
│   ├── DocumentVerifier.tsx    # Document verification
│   ├── DocumentList.tsx        # List of stored documents
│   ├── ConnectionStatus.tsx     # Connection status indicator
│   ├── ContractStatus.tsx      # Contract deployment status
│   ├── AnvilErrorDialog.tsx   # Error handling dialog
│   ├── HelpButton.tsx          # Help and documentation
│   ├── HelpModal.tsx           # Help modal component
│   └── Providers.tsx           # Context providers wrapper
├── contexts/
│   ├── WalletContext.tsx       # Wallet and contract state
│   ├── DocumentContext.tsx      # Document list state
│   └── ErrorDialogContext.tsx  # Error dialog state
├── hooks/
│   └── useContractConfig.ts     # Contract configuration hook
├── lib/
│   ├── contract.ts             # Contract ABI and configuration
│   └── utils.ts                # Utility functions (hash, sign, format)
├── config/
│   └── contract-config.json    # Contract configuration file
├── scripts/
│   ├── deploy-automated.js     # Automated deployment script
│   ├── check-anvil.js          # Anvil health check script
│   └── deploy-contract.sh      # Contract deployment script
└── public/                     # Static assets
```

### State Management

The application uses React Context API for state management:

- **WalletContext**: Manages wallet connection, contract instance, and wallet selection
- **DocumentContext**: Manages the list of stored documents and document operations
- **ErrorDialogContext**: Manages error dialogs and user notifications

### Data Flow

```
User Action
    ↓
Component (e.g., FileUpload)
    ↓
Context Hook (e.g., useWallet)
    ↓
Contract Method (via ethers.js)
    ↓
Blockchain (Anvil/Mainnet)
    ↓
Event Listener
    ↓
Context Update
    ↓
UI Re-render
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. **Fork the repository**

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**:

   - Follow TypeScript best practices
   - Write clear, self-documenting code
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**:

   ```bash
   npm run build
   npm run dev
   ```

5. **Commit your changes**:

   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your branch**:

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

### Code Style Guidelines

- **TypeScript**: Use strict mode, avoid `any` types
- **React**: Use functional components and hooks
- **Naming**: Use descriptive, camelCase names
- **Comments**: Document complex logic and business rules
- **Formatting**: Use Prettier (configured in project)

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] Tests pass (if applicable)
- [ ] Build succeeds without errors

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: "Error connecting to Anvil"

**Symptoms**: Application shows connection error dialog

**Solutions**:

1. **Check if Anvil is running**:

   ```bash
   npm run check-anvil
   ```

2. **Start Anvil manually**:

   ```bash
   cd ../sc
   anvil
   ```

3. **Check port 8545**:

   ```bash
   # Windows
   netstat -ano | findstr :8545

   # Linux/Mac
   lsof -i :8545
   ```

4. **Kill process if port is in use**:

   ```bash
   # Windows
   taskkill /PID <PID> /F

   # Linux/Mac
   kill -9 <PID>
   ```

#### Issue: "Contract not deployed"

**Symptoms**: Error dialog showing contract not found

**Solutions**:

1. **Deploy contract manually**:

   ```bash
   cd ../sc
   forge script script/FileHashStorage.s.sol:FileHashStorageScript \
     --rpc-url http://localhost:8545 --broadcast
   ```

2. **Update configuration**:

   - Copy contract address from deployment output
   - Update `config/contract-config.json`

3. **Use automated deployment**:
   ```bash
   npm run deploy
   ```

#### Issue: "Invalid signature"

**Symptoms**: Signature verification fails

**Solutions**:

1. **Check hash format**: Must be `0x` + 64 hex characters

   ```typescript
   // Correct
   const hash =
     "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730";

   // Incorrect
   const hash =
     "7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730";
   ```

2. **Verify wallet is connected**:

   ```typescript
   const { currentWallet, isConnected } = useWallet();
   if (!isConnected || !currentWallet) {
     // Handle error
   }
   ```

3. **Check signature length**: Must be 65 bytes
   ```typescript
   if (signature.length !== 130) {
     // 65 bytes = 130 hex chars
     throw new Error("Invalid signature length");
   }
   ```

#### Issue: "Transaction failed"

**Symptoms**: Blockchain transaction fails

**Solutions**:

1. **Check wallet balance**:

   ```typescript
   const balance = await provider.getBalance(wallet.address);
   console.log("Balance:", ethers.formatEther(balance));
   ```

2. **Check gas limit**: Anvil should have sufficient gas

   ```bash
   # Restart Anvil with higher gas limit
   anvil --gas-limit 10000000
   ```

3. **Check contract state**: Verify contract is deployed and accessible

#### Issue: "Build errors"

**Symptoms**: `npm run build` fails

**Solutions**:

1. **Clear cache**:

   ```bash
   rm -rf .next
   rm -rf node_modules
   npm install
   ```

2. **Check TypeScript errors**:

   ```bash
   npx tsc --noEmit
   ```

3. **Check for missing dependencies**:
   ```bash
   npm install
   ```

#### Issue: "Hot reload not working"

**Symptoms**: Changes not reflected in browser

**Solutions**:

1. **Restart dev server**:

   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

3. **Check file watchers**: Ensure file system supports watching

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**: Browser console and terminal output
2. **Review documentation**: This README and inline code comments
3. **Open an issue**: Provide error messages, steps to reproduce, and environment details
4. **Check dependencies**: Ensure all packages are up to date

### Debug Mode

Enable verbose logging:

```typescript
// In lib/contract.ts or utils.ts
const DEBUG = process.env.NODE_ENV === "development";

if (DEBUG) {
  console.log("Debug info:", data);
}
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Foundry**: For the excellent development framework
- **Ethers.js**: For robust Ethereum interaction
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Built with ❤️ for the blockchain community**

For questions, issues, or contributions, please open an issue or pull request on GitHub.
