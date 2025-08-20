import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("🔧 CREATING WEBAPP-READY ABI FILES");
  console.log("===================================");

  // Get the contract factory
  const artifact = await ethers.getContractFactory("LuminaCorePresaleV2_Skim");
  
  // Get ABI as JSON string
  const abi = artifact.interface.formatJson();
  
  console.log("📝 Creating ABI files for webapp...");

  // 1. Standard JSON ABI (most common)
  fs.writeFileSync("presale_abi_standard.json", abi);
  console.log("✅ presale_abi_standard.json created");

  // 2. JavaScript/TypeScript module
  const jsModule = `// Lumina Core Presale ABI
export const PRESALE_ABI = ${abi};

export const PRESALE_ADDRESS = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
export const TOKEN_ADDRESS = "0x21583587498d054aCE7e4de41cE74BD69b61Ab0A";
export const BASE_CHAIN_ID = 8453;

// Test if contract is working
export async function testContract(provider) {
  try {
    const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
    const [live, owner, token, treasury] = await Promise.all([
      contract.live(),
      contract.owner(), 
      contract.token(),
      contract.treasury()
    ]);
    return { live, owner, token, treasury };
  } catch (error) {
    console.error('Contract test failed:', error);
    return null;
  }
}
`;

  fs.writeFileSync("presale-config.js", jsModule);
  console.log("✅ presale-config.js created");

  // 3. Test the ABI
  console.log("\n🧪 TESTING ABI COMPLETENESS:");
  const abiParsed = JSON.parse(abi);
  const functions = abiParsed.filter((item: any) => item.type === 'function');
  
  console.log(`📊 Total functions: ${functions.length}`);
  
  const keyFunctions = ['live', 'owner', 'token', 'treasury', 'ratePerWei', 'softCap', 'hardCap', 'buy', 'claim'];
  console.log("\n🎯 KEY FUNCTIONS CHECK:");
  keyFunctions.forEach(funcName => {
    const found = functions.find((f: any) => f.name === funcName);
    console.log(`${found ? '✅' : '❌'} ${funcName}()`);
  });

  // 4. Create simple browser test
  const browserTest = `
console.log("🧪 PRESALE CONTRACT TEST");
console.log("========================");

// Configuration
const PRESALE_ADDRESS = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
const BASE_CHAIN_ID = 8453;

// The full ABI (paste this in your webapp)
const PRESALE_ABI = ${abi};

async function testPresale() {
  try {
    // 1. Check network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChain = parseInt(chainId, 16);
    console.log('Current network:', currentChain, currentChain === BASE_CHAIN_ID ? '(Base ✅)' : '(Wrong ❌)');
    
    if (currentChain !== BASE_CHAIN_ID) {
      console.log('❌ Switch to Base network first!');
      return;
    }
    
    // 2. Test contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
    
    console.log('\\n🔍 Testing contract functions:');
    
    // Test each function
    const tests = {
      live: () => contract.live(),
      owner: () => contract.owner(),
      token: () => contract.token(), 
      treasury: () => contract.treasury(),
      ratePerWei: () => contract.ratePerWei(),
      softCap: () => contract.softCap(),
      hardCap: () => contract.hardCap(),
      totalRaised: () => contract.totalRaised(),
      finalized: () => contract.finalized()
    };
    
    let working = 0;
    for (const [name, func] of Object.entries(tests)) {
      try {
        const result = await func();
        console.log(\`✅ \${name}(): \${result}\`);
        working++;
      } catch (error) {
        console.log(\`❌ \${name}(): \${error.message}\`);
      }
    }
    
    console.log(\`\\n📊 Result: \${working}/\${Object.keys(tests).length} functions working\`);
    
    if (working === Object.keys(tests).length) {
      console.log('🎉 SUCCESS! All functions working correctly.');
      console.log('Your webapp should be able to interact with this contract.');
    } else {
      console.log('⚠️ Some functions failed. Check your ABI or network connection.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPresale();
`;

  fs.writeFileSync("browser-test.js", browserTest);
  console.log("✅ browser-test.js created");

  console.log("\n🎯 WEBAPP DEBUGGING STEPS:");
  console.log("==========================");
  console.log("1. Copy content of 'presale_abi_standard.json' to your webapp");
  console.log("2. Make sure contract address is: 0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd");
  console.log("3. Copy 'browser-test.js' content to browser console");
  console.log("4. Should see 9/9 functions working");
  console.log("");
  console.log("💡 If you still only see 4 functions:");
  console.log("   - Check if webapp is importing complete ABI");
  console.log("   - Verify network is Base (chainId: 8453)");
  console.log("   - Look for JavaScript errors in console");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
