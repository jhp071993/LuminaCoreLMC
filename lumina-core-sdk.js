// 🚀 Lumina Core (LMC) - JavaScript SDK & Integration Guide

/**
 * Official JavaScript SDK for Lumina Core token and presale integration
 * Network: Base Mainnet (chainId: 8453)
 * Version: 1.0.0
 * Date: August 16, 2025
 */

// ==========================================
// 🔗 CONTRACT ADDRESSES
// ==========================================

export const LUMINA_CORE_CONTRACTS = {
  // Base Mainnet (chainId: 8453)
  BASE_MAINNET: {
    TOKEN: "0x21583587498d054aCE7e4de41cE74BD69b61Ab0A",
    PRESALE: "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd",
    TREASURY: "0x3A8a8b6d69cA0f07BC641bAc587eb41e2A553402",
    CHAIN_ID: 8453
  }
};

// ==========================================
// 📋 TOKEN SPECIFICATIONS  
// ==========================================

export const TOKEN_INFO = {
  name: "Lumina Core",
  symbol: "LMC", 
  decimals: 18,
  totalSupply: "1000000000000000000000000000", // 1 billion * 1e18
  initialSupply: "100000000000000000000000000",  // 100 million * 1e18
  cap: "1000000000000000000000000000",           // 1 billion * 1e18
  
  // Features
  features: [
    "ERC20 Standard",
    "ERC20Burnable", 
    "ERC20Permit (EIP-2612)",
    "Ownable",
    "Pausable",
    "Capped Supply",
    "Optional Fee System"
  ]
};

// ==========================================
// 🏪 PRESALE SPECIFICATIONS
// ==========================================

export const PRESALE_INFO = {
  // Basic Info
  status: "LIVE",
  startTime: 1755246518,    // Aug 15, 2025 08:28:38 UTC
  endTime: 1757837618,      // Sep 14, 2025 08:13:38 UTC
  duration: 30,             // days
  
  // Economics
  ratePerWei: 100000,       // LMC per wei (100,000 LMC per ETH)
  tokenPrice: 0.025,        // USD per token (at $2,500 ETH)
  tokensForSale: "25000000000000000000000000", // 25 million * 1e18
  
  // Caps & Limits
  softCapWei: "75000000000000000000",    // 75 ETH
  hardCapWei: "250000000000000000000",   // 250 ETH
  minBuyWei: "10000000000000000",        // 0.01 ETH
  maxBuyWei: "5000000000000000000",      // 5 ETH
  
  // Treasury
  skimBps: 500,             // 5% skim to treasury
  
  // USD Values (at $2,500 ETH)
  usd: {
    tokenPrice: 0.025,
    softCap: 187500,        // $187,500
    hardCap: 625000,        // $625,000
    minBuy: 25,             // $25
    maxBuy: 12500           // $12,500
  }
};

// ==========================================
// 🔧 NETWORK CONFIGURATION
// ==========================================

export const NETWORK_CONFIG = {
  BASE_MAINNET: {
    chainId: 8453,
    name: "Base",
    rpcUrls: [
      "https://mainnet.base.org",
      "https://base-mainnet.g.alchemy.com/v2/YOUR_KEY"
    ],
    blockExplorerUrls: ["https://basescan.org"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH", 
      decimals: 18
    }
  }
};

// ==========================================
// 📝 CONTRACT ABIs
// ==========================================

