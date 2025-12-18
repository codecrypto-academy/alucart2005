# E-Commerce Project with Blockchain and Stablecoins

## General Description

This project is a complete e-commerce system based on blockchain that integrates:
- Creation and management of a stablecoin (EuroToken)
- Purchase of stablecoins with credit card (Stripe)
- Cryptocurrency payment gateway
- Smart contracts for e-commerce management
- Web application for business administration
- Web application for end customers

## Project Architecture

```
ecommerce/
├── stablecoin/
│   ├── sc/
│   │   ├── lib/
│   │   │   └── openzeppelin-contracts/ (External Dependencies)
│   │   ├── src/
│   │   │   └── EuroToken.sol       (ERC20 Contract)
│   │   └── script/
│   │       └── DeployEuroToken.s.sol
│   ├── stablecoin-purchase/          (Frontend Token Sale + Stripe)
│   └── payment-gateway/           (Frontend Payment Gateway)
├── sc-ecommerce/
│   ├── lib/
│   │   └── openzeppelin-contracts/ (External Dependencies)
│   ├── src/
│   │   ├── Ecommerce.sol           (Main Contract)
│   │   └── libraries/              (Internal Libraries)
│   │       ├── CompanyLib.sol
│   │       ├── CustomerLib.sol
│   │       ├── ProductLib.sol
│   │       ├── ShoppingCartLib.sol
│   │       ├── InvoiceLib.sol
│   │       └── PaymentLib.sol
│   └── script/
│       └── DeployEcommerce.s.sol
├── web-admin/                      (Seller Panel Frontend)
├── web-customer/                   (Customer Store Frontend)
└── README.md
```

## Technologies Used

### Blockchain and Smart Contracts
- **Solidity**: Language for smart contracts
- **Foundry/Forge**: Development and testing framework
- **Anvil**: Local blockchain for development
- **Ethers.js v6**: Library to interact with Ethereum

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Static typing
- **Tailwind CSS**: Styles
- **MetaMask**: Cryptocurrency wallet

### Payments
- **Stripe**: Fiat payment processing
- **ERC20**: Token standard for EuroToken

---

## Part 1: Smart Contract - EuroToken (Stablecoin)

### Objective
Create an ERC20 token that represents digital euros (1 EURT = 1 EUR).

### Location
`stablecoin/sc/src/EuroToken.sol`

### Main Features
```solidity
// ERC20 Token with mint functionality
contract EuroToken is ERC20 {
    address public owner;

    // Function to create new tokens (owner only)
    function mint(address to, uint256 amount) external onlyOwner

    // Decimals: 6 (to represent euro cents)
    function decimals() public pure returns (uint8) {
        return 6;
    }
}
```

### Student Tasks

1. **Implement the EuroToken contract**
   - Inherit from OpenZeppelin ERC20
   - Set decimals to 6
   - Implement `mint` function with access control
   - Add events for auditing

2. **Write tests**
   - Deployment test
   - Mint by owner test
   - Mint by non-owner test (should fail)
   - Transfers between accounts test

3. **Deployment script**
   - Create script `DeployEuroToken.s.sol`
   - Deploy on local network (Anvil)
   - Initial mint of 1,000,000 tokens

### Useful Commands
```bash
# Compile
forge build

# Tests
forge test

# Local deploy
forge script script/DeployEuroToken.s.sol --rpc-url http://localhost:8545 --broadcast

# Check balance
cast call TOKEN_ADDRESS "balanceOf(address)(uint256)" ACCOUNT_ADDRESS --rpc-url http://localhost:8545
```

---

## Part 2: Stablecoin Purchase Application

### Objective
Allow users to buy EuroTokens using credit card (Stripe).

### Location
`stablecoin/stablecoin-purchase/`

### User Flow
1. User connects MetaMask
2. Enters amount of tokens to buy (e.g.: 100 EUR = 100 EURT)
3. Pays with credit card via Stripe
4. Backend mints tokens to user's wallet

### Main Components

#### Frontend (Next.js)
```typescript
// Purchase component
export default function EuroTokenPurchase() {
  // 1. Connect MetaMask
  // 2. Create Payment Intent with Stripe
  // 3. Show payment form
  // 4. On payment completion → mint tokens
}
```

#### Backend (API Routes)
```typescript
// /api/create-payment-intent
// Create payment intent in Stripe

// /api/mint-tokens
// Mint tokens after successful payment
```

### Student Tasks

1. **Stripe Setup**
   - Create test account in Stripe
   - Get API keys (publishable and secret)
   - Configure webhooks

2. **Implement Frontend**
   - MetaMask connection component
   - Form to enter amount
   - Integration with Stripe Elements
   - Show token balance

