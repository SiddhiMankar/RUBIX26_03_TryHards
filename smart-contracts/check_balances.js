const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  console.log("Checking balances for local accounts:");
  for (const acc of accounts) {
    const balance = await hre.ethers.provider.getBalance(acc.address);
    console.log(`${acc.address}: ${hre.ethers.formatEther(balance)} ETH`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
