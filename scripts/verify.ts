import { run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const file = path.join(__dirname, "..", "deployments", `${network.name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Deployments file not found: ${file}`);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const address = data.address;
  const args = data.constructorArgs;

  console.log(`Verifying ${address} on ${network.name} with args:`, args);
  await run("verify:verify", {
    address,
    constructorArguments: args
  });
  console.log("Verification submitted. Check the explorer if it doesn't return immediately.");
}

main().catch((e) => { console.error(e); process.exit(1); });
