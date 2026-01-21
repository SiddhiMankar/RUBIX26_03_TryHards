const fs = require('fs');
const path = require('path');

const artifactsDir = path.join(__dirname, 'smart-contracts', 'artifacts', 'contracts');
const clientAbiDir = path.join(__dirname, 'client', 'src', 'abis');

if (!fs.existsSync(clientAbiDir)) {
    fs.mkdirSync(clientAbiDir, { recursive: true });
}

// Copy HealthRecord.json
const hrSource = path.join(artifactsDir, 'HealthRecord.sol', 'HealthRecord.json');
const hrDest = path.join(clientAbiDir, 'HealthRecord.json');
fs.copyFileSync(hrSource, hrDest);
console.log(`Copied: ${hrSource} -> ${hrDest}`);

// Copy Consent.json
const consentSource = path.join(artifactsDir, 'Consent.sol', 'Consent.json');
const consentDest = path.join(clientAbiDir, 'Consent.json');
fs.copyFileSync(consentSource, consentDest);
console.log(`Copied: ${consentSource} -> ${consentDest}`);
