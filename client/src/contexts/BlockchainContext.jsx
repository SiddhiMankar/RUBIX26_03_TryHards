import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import HealthRecordABI from '../abis/HealthRecord.json';
import ConsentABI from '../abis/Consent.json';

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [healthRecordContract, setHealthRecordContract] = useState(null);
  const [consentContract, setConsentContract] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // Stores MongoDB Profile
  const [isLoading, setIsLoading] = useState(true);

  // Addresses from local deployment (Hardcoded for demo)
  const HEALTH_RECORD_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CONSENT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const API_URL = 'http://localhost:5000/api/users'; // Backend URL

  const fetchUserProfile = async (address) => {
    try {
      const res = await fetch(`${API_URL}/${address}`);
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      } else {
        setUserProfile(null); // User not found in DB
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setUserProfile(null);
    }
  };

  const createUserProfile = async (profileData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      setUserProfile(data);
      return data;
    } catch (err) {
      console.error("Failed to create profile:", err);
      throw err;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAccount = accounts[0];
      setAccount(currentAccount);

      // Check Network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log("DEBUG: Detected Chain ID:", chainId);
      
      if (chainId !== '0x7a69') { // 31337
          alert(`WRONG NETWORK DETECTED! ⚠️\n\nExpected: Localhost (31337)\nDetected: ${chainId}\n\nPlease switch MetaMask to 'Localhost 8545'.`);
      }

      // Check Balance
      const balance = await window.ethereum.request({ 
          method: 'eth_getBalance', 
          params: [currentAccount, 'latest'] 
      });
      console.log(`DEBUG: Account ${currentAccount} has balance: ${ethers.formatEther(balance)} ETH`);
      
      if (ethers.formatEther(balance) === "0.0") {
          alert(`⚠️ ZERO ETH DETECTED!\n\nAccount: ${currentAccount}\n\n1. Did you import the correct private key?\n2. Are you connected to Localhost 8545?\n\nCheck the console for more info.`);
      }
      
      // Fetch Profile from MongoDB
      await fetchUserProfile(currentAccount);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const hrContract = new ethers.Contract(HEALTH_RECORD_ADDRESS, HealthRecordABI.abi, signer);
      const cContract = new ethers.Contract(CONSENT_ADDRESS, ConsentABI.abi, signer);
      
      setHealthRecordContract(hrContract);
      setConsentContract(cContract);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
           if (accounts.length > 0) {
              setAccount(accounts[0]);
              // Ideally re-connect everything, but a simple reload ensures clean state
              window.location.reload(); 
           } else {
              setAccount(null);
              setUserProfile(null);
           }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
           window.location.reload();
        });
      }
      setIsLoading(false);
    };
    checkConnection();
  }, []);

  return (
    <BlockchainContext.Provider value={{ 
      account, 
      connectWallet, 
      healthRecordContract, 
      consentContract, 
      userProfile,     // Expose profile to app
      createUserProfile, // Expose update function
      isLoading,
      disconnectWallet: () => {
        setAccount(null);
        setUserProfile(null);
      }
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};
