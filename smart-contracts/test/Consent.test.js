
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("Consent", function () {
  async function deployConsentFixture() {
    const [patient, doctor, otherAccount] = await hre.ethers.getSigners();
    const Consent = await hre.ethers.getContractFactory("Consent");
    const consent = await Consent.deploy();
    return { consent, patient, doctor, otherAccount };
  }

  describe("Consent Management", function () {
    it("Should allow a patient to give consent", async function () {
      const { consent, patient, doctor } = await loadFixture(deployConsentFixture);
      
      const oneHour = 3600;
      await consent.giveConsent(doctor.address, "General Checkup", oneHour, []);
      
      const hasConsent = await consent.checkConsent(patient.address, doctor.address, "ANY");
      expect(hasConsent).to.equal(true);
    });

    it("Should NOT allow access without consent", async function () {
      const { consent, patient, otherAccount } = await loadFixture(deployConsentFixture);
      
      const hasConsent = await consent.checkConsent(patient.address, otherAccount.address, "ANY");
      expect(hasConsent).to.equal(false);
    });

    it("Should revoke consent correctly", async function () {
      const { consent, patient, doctor } = await loadFixture(deployConsentFixture);
      
      const oneHour = 3600;
      await consent.giveConsent(doctor.address, "General Checkup", oneHour, []);
      await consent.revokeConsent(doctor.address);
      
      const hasConsent = await consent.checkConsent(patient.address, doctor.address, "ANY");
      expect(hasConsent).to.equal(false);
    });
    
    it("Should expire consent after time", async function () {
      const { consent, patient, doctor } = await loadFixture(deployConsentFixture);
      
      const oneSecond = 1;
      await consent.giveConsent(doctor.address, "General Checkup", oneSecond, []);
      
      // Fast forward time
      await hre.ethers.provider.send("evm_increaseTime", [2]);
      await hre.ethers.provider.send("evm_mine");

      const hasConsent = await consent.checkConsent(patient.address, doctor.address, "ANY");
      expect(hasConsent).to.equal(false);
    });
  });
});
