import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  // ==== Lumina Core (LMC) Defaults ====
  const NAME = process.env.TOKEN_NAME || "Lumina Core";
  const SYMBOL = process.env.TOKEN_SYMBOL || "LMC";
  const DECIMALS = 18n;
  const CAP = BigInt(process.env.TOKEN_CAP || (1000000000n * 10n ** 18n).toString());       // 1B * 1e18
  const INITIAL = BigInt(process.env.TOKEN_INITIAL || (100000000n * 10n ** 18n).toString()); // 100M * 1e18

  // ====================================

  const [deployer] = await ethers.getSigners();
  const owner = deployer.address;

  console.log(`Deploying from: ${owner} on network: ${network.name}`);
  const Factory = await ethers.getContractFactory("UniqueToken");
  const token = await Factory.deploy(NAME, SYMBOL, INITIAL, CAP, owner);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log(`Token deployed to: ${address}`);

  // Save a simple deployment record
  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const outfile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(outfile, JSON.stringify({
    address,
    constructorArgs: [NAME, SYMBOL, INITIAL.toString(), CAP.toString(), owner],
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString()
  }, null, 2));
  console.log(`Wrote: ${outfile}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
