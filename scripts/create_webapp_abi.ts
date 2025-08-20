import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔧 CREATING WEBAPP-READY ABI FILES");
  console.log("===================================");

  // Get the contract factory
  const artifact = await ethers.getContractFactory("LuminaCorePresaleV2_Skim");
  
  // Get ABI in different formats
  const abi = artifact.interface.formatJson();
  
  console.log("📝 Creating ABI files for webapp...");

  // 1. Standard JSON ABI (most common)
  fs.writeFileSync("presale_abi_standard.json", abi);
  console.log("✅ presale_abi_standard.json created");

  // 2. Minimal format
  fs.writeFileSync("presale_abi_minimal.json", JSON.stringify(abiMinimal, null, 2));
  console.log("✅ presale_abi_minimal.json created");

  // 3. Human readable format
  fs.writeFileSync("presale_abi_human.json", JSON.stringify(abiHuman, null, 2));
  console.log("✅ presale_abi_human.json created");

  // 4. JavaScript/TypeScript module
  const jsModule = `// Lumina Core Presale ABI
export const PRESALE_ABI = ${abiStandard};

export const PRESALE_ADDRESS = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
export const TOKEN_ADDRESS = "0x21583587498d054aCE7e4de41cE74BD69b61Ab0A";
export const BASE_CHAIN_ID = 8453;

// Key function signatures for testing
export const KEY_FUNCTIONS = [
  'live()',
  'owner()', 
  'token()',
  'treasury()',
  'ratePerWei()',
  'softCap()',
  'hardCap()',
  'totalRaised()',
  'finalized()',
  'buy()',
  'claim()',
  'refund()'
];
`;

  fs.writeFileSync("presale-config.js", jsModule);
  console.log("✅ presale-config.js created");

  // 5. Test the ABI
  console.log("\n🧪 TESTING ABI COMPLETENESS:");
  const abiParsed = JSON.parse(abiStandard);
  const functions = abiParsed.filter((item: any) => item.type === 'function');
  
  console.log(`📊 Total functions: ${functions.length}`);
  console.log(`📊 View functions: ${functions.filter((f: any) => f.stateMutability === 'view').length}`);
  console.log(`📊 Payable functions: ${functions.filter((f: any) => f.stateMutability === 'payable').length}`);
  console.log(`📊 Write functions: ${functions.filter((f: any) => f.stateMutability !== 'view' && f.stateMutability !== 'payable').length}`);

  // 6. Create webapp test snippet
  const testSnippet = `
// WEBAPP TEST - Copy this into your browser console
// Make sure you're on Base network first!

const PRESALE_ADDRESS = "0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd";
const ABI = ${abiStandard};

async function testPresaleContract() {
  try {
    // Check if we're on Base network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0x2105') {
      console.log('❌ Wrong network. Current:', parseInt(chainId, 16), 'Expected: 8453 (Base)');
      return;
    }
    
    console.log('✅ Correct network: Base (8453)');
    
    // Create provider and contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(PRESALE_ADDRESS, ABI, provider);
    
    // Test all key functions
    console.log('🧪 Testing contract functions...');
    
    const tests = [
      { name: 'live', call: () => contract.live() },
      { name: 'owner', call: () => contract.owner() },
      { name: 'token', call: () => contract.token() },
      { name: 'treasury', call: () => contract.treasury() },
      { name: 'ratePerWei', call: () => contract.ratePerWei() },
      { name: 'softCap', call: () => contract.softCap() },
      { name: 'hardCap', call: () => contract.hardCap() },
      { name: 'totalRaised', call: () => contract.totalRaised() },
      { name: 'finalized', call: () => contract.finalized() },
      { name: 'startTime', call: () => contract.startTime() },
      { name: 'endTime', call: () => contract.endTime() }
    ];
    
    const results = {};
    for (const test of tests) {
      try {
        const result = await test.call();
        results[test.name] = { success: true, value: result.toString() };
        console.log(\`✅ \${test.name}(): \${result}\`);
      } catch (error) {
        results[test.name] = { success: false, error: error.message };
        console.log(\`❌ \${test.name}(): \${error.message}\`);
      }
    }
    
    console.log('\\n📊 Summary:');
    const successful = Object.values(results).filter(r => r.success).length;
    console.log(\`\${successful}/\${tests.length} functions working\`);
    
    if (successful === tests.length) {
      console.log('🎉 All functions working! Your ABI is correct.');
    } else {
      console.log('⚠️ Some functions failed. Check ABI or network.');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testPresaleContract();
`;

  fs.writeFileSync("webapp-test.js", testSnippet);
  console.log("✅ webapp-test.js created");

  console.log("\n🎯 FILES CREATED FOR YOUR WEBAPP:");
  console.log("==================================");
  console.log("1. presale_abi_standard.json - Standard ABI format");
  console.log("2. presale-config.js - Complete module with addresses");
  console.log("3. webapp-test.js - Browser console test");
  console.log("");
  console.log("🧪 NEXT STEPS:");
  console.log("1. Replace your webapp's ABI with presale_abi_standard.json");
  console.log("2. Run webapp-test.js in your browser console");
  console.log("3. Verify all 26 functions are detected");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
