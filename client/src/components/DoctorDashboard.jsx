import React, { useState } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';

const DoctorDashboard = () => {
    const { healthRecordContract, account } = useBlockchain();
    const [patientAddress, setPatientAddress] = useState('');
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setRecords([]);
        
        if (!healthRecordContract || !patientAddress) return;

        setIsLoading(true);
        try {
            // Smart Contract Call: getRecords(patientAddress)
            // This will REVERT if the doctor is not authorized.
            const data = await healthRecordContract.getRecords(patientAddress);
            
            if (data.length === 0) {
                 setError("No records found (or patient has no records).");
            } else {
                 setRecords(data);
            }
        } catch (err) {
            console.error("Error fetching patient records:", err);
            // Check for specific revert reason, mostly it's "Not authorized"
            if (err.message.includes("Not authorized") || err.message.includes("revert")) {
                 setError("ACCESS DENIED: You do not have consent to view this patient's records.");
            } else {
                 setError(`Failed to fetch records. Debug: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmergencyAccess = async () => {
        if (!healthRecordContract || !patientAddress) return;
        setIsLoading(true);
        try {

            // 1. Force the Logging Transaction FIRST (Audit Trail is mandatory)
            console.log("Initiating Emergency Log Transaction...");
            const tx = await healthRecordContract.getRecordsEmergency(patientAddress);
            console.log("Transaction Sent:", tx.hash);
            
            // 2. Wait for it to be mined (Validation)
            await tx.wait();
            console.log("Transaction Mined. Fetching data...");

            // 3. Now fetch the data (using staticCall to simulate the return value)
            const data = await healthRecordContract.getRecordsEmergency.staticCall(patientAddress);
            
            setRecords(data);
            setError('');
            alert("⚠️ EMERGENCY ACCESS LOGGED ON BLOCKCHAIN ⚠️\n\nTransaction Hash: " + tx.hash);
            
        } catch (err) {
            console.error("Emergency Access Failed:", err);
            setError("Emergency Access Failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Patient Access Portal</h2>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Patient Wallet Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg placeholder:text-slate-300 transition-all"
                            value={patientAddress}
                            onChange={(e) => setPatientAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                                isLoading 
                                ? 'bg-slate-100 cursor-not-allowed text-slate-400' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1'
                            }`}
                        >
                            {isLoading ? 'Verifying...' : 'Access Records'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Area */}
            {error && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Standard Error (if not access denied) */}
                    {!error.includes("ACCESS DENIED") && (
                         <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* MODERN EMERGENCY UI (Kept Dark/Red for Contrast/Danger) */}
                    {error.includes("ACCESS DENIED") && (
                        <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-xl">
                            <div className="absolute inset-0 bg-red-50/50"></div>
                            
                            <div className="relative p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* Left Side: Icon & Context */}
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-bold tracking-widest uppercase mb-2">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        Restricted Access Zone
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Access Denied</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                                        You do not have explicit consent to view these medical records. 
                                        Standard access protocols have been blocked by the Smart Contract.
                                    </p>
                                    
                                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-400 font-mono shadow-sm">
                                        Contract Revert: "Authorization Failed" <br/>
                                        Target: {patientAddress}
                                    </div>
                                </div>

                                {/* Right Side: Break Glass Action */}
                                <div className="w-full md:w-auto flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border border-red-100">
                                    <h4 className="text-red-600 font-black uppercase tracking-[0.2em] mb-6 text-sm">Emergency Override</h4>
                                    
                                    <button 
                                        onClick={handleEmergencyAccess}
                                        className="group relative w-24 h-24 rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-xl border-4 border-white active:scale-95 transition-all duration-300 flex items-center justify-center hover:shadow-red-500/40"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </button>

                                    <p className="mt-6 text-[10px] text-red-400 uppercase tracking-widest text-center max-w-[200px]">
                                        <span className="font-bold">Warning:</span> Action permanently recorded on blockchain.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {records.length > 0 && (
                <div>
                     <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="text-slate-800">Authorized Records</span>
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{patientAddress.slice(0,6)}...</span>
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {records.map((record, index) => (
                            <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {record.recordType}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">
                                        {new Date(Number(record.timestamp) * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{record.description}</h4>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                                     <p className="text-xs text-slate-400 font-mono truncate">CID: {record.ipfsHash}</p>
                                </div>
                                <a
                                    href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center bg-white text-slate-600 hover:bg-blue-600 hover:text-white py-3 rounded-lg text-sm font-bold transition-all border border-slate-200 hover:border-blue-600"
                                >
                                    View Document
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
