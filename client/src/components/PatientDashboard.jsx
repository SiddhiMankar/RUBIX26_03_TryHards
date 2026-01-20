import React, { useState } from 'react';
import Records from './Records';
import Consent from './Consent';

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState('records');

    return (
        <div className="space-y-8">
            <div className="flex gap-4 border-b border-slate-800 pb-1">
                <button
                    onClick={() => setActiveTab('records')}
                    className={`px-6 py-3 font-medium text-sm transition-all relative ${
                        activeTab === 'records' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    My Records
                    {activeTab === 'records' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('consent')}
                    className={`px-6 py-3 font-medium text-sm transition-all relative ${
                        activeTab === 'consent' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    Manage Consent
                    {activeTab === 'consent' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                    )}
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                {activeTab === 'records' ? <Records /> : <Consent />}
            </div>
        </div>
    );
};

export default PatientDashboard;
