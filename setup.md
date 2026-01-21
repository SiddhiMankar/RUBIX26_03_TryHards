# 🚀 Project Setup Guide

Follow this guide to set up the **TryHards Health Passport** system from scratch.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Git**
3. **MetaMask** Browser Extension
4. **MongoDB** (Local or Atlas URI)

---

## 🏗️ Step 1: Smart Contracts (The Blockchain Layer)

*This strictly runs on a local Hardhat network for development.*

1. **Navigate to directory**:

    ```bash
    cd smart-contracts
    npm install
    ```

2. **Start Local Node** (Terminal 1 - KEEP RUNNING):

    ```bash
    npx hardhat node
    ```

    > **Checkpoint**: You should see a list of 20 accounts with private keys.

3. **Deploy Contracts** (Terminal 2):

    ```bash
    cd smart-contracts
    npx hardhat run scripts/deploy_json.js --network localhost
    ```

    > **Checkpoint**:
    > 1. `deployment.json` is generated in `smart-contracts/`.
    > 2. `copy_abis.js` runs automatically (or run `node ../copy_abis.js` manually) to sync ABIs to the client.

---

## 🦊 Step 2: MetaMask Configuration (CRITICAL)

*Most errors happen here. Follow exactly.*

1. **Add Network**:
    * **Network Name**: Localhost 8545
    * **RPC URL**: `http://127.0.0.1:8545`
    * **Chain ID**: `31337`
    * **Currency**: ETH

2. **Import Account**:
    * Copy a **Private Key** from Terminal 1 (Account #0 or #1).
    * In MetaMask: Click Profile Icon -> **Import Account** -> Paste Key.

    > **Checkpoint**: Your balance MUST be **10,000 ETH**. If it is 0, you are on the wrong network.

3. **Handling "Nonce too high" or Transaction Errors**:
    * If you restart the node, you MUST reset your account.
    * MetaMask -> Settings -> Advanced -> **Clear Activity Tab Data**.

---

## 🛠️ Step 3: Backend (Profile Database)

1. **Navigate to directory**:

    ```bash
    cd server
    npm install
    ```

2. **Configure Environment**:
    * Create a `.env` file in `server/`.
    * Add: `MONGO_URI=your_mongodb_connection_string`

3. **Start Server** (Terminal 2 or 3):

    ```bash
    node server.js
    ```

    > **Checkpoint**: Logs should say `MongoDB Connected` and `Server running on port 5000`.

---

## 💻 Step 4: Frontend (The Application)

1. **Navigate to directory**:

    ```bash
    cd client
    npm install
    ```

2. **Configure Environment**:
    * Create `.env` in `client/`.
    * Add Pinata Keys for IPFS:

        ```env
        VITE_PINATA_API_KEY=your_key
        VITE_PINATA_SECRET_KEY=your_secret
        ```

3. **Start Client** (Terminal 3 or 4):

    ```bash
    npm run dev
    ```

    > **Checkpoint**: Open `http://localhost:5173`. The app should load.

---

## ✅ Final Verification Checklist

* [ ] **Blockchain**: Hardhat node is running (Terminal 1).
* [ ] **Wallet**: MetaMask is on "Localhost 8545" with 10k ETH.
* [ ] **Backend**: Server is running on port 5000.
* [ ] **Frontend**: Connected to Wallet (Address shown in top right).
* [ ] **Contracts**: Deploy script ran successfully and addresses are updated.
