import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, regions } from '../../constants';

const ConnectAssigner = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        consultancy: '',
        fullName: '',
        email: ''
    });

    // Fetch counsellors on component mount
    useEffect(() => {
        fetchCounsellors();
    }, []);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL.replace('/leads', '/users')}/counsellors`, formData);
            alert('Counsellor added successfully.');
            setFormData({ consultancy: '', fullName: '', email: '', region: '' });
            setShowForm(false);
            fetchCounsellors(); // Refresh the list
        } catch (err) {
            setError('Failed to add counsellor.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
            </main>
        </div>
    );
};

export default ConnectAssigner;
