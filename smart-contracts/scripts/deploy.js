const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy HealthRecord
  const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
  const healthRecord = await HealthRecord.deploy();
  await healthRecord.waitForDeployment();
  console.log("HealthRecord deployed to:", await healthRecord.getAddress());

  // Deploy Consent
  const Consent = await hre.ethers.getContractFactory("Consent");
  const consent = await Consent.deploy();
  await consent.waitForDeployment();
  console.log("Consent deployed to:", await consent.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
