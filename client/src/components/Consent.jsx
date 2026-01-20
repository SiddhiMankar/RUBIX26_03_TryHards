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
        <div className="max-w-2xl mx-auto">
             <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">Grant Access</h3>
                <form onSubmit={handleGrant} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Doctor's Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Purpose</label>
                        <input
                            type="text"
                            placeholder="e.g. General Checkup"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                            isLoading 
                            ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/20'
                        }`}
                    >
                        {isLoading ? 'Processing...' : 'Grant Consent'}
                    </button>
                </form>
            </div>

            <div className="bg-slate-800/40 p-6 rounded-xl border border-red-900/30">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Revoke Access</h3>
                <form onSubmit={handleRevoke} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Doctor's Address</label>
                        <input
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 font-mono text-sm"
                            value={doctorAddress}
                            onChange={(e) => setDoctorAddress(e.target.value)}
                        />
                    </div>
                     <button
                        type="submit"
                        disabled={isLoading || !doctorAddress}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                            isLoading 
                            ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/20'
                        }`}
                    >
                        {isLoading ? 'Processing...' : 'Revoke Consent'}
                    </button>
                    <p className="text-xs text-slate-500 mt-2">
                        * Revoking consent will immediately block access to all your records for this doctor.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Consent;
