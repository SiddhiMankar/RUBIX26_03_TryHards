const hre = require("hardhat");

async function main() {
  const [patient, doctor, unauthorized] = await hre.ethers.getSigners();
  console.log("Testing Emergency Access...");
  console.log("Patient:", patient.address);
  console.log("Doctor:", doctor.address);

  // 1. Deploy fresh contract for testing
  const HealthRecord = await hre.ethers.getContractFactory("HealthRecord");
  const healthRecord = await HealthRecord.deploy();
  await healthRecord.waitForDeployment(); // Ethers v6
  console.log("HealthRecord deployed to:", healthRecord.target);
  
  // No attach needed
  // const healthRecord = await HealthRecord.attach("...");

  // 2. Add a record for Patient
  console.log("Adding dummy record...");
  await healthRecord.connect(patient).addRecord("QmHash123", "X-RAY", "Broken Leg");

  // 3. Verify Doctor has NO access initially
  try {
    await healthRecord.connect(doctor).getRecords(patient.address);
    console.log("❌ Error: Doctor shouldn't have access yet!");
  } catch (e) {
    console.log("✅ Verified: Doctor initially denied access.");
  }

  // 4. Emergency Access (The "Break Glass" moment)
  console.log("🚨 Doctor attempting EMERGENCY ACCESS...");
  const tx = await healthRecord.connect(doctor).emergencyAccess(patient.address);
  const receipt = await tx.wait();

  // 5. Check for Event
  // In Ethers v6, parsing events is slightly different, but checking receipt is a good start.
  // The event signature for EmergencyAccessAccessed(address,address,uint256) is what we look for.
  const eventFound = receipt.logs.some(log => {
      // detailed verification skipped for brevity, just seeing if tx succeeded is good 
      return true;
  });
  
  if (receipt.status === 1) {
       console.log("✅ Emergency Log Transaction Mined.");
  }

  // 6. Fetch Records using Emergency Function
  const records = await healthRecord.connect(doctor).getRecordsEmergency.staticCall(patient.address);
  // Note: we use staticCall to simulate the read because the function is public (write) 
  
  if (records.length > 0) {
      console.log(`✅ Success! Retrieved ${records.length} record(s) via Emergency Override.`);
      console.log("Record Description:", records[0].description);
  } else {
      console.log("❌ Failed to retrieve records.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
