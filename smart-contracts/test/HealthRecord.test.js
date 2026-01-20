const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");

describe("HealthRecord", function () {
  async function deployHealthRecordFixture() {
    const [owner, doctor, otherAccount] = await hre.ethers.getSigners();
    const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
    const healthRecord = await HealthRecord.deploy();
    return { healthRecord, owner, doctor, otherAccount };
  }

  describe("Record Management", function () {
    it("Should allow a patient to add a record", async function () {
      const { healthRecord, owner } = await loadFixture(deployHealthRecordFixture);
      
      await healthRecord.addRecord("QmHash123", "X-RAY", "Chest X-Ray");
      
      const records = await healthRecord.getRecords(owner.address);
      expect(records.length).to.equal(1);
      expect(records[0].ipfsHash).to.equal("QmHash123");
      expect(records[0].description).to.equal("Chest X-Ray");
    });
  });

  describe("Access Control", function () {
    it("Should allow authorized doctor to view records", async function () {
      const { healthRecord, owner, doctor } = await loadFixture(deployHealthRecordFixture);
      
      await healthRecord.addRecord("QmHash123", "X-RAY", "Chest X-Ray");
      await healthRecord.grantAccess(doctor.address);
      
      const records = await healthRecord.connect(doctor).getRecords(owner.address);
      expect(records.length).to.equal(1);
    });

    it("Should NOT allow unauthorized doctor to view records", async function () {
      const { healthRecord, owner, otherAccount } = await loadFixture(deployHealthRecordFixture);
      
      await healthRecord.addRecord("QmHash123", "X-RAY", "Chest X-Ray");
      
      await expect(
        healthRecord.connect(otherAccount).getRecords(owner.address)
      ).to.be.revertedWith("Not authorized");
    });
  });
});