3. **Implement Backend**
   - Endpoint to create Payment Intent
   - Endpoint to mint tokens
   - Webhook to confirm payments
   - Security: validate successful payment before mint

4. **Testing**
   - Use Stripe test cards
   - Verify tokens are credited correctly
   - Test error handling

### Environment Variables
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=0x...
WALLET_PRIVATE_KEY=0x... # To mint from backend
```

---

## Part 3: Payment Gateway

### Objective
Allow payments with EuroTokens between customers and merchants.

### Location
`stablecoin/payment-gateway/`

### Payment Flow
1. User is redirected from store with payment data
2. Connects MetaMask
3. Confirms amount and recipient
4. Approves token transfer
5. Payment is executed through the Ecommerce contract
6. Redirects back to the store

### URL Parameters
```
http://localhost:6002/?
  merchant_address=0x...      # Merchant address
  amount=100.50              # Amount in EUR
  invoice=INV-001            # Invoice ID
  date=2025-10-15            # Date
  redirect=http://...        # Return URL
```

### Student Tasks

1. **Implement Payment UI**
   - Show payment details
   - Button to connect MetaMask
   - Check sufficient balance
   - Show transaction status

2. **Smart Contract Integration**
   - Approve token spending to Ecommerce contract
   - Call `processPayment` of the contract
   - Wait for transaction confirmation
   - Update invoice status

3. **Error Handling**
   - Insufficient balance → show link to buy tokens
   - Transaction rejection
   - Network timeout

4. **Redirection**
   - Auto redirect after successful payment
   - Pass result parameters to merchant

---

## Part 4: E-commerce Smart Contract

### Objective
Manage companies, products, shopping carts and invoices on blockchain.

### Location
`sc-ecommerce/src/Ecommerce.sol`

### Architecture
```
Ecommerce.sol (Main contract)
├── CompanyLib.sol        # Company management
├── ProductLib.sol        # Product management
├── CustomerLib.sol       # Customer management
├── CartLib.sol          # Shopping cart
├── InvoiceLib.sol       # Invoices
└── PaymentLib.sol       # Payment processing
```

### Data Structures

#### Company
```solidity
struct Company {
    uint256 companyId;
    string name;
    address companyAddress;  // Wallet where payments are received
    string taxId;
    bool isActive;
}
```

#### Product
```solidity
struct Product {
    uint256 productId;
    uint256 companyId;
    string name;
    string description;
    uint256 price;           // In euro cents (6 decimals)
    uint256 stock;
    string ipfsImageHash;
    bool isActive;
}
```

#### Invoice
```solidity
struct Invoice {
    uint256 invoiceId;
    uint256 companyId;
    address customerAddress;
    uint256 totalAmount;
    uint256 timestamp;
    bool isPaid;
    bytes32 paymentTxHash;
}
```

### Main Functions
```solidity
// Companies
function registerCompany(string name, string taxId) returns (uint256)
function getCompany(uint256 companyId) returns (Company)

// Products
function addProduct(companyId, name, description, price, stock) returns (uint256)
function updateProduct(productId, price, stock)
function getAllProducts() returns (Product[])

// Cart
function addToCart(uint256 productId, uint256 quantity)
function getCart(address customer) returns (CartItem[])
function clearCart(address customer)

// Invoices
function createInvoice(address customer, uint256 companyId) returns (uint256)
function processPayment(address customer, uint256 amount, uint256 invoiceId)
function getInvoice(uint256 invoiceId) returns (Invoice)
```

### Student Tasks

1. **Implement Libraries**
   - CompanyLib: CRUD for companies
   - ProductLib: CRUD for products with stock control
   - CartLib: Add/remove products, calculate total
   - InvoiceLib: Create invoices from cart
   - PaymentLib: Process payments with EuroToken

2. **Implement Main Contract**
   - Integrate all libraries
   - Access controls (only company owner can modify)
   - Events for each important operation
   - Business validations

3. **Complete Tests**
   - Company registration test
   - Add product test
   - Complete flow test: add to cart → create invoice → pay
   - Stock control test
   - Permissions test

4. **Optimizations**
   - Use mapping for O(1) searches
   - Minimize storage writes
   - Gas optimization

---

## Part 5: Web Admin (Administration Panel)

### Objective
Panel for companies to manage products, view invoices and customers.

### Location
`web-admin/`

### Features

#### 1. Company Management
- Register new company
- View list of companies
- Edit company information

#### 2. Product Management
- Add product (name, price, stock, image)
- Edit product
- Activate/deactivate product
- View available stock

#### 3. Invoice Management
- View all company invoices
- Filter by status (paid/pending)
- View details of each invoice
- View transaction on blockchain

#### 4. Customers
- View list of customers
- Purchase history per customer

### Main Components
```typescript
// Wallet Connection
function WalletConnect() {
  // Connect MetaMask
  // Show address and balance
}

