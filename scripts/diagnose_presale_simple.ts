import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 DIAGNOSING PRESALE CONTRACT INTERFACE");
  console.log("========================================");

  const NEW_PRESALE = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";

  try {
    // Get the contract
    const presale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", NEW_PRESALE);
    
    console.log("✅ NEW PRESALE CONTRACT CONNECTED");
    console.log(`📍 Address: ${NEW_PRESALE}`);
    console.log(`🌐 Network: ${network.name}`);

    // Test basic contract calls
    console.log("\n🧪 TESTING CONTRACT INTERFACE:");
    
    const token = await presale.token();
    console.log(`✅ token(): ${token}`);

    const live = await presale.live();
    console.log(`✅ live(): ${live}`);

    const owner = await presale.owner();
    console.log(`✅ owner(): ${owner}`);

    const treasury = await presale.treasury();
    console.log(`✅ treasury(): ${treasury}`);

    const startTime = await presale.startTime();
    console.log(`✅ startTime(): ${startTime} (${new Date(Number(startTime) * 1000).toISOString()})`);

    const endTime = await presale.endTime();
    console.log(`✅ endTime(): ${endTime} (${new Date(Number(endTime) * 1000).toISOString()})`);

    const rate = await presale.ratePerWei();
    console.log(`✅ ratePerWei(): ${rate}`);

    const softCap = await presale.softCap();
    console.log(`✅ softCap(): ${ethers.formatEther(softCap)} ETH`);

    const hardCap = await presale.hardCap();
    console.log(`✅ hardCap(): ${ethers.formatEther(hardCap)} ETH`);

    const totalRaised = await presale.totalRaised();
    console.log(`✅ totalRaised(): ${ethers.formatEther(totalRaised)} ETH`);

    const finalized = await presale.finalized();
    console.log(`✅ finalized(): ${finalized}`);

    // Test bytecode
    console.log("\n🧬 CONTRACT BYTECODE CHECK:");
    const code = await ethers.provider.getCode(NEW_PRESALE);
    console.log(`✅ Contract has bytecode: ${code.length > 2 ? 'YES' : 'NO'}`);
    console.log(`📏 Bytecode length: ${code.length} characters`);

    // Export ABI for webapp
    console.log("\n📤 EXPORTING ABI FOR WEBAPP:");
    const artifact = await ethers.getContractFactory("LuminaCorePresaleV2_Skim");
    const abiJson = artifact.interface.formatJson();
    
    // Save ABI to file
    const abiFile = path.join(__dirname, '..', 'presale_abi.json');
    fs.writeFileSync(abiFile, abiJson);
    console.log(`✅ ABI saved to: ${abiFile}`);

    // Show key function signatures
    console.log("\n🔑 KEY FUNCTION SIGNATURES:");
    console.log("==========================");
    console.log("live() -> bool");
    console.log("token() -> address");
    console.log("treasury() -> address");
    console.log("owner() -> address");
    console.log("ratePerWei() -> uint256");
    console.log("softCap() -> uint256");
    console.log("hardCap() -> uint256");
    console.log("totalRaised() -> uint256");
    console.log("finalized() -> bool");
    console.log("buy() payable -> void");

    console.log("\n🎯 WEBAPP DEBUGGING CHECKLIST:");
    console.log("==============================");
    console.log("1. ✅ Contract Address:", NEW_PRESALE);
    console.log("2. ✅ Network: Base mainnet (chainId: 8453)");
    console.log("3. ✅ Contract is live:", live);
    console.log("4. ✅ Contract has bytecode");
    console.log("5. 🔄 Check if webapp ABI matches exported ABI");
    console.log("6. 🔄 Verify webapp is connected to Base network");
    console.log("7. 🔄 Test with simple contract call in webapp");
    
    console.log("\n🧪 WEBAPP TEST CODE:");
    console.log("===================");
    console.log("// Test this in your webapp console:");
    console.log(`const address = "${NEW_PRESALE}";`);
    console.log("const provider = new ethers.providers.Web3Provider(window.ethereum);");
    console.log("const contract = new ethers.Contract(address, abi, provider);");
    console.log("contract.live().then(console.log); // Should return true");
    console.log("contract.ratePerWei().then(r => console.log(r.toString())); // Should return 100000000000000000000000");

    console.log("\n🚨 COMMON WEBAPP ISSUES:");
    console.log("========================");
    console.log("1. Wrong network - webapp connected to Ethereum mainnet instead of Base");
    console.log("2. Old contract address - using old presale address");
    console.log("3. ABI mismatch - webapp using old or different ABI");
    console.log("4. RPC issues - Base RPC not working properly");
    console.log("5. Function name differences - webapp calling functions that don't exist");

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    
    console.log("\n🚨 TROUBLESHOOTING:");
    console.log("===================");
    console.log("1. Check if you're on the correct network");
    console.log("2. Verify the contract address is correct");
    console.log("3. Make sure your RPC endpoint is working");
    console.log("4. Check if the contract is verified on BaseScan");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
