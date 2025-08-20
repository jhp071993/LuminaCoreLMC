import { ethers, run } from "hardhat";

async function main() {
  console.log("🔍 MANUAL BASESCAN VERIFICATION");
  console.log("===============================");

  const PRESALE_ADDRESS = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
  
  // Constructor arguments from deployment
  const constructorArgs = [
    "0x21583587498d054aCE7e4de41cE74BD69b61Ab0A", // _token
    "0x3A8a8b6d69cA0f07BC641bAc587eb41e2A553402", // _treasury
    "1755246518",                                    // _start (timestamp)
    "1757837618",                                    // _end (timestamp)
    "100000",                                        // _ratePerWei
    "75000000000000000000",                         // _softCapWei (75 ETH)
    "250000000000000000000",                        // _hardCapWei (250 ETH)
    "10000000000000000",                            // _minBuyWei (0.01 ETH)
    "5000000000000000000",                          // _maxBuyWei (5 ETH)
    500                                             // _skimBps (5%)
  ];

  console.log("Constructor Arguments:");
  console.log("=====================");
  constructorArgs.forEach((arg, i) => {
    console.log(`${i}: ${arg}`);
  });

  console.log("\nDecoded Parameters:");
  console.log("==================");
  console.log(`Token: ${constructorArgs[0]}`);
  console.log(`Treasury: ${constructorArgs[1]}`);
  console.log(`Start Time: ${new Date(parseInt(constructorArgs[2].toString()) * 1000).toISOString()}`);
  console.log(`End Time: ${new Date(parseInt(constructorArgs[3].toString()) * 1000).toISOString()}`);
  console.log(`Rate: ${constructorArgs[4]} tokens per wei`);
  console.log(`Soft Cap: ${ethers.formatEther(constructorArgs[5])} ETH`);
  console.log(`Hard Cap: ${ethers.formatEther(constructorArgs[6])} ETH`);
  console.log(`Min Buy: ${ethers.formatEther(constructorArgs[7])} ETH`);
  console.log(`Max Buy: ${ethers.formatEther(constructorArgs[8])} ETH`);
  console.log(`Skim BPS: ${constructorArgs[9]} (${parseInt(constructorArgs[9].toString()) / 100}%)`);

  // Try to verify on BaseScan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\n🔍 ATTEMPTING BASESCAN VERIFICATION...");
    try {
      await run("verify:verify", {
        address: PRESALE_ADDRESS,
        constructorArguments: constructorArgs,
        contract: "contracts/LuminaCorePresaleV2_Skim.sol:LuminaCorePresaleV2_Skim"
      });
      console.log("✅ Contract verified on BaseScan!");
    } catch (error: any) {
      if (error.message.includes("already verified")) {
        console.log("✅ Contract already verified on BaseScan");
      } else {
        console.log("❌ Verification failed:", error.message);
        console.log("\n💡 Manual Verification Instructions:");
        console.log("====================================");
        console.log("1. Go to https://basescan.org/address/0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd#code");
        console.log("2. Click 'Verify and Publish'");
        console.log("3. Select 'Solidity (Single file)'");
        console.log("4. Compiler: v0.8.20+commit.a1b79de6");
        console.log("5. Contract Name: LuminaCorePresaleV2_Skim");
        console.log("6. Upload the flattened contract file");
        console.log("7. Constructor Arguments (ABI-encoded):");
        
        // Encode constructor arguments
        const types = [
          "address", // _token
          "address", // _treasury
          "uint64",  // _start
          "uint64",  // _end
          "uint256", // _ratePerWei
          "uint256", // _softCapWei
          "uint256", // _hardCapWei
          "uint256", // _minBuyWei
          "uint256", // _maxBuyWei
          "uint16"   // _skimBps
        ];
        
        const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(types, constructorArgs);
        console.log(encodedArgs);
      }
    }
  } else {
    console.log("❌ No ETHERSCAN_API_KEY found");
    console.log("Please set ETHERSCAN_API_KEY in your .env file for automatic verification");
  }

  // Check current contract state
  console.log("\n🔍 CHECKING CONTRACT STATE...");
  const presale = await ethers.getContractAt("LuminaCorePresaleV2_Skim", PRESALE_ADDRESS);
  
  try {
    const [token, treasury, live] = await Promise.all([
      presale.token(),
      presale.treasury(),
      presale.live()
    ]);
    
    console.log(`✅ Token: ${token}`);
    console.log(`✅ Treasury: ${treasury}`);
    console.log(`✅ Live: ${live}`);
    console.log("✅ Contract is working correctly!");
  } catch (error) {
    console.log("❌ Cannot read contract state:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