// Minimal Token ABI for common operations
export const TOKEN_ABI = [
  // ERC20 Standard
  "function name() external view returns (string)",
  "function symbol() external view returns (string)", 
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // Extended Features
  "function burn(uint256 amount) external",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external",
  "function paused() external view returns (bool)",
  "function cap() external view returns (uint256)",
  
  // Owner Functions (view only for users)
  "function owner() external view returns (address)",
  "function feeBps() external view returns (uint16)",
  "function feeEnabled() external view returns (bool)",
  "function isFeeExempt(address account) external view returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Presale ABI for all operations
export const PRESALE_ABI = [
  // Public Functions
  "function buy() external payable",
  "function claim() external", 
  "function refund() external",
  
  // View Functions
  "function live() external view returns (bool)",
  "function token() external view returns (address)",
  "function treasury() external view returns (address)",
  "function owner() external view returns (address)",
  "function startTime() external view returns (uint64)",
  "function endTime() external view returns (uint64)",
  "function ratePerWei() external view returns (uint256)",
  "function softCap() external view returns (uint256)",
  "function hardCap() external view returns (uint256)",
  "function minContribution() external view returns (uint256)",
  "function maxContribution() external view returns (uint256)",
  "function skimBps() external view returns (uint16)",
  "function totalRaised() external view returns (uint256)",
  "function finalized() external view returns (bool)",
  "function softCapMet() external view returns (bool)",
  "function tokensFor(address user) external view returns (uint256)",
  "function contributed(address user) external view returns (uint256)",
  "function claimed(address user) external view returns (uint256)",
  
  // Owner Functions (view only for users)
  "function finalize() external",
  "function sweepLeftoverTokens(address to) external",
  "function topUpForRefunds() external payable",
  
  // Events
  "event Buy(address indexed user, uint256 grossWei, uint256 skimWei, uint256 escrowWei, uint256 tokens)",
  "event Claim(address indexed user, uint256 tokens)",
  "event Refund(address indexed user, uint256 amount)",
  "event Finalized(bool success)"
];

// ==========================================
// 🛠️ UTILITY FUNCTIONS
// ==========================================

/**
 * Convert ETH amount to wei
 * @param {string|number} ethAmount - Amount in ETH
 * @returns {string} Amount in wei
 */
export function ethToWei(ethAmount) {
  return (parseFloat(ethAmount) * 1e18).toString();
}

/**
 * Convert wei to ETH
 * @param {string|bigint} weiAmount - Amount in wei
 * @returns {string} Amount in ETH
 */
export function weiToEth(weiAmount) {
  return (parseFloat(weiAmount.toString()) / 1e18).toFixed(6);
}

/**
 * Calculate tokens for ETH amount
 * @param {string|number} ethAmount - Amount in ETH
 * @returns {string} Number of LMC tokens
 */
export function calculateTokens(ethAmount) {
  const weiAmount = ethToWei(ethAmount);
  const tokens = parseFloat(weiAmount) * PRESALE_INFO.ratePerWei;
  return (tokens / 1e18).toFixed(0);
}

/**
 * Calculate USD value
 * @param {string|number} ethAmount - Amount in ETH
 * @param {number} ethPrice - ETH price in USD (default: $2500)
 * @returns {number} USD value
 */
export function calculateUSD(ethAmount, ethPrice = 2500) {
  return parseFloat(ethAmount) * ethPrice;
}

/**
 * Format large numbers with commas
 * @param {string|number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return parseFloat(num).toLocaleString();
}

/**
 * Check if presale is currently live
 * @returns {boolean} True if presale is live
 */
export function isPresaleLive() {
  const now = Math.floor(Date.now() / 1000);
  return now >= PRESALE_INFO.startTime && now <= PRESALE_INFO.endTime;
}

/**
 * Get presale progress percentage
 * @param {string} totalRaised - Total ETH raised (in wei)
 * @returns {number} Progress percentage (0-100)
 */
export function getPresaleProgress(totalRaised) {
  const raised = parseFloat(weiToEth(totalRaised));
  const hardCap = parseFloat(weiToEth(PRESALE_INFO.hardCapWei));
  return Math.min((raised / hardCap) * 100, 100);
}

// ==========================================
// 🌐 WEB3 INTEGRATION EXAMPLES
// ==========================================

/**
 * Example: Connect to Base network
 */
export async function connectToBase() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }
  
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check if on Base network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (parseInt(chainId, 16) !== NETWORK_CONFIG.BASE_MAINNET.chainId) {
      // Switch to Base network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }] // 8453 in hex
      });
    }
    
    return true;
  } catch (error) {
    console.error("Failed to connect to Base:", error);
    throw error;
  }
}