// Company Registration
function CompanyRegistration() {
  // Form to register company
  // Only if connected wallet has no company
}

// Product List
function ProductList({ companyId }) {
  // Load products from contract
  // Buttons to edit/delete
}

// Product Form
function ProductForm({ companyId, productId? }) {
  // Add or edit product
  // Image upload to IPFS
}
```

### Student Tasks

1. **Project Setup**
   - Configure Next.js with TypeScript
   - Install Ethers.js and dependencies
   - Configure Tailwind CSS
   - Setup environment variables

2. **Implement Hooks**
   - `useWallet`: MetaMask connection management
   - `useContract`: Instantiate contracts
   - `useCompany`: Company data
   - `useProducts`: Product list

3. **Implement Pages**
   - `/`: Main dashboard
   - `/companies`: List and company registration
   - `/company/[id]`: Company detail with tabs
   - `/company/[id]/products`: Product management
   - `/company/[id]/invoices`: Invoice list

4. **Validations**
   - Only company owner can edit
   - Validate wallet is connected
   - Validate correct network (localhost/31337)
   - Transaction error handling

5. **UX/UI**
   - Dark mode support
   - Responsive design
   - Loading states
   - Success/error messages
   - Confirmations before transactions

---

## Part 6: Web Customer (Online Store)

### Objective
Online store where customers buy products with EuroTokens.

### Location
`web-customer/`

### Features

#### 1. Product Catalog
- View all available products
- Filter by company
- View price and stock
- Add to cart

#### 2. Shopping Cart
- View products in cart
- Modify quantities
- View total
- Proceed to payment

#### 3. Checkout
- Create invoice from cart
- Redirect to payment gateway
- Clear cart after creating invoice

#### 4. My Invoices
- View purchase history
- View payment status
- View details of each invoice

### Purchase Flow
```
1. User browses products
    ↓
2. Adds products to cart
    ↓
3. Goes to /cart and checks out
    ↓
4. Invoice is created on blockchain
    ↓
5. Cart is cleared
    ↓
6. Redirects to payment gateway
    ↓
7. User pays with tokens
    ↓
8. Returns to /orders (invoices)
    ↓
9. Sees invoice marked as "Paid"
```

### Main Components
```typescript
// Product List
function ProductsPage() {
  // Load products (no wallet needed)
  // "Add to Cart" button (requires wallet)
}

// Cart
function CartPage() {
  // Show cart items
  // Calculate total
  // "Checkout" button → create invoice
}

// My Invoices
function OrdersPage() {
  // Load customer invoices
  // Show status (Paid/Pending)
  // View details
}
```

### Student Tasks

1. **Implement Catalog**
   - Load products without wallet (read-only)
   - Product card design
   - Pagination or infinite scroll
   - Search/filter system

2. **Implement Cart**
   - `useCart` hook for state management
   - Add/remove/update products
   - Persistence on blockchain
   - Calculate total

3. **Implement Checkout**
   - Group items by company
   - Create invoice by calling contract
   - Wait for transaction confirmation
   - Build payment gateway URL
   - Clear cart
   - Redirect to gateway

4. **Implement History**
   - Load user invoices
   - Show details of each invoice
   - Visual status indicator (Paid/Pending)
   - Link to transaction on blockchain

5. **Optimizations**
   - Product cache
   - Optimistic updates in cart
   - Loading skeletons
   - Error boundaries

---

## Part 7: Complete Integration

### Automated Deployment Script

The file `restart-all.sh` automates the entire process:

```bash
#!/bin/bash

# 1. Stop previous applications
# 2. Start Anvil (local blockchain)
# 3. Deploy EuroToken
# 4. Deploy Ecommerce
# 5. Update environment variables
# 6. Start all applications
```

### Environment Variables per Application

#### stablecoin-purchase
```env
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

#### payment-gateway
```env
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS=0x...
```

#### web-admin
```env
NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=0x...
```

#### web-customer
```env
NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=0x...
```

### Application Ports
- Anvil: `http://localhost:8545`
- Stablecoin Purchase: `http://localhost:6001`
- Payment Gateway: `http://localhost:6002`
- Web Admin: `http://localhost:6003`
- Web Customer: `http://localhost:6004`

---

## Part 8: Complete System Testing

### Complete Test Scenario

1. **Initial Setup**
   ```bash
   # Start entire system
   ./restart-all.sh

   # Get deployed contract addresses
   # (shown at the end of the script)
   ```

2. **Buy Tokens**
   - Go to `http://localhost:6001`
   - Connect MetaMask
   - Buy 1000 EURT with test card
   - Verify balance in MetaMask

