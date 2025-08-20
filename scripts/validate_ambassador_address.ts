import { ethers } from "hardhat";

async function main() {
  const addresses = [
    "0xa11A0865C61D766E55b1ef436a0Bba681C6393eF"
    // Add more addresses here
  ];

  console.log("Validating addresses...\n");

  for (const address of addresses) {
    try {
      // Check if it's a valid Ethereum address
      const isValid = ethers.isAddress(address);
      
      if (isValid) {
        // Check if it's a contract or EOA
        const provider = ethers.provider;
        const code = await provider.getCode(address);
        const isContract = code !== "0x";
        
        console.log(`✅ ${address}`);
        console.log(`   Type: ${isContract ? "Contract" : "EOA (User Wallet)"}`);
        console.log(`   Valid: ${isValid}\n`);
      } else {
        console.log(`❌ ${address} - INVALID ADDRESS\n`);
      }
    } catch (error) {
      console.log(`❌ ${address} - ERROR: ${error}\n`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });