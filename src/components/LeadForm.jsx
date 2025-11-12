
import React, { useState, useEffect } from "react";
import {
    Typography,
    TextField,
    Checkbox,
    Button,
    Divider,
    Link,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormLabel,
    RadioGroup,
    Radio,
    Paper,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton,
    Autocomplete,
    Box,
    Card, 
    CardContent, 
    Chip, 
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import MailOutline from '@mui/icons-material/MailOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Correct import for the icon
import axios from 'axios';
import moment from 'moment'; // Import moment for date/time formatting

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// You should ensure this file exists for custom styles like container width
import './leadForm.css'
import CallHistorySection from "./CallHistorySection";
import BasicDetailsSection from "./BasicDetailsSection";
import RelationCard from "./RelationCard";
import AssetCard from "./AssetCard";
import {
    EMPTY_LEAD_STATE, loanIssues, miscSituations, emailTemplates, banksDocs, documentStatus,
    indianStates, indianCitiesWithState, courseStartQuarters, courseStartYears, degrees,
    fieldsOfInterest, admissionStatuses, universities, employmentTypes, courseDurations, referenceRelationships,
    allCountries, API_URL, MOCK_USER_FULLNAME,
    NLTemplates,
} from "../constants";


// IMPORTANT: LeadForm now accepts leadId and onBack as props
const LeadForm = ({ leadData, onBack, onUpdate }) => {
    // Start with the empty state if no leadId, or wait for fetch
    const [lead, setLead] = useState(EMPTY_LEAD_STATE);

    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState({ notes: '', callStatus: 'Connected' });
    const [primeBankList, setPrimeBankList] = useState([]);
    const [tiedUpBanks, setTiedUpBanks] = useState([]);

    const [fetchedForUniversity, setFetchedForUniversity] = useState('');
    const [showOHGFields, setShowOHGFields] = useState(false);
    const [isSelectingOHG, setIsSelectingOHG] = useState(false);
    const [hasAssets, setHasAssets] = useState(false);


    // --- EFFECT: Fetch Lead Data ---
    useEffect(() => {
        // Fetch tied-up banks for the "Recommended Banks" section
        const fetchTiedUpBanks = async () => {
            try {
                const response = await axios.get(API_URL.replace('/leads', '/banks'));
                setTiedUpBanks(response.data);
            } catch (error) {
                console.error("Failed to fetch tied-up banks:", error);
            }
        };
        fetchTiedUpBanks();

        if (leadData && leadData._id) { // Editing an existing lead
            const dataToSet = { ...EMPTY_LEAD_STATE, ...leadData };
            // Ensure there's always at least one mobile number field
            if (!dataToSet.mobileNumbers || dataToSet.mobileNumbers.length === 0) {
                dataToSet.mobileNumbers = ["+91-"];
            }
            // Ensure there's at least one relation card
            if (!dataToSet.relations || dataToSet.relations.length === 0) {
                dataToSet.relations = [{ relationshipType: 'Father', name: '', employmentType: '', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false }];
            }
            // Ensure there are always two reference slots
            if (!dataToSet.references || dataToSet.references.length < 2) {
                const existingRefs = dataToSet.references || [];
                dataToSet.references = [...existingRefs, ...Array(2 - existingRefs.length).fill({ relationship: '', name: '', address: '', phoneNumber: '' })].slice(0, 2);
            }
            // Merge passed data with the empty state to ensure all fields are present
            setLead(dataToSet);
            setLoading(false);
        } else { // Creating a new lead
            setLoading(false);
            const storedUser = localStorage.getItem('employeeUser');
            let currentUser = null;
            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
            setLead({
                ...EMPTY_LEAD_STATE,
                ...leadData, // Pre-fill from the small dialog if available
                zone: currentUser?.zone || '',
                region: currentUser?.region || '',
                relations: [{ relationshipType: 'Father', name: '', employmentType: '', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false }],
                mobileNumbers: leadData?.mobileNumber ? [leadData.mobileNumber] : ["+91- "],
                referralList: [{ name: "", code: "", phoneNumber: "" }],
            });
        }
    // This effect now runs whenever the selected lead object changes.
    }, [leadData]);

    // --- Handlers ---

    // Helper for text fields (updated to handle both flat and nested state)
    const renderTextField = (name, label, value, onChange, widthProps = { xs: '100%', sm: '50%', md: '33.33%' }, placeholder = "") => (
        <Box sx={{ p: 1.5, width: widthProps, boxSizing: 'border-box' }}>
          <TextField
            fullWidth
            size="small"
            name={name}
            label={label}
            placeholder={placeholder}
            value={value !== undefined && value !== null ? (Array.isArray(value) ? value.join(', ') : value.toString()) : ''}
            onChange={onChange}
            margin="dense"
            variant="outlined"
          />
        </Box>
    );

    // Helper for select/dropdown fields
    const renderSelectField = (name, label, value, onChange, options, widthProps = { xs: '100%', sm: '50%', md: '33.33%' }) => (
        <Box sx={{ p: 1.5, width: widthProps, boxSizing: 'border-box' }}>
            <FormControl fullWidth size="small" margin="dense" variant="outlined">
                <InputLabel>{label}</InputLabel>
                <Select
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    label={label}
                >
                    {options && options.length > 0 ?
                        options.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        )) : (
                        <MenuItem value="" disabled>
                            No options available
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        </Box>
    );

    // Simplified handler for flat state
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'approachedAnyBank') {
            // Radio group value is a string, convert to boolean
            const boolValue = value === 'true';
            setLead((prev) => ({
                ...prev,
                [name]: boolValue,
                // Also clear previousBankApproached if user selects "No"
                previousBankApproached: boolValue ? prev.previousBankApproached : ''
            }));
        } else {
            setLead((prev) => ({ 
                ...prev, 
                [name]: type === 'checkbox' ? checked : value 
            }));
        }
    };

    // Simplified handler for nested state (like coApplicant/references) - *Kept from your original code*
    const handleNestedChange = (sectionName, e) => {
        const { name, value } = e.target;

        // Check if the name indicates an array update (e.g., "references[0].name")
        const arrayMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)/);

        if (arrayMatch && sectionName === arrayMatch[1]) {
            const [, , index, property] = arrayMatch;
            const newArray = [...lead[sectionName]];
            newArray[index] = { ...newArray[index], [property]: value };
            setLead(prev => ({ ...prev, [sectionName]: newArray }));
        } else if (sectionName === 'testScores') {
            // Handle simple nested objects like testScores
            setLead(prev => ({ ...prev, [sectionName]: { ...prev[sectionName], [name]: value } }));
        } else {
            // Original logic for other nested objects like ownHouseGuarantor
            setLead(prev => ({ ...prev, [sectionName]: { ...prev[sectionName], [name]: value } }));
        }
    };
    
    const updateRelation = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newRelations = [...lead.relations];
        const relationToUpdate = { ...newRelations[index] };

        let finalValue = type === 'checkbox' ? checked : value;
        if (name === 'hasCibilIssues') {
            finalValue = value === 'true';
            if (!finalValue) {
                relationToUpdate.cibilIssues = ''; // Clear issues if "No" is selected
            }
        }

        relationToUpdate[name] = finalValue;
        newRelations[index] = relationToUpdate;
        setLead(prev => ({ ...prev, relations: newRelations }));
    };

    const addRelation = () => {
        const newRelation = { relationshipType: '', name: '', employmentType: '', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false };
        setLead(prev => ({ ...prev, relations: [...prev.relations, newRelation] }));
    };

    const removeRelation = (index) => {
        setLead(prev => ({ ...prev, relations: prev.relations.filter((_, i) => i !== index) }));
    };

    const updateAsset = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newAssets = [...lead.assets];
        const assetToUpdate = { ...newAssets[index] };
        
        let finalValue = type === 'checkbox' ? checked : value;
        if (name === 'documentsAvailable') {
            finalValue = value === 'true';
        }

        assetToUpdate[name] = finalValue;
        newAssets[index] = assetToUpdate;
        setLead(prev => ({ ...prev, assets: newAssets }));
    };

    const addAsset = () => {
        const newAsset = { assetType: '', ownerName: '', assetValue: '' };
        setLead(prev => ({ ...prev, assets: [...prev.assets, newAsset] }));
    };

    const removeAsset = (index) => {
        setLead(prev => ({ ...prev, assets: prev.assets.filter((_, i) => i !== index) }));
    };

    const handleSelectOHG = (relationshipType) => {
        // Find if a relation with this type already exists in the main relations list
        const existingRelation = lead.relations.find(
            (rel) => rel.relationshipType.toLowerCase() === relationshipType.toLowerCase()
        );

        if (existingRelation) {
            // If found, copy its details to the OHG object
            setLead(prev => ({
                ...prev,
                ownHouseGuarantor: {
                    ...existingRelation, // Copy all fields
                }
            }));
        } else {
            // If not found, just set the relationship type and clear other fields
            setLead(prev => ({
                ...prev,
                ownHouseGuarantor: {
                    ...EMPTY_LEAD_STATE.ownHouseGuarantor, // Reset to blank slate
                    relationshipType: relationshipType, // Set the selected type
                }
            }));
        }

        setShowOHGFields(true); // Show the OHG form
        setIsSelectingOHG(false); // Hide the selection buttons
    };


    const handleShowPrimeBanks = async () => {
        const universityName = lead.admittedUniversities;

        // If the list is already showing for the same university, hide it.
        if (primeBankList.length > 0 && fetchedForUniversity === universityName) {
            setPrimeBankList([]);
            setFetchedForUniversity('');
            return;
        }

        if (!universityName) {
            alert("Please enter an admitted university name first.");
            return;
        }

        try {
            const storedUser = JSON.parse(localStorage.getItem('employeeUser') || '{}');
            const response = await axios.get(`${API_URL.replace('/leads', '/banks')}/for-university`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
                params: { universityName }
            });

            if (response.data && response.data.length > 0) {
                setPrimeBankList(response.data);
                setFetchedForUniversity(universityName);
            } else {
                alert(`No prime university list found for "${universityName}".`);
                setPrimeBankList([]); // Clear any previous results
                setFetchedForUniversity('');
            }
        } catch (error) {
            console.error("Failed to fetch prime banks:", error);
            alert("An error occurred while fetching the bank list. Please try again.");
        }
    };


    // Helper for Autocomplete fields
    const renderAutocompleteField = (name, label, value, onChange, options, widthProps = { xs: '100%', sm: '50%', md: '33.33%' }) => (
        <Box sx={{ p: 1.5, width: widthProps, boxSizing: 'border-box' }}>
            <Autocomplete
                fullWidth
                size="small"
                options={options}
                value={value || null} // Autocomplete prefers null for an empty value
                onChange={(event, newValue) => {
                    // Create a synthetic event to work with the existing handleChange function
                    const syntheticEvent = {
                        target: {
                            name: name,
                            value: newValue || '' // Send back an empty string if cleared
                        }
                    };
                    onChange(syntheticEvent);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        margin="dense"
                        variant="outlined"
                    />
                )}
            />
        </Box>
    );
    // --- New Note Handlers ---

    const handleNoteChange = (e) => {
        setNewNote(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveNote = async () => {
        // If there's no lead._id, this is a create operation
        if (!lead._id) {
            // CREATE logic here (POST /api/leads)
            try {
                const createPayload = {
                    ...lead,
                };

                const response = await axios.post(API_URL, createPayload);
                alert('Lead created successfully!');
                onUpdate(response.data); // Notify parent of the new lead
                console.log('Created lead:', response.data);
                // Reset form or navigate back
                setLead(EMPTY_LEAD_STATE);
                setNewNote({ notes: '', callStatus: 'Connected' });
            } catch (error) {
                console.error('Failed to create lead:', error);
                alert('Failed to create lead. Check console for details.');
            }
            return;
        }


        try {
            // Prepare payload with all current form fields (lead state) AND the new note
            const updatePayload = {
                ...lead, // Send all current lead data for a full update
                // The backend controller expects newCallNote for logging
                newCallNote: {
                    notes: newNote.notes,
                    callStatus: newNote.callStatus
                },
                // The referralList needs to be an array of objects for the backend to process
                // (Assuming the backend handles the referralList creation logic)
                referralList: lead.referralList.filter(r => r.name || r.phoneNumber)
            };

            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload); // Use lead._id from state

            // Update local state with the new, updated lead data (including the new callHistory entry)
            setLead({ ...EMPTY_LEAD_STATE, ...response.data });
            onUpdate(response.data); // Notify parent of the update
            setNewNote({ notes: '', callStatus: 'Connected' }); // Clear the note field
            // No need for a separate success alert, let the refreshed history show it.

        } catch (error) {
            console.error('Failed to save note/update lead:', error);
            alert('Failed to update lead. Check console for details.');
        }
    };

    const handleCreateReferralLead = async (referralData) => {
        if (!referralData.name || !referralData.phoneNumber) {
            alert('Please provide a name and phone number for the referral to create a lead.');
            return;
        }

        try {
            const newLeadPayload = {
                fullName: referralData.name,
                mobileNumbers: [referralData.phoneNumber],
                // Inherit location, zone, region, and FO from the current lead
                permanentLocation: lead.permanentLocation,
                zone: lead.zone,
                region: lead.region,
                assignedFOId: lead.assignedFOId,
                assignedFO: lead.assignedFO,
                assignedFOPhone: lead.assignedFOPhone,
                // Set the source to indicate it came from a referral
                source: { source: 'Referral', name: lead.fullName, phoneNumber: lead.mobileNumbers[0] },
            };
            const response = await axios.post(API_URL, newLeadPayload);
            alert(`Successfully created a new lead for ${response.data.fullName}!`);
        } catch (error) {
            console.error('Failed to create referral lead:', error);
            alert(`Failed to create lead for ${referralData.name}. Check console for details.`);
        }
    };

    const handleAssignToBank = async (bank) => {
        if (!lead._id) {
            alert('Please save the lead before assigning it to a bank.');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/${lead._id}/assign-bank`, {
                bankId: bank._id,
                bankName: bank.name
            });
            onUpdate(response.data.lead); // Pass the updated lead object to the parent
            alert(response.data.message); // Show the specific success message from the backend
        } catch (error) {
            console.error('Failed to assign lead to bank:', error);
            alert(error.response?.data?.message || 'An error occurred during assignment.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since the lead form is large, the main submit should trigger the full update
        handleSaveNote(); 
    };

    if (loading) return <Typography align="center" sx={{ mt: 5 }}>Loading Lead Details...</Typography>;

    // Calculate total expenses (Unchanged)
    const totalFee = (parseFloat(lead.fee) || 0) + (parseFloat(lead.living) || 0) + (parseFloat(lead.otherExpenses) || 0);
    

    return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 1200, margin: '30px auto', borderRadius: 2 }}>
        {/* Back Button */}
        {onBack && (
            <Button
                variant="outlined"
                color="primary"
                onClick={onBack}
                sx={{ mb: 3 }}
                startIcon={<ArrowBackIcon />}
            >
                Back to Dashboard
            </Button>
        )}

        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: '600', color: 'primary.dark' }}>
            {lead._id ? `Lead: ${lead.fullName}` : 'Create New Lead'}
        </Typography>
        <form onSubmit={handleSubmit}>

            {/* 1. TOP METADATA & SOURCE INFO - Organized into a Card */}
            <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f5f5f5', p: 1 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                        <Box sx={{ width: { xs: '100%', md: '66.67%' }, p: 1 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                <Chip label={`Applied: ${lead.studentAppliedDate || 'N/A'} ${lead.studentAppliedTime || ''}`} color="primary" size="small" />
                                <Chip label={`FO: ${lead.assignedFO || 'N/A'} (${lead.assignedFOPhone || 'N/A'})`} color="secondary" size="small" />
                            </Box>
                            <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>Sources / Referral:</Typography>
                            <Link href="#" variant="body2" sx={{ ml: 1, mr: 2 }}>Show History</Link>
                            <Typography variant="body2" color="text.secondary" component="span">
                                **{lead.source.source || 'N/A'}**: {lead.source.name || 'N/A'} | {lead.source.email || 'N/A'} | {lead.source.phoneNumber || 'N/A'}
                            </Typography>
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '33.33%' }, p: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                                <Chip label={`Loan ID: ${lead.loanId || 'N/A'}`} variant="outlined" size="small" sx={{ fontFamily: 'monospace' }} />
                                <Chip label={`User ID: ${lead.leadID || 'N/A'}`} variant="outlined" size="small" sx={{ fontFamily: 'monospace' }} />
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* 2. ADD BASIC DETAILS */}
            <BasicDetailsSection 
                lead={lead} 
                setLead={setLead} 
                handleChange={handleChange} 
                renderTextField={renderTextField} 
                renderSelectField={renderSelectField}
                renderAutocompleteField={renderAutocompleteField} // Pass the new helper
                indianStates={indianStates} // Existing prop for State field
                indianCities={indianCitiesWithState} // New prop for Permanent Location
            />
            <Box sx={{ mt: 2 }}>
                {/* 3. FURTHER EDUCATION DETAILS */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🎓 Further Education Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                            {renderSelectField("loanType", "Loan Type", lead.loanType, handleChange, ['Balance Transfer', 'New Loan'], { xs: '100%', sm: '50%', md: '25%' })}
                            {renderSelectField("courseStartMonth", "Course Start Month", lead.courseStartMonth, handleChange, courseStartQuarters, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderSelectField("courseStartYear", "Course Start Year", lead.courseStartYear, handleChange, courseStartYears, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderSelectField("degree", "Degree", lead.degree, handleChange, degrees, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderSelectField("fieldOfInterest", "Field of Interest", lead.fieldOfInterest, handleChange, fieldsOfInterest)}
                            {renderAutocompleteField("interestedCountries", "Interested Countries", lead.interestedCountries, handleChange, allCountries)}
                            {renderSelectField("admissionStatus", "Admission Status", lead.admissionStatus, handleChange, admissionStatuses)}
                            {renderAutocompleteField("admittedUniversities", "Admitted Universities", lead.admittedUniversities, handleChange, universities, { xs: '100%', sm: '100%', md: '50%' })}
                            <Box sx={{ p: 1.5, width: { xs: '100%', md: '50%' }, boxSizing: 'border-box' }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Has the student already approached any bank? *</FormLabel>
                                    <RadioGroup
                                        row
                                        name="approachedAnyBank"
                                        value={String(lead.approachedAnyBank)}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                                {lead.approachedAnyBank && <TextField fullWidth size="small" margin="dense" variant="outlined" name="previousBankApproached" label="Previous Bank Approached" value={lead.previousBankApproached} onChange={handleChange} />}
                            </Box>
                        </Box>
                        <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
                            Enter a university and click the button below to check the prime university list.
                        </Alert>
                        <Button variant="contained" color="warning" onClick={handleShowPrimeBanks}>PRIME UNIVERSITY LIST</Button>

                        {/* Inline Bank List Display */}
                        {primeBankList.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>Prime Banks for "{fetchedForUniversity}"</Typography>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Bank Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Max Loan Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>{primeBankList.map((bank, index) => (<TableRow key={index}><TableCell>{bank.bankName}</TableCell><TableCell align="right">{bank.maxLoanAmount}</TableCell></TableRow>))}</TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
                
                {/* NEW: Test Scores Section */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>📝 Test Scores</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                            {renderTextField("GRE", "GRE (200-990)", lead.testScores.GRE, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("IELTS", "IELTS (0-9)", lead.testScores.IELTS, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("TOEFL", "TOEFL (0-120)", lead.testScores.TOEFL, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("GMAT", "GMAT (200-800)", lead.testScores.GMAT, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("SAT", "SAT (400-1600)", lead.testScores.SAT, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("PTE", "PTE (10-90)", lead.testScores.PTE, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("ACT", "ACT (1-36)", lead.testScores.ACT, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("DUOLINGO", "DuoLingo (10-160)", lead.testScores.DUOLINGO, (e) => handleNestedChange('testScores', e), { xs: '100%', sm: '50%', md: '25%' })}
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* NEW: Other & Course Details Section */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>📄 Other & Course Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5, alignItems: 'center' }}>
                            {renderTextField("age", "Age", lead.age, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("workExperience", "Work Experience (in months)", lead.workExperience, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '50%' }, boxSizing: 'border-box' }}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Is there any loan on the student?</FormLabel>
                                    <RadioGroup row name="hasStudentLoans" value={String(lead.hasStudentLoans)} onChange={handleChange}>
                                        <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                            <Divider sx={{ width: '100%', my: 2 }} />
                            {renderSelectField("courseDuration", "Course Duration", lead.courseDuration, handleChange, courseDurations, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("fee", "Fee (in Lakhs)", lead.fee, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("living", "Living (in Lakhs)", lead.living, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("otherExpenses", "Other Expenses (in Lakhs)", lead.otherExpenses, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            <Box sx={{ p: 1.5, width: { xs: '100%' }, boxSizing: 'border-box' }}>
                                <TextField fullWidth size="small" label="Total Fee (in Lakhs)" value={totalFee.toFixed(2)} InputProps={{ readOnly: true }} variant="filled" />
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* NEW: Assets Available Section */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🏠 Assets Available</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <FormLabel component="legend">Are assets available?</FormLabel>
                            <RadioGroup row value={String(hasAssets)} onChange={(e) => setHasAssets(e.target.value === 'true')}>
                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>

                        {hasAssets && (
                            <>
                                {lead.assets.map((asset, index) => (
                                    <AssetCard
                                        key={index}
                                        asset={asset}
                                        index={index}
                                        onUpdate={updateAsset}
                                        onRemove={removeAsset}
                                        renderTextField={renderTextField}
                                        renderSelectField={renderSelectField}
                                    />
                                ))}
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={addAsset} sx={{ mt: 2 }}>Add Asset</Button>
                            </>
                        )}
                    </AccordionDetails>
                </Accordion>

                {/* 4. FAMILY/CO-APPLICANT INFO */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>👨‍👩‍👧‍👦 Student Relations (Co-Applicant/Guarantor)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {lead.relations.map((relation, index) => (
                            <RelationCard
                                key={index}
                                relation={relation}
                                index={index}
                                onUpdate={updateRelation}
                                onRemove={removeRelation}
                                renderTextField={renderTextField}
                                renderSelectField={renderSelectField}
                                employmentTypes={employmentTypes}
                            />
                        ))}

                        <Button variant="outlined" startIcon={<AddIcon />} size="small" sx={{ mt: 2, mb: 2 }} onClick={addRelation}>
                            Add New Relation
                        </Button>

                        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>🏠 Own House Guarantor (OHG)</Typography>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                                Note: Own house guarantor should be one of your family members or relatives who owns a house/flat.
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>This property is NOT taken as a collateral.</Typography>
                            <Link href="#" variant="body2" sx={{ display: 'block' }} onClick={(e) => { e.preventDefault(); if (showOHGFields) { setShowOHGFields(false); setLead(prev => ({...prev, ownHouseGuarantor: EMPTY_LEAD_STATE.ownHouseGuarantor})); } else { setIsSelectingOHG(!isSelectingOHG); } }}>
                                {showOHGFields ? 'Hide Guarantor Fields' : 'Add/Change Own House Guarantor'}
                            </Link>

                            {/* Inline OHG Selection */}
                            {isSelectingOHG && !showOHGFields && (
                                <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Select a relation type:</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {['Father', 'Mother', 'Spouse', 'Brother', 'Other'].map((type) => (
                                            <Button
                                                key={type}
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleSelectOHG(type)}
                                            >
                                                {type}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Conditionally rendered card for OHG details */}
                            {showOHGFields && (
                                <Card variant="outlined" sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>Own House Guarantor Details</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                                        {renderTextField("name", "Guarantor Name", lead.ownHouseGuarantor.name, (e) => handleNestedChange('ownHouseGuarantor', e), { xs: '100%', sm: '50%', md: '25%' })}
                                        {renderSelectField("relationshipType", "Relationship to Student", lead.ownHouseGuarantor.relationshipType, (e) => handleNestedChange('ownHouseGuarantor', e), ['Uncle', 'Aunt', 'Cousin', 'Grandparent', 'Other Relative'], { xs: '100%', sm: '50%', md: '25%' })}
                                        {renderTextField("phoneNumber", "Guarantor Phone Number", lead.ownHouseGuarantor.phoneNumber, (e) => handleNestedChange('ownHouseGuarantor', e), { xs: '100%', sm: '50%', md: '25%' })}
                                        {renderSelectField("employmentType", "Employment Type", lead.ownHouseGuarantor.employmentType, (e) => handleNestedChange('ownHouseGuarantor', e), employmentTypes, { xs: '100%', sm: '50%', md: '25%' })}
                                        {renderTextField("annualIncome", "Annual Income (lacs)", lead.ownHouseGuarantor.annualIncome, (e) => handleNestedChange('ownHouseGuarantor', e), { xs: '100%', sm: '50%', md: '25%' })}
                                        {renderTextField("currentObligations", "Current Obligations", lead.ownHouseGuarantor.currentObligations, (e) => handleNestedChange('ownHouseGuarantor', e), { xs: '100%', sm: '50%', md: '25%' })}
                                        {renderTextField("cibilScore", "CIBIL Score", lead.ownHouseGuarantor.cibilScore, (e) => handleNestedChange('ownHouseGuarantor', e), { xs: '100%', sm: '50%', md: '25%' })}
                                        <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' }, boxSizing: 'border-box' }}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>CIBIL Issues?</FormLabel>
                                                <RadioGroup row name="hasCibilIssues" value={String(lead.ownHouseGuarantor.hasCibilIssues)} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)}>
                                                    <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                                                    <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                                                </RadioGroup>
                                            </FormControl>
                                            {lead.ownHouseGuarantor.hasCibilIssues && <TextField fullWidth size="small" margin="dense" name="cibilIssues" label="CIBIL Issues" value={lead.ownHouseGuarantor.cibilIssues} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} />}
                                        </Box>
                                    </Box>
                                </Card>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* 5. STUDENT REFERENCES & PAN DETAILS */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🤝 Student References & PAN Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                References are people other than your parents and siblings who you know (e.g., friends, neighbours, relatives).
                                They will NOT be added to the loan; they are for contact purposes only if the student/family are not contactable.
                            </Typography>
                        </Alert>
                        <Typography variant="h6" gutterBottom>Student References</Typography>
                        {lead.references.map((ref, index) => (
                            <Card variant="outlined" key={index} sx={{ mb: 2, p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>Reference {index + 1}</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                                    {renderTextField(`references[${index}].name`, "Name*", ref.name, (e) => handleNestedChange('references', e), { xs: '100%', sm: '50%', md: '25%' })}
                                    {renderSelectField(`references[${index}].relationship`, "Relationship*", ref.relationship, (e) => handleNestedChange('references', e), referenceRelationships, { xs: '100%', sm: '50%', md: '25%' })}
                                    {renderTextField(`references[${index}].address`, "Address*", ref.address, (e) => handleNestedChange('references', e), { xs: '100%', sm: '50%', md: '25%' })}
                                    {renderTextField(`references[${index}].phoneNumber`, "Phone Number *", ref.phoneNumber, (e) => handleNestedChange('references', e), { xs: '100%', sm: '50%', md: '25%' })}
                                </Box>
                            </Card>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Student PAN Details</Typography>
                        <FormControl component="fieldset">
                            <RadioGroup row name="panStatus" value={lead.panStatus} onChange={handleChange}>
                                <FormControlLabel value="Not Interested" control={<Radio size="small" />} label="Not Interested" />
                                <FormControlLabel value="Not Available" control={<Radio size="small" />} label="Not Available" />
                                <FormControlLabel value="Applied" control={<Radio size="small" />} label="Applied" />
                            </RadioGroup>
                            {lead.panStatus === 'Applied' && <TextField size="small" label="PAN Card Number" value={lead.panNumber} onChange={handleChange} name="panNumber" sx={{ ml: 2, width: 300, mt: 1 }} />}
                        </FormControl>
                    </AccordionDetails>
                </Accordion>

                {/* 6. REFER APPLICANT'S FRIENDS */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>👥 Refer Applicant's Friends</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                            {lead.referralList.map((ref, index) => (
                                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '33.33%' }, boxSizing: 'border-box' }} key={index}>
                                    <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>Referral {index + 1}</Typography>
                                        <TextField fullWidth size="small" label={`Name`} value={ref.name || ''} name={`referralList[${index}].name`} onChange={(e) => handleNestedChange('referralList', e)} sx={{ mb: 1 }} />
                                        <TextField fullWidth size="small" label="Phone Number" value={ref.phoneNumber || ''} name={`referralList[${index}].phoneNumber`} onChange={(e) => handleNestedChange('referralList', e)} sx={{ mb: 1 }} />
                                        <TextField fullWidth size="small" label="Code" value={ref.code || ''} name={`referralList[${index}].code`} onChange={(e) => handleNestedChange('referralList', e)} />
                                        <Button variant="contained" size="small" color="secondary" sx={{ mt: 2 }} onClick={() => handleCreateReferralLead(ref)} disabled={!ref.name || !ref.phoneNumber}>
                                            Create Lead
                                        </Button>
                                    </Card>
                                </Box>
                            ))}
                        </Box>
                        <Button variant="outlined" startIcon={<AddIcon />} size="small" onClick={() => setLead(p => ({...p, referralList: [...p.referralList, { name: "", code: "", phoneNumber: "" }] }))} sx={{ mt: 2 }}>Add Referral</Button>
                    </AccordionDetails>
                </Accordion>

                {/* 7. LOAN CALCULATIONS & BRANCH CHECK */}
                {/* <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🏦 Loan Calculations & Branch Check</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#fff4e5' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'orange' }}>Check KVB branch availability (50 kms radius)</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mx: -1.5 }}>
                                {renderTextField("collateralLocation", "Select from the dropdown only", lead.collateralLocation, handleChange, { xs: '100%', sm: '66.67%' })}
                                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '33.33%' } }}><Button variant="contained" size="small" color="primary">CHECK</Button></Box>
                            </Box>
                        </Paper>
                        <Typography variant="h6" gutterBottom>Union Bank Margin Calculation</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mx: -1.5 }}>
                            {renderTextField("totalExpenses", `Total Expenses (Fee + Living + Other Expenses) *`, totalFee.toFixed(2), () => {}, { xs: '100%', sm: '50%', md: '33.33%' })}
                            {renderTextField("maxUnsecuredGivenByUBI", "Maximum Unsecured loan given by UBI *", lead.maxUnsecuredGivenByUBI, handleChange)}
                            <Box sx={{ p: 1.5, width: { xs: '100%', md: '33.33%' } }}><Button variant="contained" color="success" size="medium" fullWidth>GET LOAN MARGIN</Button></Box>
                        </Box>
                    </AccordionDetails>
                </Accordion> */}

                {/* 8. RECOMMENDED BANKS & ISSUES */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>💳 Recommended Banks</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
                            <Box sx={{ width: { xs: '100%', md: '50%' }, p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.dark' }}>Tied-Up Banks</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {tiedUpBanks.map((bank) => (
                                        <Card key={bank._id} variant="outlined" sx={{ p: 1.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{bank.name}</Typography>
                                                {lead.assignedBanks?.some(b => b.bankId === bank._id) && (
                                                    <Chip icon={<CheckCircleOutlineIcon />} label="Assigned" color="success" size="small" />
                                                )}
                                            </Box>
                                            {lead.assignedBanks?.find(b => b.bankId === bank._id) && (
                                                <Box sx={{ mt: 1, p: 1, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                                                    <Typography variant="caption">Assigned To: <strong>{lead.assignedBanks.find(b => b.bankId === bank._id).assignedRMName}</strong></Typography>
                                                    <Typography variant="caption" display="block">Email: {lead.assignedBanks.find(b => b.bankId === bank._id).assignedRMEmail}</Typography>
                                                </Box>
                                            )}
                                            <Button variant="contained" size="small" onClick={() => handleAssignToBank(bank)} disabled={lead.assignedBanks?.some(b => b.bankId === bank._id)} sx={{ mt: 1 }}>
                                                {lead.assignedBanks?.some(b => b.bankId === bank._id) ? 'Assigned' : 'Assign'}
                                            </Button>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                       
                    </AccordionDetails>
                </Accordion>

                {/* 9. Email Templates */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🛠️ Email Templates</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>NL Normal</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{NLTemplates.map((item, index) => (<Button key={index} variant="contained" style={{backgroundColor:'orange'}} size="small" startIcon={<MailOutline />}>{item}</Button>))}</Box>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Banks Connection - Intro & Docs Upload</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{banksDocs.map((item, index) => (<Button key={index} variant="contained" style={{background:'#AA60C8'}} startIcon={<MailOutline />} size="small">{item}</Button>))}</Box>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>Document Upload</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{documentStatus.map((item, index) => (<Button key={index} variant="contained" style={{backgroundColor:'green'}} size="small" startIcon={<MailOutline />}>{item}</Button>))}</Box>
                        </Box>
                        <Box>
                            <Typography variant="h6" gutterBottom>Loan Calculators</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                <Button variant="contained" color="error" size="small" startIcon={<MailOutline />}>EDUCATION LOAN EMI CALCULATOR</Button>
                                <Button variant="contained" color="error" size="small" startIcon={<MailOutline />} >$ USD TO INR EDUCATION LOAN CALCULATOR</Button>
                                 <Button variant="contained" color="error" size="small" startIcon={<MailOutline />}>Saves Lakhs By Educational Loan Transfer</Button>
                                  <Button variant="contained" color="error" size="small" startIcon={<MailOutline />}>EL TAX Rebate Calculator</Button>
                            </Box>
                        </Box>
                         <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" gutterBottom>Banks Related - Issues</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>{loanIssues.map((item, index) => (<Button  style={{backgroundColor:'purple'}} ey={index} variant="contained" color="success" startIcon={<MailOutline />} size="small">{item}</Button>))}</Box>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Miscellaneous Situations</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{miscSituations.map((item, index) => (<Button  style={{backgroundColor:'#11224E'}} ey={index} variant="contained" color="success" startIcon={<MailOutline />} size="small">{item}</Button>))}</Box>
                    </AccordionDetails>
                </Accordion>

                {/* 10. REMINDERS & FINAL STATUS */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🗓️ Reminders & Final Status</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Card elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Targeted Sanction Date</Typography>
                            <Typography variant="caption" display="block">Previous selected date: Not selected</Typography>
                            <FormControlLabel control={<Checkbox />} label="Not possible to sanction in this month or the next month" />
                        </Card>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                            {renderTextField("lastCallDate", "Last call date", lead.lastCallDate, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            {renderTextField("reminderCallDate", "Next call date", lead.reminderCallDate, handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' }, boxSizing: 'border-box' }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Final Status</InputLabel>
                                    <Select name="leadStatus" label="Final Status" value={lead.leadStatus} onChange={handleChange}>
                                        {['No status', 'Sanctioned', 'Rejected', 'Application Incomplete'].map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                            {renderTextField("preferredNextCallTime", "Preferred Next Call time", lead.preferredNextCallTime || '', handleChange, { xs: '100%', sm: '50%', md: '25%' })}
                            <Box sx={{ width: '100%', p: 1.5 }}>
                                <FormControlLabel control={<Checkbox />} label="Clear Preferred Next Call Time" sx={{ mr: 3 }} />
                                <FormControlLabel control={<Checkbox />} label="Student is not eligible for Connecting to Advisar" />
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* --- CALL HISTORY & NOTES SECTION (MOVED TO BOTTOM) --- */}
            <CallHistorySection
                lead={lead}
                newNote={newNote}
                handleNoteChange={handleNoteChange}
                handleSaveNote={handleSaveNote}
                MOCK_USER_FULLNAME={MOCK_USER_FULLNAME}
            />


            {/* Main Submit Button */}
            <Button variant="contained" color="primary" sx={{ mt: 5, p: 1.5 }} type="submit" size="large" fullWidth>
                ✅ SUBMIT LEAD DATA & SAVE NOTES
            </Button>
        </form>
    </Paper>);
};

export default LeadForm;