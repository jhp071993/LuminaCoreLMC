import { ethers } from "hardhat";

async function main() {
  const TOKEN_ADDRESS = "0x21583587498d054aCE7e4de41cE74BD69b61Ab0A";
  
  // Get the token contract
  const token = await ethers.getContractAt("UniqueToken", TOKEN_ADDRESS);
  
  // Example transfers for ambassadors
  const transfers = [
    { address: "0xa11A0865C61D766E55b1ef436a0Bba681C6393eF1111111", amount: "5000" },
  ];

  for (const transfer of transfers) {
    const amount = ethers.parseUnits(transfer.amount, 18);
    const tx = await token.transfer(transfer.address, amount);
    await tx.wait();
    console.log(`✅ Sent ${transfer.amount} LMC to ${transfer.address}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });