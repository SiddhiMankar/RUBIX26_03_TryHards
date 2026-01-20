import React, { useState } from 'react';
import Records from './Records';
import Consent from './Consent';
import QRCode from 'react-qr-code';
import { useBlockchain } from '../contexts/BlockchainContext';

const PatientDashboard = () => {
    const { account } = useBlockchain();
    const [activeTab, setActiveTab] = useState('records');
    const [showQR, setShowQR] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`px-6 py-3 font-medium text-sm transition-all relative ${
                            activeTab === 'records' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        My Records
                        {activeTab === 'records' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-sm"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('consent')}
                        className={`px-6 py-3 font-medium text-sm transition-all relative ${
                            activeTab === 'consent' ? 'text-cyan-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Manage Consent
                        {activeTab === 'consent' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-sm"></div>
                        )}
                    </button>
                </div>
                
                {/* Health Passport QR Toggle */}
                <button 
                    onClick={() => setShowQR(!showQR)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all mb-2 border ${
                        showQR 
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    {showQR ? 'Hide Passport' : 'Show Passport'}
                </button>
            </div>

            {/* QR Code Section (Digital Passport Design - Kept premium dark for contrast) */}
            {showQR && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 flex justify-center py-4">
                    <div className="relative w-full max-w-sm aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] ring-1 ring-slate-900/5">
                        {/* Card Background */}
                        <div className="absolute inset-0 bg-slate-900">
                             <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-purple-500/20"></div>
                             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                             {/* Grid Pattern */}
                             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        </div>

                        {/* Card Content */}
                        <div className="relative h-full p-6 flex flex-col justify-between text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight mb-1">Health Passport</h3>
                                    <p className="text-[10px] text-cyan-200/80 uppercase tracking-widest">Universal Medical ID</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-cyan-400/20 flex items-center justify-center border border-cyan-400/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex gap-6 items-center flex-grow py-2">
                                <div className="bg-white p-2 rounded-lg shadow-inner">
                                    <QRCode value={account || ""} size={100} level="M" />
                                </div>
                                <div className="space-y-3 flex-1">
                                     <div>
                                        <p className="text-[9px] text-slate-400 uppercase">Identity Hash</p>
                                        <p className="font-mono text-[10px] leading-tight text-cyan-100 break-all opacity-80">
                                            {account}
                                        </p>
                                     </div>
                                     <div className="inline-block px-2 py-1 bg-cyan-950/50 rounded border border-cyan-500/30">
                                        <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">VERIFIED PATIENT</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                {activeTab === 'records' ? <Records /> : <Consent />}
            </div>
        </div>
    );
};

export default PatientDashboard;
