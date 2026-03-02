import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

const BANK_API_URL = 'https://justtapcapital.com/api/banks';

const BanksPage = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBank, setNewBank] = useState({ name: '', type: 'public' });

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            const response = await axios.get(BANK_API_URL);
            setBanks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching banks:', error);
            setLoading(false);
        }
    };

    const handleAddBank = async (e) => {
        e.preventDefault();
        try {
            await axios.post(BANK_API_URL, newBank);
            setShowAddModal(false);
            setNewBank({ name: '', type: 'public' });
            fetchBanks();
        } catch (error) {
            console.error('Error adding bank:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add bank';
            alert(errorMessage);
        }
    };

    const handleDeleteBank = async (bankId) => {
        if (window.confirm('Are you sure you want to delete this bank?')) {
            try {
                await axios.delete(`${BANK_API_URL}/${bankId}`);
                fetchBanks();
            } catch (error) {
                console.error('Error deleting bank:', error);
                alert('Failed to delete bank');
            }
        }
    };

    // Filter banks by type
    const publicBanks = banks.filter(bank => bank.type === 'public');
    const privateBanks = banks.filter(bank => bank.type === 'private');
    const nbfcBanks = banks.filter(bank => bank.type === 'nbfc');

    const renderBankSection = (title, bankList, bgColor) => (
        <div className="bank-section" style={{ marginBottom: '24px' }}>
            <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px',
                color: '#1f2937',
                borderBottom: '2px solid #512967',
                paddingBottom: '8px'
            }}>
                {title}
            </h3>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '16px' 
            }}>
                {bankList.map(bank => (
                    <div key={bank._id} style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontWeight: '600', color: '#111827' }}>{bank.name}</span>
                        <button
                            onClick={() => handleDeleteBank(bank._id)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {bankList.length === 0 && (
                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No banks in this category</p>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px' 
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                    Recommended Banks
                </h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#512967',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    + Add Bank
                </button>
            </div>

            {loading ? (
                <p>Loading banks...</p>
            ) : (
                <>
                    {renderBankSection('Public Banks', publicBanks)}
                    {renderBankSection('Private Banks', privateBanks)}
                    {renderBankSection('NBFCs', nbfcBanks)}
                </>
            )}

            {/* Add Bank Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '8px',
                        width: '400px',
                        maxWidth: '90%'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                            Add New Bank
                        </h3>
                        <form onSubmit={handleAddBank}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    value={newBank.name}
                                    onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                                    Bank Type
                                </label>
                                <select
                                    value={newBank.type}
                                    onChange={(e) => setNewBank({ ...newBank, type: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                    }}
                                >
                                    <option value="public">Public Bank</option>
                                    <option value="private">Private Bank</option>
                                    <option value="nbfc">NBFC</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewBank({ name: '', type: 'public' });
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#6b7280',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#512967',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Add Bank
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BanksPage;
