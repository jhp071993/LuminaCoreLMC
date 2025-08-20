import { ethers, network, run } from "hardhat";

async function main() {
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as string;
  const TREASURY = process.env.TREASURY as string;

  // --- Presale economics ---
  // 100,000 tokens per ETH (18d token) -> ratePerWei = 100000
  const RATE_TOKENS_PER_ETH = 100_000n; // tokens per ETH
  const ratePerWei = RATE_TOKENS_PER_ETH; // because tokensPerWei = tokensPerETH / 1e18 * 1e18 = tokensPerETH

  // Caps (ETH -> wei)
  const SOFT_CAP_ETH = "50";
  const HARD_CAP_ETH = "250";
  const MIN_BUY_ETH  = "0.01";
  const MAX_BUY_ETH  = "5";

  const softCapWei = ethers.parseEther(SOFT_CAP_ETH);
  const hardCapWei = ethers.parseEther(HARD_CAP_ETH);
  const minBuyWei  = ethers.parseEther(MIN_BUY_ETH);
  const maxBuyWei  = ethers.parseEther(MAX_BUY_ETH);

  // Skim percent (basis points). 300 = 3%
  const skimBps = 300;

  // Times: start in ~10 minutes, end in 7 days
  const now = Math.floor(Date.now() / 1000);
  const start = BigInt(now + 10 * 60);
  const end   = BigInt(now + 7 * 24 * 60 * 60);

  // Token amount to pre-load into presale: hardCap * rate
  // 250 ETH * 100,000 tokens/ETH = 25,000,000 tokens (with 18 decimals)
  const TOKENS_TO_MINT = ethers.parseUnits("25000000", 18);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // (Optional safety echo)
  console.log("\nDeploying Presale V2 (skim) with params:");
  console.log({
    TOKEN_ADDRESS,
    TREASURY,
    RATE_TOKENS_PER_ETH: RATE_TOKENS_PER_ETH.toString(),
    SOFT_CAP_ETH,
    HARD_CAP_ETH,
    MIN_BUY_ETH,
    MAX_BUY_ETH,
    skimBps,
    start: start.toString(),
    end: end.toString(),
    network: network.name,
  });

  // --- Deploy ---
  const Presale = await ethers.getContractFactory("LuminaCorePresaleV2_Skim");
  const presale = await Presale.deploy(
    TOKEN_ADDRESS,
    TREASURY,
    start,
    end,
    ratePerWei,        // tokens per wei (100000)
    softCapWei,
    hardCapWei,
    minBuyWei,
    maxBuyWei,
    skimBps
  );

  await presale.waitForDeployment();
  const presaleAddr = await presale.getAddress();
  const txHash = presale.deploymentTransaction()?.hash;
  console.log(`\n✅ Presale deployed at: ${presaleAddr}`);
  if (txHash) console.log(`   Tx: ${txHash}`);

  // --- Post-deploy wiring on the token ---
  // Minimal ABI for your UniqueToken
  const tokenAbi = [
    "function setFeeExempt(address account, bool exempt) external",
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address a) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ];
  const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, deployer);

  // 1) Exempt presale from token transfer fees (your token supports this)
  const tx1 = await token.setFeeExempt(presaleAddr, true);
  await tx1.wait();
  console.log("✅ setFeeExempt(presale, true)");

  // 2) Mint tokens to presale (exact hardCap*rate = 25,000,000)
  const tx2 = await token.mint(presaleAddr, TOKENS_TO_MINT);
  await tx2.wait();
  const bal = await token.balanceOf(presaleAddr);
  console.log(`✅ Minted ${ethers.formatUnits(bal, 18)} tokens to presale`);

  // --- Verify (if key present) ---
  try {
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\nVerifying on explorer…");
      await run("verify:verify", {
        address: presaleAddr,
        constructorArguments: [
          TOKEN_ADDRESS,
          TREASURY,
          start,
          end,
          ratePerWei,
          softCapWei,
          hardCapWei,
          minBuyWei,
          maxBuyWei,
          skimBps,
        ],
        contract: "contracts/LuminaCorePresaleV2_Skim.sol:LuminaCorePresaleV2_Skim",
      });
      console.log("✅ Verified");
    } else {
      console.log("\n(ℹ️ Set ETHERSCAN_API_KEY in .env to auto-verify)");
    }
  } catch (e:any) {
    console.log("⚠️ Verify step skipped or failed:", e.message ?? e);
  }

  console.log("\nAll done.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
