import React, { useState } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';

const Consent = () => {
    const { healthRecordContract } = useBlockchain();
    const [doctorAddress, setDoctorAddress] = useState('');
    const [purpose, setPurpose] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authorizedList, setAuthorizedList] = useState([]);
    const [emergencyLogs, setEmergencyLogs] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const { account } = useBlockchain();

    // Fetch Access History & Emergency Logs
    React.useEffect(() => {
        const fetchHistory = async () => {
             if (!healthRecordContract || !account) return;
             
             setIsLoadingHistory(true);
             try {
                 // 1. Authorized Doctors (Standard Access)
                 const grantFilter = healthRecordContract.filters.AccessGranted(account, null);
                 const revokeFilter = healthRecordContract.filters.AccessRevoked(account, null);
                 
                 // 2. Emergency Access (Audit Trail)
                 const emergencyFilter = healthRecordContract.filters.EmergencyAccessAccessed(null, account);
                 
                 const [grantEvents, revokeEvents, emergencyEvents] = await Promise.all([
                     healthRecordContract.queryFilter(grantFilter),
                     healthRecordContract.queryFilter(revokeFilter),
                     healthRecordContract.queryFilter(emergencyFilter)
                 ]);
                 
                 // --- Process Standard Access ---
                 const accessMap = new Map(); 
                 grantEvents.forEach(event => {
                     const doctor = event.args[1];
                     if (!accessMap.has(doctor)) {
                        accessMap.set(doctor, { status: 'GRANTED', block: event.blockNumber });
                     } else if (event.blockNumber > accessMap.get(doctor).block) {
                        accessMap.set(doctor, { status: 'GRANTED', block: event.blockNumber });
                     }
                 });
                 revokeEvents.forEach(event => {
                     const doctor = event.args[1];
                     if (!accessMap.has(doctor)) {
                         accessMap.set(doctor, { status: 'REVOKED', block: event.blockNumber });
                     } else if (event.blockNumber > accessMap.get(doctor).block) {
                         accessMap.set(doctor, { status: 'REVOKED', block: event.blockNumber });
                     }
                 });
                 const activeDoctors = [];
                 accessMap.forEach((value, key) => {
                     if (value.status === 'GRANTED') activeDoctors.push(key);
                 });
                 setAuthorizedList(activeDoctors);

                 // --- Process Emergency Logs ---
                 const logs = await Promise.all(emergencyEvents.map(async (event) => {
                     const block = await event.getBlock();
                     return {
                         doctor: event.args[0],
                         timestamp: new Date(Number(event.args[2]) * 1000).toLocaleString(), // Use event timestamp
                         blockTimestamp: new Date(block.timestamp * 1000).toLocaleString(), // Fallback/Verify
                         txHash: event.transactionHash
                     };
                 }));
                 // Sort newest first
                 setEmergencyLogs(logs.reverse());
                 
             } catch (err) {
                 console.error("Error fetching history:", err);
             } finally {
                 setIsLoadingHistory(false);
             }
        };
        
        fetchHistory();
        
        // Listeners
        const onGrant = (patient, doctor) => {
            if (patient.toLowerCase() === account.toLowerCase()) {
                setAuthorizedList(prev => {
                    if (!prev.includes(doctor)) return [...prev, doctor];
                    return prev;
                });
            }
        };
        const onRevoke = (patient, doctor) => {
             if (patient.toLowerCase() === account.toLowerCase()) {
                setAuthorizedList(prev => prev.filter(d => d !== doctor));
            }
        };
        const onEmergency = (doctor, patient, timestamp) => {
            if (patient.toLowerCase() === account.toLowerCase()) {
                setEmergencyLogs(prev => [{
                    doctor,
                    timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
                    txHash: "Recent" 
                }, ...prev]);
            }
        };
        
        healthRecordContract.on("AccessGranted", onGrant);
        healthRecordContract.on("AccessRevoked", onRevoke);
        healthRecordContract.on("EmergencyAccessAccessed", onEmergency);
        
        return () => {
            healthRecordContract.off("AccessGranted", onGrant);
            healthRecordContract.off("AccessRevoked", onRevoke);
            healthRecordContract.off("EmergencyAccessAccessed", onEmergency);
        };
        
    }, [healthRecordContract, account]);

    const handleGrant = async (e) => {
        e.preventDefault();
        if (!healthRecordContract) return;

        setIsLoading(true);
        try {
            // Updated to use the HealthRecord contract's native access control
            // ignoring 'purpose' var for simple access (it's just UI metadata now)
            const tx = await healthRecordContract.grantAccess(doctorAddress);
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
        if (!healthRecordContract) return;

        setIsLoading(true);
        try {
            const tx = await healthRecordContract.revokeAccess(doctorAddress);
            await tx.wait();
            alert("Consent revoked successfully!");
            setDoctorAddress('');
            setVerificationStatus(null);
        } catch (error) {
            console.error("Error revoking consent:", error);
            alert("Failed to revoke consent.");
        } finally {
            setIsLoading(false);
        }
    };

    const [verificationStatus, setVerificationStatus] = useState(null);

    const checkStatus = async () => {
        if (!healthRecordContract || !doctorAddress || !account) return;
        try {
            // Check public mapping: authorizedDoctors(patient, doctor)
            const isAuthorized = await healthRecordContract.authorizedDoctors(account, doctorAddress);
            setVerificationStatus(isAuthorized ? "✅ ACTIVE" : "❌ INACTIVE");
        } catch (err) {
            console.error("Check failed", err);
            setVerificationStatus("❓ ERROR");
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
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="0x..."
                                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-mono text-sm transition-all"
                                value={doctorAddress}
                                onChange={(e) => setDoctorAddress(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={checkStatus}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 rounded-xl text-xs font-bold uppercase transition-colors"
                            >
                                Verify
                            </button>
                        </div>
                    </div>

                    {verificationStatus && (
                        <div className={`text-center p-3 rounded-xl font-mono text-sm font-bold ${verificationStatus.includes("ACTIVE") ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                            Blockchain Status: {verificationStatus}
                        </div>
                    )}
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

            {/* Access History Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Authorized Doctors</h3>
                        <p className="text-xs text-slate-500">History of active permissions granted.</p>
                    </div>
                </div>

                {isLoadingHistory ? (
                     <div className="text-center py-8 text-slate-500 italic text-sm">Loading access history...</div>
                ) : authorizedList.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No active doctor permissions found.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {authorizedList.map((addr, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                        Dr
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-slate-600 truncate w-48 md:w-auto">{addr}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setDoctorAddress(addr);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-xs font-bold text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-4"
                                >
                                    Manage
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Emergency Access Log (Audit Trail) */}
            <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                
                <div className="flex items-center gap-3 mb-6 relative">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Emergency Access Log</h3>
                        <p className="text-xs text-red-600 font-bold uppercase tracking-wide">Audit Trail: Mandatory Reporting</p>
                    </div>
                </div>

                {isLoadingHistory ? (
                     <div className="text-center py-8 text-slate-500 italic text-sm">Loading audit logs...</div>
                ) : emergencyLogs.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic text-sm bg-white/50 rounded-xl border border-dashed border-slate-200">
                        No emergency overrides detected.
                    </div>
                ) : (
                    <div className="space-y-3 relative">
                        {emergencyLogs.map((log, index) => (
                            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-xl border border-red-100 shadow-sm group hover:shadow-md transition-all">
                                <div className="flex items-start gap-4 mb-3 md:mb-0">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold text-xs mt-1">
                                        !
                                    </div>
                                    <div>
                                        <p className="font-mono text-xs text-slate-600 break-all">{log.doctor}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                                                EMERGENCY OVERRIDE
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-700">{log.timestamp}</p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Tx: {log.txHash.substring(0, 10)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Consent;
