# FileHashStorage - Blockchain Document Verification System

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.13-orange)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/License-MIT-green)

<div align="center">

**🌐 Language / Idioma / Idioma**

[![English](https://img.shields.io/badge/English-🇬🇧-blue)](README.md) [![Spanish](https://img.shields.io/badge/Spanish-🇪🇸-red)](README.es.md) [![Portuguese](https://img.shields.io/badge/Portuguese-🇵🇹-green)](README.pt.md)

</div>

<p align="center">
  <img src="https://github.com/alucart2005/documentSighHash/blob/main/dapp/public/Capture.jpg?raw=true" alt="FileHashStorage dApp">
</p>

## 📋 Project Description

**FileHashStorage** is a complete decentralized application (dApp) that enables storing and verifying document authenticity using Ethereum blockchain technology. The system combines smart contracts developed with Foundry and a modern web interface built with Next.js.

### What Problem Does It Solve?

In today's world, verifying the authenticity of digital documents is a constant challenge. This project offers a blockchain solution that enables:

- **Immutability**: Once a document is registered, its hash cannot be modified
- **Traceability**: Each document includes a timestamp and verifiable digital signature
- **Transparency**: Anyone can verify the authenticity of a document
- **Decentralization**: Does not depend on a central authority

### Real-World Use Cases

1. **Academic Credential Verification**: Universities can register diploma hashes for employers to verify authenticity
2. **Legal Document Certification**: Notaries can register contracts and legal documents with immutable timestamps
3. **Intellectual Property Protection**: Artists and creators can register their works to prove authorship
4. **Corporate Document Auditing**: Companies can maintain an immutable record of important documents
5. **Identity Verification**: Identity documents can be verified without revealing sensitive information

## 🏗️ Project Architecture

The project is structured into two main components:

```
alucart2005/
├── sc/                    # Smart Contracts (Foundry)
│   ├── src/              # Solidity contracts
│   ├── test/             # Contract tests
│   └── script/           # Deployment scripts
└── dapp/                  # Frontend Application (Next.js)
    ├── app/              # Pages and routes
    ├── components/       # React components
    ├── contexts/         # React contexts
    └── lib/              # Utilities and configuration
```

## 🚀 Installation

### Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
- **Foundry** - Framework for smart contract development
- **Git** - Version control
- **Anvil** (included with Foundry) - Local Ethereum network for development

### Foundry Installation

If you don't have Foundry installed yet, run:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

For Windows (using Git Bash or PowerShell):

```bash
# Download and install from: https://github.com/foundry-rs/foundry/releases
# Or use chocolatey:
choco install foundry
```

### Project Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/alucart2005/alucart2005.git
cd alucart2005
```

#### 2. Configure Smart Contracts

```bash
# Navigate to contracts directory
cd sc

# Install dependencies (forge-std)
forge install

# Compile contracts
forge build

# Run tests
forge test
```

#### 3. Configure Frontend Application

```bash
# Navigate to dApp directory
cd ../dapp

# Install Node.js dependencies
npm install

# Verify Anvil is running
npm run check-anvil
```

## ⚙️ Configuration

### Development Environment Setup

#### 1. Start Anvil (Local Ethereum Network)

In a separate terminal, start Anvil:

```bash
anvil
```

This will start a local blockchain at `http://localhost:8545` with 10 pre-funded accounts for testing.

#### 2. Deploy the Contract

The contract is automatically deployed when you start the application, but you can also do it manually:

```bash
cd sc
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast
```

#### 3. Configure Contract Address

After deployment, copy the contract address and update the configuration file:

```bash
# Edit dapp/config/contract-config.json
{
  "address": "0xYOUR_CONTRACT_ADDRESS_HERE",
  "chainId": 31337
}
```

### Environment Variables (Optional)

You can create a `.env.local` file in the `dapp/` directory for additional configuration:

```env
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

## 💻 Usage

### Start the Application

```bash
# From the dapp/ directory
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Basic Workflow

1. **Connect Wallet**: Connect your MetaMask wallet or use one of Anvil's accounts
2. **Upload Document**: Select a file and calculate its hash
3. **Sign and Register**: Sign the hash with your wallet and register it on the blockchain
4. **Verify Document**: Verify the authenticity of any registered document

## 📚 Real-World Usage Examples

### Example 1: Employment Contract Registration

**Situation**: An employer needs to register an employment contract to prove its existence on a specific date.

**Steps**:

1. **Prepare the document**:

   ```bash
   # The document "employment_contract_2024.pdf" is ready to be registered
   ```

2. **From the web interface**:

   - Connect your wallet (employer's account)
   - Upload the `employment_contract_2024.pdf` file
   - The system automatically calculates the SHA-256 hash
   - Sign the hash with your wallet
   - Confirm the transaction to register the document

3. **Subsequent verification**:
   - Anyone can verify the document by uploading the same file
   - The system will compare the hash and display:
     - ✅ If the document is authentic
     - 📅 Registration date and time
     - 👤 Wallet address that registered it

**Benefit**: The employer has immutable proof that the contract existed on a specific date, useful in labor disputes.

### Example 2: University Diploma Certification

**Situation**: A university wants to issue blockchain-verifiable diplomas.

**Process**:

1. **University registers the diploma**:

   ```javascript
   // Diploma hash: 0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730
   // Timestamp: 1704067200 (January 1, 2024)
   // Signature: University's cryptographic signature
   ```

2. **Graduate verifies their diploma**:

   - The graduate uploads their diploma PDF file
   - The system verifies that the hash matches
   - Shows registration information (date, institution)

3. **Employer verifies authenticity**:
   - The employer receives the candidate's diploma
   - Uploads it to the verification system
   - Gets immediate confirmation of authenticity

**Benefit**: Eliminates the need to contact the university to verify diplomas, saving time and resources.

### Example 3: Intellectual Property Protection

**Situation**: A photographer wants to protect their photographs before publishing them.

**Implementation**:

1. **Original work registration**:

   ```bash
   # The photographer registers the hash of "original_photo.jpg"
   # This creates an immutable record that the photo existed on a specific date
   ```

2. **In case of plagiarism**:
   - The photographer can prove they registered the work earlier
   - The blockchain timestamp is legal proof of authorship
   - The cryptographic signature confirms the author's identity

**Benefit**: Legal proof of authorship without the need for expensive patent office registrations.

### Example 4: Corporate Document Auditing

**Situation**: A company needs to maintain an audited record of financial documents.

**Flow**:

1. **Monthly financial statement registration**:

   ```javascript
   // Each month, the CFO registers:
   // - Balance sheet
   // - Income statement
   // - Cash flow statement
   ```

2. **Auditor verification**:

   - Auditors can verify that documents have not been altered
   - The timestamp guarantees temporal sequence
   - The CFO's signature is verifiable

3. **Regulatory compliance**:
   - Authorities can verify documents without access to internal systems
   - Transparency without compromising privacy

**Benefit**: Improved regulatory compliance and more efficient auditing processes.

### Example 5: Identity Document Verification

**Situation**: An institution needs to verify identity documents without storing personal data.

**Solution**:

1. **User registers their document**:

   - Uploads a copy of their identity document
   - The system registers only the hash (not personal data)
   - The user signs with their wallet

2. **Institution verification**:
   - The institution receives the user's document
   - Calculates the hash and verifies it on the blockchain
   - Confirms authenticity without storing sensitive data

**Benefit**: Improved privacy (only hash is stored) and fast verification.

## 🧪 Testing

### Run Smart Contract Tests

```bash
cd sc
forge test
```

### Run Tests with Verbosity

```bash
forge test -vvv  # Shows detailed logs
```

### Run a Specific Test

```bash
forge test --match-test test_StoreDocumentHash
```

## 🔧 Useful Commands

### Smart Contracts

```bash
# Compile contracts
forge build

# Run tests
forge test

# Deploy to local network
forge script script/FileHashStorage.s.sol:FileHashStorageScript --rpc-url http://localhost:8545 --broadcast

# Verify contract on blockchain explorer
forge verify-contract <ADDRESS> FileHashStorage --chain-id 1
```

### Frontend

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check if Anvil is running
npm run check-anvil

# Deploy contract manually
npm run deploy
```

## 📖 Contract API Documentation

### Main Functions

#### `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes calldata signature)`

Stores a document hash with its timestamp and signature.

**Parameters**:

- `hash`: Document hash (SHA-256, Keccak-256, etc.)
- `timestamp`: Registration date (Unix timestamp)
- `signature`: ECDSA signature of the hash (65 bytes)

**Returns**: `bool` - `true` if storage was successful

**Usage example**:

```solidity
bytes32 docHash = keccak256("my_document.pdf");
uint256 timestamp = block.timestamp;
bytes memory signature = /* hash signature */;

fileHashStorage.storeDocumentHash(docHash, timestamp, signature);
```

#### `verifyDocument(bytes32 hash, address signer, bytes calldata signature)`

Verifies that a signature corresponds to a specific document and signer.

**Parameters**:

- `hash`: Document hash to verify
- `signer`: Expected signer address
- `signature`: Signature to verify

**Returns**: `bool` - `true` if the signature is valid

#### `getDocumentInfo(bytes32 hash)`

Gets all information from a registered document.

**Returns**:

- `bytes32`: Document hash
- `uint256`: Registration timestamp
- `address`: Signer address
- `bytes`: Document signature

#### `isDocumentStored(bytes32 hash)`

Checks if a document exists in the system.

**Returns**: `bool` - `true` if the document is registered

### Events

#### `DocumentStored(bytes32 indexed hash, address indexed signer, uint256 timestamp)`

Emitted when a document is successfully registered.

## 🤝 Contributing

Contributions are welcome! This project is part of Codecrypto Academy learning materials.

### How to Contribute

1. **Fork the repository**

   ```bash
   git clone https://github.com/alucart2005/alucart2005.git
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/my-new-feature
   ```

3. **Make your changes**

   - Follow Solidity best practices
   - Write tests for new features
   - Update documentation

4. **Run tests**

   ```bash
   cd sc && forge test
   cd ../dapp && npm run lint
   ```

5. **Commit your changes**

   ```bash
   git commit -m "feat: add new verification feature"
   ```

6. **Push to your branch**

   ```bash
   git push origin feature/my-new-feature
   ```

7. **Open a Pull Request**

### Development Guidelines

- **Solidity**: Follow [Solidity best practices](https://docs.soliditylang.org/en/latest/style-guide.html)
- **Testing**: Write comprehensive tests for all new features
- **Documentation**: Update documentation for any API changes
- **Clean Code**: Keep code readable and well-commented

### Commit Structure

Use descriptive commit messages following the format:

```
type: brief description

Detailed description (optional)
```

Common types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Add or modify tests
- `refactor`: Code refactoring

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Developer Resources](https://ethereum.org/developers/)

## 📞 Contact

- **GitHub**: [@alucart2005](https://github.com/alucart2005)
- **Project**: Part of Codecrypto Academy

## 🙏 Acknowledgments

This project uses the following technologies and tools:

- [Foundry](https://github.com/foundry-rs/foundry) - Smart contract development framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Ethers.js](https://ethers.org/) - Library for interacting with Ethereum
- [Anvil](https://github.com/foundry-rs/foundry/tree/master/anvil) - Ethereum client for local development

---

**Note**: This project is designed for educational and practice purposes. For production use, ensure you perform complete security audits and consider legal and regulatory implications.
