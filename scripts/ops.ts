import { ethers, network } from "hardhat";

// Sample operational script: toggle fee, set exemptions, transfer ownership.
async function main() {
  const deployments = require(`../deployments/${network.name}.json`);
  const tokenAddress: string = deployments.address;

  const token = await ethers.getContractAt("UniqueToken", tokenAddress);

  // ---- 1) Toggle fee (example: 0.30% to a treasury address) ----
  const ENABLE_FEE = false; // set to true when ready
  const BPS = 30;           // 30 = 0.30%
  const TREASURY = "0xYourTreasuryOrSafe";
  if (ENABLE_FEE) {
    console.log("Setting fee config...");
    const tx1 = await token.setFeeConfig(true, BPS, TREASURY);
    await tx1.wait();
    console.log("Fee config set.");
  }

  // ---- 2) Exempt important contracts (routers, LPs, distributor, etc.) ----
  const EXEMPT_ADDRESSES: string[] = [
    // "0xRouterAddress",
    // "0xYourLiquidityPool",
  ];
  for (const addr of EXEMPT_ADDRESSES) {
    console.log(`Exempting ${addr}...`);
    const tx = await token.setFeeExempt(addr, true);
    await tx.wait();
  }

  // ---- 3) Transfer ownership to a Safe multisig ----
  const SAFE = "0xYourSafeAddress";
  const TRANSFER_OWNERSHIP = false; // set to true when ready
  if (TRANSFER_OWNERSHIP) {
    console.log(`Transferring ownership to ${SAFE}...`);
    const tx = await token.transferOwnership(SAFE);
    await tx.wait();
    console.log("Ownership transferred.");
  }

  console.log("Ops complete.");
}

main().catch((e) => { console.error(e); process.exit(1); });
