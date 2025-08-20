
import { ethers } from "hardhat";

async function main() {
  console.log("🔍 COMPREHENSIVE PRESALE SETUP VERIFICATION");
  console.log("===========================================");
  
  // Your contract addresses
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
  const PRESALE_ADDRESS = process.env.PRESALE_ADDRESS as string; // You'll need to set this
  
  if (!TOKEN_ADDRESS) {
    console.error("❌ Please set TOKEN_ADDRESS in your .env file");
    return;
  }
  
  if (!PRESALE_ADDRESS) {
    console.error("❌ Please set PRESALE_ADDRESS in your .env file");
    console.log("💡 Deploy your presale first, then add PRESALE_ADDRESS=your_contract_address to .env");
    return;
  }

  try {
    // Connect to contracts
    const token = await ethers.getContractAt("UniqueToken", TOKEN_ADDRESS);
    const presale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", PRESALE_ADDRESS);
    
    console.log(`Token Contract: ${TOKEN_ADDRESS}`);
    console.log(`Presale Contract: ${PRESALE_ADDRESS}`);
    console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
    
    // Get current timestamp
    const currentTime = Math.floor(Date.now() / 1000);
    
    // ===== 1. VERIFY TOKEN SETUP =====
    console.log("\n📋 1. TOKEN VERIFICATION:");
    console.log("========================");
    
    const [tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply, tokenCap] = await Promise.all([
      token.name(),
      token.symbol(),
      token.decimals(),
      token.totalSupply(),
      token.cap()
    ]);
    
    console.log(`✅ Name: ${tokenName}`);
    console.log(`✅ Symbol: ${tokenSymbol}`);
    console.log(`✅ Decimals: ${tokenDecimals}`);
    console.log(`✅ Current Supply: ${ethers.formatUnits(tokenTotalSupply, tokenDecimals)} ${tokenSymbol}`);
    console.log(`✅ Max Cap: ${ethers.formatUnits(tokenCap, tokenDecimals)} ${tokenSymbol}`);
    
    // ===== 2. VERIFY PRESALE PARAMETERS =====
    console.log("\n🎯 2. PRESALE PARAMETERS:");
    console.log("========================");
    
    const [
      presaleToken,
      treasury,
      startTime,
      endTime,
      softCap,
      hardCap,
      minContribution,
      maxContribution,
      ratePerWei,
      skimBps,
      owner
    ] = await Promise.all([
      presale.token(),
      presale.treasury(),
      presale.startTime(),
      presale.endTime(),
      presale.softCap(),
      presale.hardCap(),
      presale.minContribution(),
      presale.maxContribution(),
      presale.ratePerWei(),
      presale.skimBps(),
      presale.owner()
    ]);
    
    // Check if presale points to correct token
    const tokenMatch = presaleToken.toLowerCase() === TOKEN_ADDRESS.toLowerCase();
    console.log(`${tokenMatch ? "✅" : "❌"} Token Address Match: ${tokenMatch}`);
    if (!tokenMatch) {
      console.log(`   Expected: ${TOKEN_ADDRESS}`);
      console.log(`   Found: ${presaleToken}`);
    }
    
    console.log(`✅ Treasury: ${treasury}`);
    console.log(`✅ Owner: ${owner}`);
    console.log(`✅ Soft Cap: ${ethers.formatEther(softCap)} ETH`);
    console.log(`✅ Hard Cap: ${ethers.formatEther(hardCap)} ETH`);
    console.log(`✅ Min Purchase: ${ethers.formatEther(minContribution)} ETH`);
    console.log(`✅ Max Purchase: ${ethers.formatEther(maxContribution)} ETH`);
    console.log(`✅ Rate: ${ratePerWei.toString()} tokens per wei (${ethers.formatUnits(ratePerWei, 0)} tokens per ETH)`);
    console.log(`✅ Skim: ${skimBps} bps (${(Number(skimBps) / 100).toFixed(1)}%)`);
    
    // ===== 3. VERIFY TIMING =====
    console.log("\n⏰ 3. TIMING VERIFICATION:");
    console.log("=========================");
    
    console.log(`Current Time: ${currentTime} (${new Date(currentTime * 1000).toISOString()})`);
    console.log(`Start Time: ${startTime} (${new Date(Number(startTime) * 1000).toISOString()})`);
    console.log(`End Time: ${endTime} (${new Date(Number(endTime) * 1000).toISOString()})`);
    
    const timeToStart = Number(startTime) - currentTime;
    const timeToEnd = Number(endTime) - currentTime;
    const duration = Number(endTime) - Number(startTime);
    
    if (timeToStart > 0) {
      console.log(`⏳ Starts in: ${Math.floor(timeToStart / 3600)} hours, ${Math.floor((timeToStart % 3600) / 60)} minutes`);
    } else if (timeToEnd > 0) {
      console.log(`⏳ Ends in: ${Math.floor(timeToEnd / 3600)} hours, ${Math.floor((timeToEnd % 3600) / 60)} minutes`);
    } else {
      console.log(`⏰ Sale period has ended`);
    }
    
    console.log(`✅ Duration: ${Math.floor(duration / (24 * 3600))} days, ${Math.floor((duration % (24 * 3600)) / 3600)} hours`);
    
    // ===== 4. VERIFY TOKEN ALLOCATION =====
    console.log("\n💰 4. TOKEN ALLOCATION:");
    console.log("======================");
    
    const presaleBalance = await token.balanceOf(PRESALE_ADDRESS);
    const expectedAllocation = BigInt(ethers.formatUnits(hardCap, 0)) * ratePerWei;
    
    console.log(`Presale Balance: ${ethers.formatUnits(presaleBalance, tokenDecimals)} ${tokenSymbol}`);
    console.log(`Expected Allocation: ${ethers.formatUnits(expectedAllocation, tokenDecimals)} ${tokenSymbol}`);
    
    const allocationMatch = presaleBalance >= expectedAllocation;
    console.log(`${allocationMatch ? "✅" : "❌"} Sufficient Allocation: ${allocationMatch}`);
    
    if (!allocationMatch) {
      const shortfall = expectedAllocation - presaleBalance;
      console.log(`❌ Shortfall: ${ethers.formatUnits(shortfall, tokenDecimals)} ${tokenSymbol}`);
    }
    
    // ===== 5. VERIFY PERMISSIONS =====
    console.log("\n🔐 5. PERMISSIONS & EXEMPTIONS:");
    console.log("==============================");
    
    const isPresaleFeeExempt = await token.isFeeExempt(PRESALE_ADDRESS);
    console.log(`${isPresaleFeeExempt ? "✅" : "❌"} Presale Fee Exempt: ${isPresaleFeeExempt}`);
    
    if (!isPresaleFeeExempt) {
      console.log("⚠️ WARNING: Presale should be fee-exempt to avoid charging buyers transfer fees");
    }
    
    // ===== 6. VERIFY PRESALE STATUS =====
    console.log("\n📊 6. PRESALE STATUS:");
    console.log("====================");
    
    const [live, finalized, softCapMet, totalRaised] = await Promise.all([
      presale.live(),
      presale.finalized(),
      presale.softCapMet(),
      presale.totalRaised()
    ]);
    
    console.log(`Live: ${live ? "🟢 YES" : "🔴 NO"}`);
    console.log(`Finalized: ${finalized ? "✅ YES" : "❌ NO"}`);
    console.log(`Soft Cap Met: ${softCapMet ? "✅ YES" : "❌ NO"}`);
    console.log(`Total Raised: ${ethers.formatEther(totalRaised)} ETH`);
    console.log(`Progress: ${(Number(totalRaised) / Number(hardCap) * 100).toFixed(2)}%`);
    
    // ===== 7. CALCULATE KEY METRICS =====
    console.log("\n📈 7. KEY METRICS:");
    console.log("==================");
    
    const tokensPerETH = Number(ratePerWei);
    const softCapETH = Number(ethers.formatEther(softCap));
    const hardCapETH = Number(ethers.formatEther(hardCap));
    
    console.log(`Token Price: ${(1 / tokensPerETH).toFixed(8)} ETH per ${tokenSymbol}`);
    console.log(`Minimum Raise: ${softCapETH} ETH = ${(softCapETH * tokensPerETH).toLocaleString()} ${tokenSymbol}`);
    console.log(`Maximum Raise: ${hardCapETH} ETH = ${(hardCapETH * tokensPerETH).toLocaleString()} ${tokenSymbol}`);
    console.log(`Treasury Gets: ${(Number(skimBps) / 100).toFixed(1)}% of each purchase immediately`);
    console.log(`Escrow Holds: ${(100 - Number(skimBps) / 100).toFixed(1)}% until withdrawal`);
    
    // ===== 8. FINAL CHECKLIST =====
    console.log("\n✅ 8. DEPLOYMENT CHECKLIST:");
    console.log("===========================");
    
    const checks = [
      { name: "Token address matches", passed: tokenMatch },
      { name: "Sufficient token allocation", passed: allocationMatch },
      { name: "Presale is fee-exempt", passed: isPresaleFeeExempt },
      { name: "Start time is future", passed: timeToStart > 0 || live },
      { name: "End time is after start", passed: Number(endTime) > Number(startTime) },
      { name: "Soft cap ≤ hard cap", passed: Number(softCap) <= Number(hardCap) },
      { name: "Min ≤ max contribution", passed: Number(minContribution) <= Number(maxContribution) },
      { name: "Rate > 0", passed: Number(ratePerWei) > 0 },
      { name: "Skim ≤ 10%", passed: Number(skimBps) <= 1000 }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      console.log(`${check.passed ? "✅" : "❌"} ${check.name}`);
      if (!check.passed) allPassed = false;
    });
    
    console.log("\n" + "=".repeat(50));
    if (allPassed && live) {
      console.log("🎉 PRESALE IS READY FOR PURCHASES! 🎉");
    } else if (allPassed && !live) {
      console.log("⏳ PRESALE SETUP IS CORRECT, WAITING FOR START TIME");
    } else {
      console.log("❌ ISSUES FOUND - PLEASE FIX BEFORE GOING LIVE");
    }
    console.log("=".repeat(50));
    
  } catch (error: any) {
    console.error("❌ Error during verification:", error.message);
    
    if (error.message.includes("could not decode result data")) {
      console.log("\n💡 This usually means:");
      console.log("- Wrong contract address");
      console.log("- Contract not deployed on this network");
      console.log("- ABI mismatch");
    }
  }
}

main().catch(console.error);