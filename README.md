# 🚀 Lumina Core (LMC)

**Advanced ERC20 token ecosystem on Base L2 with optimized presale system, treasury skim mechanism, and comprehensive smart contract features.**

[![Base Network](https://img.shields.io/badge/Network-Base%20Mainnet-blue)](https://base.org)
[![Contract Verified](https://img.shields.io/badge/Contract-Verified-green)](https://basescan.org/address/0x21583587498d054aCE7e4de41cE74BD69b61Ab0A)
[![Presale Live](https://img.shields.io/badge/Presale-LIVE-brightgreen)](https://basescan.org/address/0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd)
[![OpenZeppelin](https://img.shields.io/badge/Security-OpenZeppelin-orange)](https://openzeppelin.com/)

---

## 🌟 Overview

Lumina Core (LMC) is a next-generation ERC20 token built on Base L2, designed for scalability, security, and sustainable growth. Our ecosystem features:

- **Advanced Token Mechanics**: Burnable supply, gasless approvals (EIP-2612), emergency controls
- **Transparent Presale**: Built-in refund protection and automatic treasury funding
- **Base L2 Optimized**: Low fees, fast transactions, and seamless user experience
- **Community-Driven**: Open source, verified contracts, comprehensive documentation

## 📊 Token Information

| Property | Value |
|----------|-------|
| **Name** | Lumina Core |
| **Symbol** | LMC |
| **Decimals** | 18 |
| **Total Supply** | 1,000,000,000 LMC (capped) |
| **Network** | Base Mainnet (chainId: 8453) |
| **Contract** | [`0x21583587498d054aCE7e4de41cE74BD69b61Ab0A`](https://basescan.org/address/0x21583587498d054aCE7e4de41cE74BD69b61Ab0A) |

## 🏪 Presale Details

| Parameter | Value |
|-----------|-------|
| **Status** | 🟢 **LIVE** |
| **Duration** | Aug 15 - Sep 14, 2025 (30 days) |
| **Rate** | 100,000 LMC per ETH |
| **Price** | $0.025 USD per LMC |
| **Soft Cap** | 75 ETH (~$187,500) |
| **Hard Cap** | 250 ETH (~$625,000) |
| **Min/Max** | 0.01 ETH / 5 ETH per wallet |
| **Treasury Skim** | 5% automatic |
| **Contract** | [`0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd`](https://basescan.org/address/0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd) |

## ✨ Key Features

### 🔒 **Security First**
- Built on OpenZeppelin audited contracts
- All source code verified on BaseScan
- Reentrancy protection and emergency controls
- Owner can pause contracts in emergencies

### 💰 **Smart Presale**
- **Refund Protection**: Get your ETH back if soft cap isn't met
- **Treasury Skim**: 5% of each purchase automatically funds development
- **Fair Launch**: Min/max limits prevent whale dominance
- **Transparent**: All transactions visible on-chain

### ⚡ **Advanced Token**
- **EIP-2612 Permits**: Gasless approvals for better UX
- **Burnable**: Deflationary mechanism via token burning
- **Pausable**: Emergency stop functionality
- **Capped Supply**: Maximum 1 billion tokens ever

### 🌐 **Base L2 Native**
- Low transaction fees (~$0.01)
- Fast settlement times
- Ethereum security with L2 efficiency
- Growing ecosystem and liquidity

## 🚀 Quick Start

### For Users

1. **Add Base Network to MetaMask**
   - Network: Base
   - RPC: `https://mainnet.base.org`
   - Chain ID: `8453`
   - Currency: ETH

2. **Bridge ETH to Base**
   - Use [bridge.base.org](https://bridge.base.org)
   - Bridge ETH from Ethereum mainnet

3. **Participate in Presale**
   - Connect wallet to presale contract
   - Send 0.01-5 ETH to buy LMC tokens
   - Claim tokens after presale ends

### For Developers

```javascript
// Contract Addresses
const TOKEN_ADDRESS = "0x21583587498d054aCE7e4de41cE74BD69b61Ab0A";
const PRESALE_ADDRESS = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";

// Network Config
const CHAIN_ID = 8453; // Base mainnet
const RPC_URL = "https://mainnet.base.org";

// Basic Integration
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const presaleABI = [...]; // From presale_abi_standard.json

const presaleContract = new ethers.Contract(
  PRESALE_ADDRESS, 
  presaleABI, 
  provider
);

// Check presale status
const isLive = await presaleContract.live();
const totalRaised = await presaleContract.totalRaised();
```

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm or yarn
- Hardhat
- MetaMask or compatible wallet

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Lumina_Core_Mainnet

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

### Project Structure

```
├── contracts/              # Solidity smart contracts
│   ├── UniqueToken.sol     # Main ERC20 token
│   └── LuminaCorePresaleV2_Skim.sol # Presale contract
├── scripts/                # Deployment and utility scripts
├── deployments/            # Deployment records
├── artifacts/              # Compiled contracts
├── presale_abi_standard.json # Webapp-ready ABI
├── PROJECT_DELIVERABLES.md # Complete documentation
├── lumina-core-sdk.js      # Integration SDK
└── whitepaper.md          # Technical whitepaper
```

### Available Scripts

```bash
# Compile contracts
npm run compile

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet

# Verify contracts
npm run verify

# Run tests
npm run test
```

## 📚 Documentation

- **[Technical Whitepaper](whitepaper.md)** - Comprehensive project overview and tokenomics
- **[Integration SDK](lumina-core-sdk.js)** - Developer integration examples
- **[Webapp ABI](presale_abi_standard.json)** - Ready-to-use contract ABI
- **[Debugging Tools](webapp-debug/README.md)** - Testing and troubleshooting scripts

## 🔗 Resources

### **Official Links**
- **BaseScan Token**: [View Contract](https://basescan.org/address/0x21583587498d054aCE7e4de41cE74BD69b61Ab0A)
- **BaseScan Presale**: [View Contract](https://basescan.org/address/0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd)
- **Base Network**: [Official Site](https://base.org)

### **Technical Resources**
- **ABI Files**: `presale_abi_standard.json` (webapp-ready)
- **RPC Endpoint**: `https://mainnet.base.org`
- **Block Explorer**: [basescan.org](https://basescan.org)

### **Community**
- **Telegram**: [Join Community](#)
- **Discord**: [Developer Chat](#)
- **Twitter**: [Follow Updates](#)

## 📈 Tokenomics

### Supply Distribution
```
Total Supply: 1,000,000,000 LMC (100%)
├── Initial:    100,000,000 LMC (10%)  → Owner
├── Presale:     25,000,000 LMC (2.5%) → Public sale
└── Future:     875,000,000 LMC (87.5%) → Future use
```

### Presale Economics
- **Target Raise**: 150 ETH (~$375,000)
- **Max Raise**: 250 ETH (~$625,000)
- **Treasury Skim**: 12.5 ETH (~$31,250 at max)
- **Net to Project**: 237.5 ETH (~$593,750 at max)

## 🔐 Security

### Audits & Verification
- ✅ **Source Code**: Verified on BaseScan
- ✅ **OpenZeppelin**: Industry-standard base contracts
- ✅ **Self-Audited**: Comprehensive internal review
- 🔄 **Community Review**: Open source for public audit

### Security Features
- Reentrancy protection on all external calls
- Owner-only administrative functions
- Emergency pause functionality
- Capped supply prevents inflation
- Refund mechanism protects investors

## ⚠️ Disclaimer

**Important**: Cryptocurrency investments carry risk. This project is experimental and you could lose your entire investment. Please:

- Do your own research (DYOR)
- Only invest what you can afford to lose
- Understand the technology and risks
- Consult a financial advisor if needed

This README is for informational purposes only and does not constitute investment advice.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Ready to get started?** Connect your wallet to Base and join the presale! 🚀

*Last updated: August 20, 2025*
