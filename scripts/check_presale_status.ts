import { ethers } from "hardhat";

async function main() {
  // UPDATE THIS with your actual LuminaCorePresaleV2_Skim contract address
  const PRESALE_CONTRACT_ADDRESS = "0xbE2b61DFe424dd80fe81322457Ff4f2652400721";
  
  // ABI for LuminaCorePresaleV2_Skim
  const PRESALE_V2_ABI = [
    "function live() external view returns (bool)",
    "function finalized() external view returns (bool)", 
    "function softCapMet() external view returns (bool)",
    "function startTime() external view returns (uint64)",
    "function endTime() external view returns (uint64)",
    "function totalRaised() external view returns (uint256)",
    "function softCap() external view returns (uint256)",
    "function hardCap() external view returns (uint256)",
    "function minContribution() external view returns (uint256)",
    "function maxContribution() external view returns (uint256)",
    "function ratePerWei() external view returns (uint256)",
    "function skimBps() external view returns (uint16)",
    "function owner() external view returns (address)",
    "function treasury() external view returns (address)",
    "function token() external view returns (address)"
  ];

  try {
    // Connect to the presale contract
    const presale = await ethers.getContractAt(PRESALE_V2_ABI, PRESALE_CONTRACT_ADDRESS);
    
    console.log("🔍 Checking LuminaCorePresaleV2_Skim Status...");
    console.log("Presale Contract:", PRESALE_CONTRACT_ADDRESS);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    
    // Get current timestamp
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check all status variables
    const [
      isLive,
      isFinalized,
      isSoftCapMet,
      startTime,
      endTime,
      totalRaised,
      softCap,
      hardCap,
      minContribution,
      maxContribution,
      ratePerWei,
      skimBps,
      owner,
      treasury,
      tokenAddress
    ] = await Promise.all([
      presale.live(),
      presale.finalized(),
      presale.softCapMet(),
      presale.startTime(),
      presale.endTime(),
      presale.totalRaised(),
      presale.softCap(),
      presale.hardCap(),
      presale.minContribution(),
      presale.maxContribution(),
      presale.ratePerWei(),
      presale.skimBps(),
      presale.owner(),
      presale.treasury(),
      presale.token()
    ]);

    console.log("\n📊 PRESALE STATUS:");
    console.log("==================");
    console.log(`Live: ${isLive ? "✅ YES (ACTIVE)" : "❌ NO (PAUSED/INACTIVE)"}`);
    console.log(`Finalized: ${isFinalized ? "✅ YES" : "❌ NO"}`);
    console.log(`Soft Cap Met: ${isSoftCapMet ? "✅ YES" : "❌ NO"}`);
    console.log(`Owner: ${owner}`);
    console.log(`Treasury: ${treasury}`);
    console.log(`Token: ${tokenAddress}`);
    
    console.log("\n⏰ TIMING:");
    console.log("==========");
    console.log(`Current Time: ${currentTime} (${new Date(currentTime * 1000).toISOString()})`);
    console.log(`Start Time: ${startTime} (${new Date(Number(startTime) * 1000).toISOString()})`);
    console.log(`End Time: ${endTime} (${new Date(Number(endTime) * 1000).toISOString()})`);
    
    const timeToStart = Number(startTime) - currentTime;
    const timeToEnd = Number(endTime) - currentTime;
    
    if (timeToStart > 0) {
      console.log(`⏳ Starts in: ${Math.floor(timeToStart / 3600)} hours, ${Math.floor((timeToStart % 3600) / 60)} minutes`);
    } else if (timeToEnd > 0) {
      console.log(`⏳ Ends in: ${Math.floor(timeToEnd / 3600)} hours, ${Math.floor((timeToEnd % 3600) / 60)} minutes`);
    } else {
      console.log(`⏰ Sale period has ended`);
    }
    
    console.log("\n💰 FINANCIAL STATUS:");
    console.log("====================");
    console.log(`Total Raised: ${ethers.formatEther(totalRaised)} ETH`);
    console.log(`Soft Cap: ${ethers.formatEther(softCap)} ETH`);
    console.log(`Hard Cap: ${ethers.formatEther(hardCap)} ETH`);
    console.log(`Min Contribution: ${ethers.formatEther(minContribution)} ETH`);
    console.log(`Max Contribution: ${ethers.formatEther(maxContribution)} ETH`);
    console.log(`Rate: ${ratePerWei.toString()} tokens per wei`);
    console.log(`Skim: ${skimBps}bps (${(Number(skimBps) / 100).toFixed(1)}%)`);
    
    const progressPercent = Number(totalRaised) / Number(hardCap) * 100;
    console.log(`Progress: ${progressPercent.toFixed(2)}%`);
    
    console.log("\n🎯 DIAGNOSIS:");
    console.log("==============");
    
    if (!isLive && !isFinalized) {
      if (Number(startTime) > currentTime) {
        console.log("🟡 PRESALE HAS NOT STARTED YET");
        console.log(`   Will start in ${Math.floor(timeToStart / 3600)} hours, ${Math.floor((timeToStart % 3600) / 60)} minutes`);
      } else if (Number(endTime) <= currentTime) {
        console.log("🔴 PRESALE HAS ENDED BUT NOT FINALIZED");
        console.log("   Owner needs to call finalize() function");
      } else {
        console.log("🔴 PRESALE IS PAUSED/INACTIVE");
        console.log("   Time window is active but live() returns false");
        console.log("   This could indicate an issue with the contract");
      }
    } else if (isLive) {
      console.log("🟢 PRESALE IS ACTIVE AND ACCEPTING PURCHASES");
    } else if (isFinalized) {
      if (isSoftCapMet) {
        console.log("✅ PRESALE SUCCESSFUL - participants can claim tokens");
      } else {
        console.log("❌ PRESALE FAILED - participants can claim refunds");
      }
    }

    // Additional checks for V2 specific features
    console.log("\n🔧 V2 SKIM FEATURES:");
    console.log("===================");
    console.log(`Treasury Skim: ${(Number(skimBps) / 100).toFixed(1)}% of each purchase goes to treasury immediately`);
    console.log(`Escrow: ${(100 - Number(skimBps) / 100).toFixed(1)}% of each purchase held in contract until withdrawal`);

  } catch (error: any) {
    console.error("❌ Error checking presale status:");
    console.error(error.message);
    
    if (error.message.includes("could not decode result data")) {
      console.log("\n💡 This might mean:");
      console.log("- The contract address is incorrect");
      console.log("- The contract is not deployed on this network");
      console.log("- The contract ABI doesn't match");
    }
    
    if (error.message.includes("call revert exception")) {
      console.log("\n💡 The contract exists but a function call failed");
      console.log("- Check if you're on the correct network");
      console.log("- Verify the contract address");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});