import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

const AssignerPanel = ({ onLogout }) => {
    const [unassignedLeads, setUnassignedLeads] = useState([]);
    const [fos, setFos] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // States to manage per-lead selections
    const [leadRegions, setLeadRegions] = useState({}); // { leadId: region }
    const [assignments, setAssignments] = useState({}); // { leadId: foId }
    // Cache FOs by region to avoid re-fetching
    const [fosByRegion, setFosByRegion] = useState({}); // { region: [fo1, fo2] }

    // Fetch current user from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
        }
    }, []);

    // Fetch all available regions on component mount
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get(`${API_URL.replace('/leads', '/users')}/regions`);
                setRegions(response.data);
            } catch (err) {
                setError('Failed to fetch regions.');
                console.error(err);
            }
        };
        fetchRegions();
    }, []);

    // Fetch unassigned leads
    const fetchUnassignedLeads = useCallback(async (user) => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                params: { 
                    role: 'assigner', // Explicitly set role for this panel
                    assigned: 'false' // Custom param to get unassigned leads
                }
            });
            setUnassignedLeads(response.data);
        } catch (err) {
            setError('Failed to fetch unassigned leads.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchUnassignedLeads(currentUser);
        }
    }, [currentUser, fetchUnassignedLeads]);

    // Handle region selection for a specific lead
    const handleRegionSelection = async (leadId, region) => {
        setLeadRegions(prev => ({ ...prev, [leadId]: region }));
        setAssignments(prev => ({ ...prev, [leadId]: '' })); // Reset FO selection

        if (region && !fosByRegion[region]) {
            // Fetch FOs for this region if not already cached
            try {
                const response = await axios.get(`${API_URL.replace('/leads', '/users')}/fos`, {
                    params: { region }
                });
                setFosByRegion(prev => ({ ...prev, [region]: response.data }));
            } catch (err) {
                setError(`Failed to fetch FOs for ${region}.`);
                console.error(err);
            }
        }
    };

    const handleFoSelection = (leadId, foId) => {
        setAssignments(prev => ({ ...prev, [leadId]: foId }));
    };

    const handleAssignLead = async (leadId) => {
        const region = leadRegions[leadId];
        const foId = assignments[leadId];
        if (!region) {
            alert('Please select a region for the lead.');
            return;
        }
        if (!foId) {
            alert('Please select a Field Officer to assign.');
            return;
        }

        const selectedFo = fosByRegion[region]?.find(fo => fo._id === foId);
        if (!selectedFo) {
            alert('Selected FO not found.');
            return;
        }

        try {
            const payload = {
                assignedFOId: selectedFo._id,
                assignedFO: selectedFo.fullName,
                assignedFOPhone: selectedFo.phoneNumber, // Assuming FO has a phone number
                region: selectedFo.region,
                zone: selectedFo.zone, // Assuming FO has a zone
            };

            await axios.put(`${API_URL}/${leadId}`, payload);
            alert(`Lead successfully assigned to ${selectedFo.fullName}.`);
            // Refresh the list of unassigned leads
            fetchUnassignedLeads(currentUser);
        } catch (err) {
            setError('Failed to assign lead.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Assigner Panel</h1>
                    <div>
                        <span className="mr-4">Welcome, {currentUser?.fullName || 'Assigner'}</span>
                        <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

                {loading ? (
                    <p>Loading leads...</p>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <ul className="divide-y divide-gray-200">
                            {unassignedLeads.length > 0 ? unassignedLeads.map(lead => (
                                <li key={lead._id} className="p-4 hover:bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex-1 mb-4 md:mb-0">
                                            <p className="text-lg font-bold text-indigo-600">{lead.fullName}</p>
                                            <p className="text-sm text-gray-600">Email: {lead.email || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Location: {lead.permanentLocation || 'N/A'}</p>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                            {/* Per-Lead Region Dropdown */}
                                            <select
                                                value={leadRegions[lead._id] || ''}
                                                onChange={(e) => handleRegionSelection(lead._id, e.target.value)}
                                                className="p-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">Select Region</option>
                                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>

                                            {/* Per-Lead FO Dropdown */}
                                            <select
                                                value={assignments[lead._id] || ''}
                                                onChange={(e) => handleFoSelection(lead._id, e.target.value)}
                                                disabled={!leadRegions[lead._id]}
                                                className="p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                                            >
                                                <option value="">{leadRegions[lead._id] ? 'Select FO' : 'Select Region First'}</option>
                                                {(fosByRegion[leadRegions[lead._id]] || []).map(fo => <option key={fo._id} value={fo._id}>{fo.fullName}</option>)}
                                            </select>

                                            <button
                                                onClick={() => handleAssignLead(lead._id)}
                                                disabled={!assignments[lead._id]}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            )) : (
                                <li className="p-4 text-center text-gray-500">No unassigned leads found.</li>
                            )}
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AssignerPanel;