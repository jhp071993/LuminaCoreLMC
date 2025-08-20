import { ethers } from "hardhat";

async function main() {
  console.log("🔍 ANALYZING TOKEN CONTRACT FOR PRESALE DESIGN");
  console.log("==============================================");
  
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
  
  try {
    const token = await ethers.getContractAt("UniqueToken", TOKEN_ADDRESS);
    const [deployer] = await ethers.getSigners();
    
    // Get all token parameters
    const [
      name,
      symbol, 
      decimals,
      totalSupply,
      cap,
      owner,
      feeEnabled,
      feeBps,
      feeRecipient,
      deployerBalance,
      paused
    ] = await Promise.all([
      token.name(),
      token.symbol(),
      token.decimals(),
      token.totalSupply(),
      token.cap(),
      token.owner(),
      token.feeEnabled(),
      token.feeBps(),
      token.feeRecipient(),
      token.balanceOf(deployer.address),
      token.paused()
    ]);
    
    console.log("\n📊 TOKEN ANALYSIS:");
    console.log("==================");
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
    console.log(`Contract: ${TOKEN_ADDRESS}`);
    console.log(`Owner: ${owner}`);
    console.log(`Paused: ${paused}`);
    
    const totalSupplyNum = Number(ethers.formatUnits(totalSupply, decimals));
    const capNum = Number(ethers.formatUnits(cap, decimals));
    const deployerBalanceNum = Number(ethers.formatUnits(deployerBalance, decimals));
    const remainingMintable = capNum - totalSupplyNum;
    
    console.log("\n💰 SUPPLY ANALYSIS:");
    console.log("===================");
    console.log(`Current Supply: ${totalSupplyNum.toLocaleString()} ${symbol}`);
    console.log(`Maximum Cap: ${capNum.toLocaleString()} ${symbol}`);
    console.log(`Deployer Balance: ${deployerBalanceNum.toLocaleString()} ${symbol}`);
    console.log(`Remaining Mintable: ${remainingMintable.toLocaleString()} ${symbol}`);
    console.log(`Supply Utilization: ${(totalSupplyNum / capNum * 100).toFixed(1)}%`);
    
    console.log("\n💸 FEE CONFIGURATION:");
    console.log("=====================");
    console.log(`Fee Enabled: ${feeEnabled}`);
    console.log(`Fee Rate: ${feeBps} bps (${(Number(feeBps) / 100).toFixed(2)}%)`);
    console.log(`Fee Recipient: ${feeRecipient}`);
    
    console.log("\n🎯 PRESALE RECOMMENDATIONS:");
    console.log("===========================");
    
    // Calculate reasonable presale allocations
    const availableForPresale = Math.min(deployerBalanceNum, remainingMintable * 0.5); // Max 50% of remaining supply
    const reasonablePresaleAllocation = Math.min(availableForPresale, capNum * 0.05); // Max 5% of total cap
    
    console.log(`Available for Presale: ${availableForPresale.toLocaleString()} ${symbol}`);
    console.log(`Recommended Presale Allocation: ${reasonablePresaleAllocation.toLocaleString()} ${symbol}`);
    console.log(`% of Total Cap: ${(reasonablePresaleAllocation / capNum * 100).toFixed(2)}%`);
    
    // Price recommendations based on market analysis
    const recommendedPrices = [
      { label: "Conservative", tokensPerETH: 500_000, priceUSD: 0.005 },
      { label: "Moderate", tokensPerETH: 250_000, priceUSD: 0.01 },
      { label: "Premium", tokensPerETH: 100_000, priceUSD: 0.025 },
      { label: "High-Value", tokensPerETH: 50_000, priceUSD: 0.05 }
    ];
    
    console.log("\n💵 PRICING SCENARIOS (assuming ETH = $2,500):");
    console.log("============================================");
    
    recommendedPrices.forEach(scenario => {
      const ethNeeded = reasonablePresaleAllocation / scenario.tokensPerETH;
      const usdRaised = ethNeeded * 2500;
      
      console.log(`\n${scenario.label} Pricing:`);
      console.log(`  Rate: ${scenario.tokensPerETH.toLocaleString()} ${symbol}/ETH`);
      console.log(`  Token Price: $${scenario.priceUSD.toFixed(3)}`);
      console.log(`  Hard Cap: ${ethNeeded.toFixed(1)} ETH ($${usdRaised.toLocaleString()})`);
      console.log(`  Soft Cap: ${(ethNeeded * 0.3).toFixed(1)} ETH ($${(usdRaised * 0.3).toLocaleString()})`);
    });
    
    console.log("\n🏆 FINAL RECOMMENDATIONS:");
    console.log("=========================");
    
    // Based on analysis, recommend moderate pricing
    const recommendedRate = 100_000;
    const recommendedAllocation = Math.min(25_000_000, reasonablePresaleAllocation);
    const recommendedHardCap = recommendedAllocation / recommendedRate;
    const recommendedSoftCap = recommendedHardCap * 0.3;
    
    console.log(`✅ Recommended Allocation: ${recommendedAllocation.toLocaleString()} ${symbol}`);
    console.log(`✅ Recommended Rate: ${recommendedRate.toLocaleString()} ${symbol}/ETH`);
    console.log(`✅ Recommended Soft Cap: ${recommendedSoftCap.toFixed(1)} ETH`);
    console.log(`✅ Recommended Hard Cap: ${recommendedHardCap.toFixed(1)} ETH`);
    console.log(`✅ Token Price: $0.025 (at $2,500 ETH)`);
    console.log(`✅ Max Raise: $${(recommendedHardCap * 2500).toLocaleString()}`);
    
    console.log("\n🔍 TOKENOMICS HEALTH CHECK:");
    console.log("===========================");
    console.log(`✅ Presale as % of total supply: ${(recommendedAllocation / capNum * 100).toFixed(2)}%`);
    console.log(`✅ Liquidity remaining after presale: ${(remainingMintable - recommendedAllocation).toLocaleString()} ${symbol}`);
    console.log(`✅ Owner control: ${(deployerBalanceNum / totalSupplyNum * 100).toFixed(1)}% of current supply`);
    
    // Risk assessment
    console.log("\n⚠️ RISK ASSESSMENT:");
    console.log("===================");
    
    if (recommendedAllocation / capNum > 0.1) {
      console.log("⚠️ WARNING: Presale >10% of total cap - consider reducing");
    } else {
      console.log("✅ Presale allocation is reasonable (<10% of total cap)");
    }
    
    if (deployerBalanceNum / totalSupplyNum > 0.5) {
      console.log("⚠️ WARNING: Owner holds majority of current supply");
    } else {
      console.log("✅ Owner holdings are reasonable");
    }
    
    if (feeEnabled && Number(feeBps) > 50) {
      console.log("⚠️ WARNING: Transaction fees are enabled and high");
    } else {
      console.log("✅ Transaction fees are reasonable or disabled");
    }
    
  } catch (error: any) {
    console.error("❌ Error analyzing token:", error.message);
  }
}

main().catch(console.error);
