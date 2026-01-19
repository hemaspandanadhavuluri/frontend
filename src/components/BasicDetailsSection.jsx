import React from 'react';
import { regions, countryPhoneCodes } from '../constants';
import {
    Button,
    TextField,
    Box,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputAdornment,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const BasicDetailsSection = ({ lead, setLead, handleChange, renderTextField, renderSelectField, renderAutocompleteField, indianStates, indianCities }) => {
    const handleMobileNumberChange = (index, value) => {
        const newMobileNumbers = [...lead.mobileNumbers];
        newMobileNumbers[index] = value;
        setLead(p => ({ ...p, mobileNumbers: newMobileNumbers }));
    };

    const addMobileNumber = () => {
        setLead(p => ({ ...p, mobileNumbers: [...p.mobileNumbers, '+91-'] }));
    };

    const removeMobileNumber = (index) => {
        const newMobileNumbers = lead.mobileNumbers.filter((_, i) => i !== index);
        setLead(p => ({ ...p, mobileNumbers: newMobileNumbers }));
    };

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                👤 Basic Details
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                {renderTextField("fullName", "Full Name *", lead.fullName, handleChange)}
                {renderTextField("email", "Email id *", lead.email, handleChange)}
                {!lead._id && (
                    <div className={`field-wrapper field-container`}>
                        <label htmlFor="source" className="field-label">Source</label>
                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={lead.source?.source || ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setLead(prev => ({
                                    ...prev,
                                    source: { ...prev.source, source: newValue }
                                }));
                            }}
                            className="field-input"
                        />
                    </div>
                )}

                {/* Mobile Numbers Section */}
                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '33.33%' }, boxSizing: 'border-box' }}>
                    {lead.mobileNumbers.map((mobile, index) => {
                        const parts = mobile.split('-');
                        const code = parts.length > 1 ? parts[0] : '+91';
                        const num = parts.length > 1 ? parts[1] : mobile;
                        return (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={num || ''}
                                    onChange={(e) => handleMobileNumberChange(index, `${code}-${e.target.value}`)}
                                    placeholder="Enter mobile number"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FormControl variant="standard" sx={{ minWidth: 70 }}>
                                                    <Select
                                                        disableUnderline
                                                        value={code}
                                                        onChange={(e) => handleMobileNumberChange(index, `${e.target.value}-${num || ''}`)}
                                                    >
                                                        {countryPhoneCodes.map(country => <MenuItem key={country.code} value={country.code}>{country.name} ({country.code})</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                {lead.mobileNumbers.length > 1 && (
                                    <IconButton onClick={() => removeMobileNumber(index)} size="small" color="error">
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                )}
                            </Box>
                        );
                    })}
                    <Button startIcon={<AddIcon />} onClick={addMobileNumber} size="small">Add Number</Button>
                </Box>
                {renderAutocompleteField("permanentLocation", "Permanent Location in INDIA", lead.permanentLocation, handleChange, indianCities)}
                {renderSelectField("state", "State", lead.state, handleChange, indianStates)}
                {renderTextField("regionalHead", "Regional Head Name", lead.regionalHead, handleChange)}
                {renderTextField("region", "Region Name", lead.region, handleChange)}
                {renderSelectField("planningToStudy", "Planning to Study in", lead.planningToStudy, handleChange, ['India', 'Abroad'])}
            </Box>
        </>
    );
};

export default BasicDetailsSection;