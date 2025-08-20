import { ethers } from "hardhat";

async function main() {
  console.log("🔧 FIXING PRESALE TOKEN ALLOCATION");
  console.log("==================================");
  
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
  const PRESALE_ADDRESS = process.env.PRESALE_ADDRESS as string;
  
  if (!TOKEN_ADDRESS || !PRESALE_ADDRESS) {
    console.error("❌ Missing TOKEN_ADDRESS or PRESALE_ADDRESS in .env");
    return;
  }
  
  console.log(`Token: ${TOKEN_ADDRESS}`);
  console.log(`Presale: ${PRESALE_ADDRESS}`);
  
  try {
    // Connect to contracts
    const token = await ethers.getContractAt("UniqueToken", TOKEN_ADDRESS);
    const presale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", PRESALE_ADDRESS);
    const [deployer] = await ethers.getSigners();
    
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
    
    // Get presale parameters
    const [hardCap, ratePerWei, tokenDecimals] = await Promise.all([
      presale.hardCap(),
      presale.ratePerWei(),
      token.decimals()
    ]);
    
    console.log("\n📊 PRESALE PARAMETERS:");
    console.log("======================");
    console.log(`Hard Cap: ${ethers.formatEther(hardCap)} ETH`);
    console.log(`Rate Per Wei: ${ratePerWei.toString()}`);
    console.log(`Rate Per ETH: ${ratePerWei.toString()} tokens per ETH`);
    
    // CORRECT CALCULATION: Convert ETH to tokens
    const hardCapETH = Number(ethers.formatEther(hardCap));
    const tokensPerETH = Number(ratePerWei);
    const requiredAllocation = ethers.parseUnits((hardCapETH * tokensPerETH).toString(), tokenDecimals);
    
    console.log(`Required Allocation: ${ethers.formatUnits(requiredAllocation, tokenDecimals)} LMC`);
    console.log(`Calculation: ${hardCapETH} ETH × ${tokensPerETH} tokens/ETH = ${hardCapETH * tokensPerETH} tokens`);
    
    // Check current allocation
    const currentBalance = await token.balanceOf(PRESALE_ADDRESS);
    console.log(`Current Balance: ${ethers.formatUnits(currentBalance, tokenDecimals)} LMC`);
    
    // Calculate shortfall
    if (currentBalance >= requiredAllocation) {
      console.log("✅ PRESALE HAS SUFFICIENT TOKENS!");
      console.log(`Surplus: ${ethers.formatUnits(currentBalance - requiredAllocation, tokenDecimals)} LMC`);
      return;
    }
    
    const shortfall = requiredAllocation - currentBalance;
    console.log(`❌ Shortfall: ${ethers.formatUnits(shortfall, tokenDecimals)} LMC`);
    
    // Check deployer's balance
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log(`\nDeployer Balance: ${ethers.formatUnits(deployerBalance, tokenDecimals)} LMC`);
    
    if (deployerBalance < shortfall) {
      console.log("❌ Deployer doesn't have enough tokens!");
      
      // Check if we can mint
      try {
        const cap = await token.cap();
        const totalSupply = await token.totalSupply();
        const canMint = totalSupply + shortfall <= cap;
        
        if (canMint) {
          console.log(`\n🏭 MINTING MISSING TOKENS...`);
          console.log(`Amount: ${ethers.formatUnits(shortfall, tokenDecimals)} LMC`);
          
          const mintTx = await token.mint(deployer.address, shortfall);
          await mintTx.wait();
          console.log(`✅ Minted ${ethers.formatUnits(shortfall, tokenDecimals)} LMC to deployer`);
          
        } else {
          const maxMintable = cap - totalSupply;
          console.log(`❌ Cannot mint enough. Max mintable: ${ethers.formatUnits(maxMintable, tokenDecimals)} LMC`);
          return;
        }
      } catch (error) {
        console.log("❌ Cannot mint:", error);
        return;
      }
    }
    
    // Transfer tokens to presale
    console.log(`\n📤 TRANSFERRING TOKENS TO PRESALE...`);
    console.log(`Amount: ${ethers.formatUnits(shortfall, tokenDecimals)} LMC`);
    
    const transferTx = await token.transfer(PRESALE_ADDRESS, shortfall);
    console.log(`Transaction: ${transferTx.hash}`);
    
    await transferTx.wait();
    console.log("✅ Transfer confirmed!");
    
    // Verify final allocation
    const finalBalance = await token.balanceOf(PRESALE_ADDRESS);
    console.log(`\n✅ FINAL VERIFICATION:`);
    console.log(`Required: ${ethers.formatUnits(requiredAllocation, tokenDecimals)} LMC`);
    console.log(`Current: ${ethers.formatUnits(finalBalance, tokenDecimals)} LMC`);
    
    if (finalBalance >= requiredAllocation) {
      console.log("🎉 PRESALE NOW HAS SUFFICIENT TOKENS!");
    } else {
      console.log("❌ Still short. Please check manually.");
    }
    
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("ERC20: transfer amount exceeds balance")) {
      console.log("\n💡 You don't have enough tokens. Try minting more first.");
    } else if (error.message.includes("Ownable: caller is not the owner")) {
      console.log("\n💡 You're not the owner of the token contract.");
    }
  }
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exitCode = 1;
});