import React from 'react';
import {
    Card,
    Typography,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    FormLabel as MuiFormLabel,
    Checkbox,
    IconButton,
    TextField,
    Select,
    MenuItem,
    InputAdornment
} from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { countryPhoneCodes } from '../constants';

const RelationCard = ({
    relation,
    index,
    onUpdate,
    onRemove,
    renderTextField,
    renderSelectField,
    employmentTypes
}) => {

    const documentOptions = {
        'Salaried': ['Payslips', 'Form 16', 'Salary Certificate'],
        'Self-employed': ['MSME Certificate', 'Business Certificate', 'GST', 'IT Returns'],
        'Agriculture': ['Agriculture Income Certificate'],
        'Not Employed': ['Income Certificate'],
    };

    const handleDocumentChange = (e) => {
        const { name, checked } = e.target;
        const currentDocs = relation.documents || [];
        const newDocs = checked ? [...currentDocs, name] : currentDocs.filter(doc => doc !== name);
        onUpdate(index, { target: { name: 'documents', value: newDocs } });
    };

    const handleRelationChange = (e) => {
        const { name, value } = e.target;
        // Custom handler for phone number parts
        if (name === 'phoneCode' || name === 'phoneNumberOnly') {
            const currentPhone = relation.phoneNumber || '+91-';
            const [currentCode, currentNum] = currentPhone.split('-');
            const newPhone = name === 'phoneCode' ? `${value}-${currentNum || ''}` : `${currentCode || '+91'}-${value}`;
            onUpdate(index, { target: { name: 'phoneNumber', value: newPhone } });
        } else if (name === 'documents') {
            // This case is for the new document checkboxes
            onUpdate(index, { target: { name: 'documents', value: value } });
        } else {
            onUpdate(index, e);
        }
    };

    return (
        <Card variant="outlined" sx={{ my: 2, p: 2, bgcolor: '#f9f9f9', position: 'relative' }}>
            <IconButton
                aria-label="remove relation"
                onClick={() => onRemove(index)}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <RemoveCircleOutlineIcon color="error" />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>
                {relation.relationshipType || `Relation ${index + 1}`}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                {renderSelectField(`relationshipType`, "Relationship Type", relation.relationshipType, handleRelationChange, ['Father', 'Mother', 'Spouse', 'Brother', 'Sister', 'Guardian'], { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`name`, "Name", relation.name, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                {renderSelectField(`employmentType`, "Employment Type", relation.employmentType, handleRelationChange, employmentTypes, { xs: '100%', sm: '50%', md: '25%' })}
                
                {/* --- NEW: Conditional Document Checkboxes --- */}
                {relation.employmentType && documentOptions[relation.employmentType] && (
                    <Box sx={{ width: '100%', p: 1.5, mt: 2, borderTop: '1px solid #eee' }}>
                        <FormControl component="fieldset" variant="standard">
                            <MuiFormLabel component="legend" sx={{ fontSize: '0.875rem', fontWeight: 'bold', mb: 1 }}>Required Documents</MuiFormLabel>
                            <FormGroup row>
                                {documentOptions[relation.employmentType].map(docName => (
                                    <FormControlLabel
                                        key={docName}
                                        control={<Checkbox checked={(relation.documents || []).includes(docName)} onChange={handleDocumentChange} name={docName} size="small" />}
                                        label={<Typography variant="body2">{docName}</Typography>}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Box>
                )}

                {renderTextField(`annualIncome`, "Annual Income (lacs)", relation.annualIncome, onUpdate.bind(null, index), { xs: '100%', sm: '50%', md: '25%' })}
                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' }, boxSizing: 'border-box' }}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        size="small"
                        value={(relation.phoneNumber || '').split('-')[1] || ''}
                        onChange={(e) => handleRelationChange({ target: { name: 'phoneNumberOnly', value: e.target.value } })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FormControl variant="standard" sx={{ minWidth: 70 }}>
                                        <Select
                                            disableUnderline
                                            name="phoneCode"
                                            value={(relation.phoneNumber || '+91-').split('-')[0]}
                                            onChange={handleRelationChange}
                                        >
                                            {countryPhoneCodes.map(country => <MenuItem key={country.code} value={country.code}>{country.name} ({country.code})</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                {renderTextField(`currentObligations`, "Current Obligations", relation.currentObligations, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`cibilScore`, "CIBIL Score", relation.cibilScore, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' }, boxSizing: 'border-box' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>CIBIL Issues?</FormLabel>
                        <RadioGroup
                            row
                            name="hasCibilIssues"
                            value={String(relation.hasCibilIssues || 'false')}
                            onChange={handleRelationChange}
                        >
                            <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                        </RadioGroup>
                    </FormControl>
                    {relation.hasCibilIssues && (
                        <TextField fullWidth size="small" margin="dense" name="cibilIssues" label="CIBIL Issues" value={relation.cibilIssues || ''} onChange={handleRelationChange} />
                    )}
                </Box>
                <Box sx={{ width: '100%', p: 1.5 }}>
                    <FormControlLabel
                        control={<Checkbox checked={relation.isCoApplicant} name="isCoApplicant" onChange={handleRelationChange} />}
                        label="This is a Co-applicant"
                    />
                </Box>
            </Box>
        </Card>
    );
};

export default RelationCard;