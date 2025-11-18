# FileHashStorage - Smart Contracts Backend

![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-blue)
![License](https://img.shields.io/badge/License-UNLICENSED-red)

<div align="center">

**🌐 Language / Idioma / Idioma**

[![English](https://img.shields.io/badge/English-🇬🇧-blue)](README.md) [![Spanish](https://img.shields.io/badge/Spanish-🇪🇸-red)](README.es.md) [![Portuguese](https://img.shields.io/badge/Portuguese-🇵🇹-green)](README.pt.md)

</div>

Ethereum blockchain-based document storage and verification system. This smart contract enables storing document hashes with immutable timestamps and ECDSA cryptographic signatures, providing a decentralized solution for document authenticity verification.

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Contract API](#-contract-api)
- [Practical Examples](#-practical-examples)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎯 Introduction

FileHashStorage is a smart contract designed to provide an immutable document registration and verification system. It uses cryptographic hashing (SHA-256) and ECDSA digital signatures to ensure document integrity and authenticity.

### Key Features

- **Immutable Storage**: Document hashes are permanently stored on the blockchain
- **Cryptographic Verification**: ECDSA signature-based verification system
- **Timestamps**: Each document includes a Unix timestamp for temporal tracking
- **Events**: Event emission for frontend and API integration
- **Gas Optimized**: Efficient design to minimize transaction costs

### Use Cases

This contract is ideal for:

- **E-commerce**: Product certificate verification, warranties, and authenticity documents
- **Verification APIs**: Backend for document verification services
- **Legal Compliance**: Immutable registration of contracts and legal documents
- **Supply Chain**: Shipping document and certification traceability
- **Education**: Academic credential and certificate verification

## 🚀 Installation

### Prerequisites

- **Rust** (for Foundry) - [Install Rust](https://rustup.rs/)
- **Git** - Version control
- **Node.js** (optional) - For automation scripts

### Install Foundry

Foundry is a fast and modular toolkit for Ethereum application development.

#### Linux and macOS

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### Windows

```powershell
# Using Git Bash or PowerShell
irm https://foundry.paradigm.xyz | iex
foundryup
```

Or download from: [Foundry Releases](https://github.com/foundry-rs/foundry/releases)

### Verify Installation

```bash
forge --version
cast --version
anvil --version
```

### Install Project Dependencies

```bash
cd sc
forge install
```

This will install `forge-std` and other necessary dependencies.

## ⚙️ Configuration

### Project Structure

```
sc/
├── src/                    # Source contracts
│   └── FileHashStorage.sol
├── test/                   # Tests
│   └── FileHashStorage.t.sol
├── script/                 # Deployment scripts
│   └── FileHashStorage.s.sol
├── lib/                    # Dependencies
│   └── forge-std/
├── out/                    # Compiled artifacts
├── cache/                  # Compilation cache
└── foundry.toml           # Foundry configuration
```

### Foundry Configuration

The `foundry.toml` file contains the project configuration:

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
```

To customize the configuration, edit `foundry.toml` according to your needs. See the [Foundry documentation](https://book.getfoundry.sh/reference/config) for more options.

## 💻 Usage

### Compile Contracts

```bash
forge build
```

Compiled artifacts are generated in the `out/` directory.

### Run Tests

```bash
# Run all tests
forge test

# Run tests with detailed logs
forge test -vvv

# Run a specific test
forge test --match-test test_StoreDocumentHash

# Run tests with gas coverage
forge test --gas-report
```

### Format Code

```bash
forge fmt
```

### Gas Analysis

```bash
# Generate gas snapshot
forge snapshot

# Compare snapshots
forge snapshot --diff
```

### Start Anvil (Local Blockchain)

```bash
anvil
```

Anvil will start a local blockchain at `http://localhost:8545` with 10 pre-funded accounts.

## 📚 Contract API

### Main Functions

#### `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes calldata signature)`

Stores a document hash on the blockchain with its timestamp and signature.

**Parameters**:

- `hash` (bytes32): Document hash (SHA-256, Keccak-256, etc.)
- `timestamp` (uint256): Unix registration timestamp
- `signature` (bytes): ECDSA signature of the hash (65 bytes)

**Returns**: `bool` - `true` if storage was successful

**Events**: Emits `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

**Will revert if**:

- The hash is `bytes32(0)`
- The document is already stored
- The signature is invalid or not 65 bytes

**Usage example**:

```solidity
bytes32 documentHash = keccak256("my_document.pdf");
uint256 timestamp = block.timestamp;
bytes memory signature = /* 65-byte ECDSA signature */;

bool success = fileHashStorage.storeDocumentHash(
    documentHash,
    timestamp,
    signature
);
```

#### `verifyDocument(bytes32 hash, address signer, bytes calldata signature)`

Verifies that a signature corresponds to a specific document and signer.

**Parameters**:

- `hash` (bytes32): Document hash to verify
- `signer` (address): Expected signer address
- `signature` (bytes): Signature to verify

**Returns**: `bool` - `true` if the signature is valid and corresponds to the signer

**Will revert if**:

- The document does not exist
- The signer is `address(0)`

**Usage example**:

```solidity
bytes32 documentHash = keccak256("my_document.pdf");
address expectedSigner = 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb;
bytes memory signature = /* document signature */;

bool isValid = fileHashStorage.verifyDocument(
    documentHash,
    expectedSigner,
    signature
);
```

#### `getDocumentInfo(bytes32 hash)`

Retrieves all stored information about a document.

**Parameters**:

- `hash` (bytes32): Document hash

**Returns**:

- `bytes32 documentHash`: Document hash
- `uint256 timestamp`: Registration timestamp
- `address signer`: Signer address
- `bytes memory signature`: Document signature

**Will revert if**: The document does not exist

**Usage example**:

```solidity
bytes32 documentHash = keccak256("my_document.pdf");

(
    bytes32 docHash,
    uint256 timestamp,
    address signer,
    bytes memory signature
) = fileHashStorage.getDocumentInfo(documentHash);
```

#### `isDocumentStored(bytes32 hash)`

Checks if a document exists in the system.

**Parameters**:

- `hash` (bytes32): Document hash

**Returns**: `bool` - `true` if the document is stored

**Usage example**:

```solidity
bytes32 documentHash = keccak256("my_document.pdf");
bool exists = fileHashStorage.isDocumentStored(documentHash);
```

#### `getDocumentSignature(bytes32 hash)`

Retrieves the stored signature of a specific document.

**Parameters**:

- `hash` (bytes32): Document hash

**Returns**: `bytes memory` - Document signature

**Will revert if**: The document does not exist

### Events

#### `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

Emitted when a document is successfully stored.

**Parameters**:

- `hash`: Stored document hash
- `signer`: Signer address
- `timestamp`: Registration timestamp

## 🌍 Practical Examples

### Example 1: E-Commerce API Integration

**Scenario**: A marketplace needs to verify product authenticity certificates.

```solidity
// Wrapper contract for e-commerce
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
        // Store certificate in FileHashStorage
        fileHashStorage.storeDocumentHash(
            documentHash,
            timestamp,
            signature
        );

        // Link certificate with product
        productCertificates[documentHash] = productId;
    }

    function verifyProductCertificate(
        bytes32 documentHash,
        address manufacturer
    ) external view returns (bool) {
        // Verify certificate exists
        if (!fileHashStorage.isDocumentStored(documentHash)) {
            return false;
        }

        // Get certificate information
        (, , address signer, bytes memory signature) =
            fileHashStorage.getDocumentInfo(documentHash);

        // Verify it was signed by the manufacturer
        return fileHashStorage.verifyDocument(
            documentHash,
            manufacturer,
            signature
        ) && signer == manufacturer;
    }
}
```

**Usage in REST API**:

```javascript
// Endpoint: POST /api/products/:id/verify-certificate
async function verifyProductCertificate(productId, certificateFile) {
  // 1. Calculate certificate hash
  const hash = calculateSHA256(certificateFile);

  // 2. Get manufacturer address from database
  const manufacturer = await getManufacturerAddress(productId);

  // 3. Verify on blockchain
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

### Example 2: Document Verification System for API

**Scenario**: Backend API that allows clients to verify documents.

```solidity
// Contract for verification service
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

**REST API Integration**:

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

### Example 3: Timestamp System for Legal Contracts

**Scenario**: Notary office that needs to register contracts with immutable timestamps.

```solidity
// Contract for legal registration
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
        // Register in FileHashStorage
        fileHashStorage.storeDocumentHash(hash, timestamp, signature);

        // Store additional metadata
        documents[hash] = LegalDocument({
            hash: hash,
            documentType: documentType,
            reference: reference,
            registeredAt: block.timestamp
        });

        // Link with user
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

### Example 4: Web3 Frontend Integration

**Scenario**: Frontend that interacts directly with the contract.

```javascript
// Integration with ethers.js
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
    // 1. Calculate file hash
    const fileHash = await this.calculateFileHash(file);

    // 2. Sign the hash
    const signature = await wallet.signMessage(ethers.getBytes(fileHash));

    // 3. Get timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // 4. Store on blockchain
    const tx = await this.contract
      .connect(wallet)
      .storeDocumentHash(fileHash, timestamp, signature);

    // 5. Wait for confirmation
    const receipt = await tx.wait();

    return {
      hash: fileHash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  }

  async verifyDocument(file, expectedSigner) {
    const fileHash = await this.calculateFileHash(file);

    // Check existence
    const exists = await this.contract.isDocumentStored(fileHash);

    if (!exists) {
      return { valid: false, reason: "Document not found" };
    }

    // Get information
    const [hash, timestamp, signer, signature] =
      await this.contract.getDocumentInfo(fileHash);

    // Verify signature
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

  // Listen to events
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

### Run Tests

```bash
# All tests
forge test

# Tests with detailed logs
forge test -vvv

# Tests with coverage
forge test --gas-report
```

### Test Structure

Tests are located in `test/FileHashStorage.t.sol` and cover:

- ✅ Document storage
- ✅ Document verification
- ✅ Signature validation
- ✅ Error handling
- ✅ Emitted events
- ✅ Edge cases (duplicate hashes, invalid signatures, etc.)

### Test Example

```solidity
function test_StoreAndVerifyDocument() public {
    bytes32 hash = keccak256("test_document.pdf");
    uint256 timestamp = block.timestamp;
    bytes memory signature = createSignature(hash, signer1Key);

    // Store
    bool success = fileHashStorage.storeDocumentHash(
        hash,
        timestamp,
        signature
    );
    assertTrue(success);

    // Verify
    bool isValid = fileHashStorage.verifyDocument(
        hash,
        signer1,
        signature
    );
    assertTrue(isValid);
}
```

## 🚢 Deployment

### Deploy to Local Network (Anvil)

```bash
# 1. Start Anvil
anvil

# 2. In another terminal, deploy
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast
```

### Deploy to Testnet (Sepolia)

```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Deploy
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key YOUR_ETHERSCAN_API_KEY
```

### Deploy to Mainnet

```bash
# ⚠️ WARNING: Production only
forge script script/FileHashStorage.s.sol:FileHashStorageScript \
    --rpc-url https://mainnet.infura.io/v3/YOUR_PROJECT_ID \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key YOUR_ETHERSCAN_API_KEY \
    --slow
```

### Verify Contract on Etherscan

```bash
forge verify-contract \
    CONTRACT_ADDRESS \
    FileHashStorage \
    --etherscan-api-key YOUR_API_KEY \
    --chain-id 1
```

## 🤝 Contributing

### Development Guidelines

1. **Fork the repository**

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/new-feature
   ```

3. **Develop and test**:

   ```bash
   forge build
   forge test
   forge fmt
   ```

4. **Commit**:

   ```bash
   git commit -m "feat: add new feature"
   ```

5. **Push and create Pull Request**

### Code Standards

- **Solidity Style Guide**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Natspec**: Document all public functions with Natspec comments
- **Tests**: Write tests for all new features
- **Gas Optimization**: Consider gas optimization in new functions

### Pull Request Checklist

- [ ] Code compiles without errors (`forge build`)
- [ ] All tests pass (`forge test`)
- [ ] Code formatted (`forge fmt`)
- [ ] Documentation updated
- [ ] Tests added for new features
- [ ] No compiler warnings

## 📖 Additional Resources

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

## 📄 License

This project is unlicensed (UNLICENSED). See the license file for details.

## ⚠️ Warnings

- **Security**: This contract has been designed for specific use cases. Perform a security audit before using in production.
- **Gas Costs**: Consider gas costs when storing documents. Each transaction consumes gas.
- **Scalability**: For large volumes of documents, consider using events and off-chain storage.

---

**Developed with Foundry for the blockchain community**

For questions or issues, open an issue in the repository.