/**
 * Example: Get token balance
 */
export async function getTokenBalance(userAddress, provider) {
  const tokenContract = new ethers.Contract(
    LUMINA_CORE_CONTRACTS.BASE_MAINNET.TOKEN,
    TOKEN_ABI,
    provider
  );
  
  const balance = await tokenContract.balanceOf(userAddress);
  return weiToEth(balance.toString());
}

/**
 * Example: Participate in presale
 */
export async function buyTokens(ethAmount, signer) {
  const presaleContract = new ethers.Contract(
    LUMINA_CORE_CONTRACTS.BASE_MAINNET.PRESALE,
    PRESALE_ABI,
    signer
  );
  
  const tx = await presaleContract.buy({
    value: ethToWei(ethAmount)
  });
  
  return tx;
}

/**
 * Example: Claim tokens after presale
 */
export async function claimTokens(signer) {
  const presaleContract = new ethers.Contract(
    LUMINA_CORE_CONTRACTS.BASE_MAINNET.PRESALE,
    PRESALE_ABI,
    signer
  );
  
  const tx = await presaleContract.claim();
  return tx;
}

// ==========================================
// 📊 ANALYTICS & TRACKING
// ==========================================

export const ANALYTICS_EVENTS = {
  // Presale Events
  PRESALE_VIEW: "presale_view",
  PRESALE_BUY_INITIATED: "presale_buy_initiated", 
  PRESALE_BUY_COMPLETED: "presale_buy_completed",
  PRESALE_CLAIM_INITIATED: "presale_claim_initiated",
  PRESALE_CLAIM_COMPLETED: "presale_claim_completed",
  
  // Token Events
  TOKEN_TRANSFER: "token_transfer",
  TOKEN_BURN: "token_burn",
  TOKEN_APPROVE: "token_approve",
  
  // Wallet Events
  WALLET_CONNECTED: "wallet_connected",
  NETWORK_SWITCHED: "network_switched"
};

// ==========================================
// 🔗 USEFUL LINKS
// ==========================================

export const LINKS = {
  // Contracts
  TOKEN_BASESCAN: `https://basescan.org/address/${LUMINA_CORE_CONTRACTS.BASE_MAINNET.TOKEN}`,
  PRESALE_BASESCAN: `https://basescan.org/address/${LUMINA_CORE_CONTRACTS.BASE_MAINNET.PRESALE}`,
  TREASURY_BASESCAN: `https://basescan.org/address/${LUMINA_CORE_CONTRACTS.BASE_MAINNET.TREASURY}`,
  
  // Base Network
  BASE_BRIDGE: "https://bridge.base.org",
  BASE_DOCS: "https://docs.base.org",
  BASE_ECOSYSTEM: "https://base.org/ecosystem",
  
  // Tools
  BASE_SCAN: "https://basescan.org",
  COINGECKO_BASE: "https://www.coingecko.com/en/categories/base-ecosystem",
  DEFILLAMA_BASE: "https://defillama.com/chain/Base"
};

// ==========================================
// 📚 DOCUMENTATION
// ==========================================

export const DOCUMENTATION = {
  PROJECT_REPO: "https://github.com/your-org/lumina-core",
  WHITEPAPER: "https://docs.luminacore.com/whitepaper",
  API_DOCS: "https://docs.luminacore.com/api",
  INTEGRATION_GUIDE: "https://docs.luminacore.com/integration",
  FAQ: "https://docs.luminacore.com/faq"
};

// Export default configuration
export default {
  contracts: LUMINA_CORE_CONTRACTS,
  token: TOKEN_INFO,
  presale: PRESALE_INFO,
  network: NETWORK_CONFIG,
  abis: { TOKEN_ABI, PRESALE_ABI },
  utils: {
    ethToWei,
    weiToEth,
    calculateTokens,
    calculateUSD,
    formatNumber,
    isPresaleLive,
    getPresaleProgress
  },
  links: LINKS
};
