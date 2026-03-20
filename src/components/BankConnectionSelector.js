import React, { useState, useEffect } from 'react';
import { getBanksForEmailTemplate } from '../utils/bankConnectionUtils';

const BankConnectionSelector = ({ onBankSelect, onExecutiveSelect, selectedBankType = 'both' }) => {
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [executives, setExecutives] = useState([]);
    const [selectedExecutive, setSelectedExecutive] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBanks();
    }, [selectedBankType]);

    const loadBanks = async () => {
        setLoading(true);
        try {
            const bankData = await getBanksForEmailTemplate(selectedBankType);
            setBanks(bankData);
        } catch (error) {
            console.error('Error loading banks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBankChange = (e) => {
        const bankId = e.target.value;
        setSelectedBank(bankId);
        
        const bank = banks.find(b => b._id === bankId);
        if (bank) {
            setExecutives(bank.executives || []);
            onBankSelect(bank);
        } else {
            setExecutives([]);
        }
        setSelectedExecutive('');
    };

    const handleExecutiveChange = (e) => {
        const executiveId = e.target.value;
        setSelectedExecutive(executiveId);
        
        const executive = executives.find(ex => ex._id === executiveId);
        if (executive) {
            onExecutiveSelect(executive);
        }
    };

    return (
        <div className="bank-connection-selector">
            <div className="form-group">
                <label>Select Bank:</label>
                <select 
                    value={selectedBank} 
                    onChange={handleBankChange}
                    disabled={loading}
                >
                    <option value="">Choose a bank...</option>
                    {banks.map(bank => (
                        <option key={bank._id} value={bank._id}>
                            {bank.name} ({bank.type.toUpperCase()})
                        </option>
                    ))}
                </select>
            </div>

            {executives.length > 0 && (
                <div className="form-group">
                    <label>Select Executive:</label>
                    <select 
                        value={selectedExecutive} 
                        onChange={handleExecutiveChange}
                    >
                        <option value="">Choose an executive...</option>
                        {executives.map(executive => (
                            <option key={executive._id} value={executive._id}>
                                {executive.name} - {executive.email} - {executive.mobile}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading && <div className="loading">Loading banks...</div>}
        </div>
    );
};

export default BankConnectionSelector;