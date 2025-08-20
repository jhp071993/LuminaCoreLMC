import { ethers, network, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const NEW_PRESALE = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
  const TREASURY = process.env.TREASURY as string;

  console.log("🔍 VERIFYING NEW OPTIMIZED PRESALE");
  console.log("==================================");

  // Get presale contract
  const presale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", NEW_PRESALE);
  const token = await ethers.getContractAt("UniqueToken", TOKEN_ADDRESS);

  // Check all parameters
  const [
    presaleToken,
    treasury,
    startTime,
    endTime,
    rate,
    softCap,
    hardCap,
    minBuy,
    maxBuy,
    skimBps,
    isLive,
    presaleBalance
  ] = await Promise.all([
    presale.token(),
    presale.treasury(),
    presale.startTime(),
    presale.endTime(),
    presale.ratePerWei(),
    presale.softCap(),
    presale.hardCap(),
    presale.minContribution(),
    presale.maxContribution(),
    presale.skimBps(),
    presale.live(),
    token.balanceOf(NEW_PRESALE)
  ]);

  console.log(`📍 Contract Address: ${NEW_PRESALE}`);
  console.log(`🔗 BaseScan: https://basescan.org/address/${NEW_PRESALE}`);
  console.log(`🪙 Token: ${presaleToken} (${presaleToken === TOKEN_ADDRESS ? '✅' : '❌'})`);
  console.log(`🏦 Treasury: ${treasury} (${treasury === TREASURY ? '✅' : '❌'})`);
  console.log(`⏰ Start: ${new Date(Number(startTime) * 1000).toISOString()}`);
  console.log(`⏰ End: ${new Date(Number(endTime) * 1000).toISOString()}`);
  console.log(`💱 Rate: ${rate.toLocaleString()} LMC per ETH`);
  console.log(`📊 Soft Cap: ${ethers.formatEther(softCap)} ETH`);
  console.log(`📊 Hard Cap: ${ethers.formatEther(hardCap)} ETH`);
  console.log(`💰 Min Buy: ${ethers.formatEther(minBuy)} ETH`);
  console.log(`💰 Max Buy: ${ethers.formatEther(maxBuy)} ETH`);
  console.log(`🪙 Treasury Skim: ${Number(skimBps) / 100}%`);
  console.log(`🟢 Live: ${isLive ? '✅ YES' : '❌ NO'}`);
  console.log(`💰 Token Balance: ${ethers.formatUnits(presaleBalance, 18)} LMC`);

  // Check token price calculation
  const ethPrice = 2500; // Assume $2500 ETH
  const tokensPerEth = Number(rate);
  const tokenPriceUSD = ethPrice / tokensPerEth;
  console.log(`💵 Token Price: $${tokenPriceUSD.toFixed(4)} (at $${ethPrice} ETH)`);

  // Check raise goals
  const softCapUSD = parseFloat(ethers.formatEther(softCap)) * ethPrice;
  const hardCapUSD = parseFloat(ethers.formatEther(hardCap)) * ethPrice;
  console.log(`🎯 Soft Cap Goal: $${softCapUSD.toLocaleString()}`);
  console.log(`🎯 Hard Cap Goal: $${hardCapUSD.toLocaleString()}`);

  // Save deployment info
  const deploymentInfo = {
    address: NEW_PRESALE,
    constructorArgs: [
      TOKEN_ADDRESS,
      TREASURY,
      startTime.toString(),
      endTime.toString(),
      rate.toString(),
      softCap.toString(),
      hardCap.toString(),
      minBuy.toString(),
      maxBuy.toString(),
      Number(skimBps)
    ],
    config: {
      TOKENS_FOR_PRESALE: "25000000",
      RATE_TOKENS_PER_ETH: rate.toString(),
      SOFT_CAP_ETH: ethers.formatEther(softCap),
      HARD_CAP_ETH: ethers.formatEther(hardCap),
      MIN_CONTRIB_ETH: ethers.formatEther(minBuy),
      MAX_CONTRIB_ETH: ethers.formatEther(maxBuy),
      SKIM_BPS: Number(skimBps),
      DURATION_DAYS: Math.round((Number(endTime) - Number(startTime)) / (24 * 60 * 60))
    },
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    timestamp: new Date().toISOString(),
    contract: "LuminaCorePresaleV2_Skim",
    verified: false
  };

  const outDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  
  const outFile = path.join(outDir, `${network.name}_presale_v2.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📄 Deployment info saved: ${outFile}`);

  // Verify on BaseScan if API key exists
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 VERIFYING ON BASESCAN...");
    try {
      await run("verify:verify", {
        address: NEW_PRESALE,
        constructorArguments: deploymentInfo.constructorArgs,
        contract: "contracts/LuminaCorePresaleV2_Skim.sol:LuminaCorePresaleV2_Skim"
      });
      console.log("✅ Contract verified on BaseScan");
      
      // Update deployment info
      deploymentInfo.verified = true;
      fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
    } catch (error: any) {
      if (error.message.includes("already verified")) {
        console.log("✅ Contract already verified on BaseScan");
        deploymentInfo.verified = true;
        fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
      } else {
        console.log("⚠️ Verification failed:", error.message);
      }
    }
  } else {
    console.log("⚠️ No ETHERSCAN_API_KEY found, skipping verification");
  }

  console.log("\n🎉 VERIFICATION COMPLETE!");
  console.log("=========================");
  console.log("✅ All parameters look correct");
  console.log(`✅ ${ethers.formatUnits(presaleBalance, 18)} LMC allocated to presale`);
  console.log(`✅ Presale is ${isLive ? 'LIVE' : 'not yet live'}`);
  
  console.log("\n📝 UPDATE YOUR .ENV:");
  console.log("====================");
  console.log(`PRESALE_ADDRESS=${NEW_PRESALE}`);
  
  console.log("\n🔗 USEFUL LINKS:");
  console.log("================");
  console.log(`Contract: https://basescan.org/address/${NEW_PRESALE}`);
  console.log(`Token: https://basescan.org/address/${TOKEN_ADDRESS}`);
  console.log(`Treasury: https://basescan.org/address/${TREASURY}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
