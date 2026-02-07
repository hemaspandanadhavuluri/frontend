import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Button, Typography } from '@mui/material';
import BasicDetailsSection from './sections/BasicDetailsSection';
import { EMPTY_LEAD_STATE, indianStates, indianCitiesWithState, countryPhoneCodes, API_URL } from '../constants';

const CreateNewLeadPage = () => {
    const navigate = useNavigate();
    const [lead, setLead] = useState({
        fullName: '',
        email: '',
        source: '',
        mobileNumbers: ["+91-"],
        permanentLocation: '',
        state: '',
        regionalHead: '',
        region: '',
        planningToStudy: '',
        assignedFOId: '',
        assignedFO: '',
        assignedFOPhone: '',
        sanctionDetails: EMPTY_LEAD_STATE.sanctionDetails,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setLead(prev => ({
                ...prev,
                regionalHead: user.regionalHead || '',
                region: user.region || '',
                assignedFOId: user._id || '',
                assignedFO: user.fullName || '',
                assignedFOPhone: user.mobileNumber || '',
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLead(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        if (!lead.fullName || !lead.email || !lead.source) {
            alert('Please fill in all required fields: Full Name, Email, and Source.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(API_URL, lead);
            alert('Lead created successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error creating lead:', error);
            alert('Failed to create lead. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderTextField = (name, label, value, onChange, widthClass = "field-container", placeholder = "") => (
        <div className={`field-wrapper ${widthClass}`}>
            <label htmlFor={name} className="field-label">{label}</label>
            <input
                type="text"
                id={name}
                name={name}
                placeholder={placeholder}
                value={value !== undefined && value !== null ? value.toString() : ''}
                onChange={onChange}
                className="field-input"
            />
        </div>
    );

    const renderSelectField = (name, label, value, onChange, options, widthClass = "field-container") => (
        <div className={`field-wrapper ${widthClass}`}>
            <label htmlFor={name} className="field-label">{label}</label>
            <select
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                className="field-input"
            >
                <option value="">Select {label}</option>
                {options && options.length > 0 ?
                    options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    )) : (
                    <option value="" disabled>No options available</option>
                )}
            </select>
        </div>
    );

    const renderAutocompleteField = (name, label, value, onChange, options, widthClass = "w-full md:w-1/3") => {
        return (
            <div className={`p-2 ${widthClass}`}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <input
                    type="text"
                    id={`${name}-input`}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type here..."
                />
            </div>
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold', textAlign: 'center' }}>
                Create New Lead
            </Typography>
            <Box sx={{ mt: 3 }}>
                <BasicDetailsSection
                    lead={lead}
                    setLead={setLead}
                    handleChange={handleChange}
                    renderTextField={renderTextField}
                    renderSelectField={renderSelectField}
                    renderAutocompleteField={renderAutocompleteField}
                    indianStates={indianStates}
                    indianCities={indianCitiesWithState}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading}
                        sx={{ mr: 2, px: 4, py: 1.5 }}
                    >
                        {loading ? 'Creating...' : 'Create Lead'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateNewLeadPage;
