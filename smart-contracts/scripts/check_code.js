const hre = require("hardhat");

async function main() {
  const address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const code = await hre.ethers.provider.getCode(address);
  console.log("CODE_AT_ADDRESS:", code);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
