import { ethers, network, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 DEPLOYING OPTIMIZED PRESALE BASED ON TOKEN ANALYSIS");
  console.log("======================================================");
  
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
  const TREASURY = process.env.TREASURY as string;
  
  if (!TOKEN_ADDRESS || !TREASURY) {
    throw new Error("Please set TOKEN_ADDRESS and TREASURY in your .env");
  }

  // --- OPTIMIZED PRESALE PARAMETERS (Based on analysis) ---
  const PRESALE_CONFIG = {
    // Allocation: 2.5% of total cap, reasonable for launch
    TOKENS_FOR_PRESALE: "25000000", // 25M LMC
    
    // Pricing: Premium tier ($0.025 per token at $2,500 ETH)
    RATE_TOKENS_PER_ETH: 100_000n,
    
    // Caps: Much more realistic for a new project
    SOFT_CAP_ETH: "75",    // $187,500 at $2,500 ETH
    HARD_CAP_ETH: "250",   // $625,000 at $2,500 ETH
    
    // Contribution limits: Accessible but prevents whales
    MIN_CONTRIB_ETH: "0.01", // $25 minimum
    MAX_CONTRIB_ETH: "5",    // $12,500 maximum
    
    // Skim: Lower than before, fair for development
    SKIM_BPS: 500, // 5% instead of 10%
    
    // Timing: Reasonable duration
    DURATION_DAYS: 30 // 30 days instead of 60+
  };

  // Calculate derived values
  const ratePerWei = PRESALE_CONFIG.RATE_TOKENS_PER_ETH;
  const softCapWei = ethers.parseEther(PRESALE_CONFIG.SOFT_CAP_ETH);
  const hardCapWei = ethers.parseEther(PRESALE_CONFIG.HARD_CAP_ETH);
  const minContribWei = ethers.parseEther(PRESALE_CONFIG.MIN_CONTRIB_ETH);
  const maxContribWei = ethers.parseEther(PRESALE_CONFIG.MAX_CONTRIB_ETH);
  const tokensToAllocate = ethers.parseUnits(PRESALE_CONFIG.TOKENS_FOR_PRESALE, 18);

  // Timing: Start in 15 minutes, end in 30 days
  const now = Math.floor(Date.now() / 1000);
  const start = BigInt(now + 15 * 60); // 15 minutes from now
  const end = BigInt(now + PRESALE_CONFIG.DURATION_DAYS * 24 * 60 * 60);

  const [deployer] = await ethers.getSigners();
  
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  
  console.log("\n📊 OPTIMIZED PRESALE PARAMETERS:");
  console.log("================================");
  console.log(`Token Allocation: ${PRESALE_CONFIG.TOKENS_FOR_PRESALE} LMC`);
  console.log(`Rate: ${PRESALE_CONFIG.RATE_TOKENS_PER_ETH.toLocaleString()} LMC per ETH`);
  console.log(`Token Price: $0.025 (at $2,500 ETH)`);
  console.log(`Soft Cap: ${PRESALE_CONFIG.SOFT_CAP_ETH} ETH (~$${(parseFloat(PRESALE_CONFIG.SOFT_CAP_ETH) * 2500).toLocaleString()})`);
  console.log(`Hard Cap: ${PRESALE_CONFIG.HARD_CAP_ETH} ETH (~$${(parseFloat(PRESALE_CONFIG.HARD_CAP_ETH) * 2500).toLocaleString()})`);
  console.log(`Min Contribution: ${PRESALE_CONFIG.MIN_CONTRIB_ETH} ETH (~$${(parseFloat(PRESALE_CONFIG.MIN_CONTRIB_ETH) * 2500).toLocaleString()})`);
  console.log(`Max Contribution: ${PRESALE_CONFIG.MAX_CONTRIB_ETH} ETH (~$${(parseFloat(PRESALE_CONFIG.MAX_CONTRIB_ETH) * 2500).toLocaleString()})`);
  console.log(`Treasury Skim: ${PRESALE_CONFIG.SKIM_BPS / 100}%`);
  console.log(`Duration: ${PRESALE_CONFIG.DURATION_DAYS} days`);
  console.log(`Start: ${new Date(Number(start) * 1000).toISOString()}`);
  console.log(`End: ${new Date(Number(end) * 1000).toISOString()}`);

  // Verify token first
  console.log("\n🔍 VERIFYING TOKEN...");
  const token = await ethers.getContractAt("UniqueToken", TOKEN_ADDRESS);
  const [tokenName, tokenSymbol, deployerBalance] = await Promise.all([
    token.name(),
    token.symbol(),
    token.balanceOf(deployer.address)
  ]);
  
  console.log(`Token: ${tokenName} (${tokenSymbol})`);
  console.log(`Deployer Balance: ${ethers.formatUnits(deployerBalance, 18)} LMC`);
  
  if (deployerBalance < tokensToAllocate) {
    console.error(`❌ Insufficient tokens! Need ${ethers.formatUnits(tokensToAllocate, 18)} LMC`);
    return;
  }

  // Deploy new presale
  console.log("\n🚀 DEPLOYING NEW PRESALE...");
  const Presale = await ethers.getContractFactory("LuminaCorePresaleV2_Skim");
  const presale = await Presale.deploy(
    TOKEN_ADDRESS,        // _token
    TREASURY,            // _treasury  
    start,               // _start
    end,                 // _end
    ratePerWei,          // _ratePerWei
    softCapWei,          // _softCapWei
    hardCapWei,          // _hardCapWei
    minContribWei,       // _minBuyWei
    maxContribWei,       // _maxBuyWei
    PRESALE_CONFIG.SKIM_BPS // _skimBps
  );

  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log(`✅ New Presale deployed: ${presaleAddress}`);

  // Setup token permissions and allocation
  console.log("\n🔧 SETTING UP TOKEN PERMISSIONS...");
  
  // 1. Remove old presale from fee exemption (if exists)
  const OLD_PRESALE = process.env.PRESALE_ADDRESS;
  if (OLD_PRESALE && OLD_PRESALE !== "YOUR_PRESALE_ADDRESS_HERE") {
    try {
      const tx0 = await token.setFeeExempt(OLD_PRESALE, false);
      await tx0.wait();
      console.log(`✅ Removed fee exemption from old presale: ${OLD_PRESALE}`);
    } catch (error) {
      console.log("⚠️ Could not remove old presale exemption (may not be needed)");
    }
  }

  // 2. Set new presale as fee exempt
  const tx1 = await token.setFeeExempt(presaleAddress, true);
  await tx1.wait();
  console.log("✅ Set new presale as fee exempt");

  // 3. Transfer tokens to new presale
  console.log(`\n📤 TRANSFERRING ${PRESALE_CONFIG.TOKENS_FOR_PRESALE} LMC TO PRESALE...`);
  const tx2 = await token.transfer(presaleAddress, tokensToAllocate);
  await tx2.wait();
  console.log(`✅ Transferred ${PRESALE_CONFIG.TOKENS_FOR_PRESALE} LMC to presale`);

  // Save deployment info
  const deploymentInfo = {
    address: presaleAddress,
    constructorArgs: [
      TOKEN_ADDRESS,
      TREASURY,
      start.toString(),
      end.toString(),
      ratePerWei.toString(),
      softCapWei.toString(),
      hardCapWei.toString(),
      minContribWei.toString(),
      maxContribWei.toString(),
      PRESALE_CONFIG.SKIM_BPS
    ],
    config: {
      ...PRESALE_CONFIG,
      RATE_TOKENS_PER_ETH: PRESALE_CONFIG.RATE_TOKENS_PER_ETH.toString() // Convert BigInt to string
    },
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString(),
    contract: "LuminaCorePresaleV2_Skim"
  };

  const outDir = path.join(__dirname, "..", "deployments");
  const outFile = path.join(outDir, `${network.name}_presale_v2.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved: ${outFile}`);

  // Verify on BaseScan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 VERIFYING ON BASESCAN...");
    try {
      await run("verify:verify", {
        address: presaleAddress,
        constructorArguments: deploymentInfo.constructorArgs,
        contract: "contracts/LuminaCorePresaleV2_Skim.sol:LuminaCorePresaleV2_Skim"
      });
      console.log("✅ Contract verified on BaseScan");
    } catch (error: any) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }

  // Final verification
  console.log("\n✅ FINAL VERIFICATION:");
  const finalBalance = await token.balanceOf(presaleAddress);
  const isLive = await presale.live();
  console.log(`Presale Balance: ${ethers.formatUnits(finalBalance, 18)} LMC`);
  console.log(`Presale Live: ${isLive}`);

  console.log("\n🎉 NEW PRESALE DEPLOYMENT COMPLETE!");
  console.log("===================================");
  console.log(`📍 Contract: ${presaleAddress}`);
  console.log(`🔗 BaseScan: https://basescan.org/address/${presaleAddress}`);
  console.log(`💰 Total Raise Goal: ${PRESALE_CONFIG.HARD_CAP_ETH} ETH (~$${(parseFloat(PRESALE_CONFIG.HARD_CAP_ETH) * 2500).toLocaleString()})`);
  console.log(`🪙 Token Allocation: ${PRESALE_CONFIG.TOKENS_FOR_PRESALE} LMC`);
  console.log(`💵 Token Price: $0.025`);
  console.log(`⏰ Duration: ${PRESALE_CONFIG.DURATION_DAYS} days`);
  
  console.log("\n📝 NEXT STEPS:");
  console.log("==============");
  console.log("1. Update your .env file with the new presale address:");
  console.log(`   PRESALE_ADDRESS=${presaleAddress}`);
  console.log("2. Update your webapp to use the new presale address");
  console.log("3. Update your Telegram/social media with new contract");
  console.log("4. Run verification script to ensure everything is working");
  
  console.log("\n🔄 MIGRATION PLAN:");
  console.log("==================");
  console.log("• Old presale will continue until October (people can still buy)");
  console.log("• New presale has much better parameters and realistic goals");
  console.log("• Direct all new marketing to the new presale");
  console.log("• Consider announcing the migration to your community");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
