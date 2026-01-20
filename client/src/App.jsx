import React, { useState } from 'react';
import { useBlockchain } from './contexts/BlockchainContext';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';

function App() {
  const { account, connectWallet, userProfile, createUserProfile, isLoading } = useBlockchain();
  
  // Registration Form State
  const [regData, setRegData] = useState({ name: '', email: '', role: 'PATIENT' });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!account) return;
    setIsRegistering(true);
    try {
      await createUserProfile({
        address: account,
        ...regData
      });
    } catch (err) {
      alert("Registration failed!");
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-slate-900 text-cyan-400 font-mono">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-cyan-900/30 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)]"></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                HealthPass<span className="text-cyan-400">.io</span>
              </span>
            </div>
            <div>
              {account ? (
                <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${userProfile?.role === 'DOCTOR' ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                  <span className="font-mono text-sm text-slate-300">
                     {userProfile ? userProfile.name : "Guest"} ({account.slice(0, 4)}...{account.slice(-4)})
                  </span>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 rounded-lg font-semibold transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!account ? (
          // LANDING PAGE
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
              Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Health Records</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-lg mb-10 leading-relaxed">
              Securely store generic medical files on IPFS and manage doctor access via smart contracts. You own your data.
            </p>
            <button onClick={connectWallet} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_4px_20px_rgba(6,182,212,0.4)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1">
              Get Started
            </button>
          </div>
        ) : !userProfile ? (
          // REGISTRATION FORM
          <div className="max-w-md mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2" 
                  value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2" 
                  value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">I am a...</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
                  value={regData.role} onChange={e => setRegData({...regData, role: e.target.value})}>
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                </select>
              </div>
              <button type="submit" disabled={isRegistering} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-lg mt-4">
                {isRegistering ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </form>
          </div>
        ) : (
          // DASHBOARD (ROLE BASED)
          <div className="space-y-8">
             <div className="bg-slate-800/30 p-4 rounded-xl border border-dashed border-slate-700 flex justify-between items-center">
                <div>
                   <h2 className="text-xl font-semibold">Welcome, {userProfile.name}</h2>
                   <p className="text-sm text-slate-400">Role: <span className={`font-bold ${userProfile.role === 'DOCTOR' ? 'text-blue-400' : 'text-emerald-400'}`}>{userProfile.role}</span></p>
                </div>
             </div>

             {/* RENDER DASHBOARD COMPONENT BASED ON ROLE */}
             {userProfile.role === 'PATIENT' ? <PatientDashboard /> : <DoctorDashboard />}

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
