import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, regions, bankStates, publicBanksIndia, privateBanksIndia } from '../../constants';

const ConnectAssigner = () => {
    const [activeTab, setActiveTab] = useState('counsellor');
    const [counsellors, setCounsellors] = useState([]);
    const [bankExecutives, setBankExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        consultancy: '',
        fullName: '',
        email: ''
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

    // Combine all banks for dropdown
    const allBanks = [...publicBanksIndia, ...privateBanksIndia];

    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === 'counsellor') {
            fetchCounsellors();
        } else {
            fetchBankExecutives();
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
            setFormData({ consultancy: '', fullName: '', email: '', region: '' });
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

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => { setActiveTab('counsellor'); setShowForm(false); setError(''); }}
                        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                            activeTab === 'counsellor'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Leads</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {counsellors.length > 0 ? counsellors.map(counsellor => (
                                            <tr key={counsellor._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{counsellor.consultancy}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.fullName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{counsellor.leadCount}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No counsellors found.</td>
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
            </main>
        </div>
    );
};

export default ConnectAssigner;
