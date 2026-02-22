import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, regions, bankStates } from '../../constants';

const ConnectAssigner = () => {
    const [activeTab, setActiveTab] = useState('counsellor');
    const [counsellors, setCounsellors] = useState([]);
    const [bankExecutives, setBankExecutives] = useState([]);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        consultancy: '',
        fullName: '',
        email: '',
        phoneNumber: ''
    });
    const [bankExecutiveFormData, setBankExecutiveFormData] = useState({
        bankName: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        region: '',
        branch: '',
        empId: ''
    });
    
    // Bank management state
    const [showAddBankModal, setShowAddBankModal] = useState(false);
    const [showAddRMModal, setShowAddRMModal] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null);
    const [newBankData, setNewBankData] = useState({ name: '', type: 'public' });
    const [bankError, setBankError] = useState(''); // Local error for bank modal
    const [newRMData, setNewRMData] = useState({ name: '', email: '', phoneNumber: '', region: '', branch: '', empId: '' });
    const [expandedBankId, setExpandedBankId] = useState(null);

    // Combine all banks for dropdown (static + DB banks)
    const dbBankNames = banks.map(b => b.name);
    const allBanks = [...dbBankNames];

    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === 'counsellor') {
            fetchCounsellors();
        } else if (activeTab === 'bank-executive') {
            fetchBankExecutives();
            fetchBanks(); // Also fetch banks for the dropdown
        } else if (activeTab === 'banks') {
            fetchBanks();
        }
    }, [activeTab]);

    const fetchCounsellors = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL.replace('/leads', '/users')}/counsellors`);
            setCounsellors(response.data);
        } catch (err) {
            setError('Failed to fetch counsellors.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBankExecutives = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL.replace('/leads', '/users')}/bank-executives`);
            setBankExecutives(response.data);
        } catch (err) {
            setError('Failed to fetch bank executives.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Bank API URL - banks are at /api/banks not /api/leads/banks
    const BANK_API_URL = 'https://justtapcapital.com/api/banks';

    const fetchBanks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(BANK_API_URL);
            setBanks(response.data);
        } catch (err) {
            setError('Failed to fetch banks.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Bank management functions
    const handleAddBank = async (e) => {
        e.preventDefault();
        setBankError(''); // Clear previous errors
        try {
            await axios.post(BANK_API_URL, newBankData);
            alert('Bank added successfully.');
            setShowAddBankModal(false);
            setNewBankData({ name: '', type: 'public' });
            fetchBanks();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to add bank.';
            setBankError(errorMessage);
            console.error(err);
        }
    };

    const handleDeleteBank = async (bankId) => {
        if (window.confirm('Are you sure you want to delete this bank?')) {
            try {
                await axios.delete(`${BANK_API_URL}/${bankId}`);
                alert('Bank deleted successfully.');
                fetchBanks();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete bank.');
                console.error(err);
            }
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBankExecutiveInputChange = (e) => {
        const { name, value } = e.target;
        setBankExecutiveFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL.replace('/leads', '/users')}/counsellors`, formData);
            alert('Counsellor added successfully.');
            setFormData({ consultancy: '', fullName: '', email: '', phoneNumber: '', region: '' });
            setShowForm(false);
            fetchCounsellors();
        } catch (err) {
            setError('Failed to add counsellor.');
            console.error(err);
        }
    };

    const handleBankExecutiveSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL.replace('/leads', '/users')}/bank-executives`, bankExecutiveFormData);
            alert('Bank executive added successfully.');
            setBankExecutiveFormData({ bankName: '', fullName: '', email: '', phoneNumber: '', region: '', branch: '', empId: '' });
            setShowForm(false);
            fetchBankExecutives();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add bank executive.');
            console.error(err);
        }
    };

    // Group banks by type
    const publicBanks = banks.filter(bank => bank.type === 'public');
    const privateBanks = banks.filter(bank => bank.type === 'private');
    const nbfcBanks = banks.filter(bank => bank.type === 'nbfc');

    const renderBankSection = (title, bankList) => {
        if (bankList.length === 0) return null;
        
        return (
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{title} ({bankList.length})</h3>
                <div className="space-y-3">
                    {bankList.map(bank => (
                        <div key={bank._id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{bank.name}</h4>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDeleteBank(bank._id)}
                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#360d4c' }}>
            <main className="w-4/5 mx-auto py-8">
                {/* Tabs */}
                <div className="flex border-b mb-X" style={{borderColor:'#512967'}}>
                    <button
                         onClick={() => { setActiveTab('counsellor'); setShowForm(false); setError(''); }}
                         style={{
                             backgroundColor:activeTab==='counsellor'?'#bd6a4c':'#512967',
                             color:'white',
                             marginRight:'X'}
                         }
                         className={` px-X py-X font-medium text-sm rounded-t-lg`}
                    >
                        Counsellors
                    </button>
                    <button
                        onClick={() => { setActiveTab('bank-executive'); setShowForm(false); setError(''); }}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg ml-2 ${
                            activeTab === 'bank-executive'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Bank Executives
                    </button>
                    <button
                        onClick={() => { setActiveTab('banks'); setShowForm(false); setError(''); setExpandedBankId(null); }}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg ml-2 ${
                            activeTab === 'banks'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Banks
                    </button>
                </div>

                {/* Counsellor Tab Content */}
                {activeTab === 'counsellor' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Connect Counsellors</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {showForm ? 'Cancel' : 'Add Counsellor'}
                            </button>
                        </div>

                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

                        {showForm && (
                            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Add New Counsellor</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Consultancy Name</label>
                                        <input
                                            type="text"
                                            name="consultancy"
                                            value={formData.consultancy}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Counsellor Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Counsellor Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Region</label>
                                        <select
                                            name="region"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select Region</option>
                                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Add Counsellor
                                    </button>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <p>Loading counsellors...</p>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consultancy</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counsellor Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counsellor Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Leads</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {counsellors.length > 0 ? counsellors.map(counsellor => (
                                            <tr key={counsellor._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{counsellor.consultancy}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.fullName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.phoneNumber || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.leadCount}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No counsellors found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Bank Executive Tab Content */}
                {activeTab === 'bank-executive' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Connect Bank Executives</h2>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {showForm ? 'Cancel' : 'Add Bank Executive'}
                            </button>
                        </div>

                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

                        {showForm && (
                            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Add New Bank Executive</h3>
                                <form onSubmit={handleBankExecutiveSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                        <select
                                            name="bankName"
                                            value={bankExecutiveFormData.bankName}
                                            onChange={handleBankExecutiveInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select Bank</option>
                                            {allBanks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State / Region</label>
                                        <select
                                            name="region"
                                            value={bankExecutiveFormData.region}
                                            onChange={handleBankExecutiveInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">Select State</option>
                                            {bankStates.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Executive Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={bankExecutiveFormData.fullName}
                                            onChange={handleBankExecutiveInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={bankExecutiveFormData.email}
                                            onChange={handleBankExecutiveInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={bankExecutiveFormData.phoneNumber}
                                            onChange={handleBankExecutiveInputChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Branch</label>
                                        <input
                                            type="text"
                                            name="branch"
                                            value={bankExecutiveFormData.branch}
                                            onChange={handleBankExecutiveInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                                        <input
                                            type="text"
                                            name="empId"
                                            value={bankExecutiveFormData.empId}
                                            onChange={handleBankExecutiveInputChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Add Bank Executive
                                    </button>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <p>Loading bank executives...</p>
                        ) : (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executive Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bankExecutives.length > 0 ? bankExecutives.map((executive, index) => (
                                            <tr key={`${executive._id}-${index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{executive.bankName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.region}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.phoneNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.branch || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{executive.empId || '-'}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No bank executives found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Banks Tab Content */}
                {activeTab === 'banks' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Manage Banks</h2>
                            <button
                                onClick={() => {
                                    setShowAddBankModal(true);
                                    setError('');
                                    setBankError('');
                                    setNewBankData({ name: '', type: 'public' });
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                + Add Bank
                            </button>
                        </div>

                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

                        {loading ? (
                            <p>Loading banks...</p>
                        ) : (
                            <>
                                {renderBankSection('Public Banks', publicBanks)}
                                {renderBankSection('Private Banks', privateBanks)}
                                {renderBankSection('NBFC Banks', nbfcBanks)}
                                {banks.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No banks found. Click "Add Bank" to add your first bank.
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Add Bank Modal */}
                {showAddBankModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Add New Bank</h3>
                            {bankError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {bankError}
                                </div>
                            )}
                            <form onSubmit={handleAddBank} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                    <input
                                        type="text"
                                        value={newBankData.name}
                                        onChange={(e) => setNewBankData({ ...newBankData, name: e.target.value })}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter bank name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bank Type</label>
                                    <select
                                        value={newBankData.type}
                                        onChange={(e) => setNewBankData({ ...newBankData, type: e.target.value })}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="public">Public Bank</option>
                                        <option value="private">Private Bank</option>
                                        <option value="nbfc">NBFC</option>
                                    </select>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        Add Bank
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddBankModal(false);
                                            setBankError('');
                                            setNewBankData({ name: '', type: 'public' });
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ConnectAssigner;
