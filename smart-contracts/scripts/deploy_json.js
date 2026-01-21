const fs = require("fs");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy HealthRecord
  const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
  const healthRecord = await HealthRecord.deploy();
  await healthRecord.waitForDeployment();
  const hrAddress = await healthRecord.getAddress();
  console.log("HealthRecord:", hrAddress);

  // Deploy Consent
  const Consent = await hre.ethers.getContractFactory("Consent");
  const consent = await Consent.deploy();
  await consent.waitForDeployment();
  const consentAddress = await consent.getAddress();
  console.log("Consent:", consentAddress);

  const addresses = {
    HealthRecord: hrAddress,
    Consent: consentAddress
  };

  fs.writeFileSync("deployment.json", JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
