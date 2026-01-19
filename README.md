# 🏥 Consent-as-Code + Health Passport  
### Secure Patient Health Data Exchange  
Built for **RUBIX'26 Hackathon** — Team *TryHards*

> *UPI for medical data — except the patient is the bank.*

A decentralized health data exchange system that gives patients **true ownership** of their medical records through **programmable consent enforced by smart contracts**. The system enables secure sharing of health data across hospitals, diagnostic labs, emergencies, and insurance providers — without blind trust.

---

## 📑 Table of Contents
- [Brief Description](#brief-description)
- [Tech Stack](#tech-stack)
- [Key Terminologies](#key-terminologies)
- [Problems with Traditional Systems](#problems-with-traditional-systems)
- [How Our System Improves Healthcare Data Exchange](#system-improvements)
- [System Workflow](#system-workflow)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Setup Instructions](#setup-instructions)

---

<a id="brief-description"></a>
## 📌 Brief Description

Traditional healthcare systems store patient data in siloed, centralized databases with limited transparency and weak consent mechanisms. This project introduces **Consent-as-Code**, where access rules are written directly into smart contracts.

Patients control:
- **Who** can access their data  
- **What** data can be accessed  
- **For how long** it can be accessed  

Medical files are stored off-chain using IPFS, while consent logic, access verification, and audit trails are permanently recorded on the blockchain.

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

### Frontend
<p align="left">
  <img src="https://github.com/user-attachments/assets/2ffa59bb-52e2-4ef5-bcbd-2d865b4aeb0e" width="45" />
  
  <img src="https://github.com/user-attachments/assets/5b669a24-1b16-426d-b12b-e3b7fa399110" width="45" />
  
  <img src="https://github.com/user-attachments/assets/25835cbd-013c-4b79-9583-17a1b94c8288" width="45" />
</p>

- React / Next.js  
- MetaMask  
- QR Code Generator & Scanner  

### Blockchain
<p align="left">
  <img src="https://github.com/user-attachments/assets/02028d10-c842-4b62-b1bc-74c8442d18a4" width="45" />
  
  <img src="https://github.com/user-attachments/assets/e549c3b3-1662-4e10-8f34-644ba9d46ef2" width="45" />
</p>

- Ethereum / Polygon Testnet  
- Solidity  
- Hardhat / Remix  


### Storage
<p align="left">
  <img src="https://github.com/user-attachments/assets/ae6c17ac-174a-46b6-82e1-ed03b8ff0ede" width="45" />
</p>

- IPFS (InterPlanetary File System)  

### Backend & Utilities
<p align="left">
  <img src="https://github.com/user-attachments/assets/5e8d636b-ae0e-4dbd-88a8-61afa03c38aa" width="45" />
</p>

- Node.js  
- Ethers.js / Web3.js  

---

<a id="key-terminologies"></a>
## 📘 Key Terminologies

### Blockchain  
Blockchain acts as the **trust backbone** of the system. It is used to store consent rules, access permissions, and audit logs in an immutable and transparent manner. Once an access event or consent rule is recorded on-chain, it **cannot be altered or deleted**, ensuring accountability and preventing unauthorized data tampering.

By removing reliance on a single centralized authority, the blockchain enables **trustless verification**, where hospitals, doctors, patients, and insurers can independently verify the authenticity of records and access events.

### Smart Contracts  
Smart contracts are **self-executing programs deployed on the blockchain** that automatically enforce access rules defined by the patient. Instead of relying on hospital administrators or backend servers to check permissions, smart contracts act as the **final authority** for granting or denying access.

They ensure that:
- Access is granted only if consent conditions are satisfied  
- Every access attempt is logged automatically  
- Emergency access rules are applied consistently  

This eliminates human bias, manual approvals, and the risk of silent misuse.

### IPFS (InterPlanetary File System)  
Medical records such as X-rays, lab reports, and prescriptions are often large in size and unsuitable for direct blockchain storage. IPFS is a **decentralized, content-addressed storage system** used to store these files efficiently.

Only the **IPFS hash (content identifier)** is stored on the blockchain, ensuring:
- Scalability without blockchain bloat  
- Data integrity (any modification changes the hash)  
- Decentralized availability without a single point of failure  

### Consent-as-Code  
Consent-as-Code replaces traditional binary consent models with **programmable, rule-based access control**. Instead of simply allowing or denying access, patients define consent conditions that are enforced directly by smart contracts.

Consent can be restricted by:
- **Time**  
- **Data type**  
- **Purpose**  

These rules cannot be bypassed or silently overridden.

### Health Passport  
The Health Passport is a **QR-based digital identifier** that enables seamless discovery of a patient’s verified medical history across institutions. The QR code does **not contain any medical data**.

---

<a id="problems-with-traditional-systems"></a>
## ❌ Problems with Traditional Systems

- Patient data locked in hospital-specific silos  
- No standardized data sharing across providers  
- Binary consent models  
- No tamper-proof audit logs  
- Emergency access lacks accountability  
- Insurance claim processing is slow and trust-dependent  

---

<a id="system-improvements"></a>
## ✅ How Our System Improves Healthcare Data Exchange

| Traditional Systems | Proposed System |
|---------------------|-----------------|
| Hospital-owned data | Patient-owned data |
| Centralized storage | Decentralized architecture |
| Manual consent | Programmable consent |
| Opaque access | On-chain auditability |
| Blind emergency override | Emergency access with accountability |
| Slow insurance claims | Smart contract–verified claims |

---

<a id="system-workflow"></a>
## ⚙️ System Workflow

1. Patient uploads an encrypted medical record  
2. File is stored on IPFS  
3. IPFS hash and metadata are stored on-chain  
4. Patient grants consent  
5. Doctor requests access  
6. Smart contract validates consent  
7. File is retrieved and decrypted  
8. Access is logged immutably  

Emergency access bypasses consent **but is permanently flagged and auditable**.
The following diagram illustrates the end-to-end flow of data access and consent enforcement:


<img width="180" height="385" alt="0" src="https://github.com/user-attachments/assets/d69e2884-51be-42ed-99e8-9b831a6c1803" />


---

<a id="key-features"></a>
## 🌟 Key Features

### 1️⃣ Consent-as-Code
- Time-limited access  
- Data-scoped access  
- Purpose-bound access  

### 2️⃣ Emergency Access Protocol
- Instant access  
- Mandatory logging  
- Patient notification  
- Audit flags  

### 3️⃣ Health Passport
- Single QR across hospitals  
- Blockchain pointer only  
- Verified history retrieval  

### 4️⃣ Insurance Auto-Trust Layer
- On-chain treatment verification  
- Auto-triggered claims  

### 5️⃣ Human-Readable Audit Logs
- Clear, interpretable access timelines  

---

<a id="screenshots"></a>
## 🖼️ Screenshots

> _Screenshots will be added after final UI integration._

---

<a id="setup-instructions"></a>
## 🚀 Setup Instructions

### Prerequisites
- Node.js  
- MetaMask  
- IPFS node or gateway  

### Steps
```bash
git clone <repo-url>
cd <project-folder>
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npm run dev
