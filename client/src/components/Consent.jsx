import React, { useState } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';

const Consent = () => {
    const { consentContract } = useBlockchain();
    const [doctorAddress, setDoctorAddress] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGrant = async (e) => {
        e.preventDefault();
        if (!consentContract) return;

        setIsLoading(true);
        try {
            // Default 24 hours validity for now
            const oneDaySeconds = 24 * 60 * 60;
            const tx = await consentContract.giveConsent(
                doctorAddress,
                purpose,
                oneDaySeconds,
                [] // Empty array means ALL record types allowed
            );
            await tx.wait();
            alert("Consent granted successfully!");
            setDoctorAddress('');
            setPurpose('');
        } catch (error) {
            console.error("Error granting consent:", error);
            alert("Failed to grant consent.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevoke = async (e) => {
        e.preventDefault();
        if (!consentContract) return;

        setIsLoading(true);
        try {
            const tx = await consentContract.revokeConsent(doctorAddress);
            await tx.wait();
            alert("Consent revoked successfully!");
            setDoctorAddress('');
        } catch (error) {
            console.error("Error revoking consent:", error);
            alert("Failed to revoke consent.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Grant Access</h3>
                        <p className="text-xs text-slate-500">Authorize a doctor to view your records.</p>
                    </div>
                </div>

                <form onSubmit={handleGrant} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Doctor's Wallet Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono text-sm transition-all"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Purpose of Access</label>
                        <input
                            type="text"
                            placeholder="e.g. Annual Physical Checkup"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-300"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
                            isLoading 
                            ? 'bg-slate-100 cursor-not-allowed text-slate-400' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1'
                        }`}
                    >
                        {isLoading ? 'Processing Blockchain Tx...' : 'Grant Consent'}
                    </button>
                    <p className="text-[10px] text-center text-slate-400">
                        * This action requires a small gas fee (Test ETH).
                    </p>
                </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Revoke Access</h3>
                        <p className="text-xs text-slate-500">Remove a doctor's permission immediately.</p>
                    </div>
                </div>

                <form onSubmit={handleRevoke} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Doctor's Wallet Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 font-mono text-sm transition-all"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                        />
                    </div>
                     <button
                        type="submit"
                        disabled={isLoading || !doctorAddress}
                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
                            isLoading 
                            ? 'bg-slate-100 cursor-not-allowed text-slate-400' 
                            : 'bg-red-600 hover:bg-red-700 text-white hover:-translate-y-1'
                        }`}
                    >
                        {isLoading ? 'Processing Blockchain Tx...' : 'Revoke Consent'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Consent;
