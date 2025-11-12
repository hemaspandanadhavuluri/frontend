import React from 'react';
import { regions } from '../constants';
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

const countryData = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'USA/Canada' },
    { code: '+44', name: 'UK' },
    { code: '+61', name: 'Australia' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+86', name: 'China' },
    { code: '+971', name: 'UAE' },
    { code: '+7', name: 'Russia' },
    { code: '+39', name: 'Italy' },
    { code: '+34', name: 'Spain' },
    { code: '+52', name: 'Mexico' },
    { code: '+55', name: 'Brazil' },
    { code: '+27', name: 'South Africa' },
    { code: '+31', name: 'Netherlands' },
    { code: '+32', name: 'Belgium' },
    { code: '+36', name: 'Hungary' },
    { code: '+41', name: 'Switzerland' },
    { code: '+43', name: 'Austria' },
    { code: '+45', name: 'Denmark' },
    { code: '+46', name: 'Sweden' },
    { code: '+47', name: 'Norway' },
    { code: '+48', name: 'Poland' },
    { code: '+54', name: 'Argentina' },
    { code: '+56', name: 'Chile' },
    { code: '+57', name: 'Colombia' },
    { code: '+58', name: 'Venezuela' },
    { code: '+60', name: 'Malaysia' },
    { code: '+62', name: 'Indonesia' },
    { code: '+63', name: 'Philippines' },
    { code: '+64', name: 'New Zealand' },
    { code: '+65', name: 'Singapore' },
    { code: '+66', name: 'Thailand' },
    { code: '+82', name: 'South Korea' },
    { code: '+84', name: 'Vietnam' },
    { code: '+90', name: 'Turkey' },
    { code: '+92', name: 'Pakistan' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+95', name: 'Myanmar' },
    { code: '+98', name: 'Iran' },
    { code: '+212', name: 'Morocco' },
    { code: '+213', name: 'Algeria' },
    { code: '+216', name: 'Tunisia' },
    { code: '+218', name: 'Libya' },
    { code: '+220', name: 'Gambia' },
    { code: '+221', name: 'Senegal' },
    { code: '+222', name: 'Mauritania' },
    { code: '+223', name: 'Mali' },
    { code: '+224', name: 'Guinea' },
    { code: '+225', name: 'Ivory Coast' },
    { code: '+226', name: 'Burkina Faso' },
    { code: '+227', name: 'Niger' },
    { code: '+228', name: 'Togo' },
    { code: '+229', name: 'Benin' },
    { code: '+230', name: 'Mauritius' },
    { code: '+231', name: 'Liberia' },
    { code: '+232', name: 'Sierra Leone' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
    { code: '+235', name: 'Chad' },
    { code: '+236', name: 'Central African Republic' },
    { code: '+237', name: 'Cameroon' },
    { code: '+238', name: 'Cape Verde' },
    { code: '+239', name: 'Sao Tome and Principe' },
    { code: '+240', name: 'Equatorial Guinea' },
    { code: '+241', name: 'Gabon' },
    { code: '+242', name: 'Congo' },
    { code: '+243', name: 'DR Congo' },
    { code: '+244', name: 'Angola' },
    { code: '+245', name: 'Guinea-Bissau' },
    { code: '+246', name: 'British Indian Ocean Territory' },
    { code: '+248', name: 'Seychelles' },
    { code: '+249', name: 'Sudan' },
    { code: '+250', name: 'Rwanda' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+252', name: 'Somalia' },
    { code: '+253', name: 'Djibouti' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' },
    { code: '+256', name: 'Uganda' },
    { code: '+257', name: 'Burundi' },
    { code: '+258', name: 'Mozambique' },
    { code: '+260', name: 'Zambia' },
    { code: '+261', name: 'Madagascar' },
    { code: '+262', name: 'Reunion' },
    { code: '+263', name: 'Zimbabwe' },
    { code: '+264', name: 'Namibia' },
    { code: '+265', name: 'Malawi' },
    { code: '+266', name: 'Lesotho' },
    { code: '+267', name: 'Botswana' },
    { code: '+268', name: 'Swaziland' },
    { code: '+269', name: 'Comoros' },
];

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
               
                {/* Mobile Numbers Section */}
                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '33.33%' }, boxSizing: 'border-box' }}>
                    {lead.mobileNumbers.map((mobile, index) => {
                        const [code, num] = mobile.split('-');
                        return (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={num || ''}
                                    onChange={(e) => handleMobileNumberChange(index, `${code || '+91'}-${e.target.value}`)}
                                    placeholder="Enter mobile number"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FormControl variant="standard" sx={{ minWidth: 70 }}>
                                                    <Select
                                                        disableUnderline
                                                        value={code || '+91'}
                                                        onChange={(e) => handleMobileNumberChange(index, `${e.target.value}-${num || ''}`)}
                                                    >
                                                        {countryData.map(country => <MenuItem key={country.code} value={country.code}>{country.name} ({country.code})</MenuItem>)}
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
                {renderTextField("regionalHead", "Regional Head", lead.regionalHead, handleChange)}
                {renderSelectField("region", "Region *", lead.region, handleChange, regions)}
                {renderSelectField("planningToStudy", "Planning to Study in", lead.planningToStudy, handleChange, ['India', 'Abroad'])}
            </Box>
        </>
    );
};

export default BasicDetailsSection;