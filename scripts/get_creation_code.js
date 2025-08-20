import fs from "fs";
import fetch from "node-fetch";

// ==== CONFIG ====
const TX_HASH = "0x9489084c999c4a70dc5c65ca49a3fa54b2a68f3325834b7bc8ebe7bc586049a1";
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY; // put in .env
const CONTRACT_ARTIFACT = "../artifacts/contracts/UniqueToken.sol/UniqueToken.json"; // adjust if path differs

if (!BASESCAN_API_KEY) {
    console.error("Missing BASESCAN_API_KEY in .env");
    process.exit(1);
}

async function main() {
    console.log("Fetching transaction data from BaseScan...");

    const url = `https://api-sepolia.basescan.org/api?module=proxy&action=eth_getTransactionByHash&txhash=${TX_HASH}&apikey=${BASESCAN_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data?.result?.input) {
        console.error("Failed to fetch transaction input data");
        process.exit(1);
    }

    const creationCode = data.result.input;

    // Save creation bytecode to file
    fs.writeFileSync("creation.txt", creationCode, "utf8");
    console.log(`✅ Saved creation bytecode to creation.txt (${creationCode.length} chars)`);

    // Load compiled bytecode
    const artifact = JSON.parse(fs.readFileSync(CONTRACT_ARTIFACT, "utf8"));
    const compiledBytecode = artifact.bytecode;

    // Compare & extract constructor args
    if (creationCode.startsWith(compiledBytecode)) {
        const constructorArgs = "0x" + creationCode.slice(compiledBytecode.length);
        console.log(`✅ Constructor arguments found: ${constructorArgs}`);
    } else {
        console.error("❌ Compiled bytecode does not match start of creation bytecode.");
        console.error(`First few mismatching chars: ${creationCode.slice(0, 100)} ...`);
    }
}

main().catch(console.error);