3. **Register Company (Admin)**
   - Go to `http://localhost:6003`
   - Connect with company account
   - Register company "My Store"
   - Add products:
     - Product A: €10, Stock: 100
     - Product B: €25, Stock: 50

4. **Buy Products (Customer)**
   - Go to `http://localhost:6004`
   - View product catalog
   - Connect customer wallet
   - Add Product A (qty: 2) to cart
   - Add Product B (qty: 1) to cart
   - Go to cart
   - Checkout → creates invoice
   - Redirects to payment gateway

5. **Pay in Gateway**
   - View payment details (€45)
   - Connect MetaMask (customer account)
   - Verify sufficient balance
   - Confirm payment
   - Approve token spending
   - Confirm processPayment transaction
   - See successful payment confirmation

6. **Verify Invoice**
   - Redirects to `http://localhost:6004/orders`
   - See invoice marked as "Paid"
   - View purchase details

7. **Verify Company (Admin)**
   - Go back to `http://localhost:6003`
   - See invoice in company panel
   - Verify received token balance
   - See updated stock:
     - Product A: 98
     - Product B: 49

### Student Tasks

1. **Document Tests**
   - Create document with screenshots
   - Document each step of the flow
   - Note transaction hashes
   - Verify states on blockchain

2. **Error Testing**
   - Try to pay without balance
   - Try to add product without wallet
   - Try to modify another company's product
   - Out of stock product

3. **Edge Case Testing**
   - Multiple products from different companies
   - Cancel payment in gateway
   - Change account in MetaMask
   - Page reload during process

---

## Additional Resources

### Documentation
- [Solidity Docs](https://docs.soliditylang.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Docs](https://stripe.com/docs)

### Tools
- [Remix IDE](https://remix.ethereum.org/) - Online IDE for Solidity
- [MetaMask](https://metamask.io/) - Cryptocurrency wallet
- [IPFS](https://ipfs.io/) - Decentralized storage

### Useful Commands
```bash
# Foundry
forge build                    # Compile contracts
forge test                     # Run tests
forge test -vvv               # Tests with detailed logs
forge fmt                      # Format code
forge clean                    # Clean builds

# Anvil
anvil                          # Start local blockchain
anvil --accounts 10           # With 10 preloaded accounts

# Cast (interact with contracts)
cast call ADDRESS "functionName()" --rpc-url http://localhost:8545
cast send ADDRESS "functionName(args)" --private-key 0x... --rpc-url http://localhost:8545

# Next.js
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run start                  # Run build
```

---

## Project Evaluation

### Evaluation Criteria

1. **Smart Contracts (30%)**
   - Correct ERC20 implementation
   - Library architecture
   - Complete tests
   - Gas optimization
   - Security and validations

2. **Blockchain Integration (20%)**
   - MetaMask connection
   - Transaction handling
   - Error handling
   - Events and logs

3. **Functionality (25%)**
   - All features working
   - Complete purchase flow
   - State management
   - Data persistence

4. **UX/UI (15%)**
   - Intuitive design
   - Responsive
   - Loading states
   - Clear messages

5. **Documentation (10%)**
   - Complete README
   - Code comments
   - API documentation
   - User guide

---

## Deliverables

1. **Source Code**
   - Git repository with all code
   - Meaningful commits
   - Organized branches

2. **Documentation**
   - README with installation instructions
   - Architecture diagrams
   - Contract documentation
   - User guide

3. **Demo**
   - Demo video (5-10 minutes)
   - Project presentation
   - Technical decisions explanation

4. **Tests**
   - Minimum 80% coverage
   - Integration tests
   - Test report

---

## Optional Extensions (Bonus)

1. **Multi-currency**
   - Add more stablecoins (USDT, DAI)
   - Exchange between currencies

2. **Review System**
   - Customers can leave reviews
   - Product rating

3. **Loyalty Program**
   - NFTs as rewards
   - Discounts for frequent customers

4. **Multi-vendor Marketplace**
   - Multiple companies on one platform
   - Platform commissions

5. **Notifications**
   - Email when invoice is created
   - Push notifications for payments

6. **Analytics Dashboard**
   - Sales charts
   - Best-selling products
   - Business metrics

---

## Conclusion

This project integrates multiple modern technologies:
- Blockchain and Smart Contracts
- DeFi (stablecoins)
- Traditional payments (Stripe)
- Full-stack web development
- TypeScript and React

By completing it, the student will have practical experience in:
- Development of secure smart contracts
- Integration with cryptocurrency wallets
- DApp development
- Decentralized application architecture
- Blockchain testing
- UX for crypto applications

Good luck with the project! 🚀
