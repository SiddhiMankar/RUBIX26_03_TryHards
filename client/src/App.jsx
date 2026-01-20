import React, { useState } from 'react';
import { useBlockchain } from './contexts/BlockchainContext';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';

function App() {
  const { account, connectWallet, userProfile, createUserProfile, isLoading, disconnectWallet } = useBlockchain();
  
  // Registration Form State
  const [regData, setRegData] = useState({ name: '', email: '', role: 'PATIENT' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
      if (account) {
          navigator.clipboard.writeText(account);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
      }
  };

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

  if (isLoading) return <div className="flex items-center justify-center h-screen bg-slate-50 text-cyan-600 font-mono">Loading HealthPass...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Navbar - Clean Medical Style */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-xl">
                 ✚
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">
                HealthPass<span className="text-cyan-600">.io</span>
              </span>
            </div>

            {/* Profile / Connect */}
            <div>
              {account ? (
                <div className="flex items-center gap-4">
                  {/* Identity Badge */}
                  <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold text-slate-700">{userProfile ? userProfile.name : "Guest User"}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                          {userProfile?.role || "Unregistered"}
                      </span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900 pl-4 pr-2 py-2 rounded-full border border-slate-700 hover:border-cyan-500 transition-all group cursor-pointer shadow-lg active:scale-95" onClick={handleCopy}>
                    <div className="flex flex-col items-end mr-1">
                        <span className={`text-[10px] font-bold uppercase leading-none mb-0.5 transition-colors ${isCopied ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isCopied ? 'Copied!' : 'Wallet ID'}
                        </span>
                        <span className="font-mono text-sm text-cyan-400 font-bold tracking-wide group-hover:text-white transition-colors" title={account}>
                            {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                    </div>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-slate-800 ${userProfile?.role === 'DOCTOR' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                        {userProfile?.role === 'DOCTOR' ? 'Dr' : 'Pt'}
                     </div>
                  </div>

                  {/* Logout Button */}
                  <button 
                    onClick={disconnectWallet}
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Disconnect Wallet"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
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
          // LANDING PAGE (Medical Theme)
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-bold mb-6 border border-cyan-100">
                ✨ The Future of Medical Consent
            </div>
            <h1 className="text-6xl font-extrabold mb-6 tracking-tight text-slate-900">
              Your Health, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Your Keys</span>.
            </h1>
            <p className="text-slate-500 max-w-2xl text-xl mb-10 leading-relaxed">
              A secure, patient-centric health exchange powered by Blockchain. 
              Share records instantly with doctors, keep ownership forever.
            </p>
            <div className="flex gap-4">
                <button onClick={connectWallet} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                Connect Wallet
                </button>
                <button className="px-8 py-4 rounded-xl font-bold text-lg text-slate-600 hover:bg-slate-100 transition-all">
                Learn More
                </button>
            </div>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">🛡️</div>
                    <h3 className="font-bold text-lg mb-2">Unhackable Security</h3>
                    <p className="text-slate-500 text-sm">Records are encrypted on IPFS. Access is controlled by immutable smart contracts.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-2xl mb-4">⚡</div>
                    <h3 className="font-bold text-lg mb-2">Instant Sharing</h3>
                    <p className="text-slate-500 text-sm">Grant doctor access in seconds via QR code or wallet address. Revoke anytime.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-2xl mb-4">🆔</div>
                    <h3 className="font-bold text-lg mb-2">Universal ID</h3>
                    <p className="text-slate-500 text-sm">One identity for all hospitals. No more filling out the same forms twice.</p>
                </div>
            </div>
          </div>
        ) : !userProfile ? (
          // REGISTRATION FORM (Medical Theme)
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Setup Profile</h2>
                <p className="text-slate-500 text-sm mt-1">Link your wallet to a standard identity</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                  placeholder="e.g. Alice Smith"
                  value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium text-slate-900 placeholder:text-slate-300" 
                   placeholder="alice@example.com"
                  value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => setRegData({...regData, role: 'PATIENT'})}
                        className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${regData.role === 'PATIENT' ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'}`}
                    >
                        <div className="text-2xl mb-1">🧍</div>
                        <div className="font-bold text-sm">Patient</div>
                    </div>
                    <div 
                        onClick={() => setRegData({...regData, role: 'DOCTOR'})}
                        className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${regData.role === 'DOCTOR' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'}`}
                    >
                        <div className="text-2xl mb-1">🩺</div>
                        <div className="font-bold text-sm">Doctor</div>
                    </div>
                </div>
              </div>
              <button type="submit" disabled={isRegistering} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg mt-6 transition-all">
                {isRegistering ? 'Creating Identity...' : 'Complete Registration'}
              </button>
            </form>
          </div>
        ) : (
          // DASHBOARD WRAPPER
          <div className="space-y-8">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white shadow-md ${userProfile.role === 'DOCTOR' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                        {userProfile.name.charAt(0)}
                   </div>
                   <div>
                       <h2 className="text-xl font-bold text-slate-800">Welcome, {userProfile.name}</h2>
                       <p className="text-sm text-slate-500">Dashboard Panel • <span className="text-slate-400">{new Date().toLocaleDateString()}</span></p>
                   </div>
                </div>
                <div className="flex gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        userProfile.role === 'DOCTOR' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                        {userProfile.role} ACCOUNT
                    </span>
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
