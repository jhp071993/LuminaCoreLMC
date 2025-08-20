import { artifacts, ethers } from "hardhat";

function strip0x(s: string) {
  return s.startsWith("0x") ? s.slice(2) : s;
}

function firstDiff(a: string, b: string): number {
  const m = Math.min(a.length, b.length);
  for (let i = 0; i < m; i++) if (a[i] !== b[i]) return i;
  return m === a.length && m === b.length ? -1 : m;
}

async function main() {
  // === 1) Put your creation tx hash here (from the contract page) ===
  // From your screenshot it is:
  // 0x9489084c999c4a70dc5c65ce493fa54b2a68f3325834b7bc8ebe7bc586049a1
  const CREATION_TX =
    process.env.CREATION_TX ||
    "0x9489084c999c4a70dc5c65ce493fa54b2a68f3325834b7bc8ebe7bc586049a1";

  console.log("Reading creation tx:", CREATION_TX);
  const tx = await ethers.provider.getTransaction(CREATION_TX);
  if (!tx) throw new Error("Creation tx not found");
  if (tx.to) throw new Error("This tx is not a contract creation (tx.to should be null)");

  const chainData = strip0x(tx.data.toLowerCase());

  // === 2) Read local compiled bytecode (no constructor args) ===
  const art = await artifacts.readArtifact("UniqueToken");
  const localBytecode = strip0x((art.bytecode as string).toLowerCase());

  // Optional: some toolchains include metadata placeholders; we just compare prefix
  if (!chainData.startsWith(localBytecode)) {
    console.log("❌ Local bytecode does NOT match on‑chain creation bytecode prefix.");
    console.log("Local length :", localBytecode.length);
    console.log("Chain length :", chainData.length);

    const i = firstDiff(localBytecode, chainData);
    if (i >= 0) {
      console.log("First differing hex index:", i);
      console.log("Local snippet :", localBytecode.slice(i, i + 64));
      console.log("Chain snippet :", chainData.slice(i, i + 64));
    }

    console.log("\nHints:");
    console.log("- Make sure compiler version is EXACTLY 0.8.24+commit.e11b9ed9");
    console.log("- Optimizer settings must match deployment (enabled? runs=200?)");
    console.log("- Re-run: npx hardhat clean && npx hardhat compile");
    process.exit(1);
  }

  // === 3) Extract ABI-encoded constructor args from chain data ===
  const encodedArgs = "0x" + chainData.slice(localBytecode.length);
  console.log("\n✅ Local bytecode matches on‑chain prefix.");
  console.log("Encoded constructor args (tail):", encodedArgs);

  // === 4) Decode to human-readable values to double-check ===
  const types = ["string", "string", "uint256", "uint256", "address"];
  const dec = ethers.AbiCoder.defaultAbiCoder().decode(types, encodedArgs);

  console.log("\nDecoded constructor args:");
  console.log("  name_         :", dec[0]);
  console.log("  symbol_       :", dec[1]);
  console.log("  initialSupply :", dec[2].toString());
  console.log("  cap_          :", dec[3].toString());
  console.log("  owner_        :", dec[4], "\n");

  console.log("Paste the encoded string above into BaseScan's 'Constructor Arguments (ABI‑encoded)' box.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
