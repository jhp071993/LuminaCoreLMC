import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    base_sepolia: {
      url: process.env.RPC_BASE_SEPOLIA || "https://sepolia.base.org",
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : [],
      chainId: 84532,
    },
    base: {
      url: process.env.ALCHEMY_BASE_RPC!,
      accounts: process.env.DEPLOYER_PK ? [process.env.DEPLOYER_PK] : [],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // works for Basescan too
  },
};

export default config;