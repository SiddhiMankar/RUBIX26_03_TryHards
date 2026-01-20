import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { uploadToIPFS } from '../utils/pinata';

const Records = () => {
    const { healthRecordContract, account } = useBlockchain();
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        recordType: 'GENERAL',
        file: null
    });

    const fetchRecords = async () => {
        if (!healthRecordContract || !account) return;
        setIsLoading(true);
        try {
            // Fetch records for the connected user
            const data = await healthRecordContract.getRecords(account);
            setRecords(data);
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [healthRecordContract, account]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file || !healthRecordContract) return;

        setUploading(true);
        try {
            // 1. Upload to IPFS via Pinata
            const ipfsHash = await uploadToIPFS(formData.file);
            console.log("Uploaded to IPFS:", ipfsHash);

            // 2. Add to Blockchain
            const tx = await healthRecordContract.addRecord(
                ipfsHash,
                formData.recordType,
                formData.description
            );
            await tx.wait();
            
            // 3. Refresh UI
            setFormData({ description: '', recordType: 'GENERAL', file: null });
            fetchRecords();
            alert("Record added successfully!");
        } catch (error) {
            console.error("Error adding record:", error);
            alert("Failed to add record. See console.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Form */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Add New Record</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <input
                                type="text"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Type</label>
                            <select
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                value={formData.recordType}
                                onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                            >
                                <option value="GENERAL">General</option>
                                <option value="X-RAY">X-Ray</option>
                                <option value="LAB">Lab Report</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">File</label>
                        <input
                            type="file"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:outline-none focus:border-cyan-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/20 file:text-cyan-400 hover:file:bg-cyan-900/40"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                            uploading 
                            ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                            : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg hover:shadow-cyan-500/20'
                        }`}
                    >
                        {uploading ? 'Uploading to IPFS & Blockchain...' : 'Upload Record'}
                    </button>
                </form>
            </div>

            {/* Records List */}
            <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Your Records</h3>
                {isLoading ? (
                    <p className="text-slate-400">Loading records...</p>
                ) : records.length === 0 ? (
                    <p className="text-slate-500 italic">No records found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {records.map((record, index) => (
                            <div key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-cyan-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-cyan-900/30 text-cyan-400 text-xs font-bold px-2 py-1 rounded uppercase">
                                        {record.recordType}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(Number(record.timestamp) * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-white mb-1">{record.description}</h4>
                                <p className="text-xs text-slate-400 mb-4 truncate">IPFS: {record.ipfsHash}</p>
                                <a
                                    href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    View Document
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Records;
