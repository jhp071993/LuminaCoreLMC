import { ethers, network } from "hardhat";

async function main() {
  console.log("🔍 DIAGNOSING PRESALE CONTRACT INTERFACE");
  console.log("========================================");

  const NEW_PRESALE = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
  const OLD_PRESALE = "0xbE2b61DFe424dd80fe81322457Ff4f2652400721";

  try {
    // Get the contract
    const presale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", NEW_PRESALE);
    
    console.log("✅ NEW PRESALE CONTRACT CONNECTED");
    console.log(`📍 Address: ${NEW_PRESALE}`);
    console.log(`🌐 Network: ${network.name}`);

    // Test basic contract calls
    console.log("\n🧪 TESTING CONTRACT INTERFACE:");
    
    // Test all the basic view functions
    try {
      const token = await presale.token();
      console.log(`✅ token(): ${token}`);
    } catch (error) {
      console.log(`❌ token(): ${error.message}`);
    }

    try {
      const live = await presale.live();
      console.log(`✅ live(): ${live}`);
    } catch (error) {
      console.log(`❌ live(): ${error.message}`);
    }

    try {
      const owner = await presale.owner();
      console.log(`✅ owner(): ${owner}`);
    } catch (error) {
      console.log(`❌ owner(): ${error.message}`);
    }

    try {
      const treasury = await presale.treasury();
      console.log(`✅ treasury(): ${treasury}`);
    } catch (error) {
      console.log(`❌ treasury(): ${error.message}`);
    }

    try {
      const startTime = await presale.startTime();
      console.log(`✅ startTime(): ${startTime} (${new Date(Number(startTime) * 1000).toISOString()})`);
    } catch (error) {
      console.log(`❌ startTime(): ${error.message}`);
    }

    try {
      const endTime = await presale.endTime();
      console.log(`✅ endTime(): ${endTime} (${new Date(Number(endTime) * 1000).toISOString()})`);
    } catch (error) {
      console.log(`❌ endTime(): ${error.message}`);
    }

    try {
      const rate = await presale.ratePerWei();
      console.log(`✅ ratePerWei(): ${rate}`);
    } catch (error) {
      console.log(`❌ ratePerWei(): ${error.message}`);
    }

    try {
      const softCap = await presale.softCap();
      console.log(`✅ softCap(): ${ethers.formatEther(softCap)} ETH`);
    } catch (error) {
      console.log(`❌ softCap(): ${error.message}`);
    }

    try {
      const hardCap = await presale.hardCap();
      console.log(`✅ hardCap(): ${ethers.formatEther(hardCap)} ETH`);
    } catch (error) {
      console.log(`❌ hardCap(): ${error.message}`);
    }

    try {
      const totalRaised = await presale.totalRaised();
      console.log(`✅ totalRaised(): ${ethers.formatEther(totalRaised)} ETH`);
    } catch (error) {
      console.log(`❌ totalRaised(): ${error.message}`);
    }

    try {
      const finalized = await presale.finalized();
      console.log(`✅ finalized(): ${finalized}`);
    } catch (error) {
      console.log(`❌ finalized(): ${error.message}`);
    }

    // Get the full ABI
    console.log("\n📋 FULL CONTRACT ABI:");
    console.log("=====================");
    
    const artifact = await ethers.getContractFactory("LuminaCorePresaleV2_Skim");
    const abi = artifact.interface.fragments;
    
    console.log("🔧 FUNCTIONS:");
    abi.forEach((fragment, index) => {
      if (fragment.type === 'function') {
        const inputs = fragment.inputs.map(input => `${input.type} ${input.name}`).join(', ');
        const outputs = fragment.outputs ? fragment.outputs.map(output => output.type).join(', ') : 'void';
        console.log(`  ${index + 1}. ${fragment.name}(${inputs}) -> ${outputs} [${fragment.stateMutability}]`);
      }
    });

    console.log("\n📡 EVENTS:");
    abi.forEach((fragment, index) => {
      if (fragment.type === 'event') {
        const inputs = fragment.inputs.map(input => `${input.type} ${input.name}`).join(', ');
        console.log(`  ${index + 1}. ${fragment.name}(${inputs})`);
      }
    });

    // Test bytecode
    console.log("\n🧬 CONTRACT BYTECODE CHECK:");
    const code = await ethers.provider.getCode(NEW_PRESALE);
    console.log(`✅ Contract has bytecode: ${code.length > 2 ? 'YES' : 'NO'}`);
    console.log(`📏 Bytecode length: ${code.length} characters`);

    // Compare with old presale
    console.log("\n🔄 COMPARING WITH OLD PRESALE:");
    try {
      const oldPresale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", OLD_PRESALE);
      const oldLive = await oldPresale.live();
      console.log(`🟡 Old Presale Live: ${oldLive}`);
      
      const oldCode = await ethers.provider.getCode(OLD_PRESALE);
      console.log(`📏 Old Bytecode length: ${oldCode.length} characters`);
      console.log(`🔀 Same bytecode: ${code === oldCode ? 'YES' : 'NO'}`);
    } catch (error) {
      console.log(`❌ Old presale connection failed: ${error.message}`);
    }

    // Export ABI for webapp
    console.log("\n📤 EXPORTING ABI FOR WEBAPP:");
    const abiJson = JSON.stringify(artifact.interface.fragments, null, 2);
    
    const fs = require('fs');
    const path = require('path');
    
    // Save ABI to file
    const abiFile = path.join(__dirname, '..', 'presale_abi.json');
    fs.writeFileSync(abiFile, abiJson);
    console.log(`✅ ABI saved to: ${abiFile}`);

    console.log("\n🎯 WEBAPP DEBUGGING TIPS:");
    console.log("========================");
    console.log("1. Make sure your webapp is using the correct contract address:");
    console.log(`   ${NEW_PRESALE}`);
    console.log("2. Make sure your webapp is connected to Base mainnet (chainId: 8453)");
    console.log("3. Check if your webapp ABI matches the exported ABI");
    console.log("4. Verify the 'live()' function returns true");
    console.log("5. Test contract connection with ethers.js");
    
    console.log("\n🧪 QUICK TEST FOR YOUR WEBAPP:");
    console.log("==============================");
    console.log(`const presale = new ethers.Contract("${NEW_PRESALE}", abi, provider);`);
    console.log(`const isLive = await presale.live(); // Should return true`);
    console.log(`const rate = await presale.ratePerWei(); // Should return 100000000000000000000000`);

  } catch (error) {
    console.error("❌ ERROR:", error);
    
    console.log("\n🚨 POSSIBLE ISSUES:");
    console.log("==================");
    console.log("1. Wrong network - make sure you're on Base mainnet");
    console.log("2. Wrong contract address in webapp");
    console.log("3. ABI mismatch between contract and webapp");
    console.log("4. RPC connection issues");
    console.log("5. Wallet not connected to Base network");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
