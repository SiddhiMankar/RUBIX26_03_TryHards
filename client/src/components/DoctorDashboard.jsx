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
            // Check for specific revert reason if possible, mostly it's "Not authorized"
            if (err.message.includes("Not authorized")) {
                 setError("ACCESS DENIED: You do not have consent to view this patient's records.");
            } else {
                 setError("Failed to fetch records. Verify address and consent.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-blue-900/30 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Patient Access Portal</h2>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm text-slate-400 mb-2">Patient Wallet Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 font-mono text-lg"
                            value={patientAddress}
                            onChange={(e) => setPatientAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                                isLoading 
                                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1'
                            }`}
                        >
                            {isLoading ? 'Verifying Consent...' : 'Access Records'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Area */}
            {error && (
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl text-red-200 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {records.length > 0 && (
                <div>
                     <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="text-emerald-400">Authorized Records</span>
                        <span className="text-slate-500 text-sm font-normal">for {patientAddress}</span>
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {records.map((record, index) => (
                            <div key={index} className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-blue-500/40 transition-all shadow-md">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-blue-900/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {record.recordType}
                                    </span>
                                    <span className="text-xs text-slate-500 font-mono">
                                        {new Date(Number(record.timestamp) * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-lg text-white mb-2">{record.description}</h4>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 mb-4">
                                     <p className="text-xs text-slate-500 font-mono truncate">CID: {record.ipfsHash}</p>
                                </div>
                                <a
                                    href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white py-3 rounded-lg text-sm font-bold transition-all border border-blue-500/30 hover:border-blue-500"
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
