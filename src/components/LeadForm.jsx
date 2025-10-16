
import React, { useState, useEffect } from "react";
import {
    Typography,
    TextField,
    Checkbox,
    Button,
    FormControlLabel,
    Grid,
    Divider,
    Link,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    Radio,
    Paper,
    Box,
    Card, CardContent, Chip, Alert // Added Box for layout
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import moment from 'moment'; // Import moment for date/time formatting

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// You should ensure this file exists for custom styles like container width
import './leadForm.css' 

// Mock Initial State (Empty structure for dynamic loading)
const EMPTY_LEAD_STATE = {
    // 1. Basic Info
    leadID: "", fullName: "", email: "", mobileNumbers: [], permanentLocation: "", currentAddress: "",
    state: "", region: "", zone: "", regionalHead: "", zonalHead: "", planningToStudy: "",
    source: { source: '', name: '', email: '', phoneNumber: '' }, 
    
    // 2. Education / Loan Info
    loanId: '', loanType: "", courseStartMonth: "", courseStartYear: "", degree: "",
    fieldOfInterest: "", interestedCountries: "", admitReceived: false, admittedUniversities: "",
    approachedAnyBank: false, previousBankApproached: "",
    testScores: {}, // Assuming an empty object for test scores
    
    // 4. Financial Info
    age: "", workExperience: "", hasLoans: false, courseDuration: "",
    fee: "", living: "", otherExpenses: "", maxUnsecuredGivenByUBI: "",
    hasAssets: false, availableAssets: "", listOfFOsServed: [], currentFO: "",
    studentAppliedDate: "", studentAppliedTime: "", assignedFO: "", assignedFOPhone: '',

    // 5. Family Info / Co-Applicant
    fatherName: "", fatherEmploymentType: "", fatherAnnualIncome: "", fatherPhoneNumber: "",
    currentObligations: "", cibilScore: "", cibilIssues: "", ownHouseGuarantor: false,
    coApplicant: {
      relationshipType: "", name: "", employmentType: "", annualIncome: "", phoneNumber: "",
      currentObligations: "", cibilScore: "", cibilIssues: "", isCoApplicant: false, isDivorced: false, knowsCoApplicant: true,
    },

    // 6. References, Notes, etc.
    references: [], 
    panStatus: "Not Interested", panNumber: "",
    referralList: [],
    collateralLocation: "", suggestedBank: "", lastCallDate: "", reminderCallDate: "",
    leadStatus: "No status", targetSanctionDate: "",
    callHistory: [], // New array to store notes/calls
};

const loanIssues = [
    "High Interest Rate",
    "Collateral Mismatch",
    "CIBIL Low",
    "Document Issues",
    "Co-Applicant Issues",
];

// Line 522: 'miscSituations' is not defined
const miscSituations = [
    "Lost Contact",
    "Student Abroad",
    "Follow-up Needed",
    "Switched Course",
];

// Line 529: 'emailTemplates' is not defined
const emailTemplates = [
    "Send Intro Mail",
    "Send Document List",
    "Send Reminder",
    "Send Sanction Mail",
];

// Line 533: 'banksDocs' is not defined
const banksDocs = [
    "Upload Bank Intro Doc",
    "Upload Doc 1",
    "Upload Doc 2",
];

// Line 538: 'documentStatus' is not defined
const documentStatus = [
    "Doc: PAN - Pending",
    "Doc: Aadhar - Done",
    "Doc: Passport - Pending",
    "Doc: Co-App - Done",
];
// MOCK USER: Used for logging notes when 'protect' middleware is off
const MOCK_USER_FULLNAME = 'FO 1 (Mock)'; 
const API_URL = 'http://localhost:5000/api/leads';


// IMPORTANT: LeadForm now accepts leadId and onBack as props
const LeadForm = ({ leadData, onBack }) => {
    // Start with the empty state if no leadId, or wait for fetch
    const [lead, setLead] = useState(EMPTY_LEAD_STATE);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState({ notes: '', callStatus: 'Connected' });
    const recommendedBanks = {
    private: [
        { name: 'HDFC Bank' },
        { name: 'ICICI Bank' },
        { name: 'Axis Bank' },
    ],
    public: [
        { name: 'SBI Bank' },
        { name: 'Bank of Baroda' },
        { name: 'PNB Bank' },
    ],
};

    // --- EFFECT: Fetch Lead Data ---
    useEffect(() => {
        // If leadData is passed, it means we are editing an existing lead.
        // No need to fetch, just set the state.
        if (leadData) {
            // Merge passed data with the empty state to ensure all fields are present
            setLead({ ...EMPTY_LEAD_STATE, ...leadData });
            setLoading(false);
        } else {
            // If no leadData is passed, it implies a 'create new' scenario or an error.
            // For now, we just stop loading. The 'Create New Lead' dialog in Dashboard
            // handles creation separately. This form is now primarily for viewing/editing.
            setLead(EMPTY_LEAD_STATE);
            setLoading(false);
        }
    // This effect now runs whenever the selected lead object changes.
    }, [leadData]);

    // --- Handlers ---

    // Helper for text fields (updated to handle both flat and nested state)
    const renderTextField = (name, label, value, onChange, gridProps = { xs: 12, sm: 6, md: 4 }, placeholder = "") => (
        <Grid item {...gridProps}>
          <TextField
            fullWidth
            size="small"
            name={name}
            label={label}
            placeholder={placeholder}
            // Ensure value is a string for the TextField component
            value={value !== undefined && value !== null ? (Array.isArray(value) ? value.join(', ') : value.toString()) : ''}
            onChange={onChange}
            margin="dense"
            variant="outlined"
          />
        </Grid>
    );

    // Simplified handler for flat state
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLead((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    // Simplified handler for nested state (like coApplicant/references) - *Kept from your original code*
    const handleNestedChange = (section, e) => {
        const { name, value, type, checked } = e.target;
        const path = name.split('.');
        
        if (path.length > 1) { // For nested properties like references[0].name
            const indexMatch = path[0].match(/\[(\d+)\]/);
            if (!indexMatch) return; // Prevent crash if index is missing
            
            const index = parseInt(indexMatch[1]);
            const prop = path[0].replace(/\[\d+\]/, '');

            setLead(prev => {
                const newArray = [...prev[prop]];
                newArray[index] = {
                    ...newArray[index],
                    [path[1]]: type === 'checkbox' ? checked : value
                };
                return { ...prev, [prop]: newArray };
            });
        } else { // For top-level nested objects like coApplicant
            setLead(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: type === 'checkbox' ? checked : value,
                },
            }));
        }
    };
    
    // --- New Note Handlers ---

    const handleNoteChange = (e) => {
        setNewNote(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveNote = async () => {
        // If there's no lead._id, it's a create operation (though this form is now for updates)
        if (!lead._id) {
            // CREATE logic here (POST /api/leads)
            try {
                const createPayload = {
                    ...lead,
                    // Remove empty fields or handle as needed
                    mobileNumbers: lead.mobileNumbers.filter(num => num.trim() !== ''),
                    referralList: lead.referralList.filter(r => r.name || r.phoneNumber)
                };

                const response = await axios.post(API_URL, createPayload);
                alert('Lead created successfully!');
                // Optionally, redirect or update state to show the new lead
                // For now, just log and clear
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

        // Existing update logic for existing leads
        if (!newNote.notes && !newNote.callStatus) return; // Don't save empty notes

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
            setNewNote({ notes: '', callStatus: 'Connected' }); // Clear the note field
            // No need for a separate success alert, let the refreshed history show it.

        } catch (error) {
            console.error('Failed to save note/update lead:', error);
            alert('Failed to update lead. Check console for details.');
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Since the lead form is large, the main submit should trigger the full update
        handleSaveNote(); 
    };

    if (loading) return <Typography align="center" sx={{ mt: 5 }}>Loading Lead Details...</Typography>;

    // Calculate total expenses (Unchanged)
    const totalExpenses = (parseFloat(lead.fee) || 0) + (parseFloat(lead.living) || 0) + (parseFloat(lead.otherExpenses) || 0);


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
            Lead Management: {lead.fullName || 'New Applicant'}
        </Typography>
        <form onSubmit={handleSubmit}>

            {/* 1. TOP METADATA & SOURCE INFO - Organized into a Card */}
            <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                <Chip label={`Applied: ${lead.studentAppliedDate || 'N/A'} ${lead.studentAppliedTime || ''}`} color="primary" size="small" />
                                <Chip label={`FO: ${lead.assignedFO || 'N/A'} (${lead.assignedFOPhone || 'N/A'})`} color="secondary" size="small" />
                            </Box>
                            <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>Sources / Referral:</Typography>
                            <Link href="#" variant="body2" sx={{ ml: 1, mr: 2 }}>Show History</Link>
                            <Typography variant="body2" color="text.secondary">
                                **{lead.source.source || 'N/A'}**: {lead.source.name || 'N/A'} | {lead.source.email || 'N/A'} | {lead.source.phoneNumber || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Chip label={`Loan ID: ${lead.loanId || 'N/A'}`} variant="outlined" size="small" />
                                <Chip label={`User ID: ${lead.leadID || 'N/A'}`} variant="outlined" size="small" />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* --- NEW: CALL HISTORY & NOTES SECTION --- */}
            <Card variant="outlined" sx={{ mb: 4, borderColor: 'primary.main', borderWidth: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        📞 Call History & Notes
                    </Typography>

                    {/* Display History */}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Previous Logs ({lead.callHistory?.length || 0})</Typography>
                    <Box sx={{ maxHeight: 250, overflowY: 'auto', p: 2, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #eee' }}>
                        {lead.callHistory && lead.callHistory.length > 0 ? (
                            lead.callHistory.slice().reverse().map((log, index) => (
                                <Box key={index} sx={{ mb: 1.5, p: 1, borderLeft: '3px solid #1976d2', pl: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', color: 'text.secondary' }}>
                                        {moment(log.timestamp).format('DD MMM YYYY, h:mm A')} | Logged by: **{log.loggedByName || 'System'}**
                                        <Chip label={log.callStatus || 'Log'} size="small" color={log.callStatus === 'Connected' ? 'success' : 'default'} sx={{ ml: 1, height: 20 }} />
                                    </Typography>
                                    <Typography variant="body2" component="p" sx={{ mt: 0.5 }}>
                                        *"{log.notes}"*
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">No call history recorded yet.</Typography>
                        )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Add New Note */}
                    <Typography variant="h6" sx={{ mb: 2 }}>➕ Add New Note (Logged by: **{MOCK_USER_FULLNAME}**)</Typography>
                    <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                name="notes"
                                label="Notes / Conversation Summary"
                                placeholder="Enter detailed notes from the conversation..."
                                value={newNote.notes}
                                onChange={handleNoteChange}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Call Status *</InputLabel>
                                <Select name="callStatus" label="Call Status *" value={newNote.callStatus} onChange={handleNoteChange}>
                                    <MenuItem value="Connected">Connected</MenuItem>
                                    <MenuItem value="No Answer">No Answer</MenuItem>
                                    <MenuItem value="Busy">Busy</MenuItem>
                                    <MenuItem value="Invalid Number">Invalid Number</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* This button saves the note and updates the whole lead */}
                            <Button variant="contained" color="primary" onClick={handleSaveNote} fullWidth startIcon={<AddIcon />} size="medium">
                                Save Note
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Divider sx={{ my: 4 }} />

            {/* 2. ADD BASIC DETAILS */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>👤 Add Basic Details</Typography>
            <Grid container spacing={3}>
                {renderTextField("fullName", "Full Name *", lead.fullName, handleChange, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("email", "Email id *", lead.email, handleChange, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("mobileNumbers", "Mobile Numbers", lead.mobileNumbers, (e) => setLead(p => ({ ...p, mobileNumbers: [e.target.value] })), { xs: 12, sm: 6, md: 4 }, "e.g., +91-7569440543")}

                {renderTextField("permanentLocation", "Permanent Location in INDIA (City/District)", lead.permanentLocation, handleChange, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("state", "State", lead.state, handleChange, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("regionalHead", "Regional Head", lead.regionalHead, handleChange, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("planningToStudy", "Planning to Study in", lead.planningToStudy, handleChange, { xs: 12, sm: 6, md: 4 })}
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* 3. FURTHER EDUCATION DETAILS */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🎓 Further Education Details</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    {/* Loan Type Dropdown Placeholder */}
                    <FormControl fullWidth size="small"><InputLabel>Loan Type</InputLabel><Select label="Loan Type" /></FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {/* Course start month Dropdown Placeholder */}
                    <FormControl fullWidth size="small"><InputLabel>Course Start Month</InputLabel><Select label="Course Start Month" /></FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {/* Course start year Dropdown Placeholder */}
                    <FormControl fullWidth size="small"><InputLabel>Course Start Year</InputLabel><Select label="Course Start Year" /></FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {/* Degree Dropdown Placeholder */}
                    <FormControl fullWidth size="small"><InputLabel>Degree</InputLabel><Select label="Degree" /></FormControl>
                </Grid>

                {renderTextField("fieldOfInterest", "Field of Interest", lead.fieldOfInterest, handleChange, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("interestedCountries", "Interested Countries", lead.interestedCountries, handleChange, { xs: 12, sm: 6, md: 4 })}
                <Grid item xs={12} sm={6} md={4}>
                    {/* Admit Received Dropdown Placeholder */}
                    <FormControl fullWidth size="small"><InputLabel>Admit Received</InputLabel><Select label="Admit Received" /></FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    {renderTextField("admittedUniversities", "Admitted Universities", lead.admittedUniversities, handleChange, { xs: 12 }, "Add university")}
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Has the student already approached any bank? *</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={lead.approachedAnyBank} onChange={handleChange} name="approachedAnyBank" color="primary" />}
                        label={lead.approachedAnyBank ? "Yes" : "No"}
                    />
                    {lead.approachedAnyBank && renderTextField("previousBankApproached", "Previous Bank Approached", lead.previousBankApproached, handleChange, { xs: 12 })}
                </Grid>
            </Grid>

            <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                The above details are **Not matching** the prime university criteria.
            </Alert>
            <Button variant="contained" color="warning" sx={{ mb: 4 }}>HOME UNIVERSITY LIST</Button>

            <Divider sx={{ my: 4 }} />

            {/* 4. FAMILY/CO-APPLICANT INFO */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>👨‍👩‍👧‍👦 Student Relations (Co-Applicant/Guarantor)</Typography>
            <FormControlLabel
                control={<Checkbox checked={!lead.coApplicant.knowsCoApplicant} onChange={() => setLead(p => ({...p, coApplicant: {...p.coApplicant, knowsCoApplicant: !p.coApplicant.knowsCoApplicant}}))} />}
                label="Student doesn't know the Co-Applicant"
            />

            <Card variant="outlined" sx={{ my: 2, p: 2, bgcolor: '#f9f9f9' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>
                    {lead.coApplicant.relationshipType || 'Co-Applicant'} (Family)
                </Typography>
                <Grid container spacing={3}>
                    {renderTextField("relationshipType", "Relationship Type", lead.coApplicant.relationshipType, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}
                    {renderTextField("name", "Enter Name", lead.coApplicant.name, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}
                    <Grid item xs={12} sm={6} md={3}>
                        {/* Employment Type Dropdown Placeholder */}
                        <FormControl fullWidth size="small"><InputLabel>Employment Type</InputLabel><Select label="Employment Type" /></FormControl>
                    </Grid>
                    {renderTextField("annualIncome", "Annual Income (lacs)*", lead.coApplicant.annualIncome, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}
                    {renderTextField("phoneNumber", "Phone Number *", lead.coApplicant.phoneNumber, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}

                    {renderTextField("currentObligations", "Current Obligations", lead.coApplicant.currentObligations, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}
                    {renderTextField("cibilScore", "CIBIL Score *", lead.coApplicant.cibilScore, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}
                    {renderTextField("cibilIssues", "CIBIL Issues (if any) *", lead.coApplicant.cibilIssues, (e) => handleNestedChange('coApplicant', e), { xs: 12, sm: 6, md: 3 })}

                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox checked={lead.coApplicant.isCoApplicant} name="isCoApplicant" onChange={(e) => handleNestedChange('coApplicant', e)} />} label="This is the Co-applicant" />
                        <FormControlLabel control={<Checkbox checked={lead.coApplicant.isDivorced} name="isDivorced" onChange={(e) => handleNestedChange('coApplicant', e)} />} label="Expired/Divorced" />
                    </Grid>
                </Grid>
            </Card>
            <Button variant="outlined" startIcon={<AddIcon />} size="small" sx={{ mb: 4 }}>Add New Relation</Button>

            <Box sx={{ mb: 4, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>🏠 Own House Guarantor (OHG)</Typography>
                <FormControlLabel control={<Checkbox checked={lead.ownHouseGuarantor} onChange={handleChange} name="ownHouseGuarantor" />} label="Own House Guarantor" />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>Note: this property is NOT taken as a collateral</Typography>
                <Link href="#" variant="body2" sx={{ display: 'block' }}>Add/Change Own House Guarantor</Link>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 5. STUDENT REFERENCES & PAN DETAILS */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🤝 Student References & PAN Details</Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Student References</Typography>
                {lead.references.map((ref, index) => (
                    <Card variant="outlined" key={index} sx={{ mb: 2, p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>Reference {index + 1}</Typography>
                        <Grid container spacing={3}>
                            {renderTextField(`references[${index}].relationship`, "Relationship Name*", ref.relationship, (e) => handleNestedChange('references', e), { xs: 12, sm: 4 })}
                            {renderTextField(`references[${index}].address`, "Address*", ref.address, (e) => handleNestedChange('references', e), { xs: 12, sm: 4 })}
                            {renderTextField(`references[${index}].phoneNumber`, "Phone Number *", ref.phoneNumber, (e) => handleNestedChange('references', e), { xs: 12, sm: 4 })}
                        </Grid>
                    </Card>
                ))}
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Student PAN Details</Typography>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <RadioGroup row name="panStatus" value={lead.panStatus} onChange={handleChange}>
                        <FormControlLabel value="Not Interested" control={<Radio size="small" />} label="Not Interested" />
                        <FormControlLabel value="Not Available" control={<Radio size="small" />} label="Not Available" />
                        <FormControlLabel value="Applied" control={<Radio size="small" />} label="Applied" />
                    </RadioGroup>
                    {lead.panStatus === 'Applied' && (
                        <TextField size="small" label="PAN Card Number" value={lead.panNumber} onChange={handleChange} name="panNumber" sx={{ ml: 2, width: 300, mt: 1 }} />
                    )}
                </FormControl>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 6. REFER APPLICANT'S FRIENDS */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>👥 Refer Applicant's Friends</Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {lead.referralList.map((ref, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>Referral {index + 1}</Typography>
                            <TextField
                                fullWidth size="small" label={`Name`}
                                value={ref.name || ''} name={`referralList[${index}].name`}
                                onChange={(e) => handleNestedChange('referralList', e)}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth size="small" label="Phone Number"
                                value={ref.phoneNumber || ''} name={`referralList[${index}].phoneNumber`}
                                onChange={(e) => handleNestedChange('referralList', e)}
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                fullWidth size="small" label="Code"
                                value={ref.code || ''} name={`referralList[${index}].code`}
                                onChange={(e) => handleNestedChange('referralList', e)}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="outlined" startIcon={<AddIcon />} size="small"
                onClick={() => setLead(p => ({...p, referralList: [...p.referralList, { name: "", code: "", phoneNumber: "" }] }))}
                sx={{ mb: 4 }}
            >
                Add Referral
            </Button>

            <Divider sx={{ my: 4 }} />

            {/* 7. KVB CHECK & LOAN MARGIN CALC */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🏦 Loan Calculations & Branch Check</Typography>

            <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: '#fff4e5' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'orange' }}>Check KVB branch availability (50 kms radius)</Typography>
                <Grid container spacing={2} alignItems="center">
                    {renderTextField("collateralLocation", "Select from the dropdown only", lead.collateralLocation, handleChange, { xs: 10, sm: 8, md: 5 })}
                    <Grid item xs={2}><Button variant="contained" size="small" color="primary">CHECK</Button></Grid>
                </Grid>
            </Paper>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Union Bank Margin Calculation</Typography>
            <Grid container spacing={3} alignItems="center">
                {renderTextField("totalExpenses", `Total Expenses (Fee + Living + Other Expenses) *`, totalExpenses.toString(), () => {}, { xs: 12, sm: 6, md: 4 })}
                {renderTextField("maxUnsecuredGivenByUBI", "Maximum Unsecured loan given by UBI *", lead.maxUnsecuredGivenByUBI, handleChange, { xs: 12, sm: 6, md: 4 })}
                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Button variant="contained" color="success" size="medium" fullWidth sx={{ height: 40 }}>GET LOAN MARGIN</Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* 8. RECOMMENDED BANKS & ISSUES (BUTTON GROUPS) */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>💳 Recommended Banks & Issues</Typography>
            <Grid container spacing={4} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.dark' }}>Private Banks</Typography>
                    <Grid container spacing={2}>
                        {recommendedBanks.private.map((bank, index) => (
                            <Grid item xs={12} key={index}>
                                <Card variant="outlined" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body1">{bank.name}</Typography>
                                    <Button variant="contained" size="small">ASSIGN</Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.dark' }}>Public Banks</Typography>
                    <Grid container spacing={2}>
                        {recommendedBanks.public.map((bank, index) => (
                            <Grid item xs={12} key={index}>
                                <Card variant="outlined" sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body1">{bank.name}</Typography>
                                    <Button variant="contained" size="small">ASSIGN</Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Banks Related - Issues</Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {loanIssues.map((issue, index) => (<Grid item key={index}><Chip label={issue} color="secondary" clickable /></Grid>))}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Miscellaneous Situations</Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    {miscSituations.map((item, index) => (<Grid item key={index}><Chip label={item} color="info" clickable /></Grid>))}
                </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 9. TEMPLATES, DOCUMENTS, CALCULATORS */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>📧 Tools & Resources</Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Email Templates</Typography>
                <Grid container spacing={1}>{emailTemplates.map((item, index) => (<Grid item key={index}><Button variant="contained" color="error" size="small">{item}</Button></Grid>))}</Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Banks Connection - Intro & Docs Upload</Typography>
                <Grid container spacing={1}>
                    {banksDocs.map((item, index) => (<Grid item key={index}><Button variant="contained" color="success" startIcon={<CheckCircleOutlineIcon />} size="small">{item}</Button></Grid>))}
                </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Document Status</Typography>
                <Grid container spacing={1}>
                    {documentStatus.map((item, index) => (<Grid item key={index}><Button variant="contained" color="info" size="small">{item}</Button></Grid>))}
                </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Loan Calculators</Typography>
                <Grid container spacing={1}>
                    <Grid item><Button variant="contained" color="error" size="small">EDUCATION LOAN EMI CALCULATOR</Button></Grid>
                    <Grid item><Button variant="contained" color="error" size="small">$ USD TO INR EDUCATION LOAN CALCULATOR</Button></Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 10. SANCTION DATE & REMINDERS */}
            <Typography variant="h5" gutterBottom sx={{ color: 'secondary.main', fontWeight: 'bold' }}>🗓️ Reminders & Final Status</Typography>

            <Card elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Targeted Sanction Date</Typography>
                <Typography variant="caption" display="block">Previous selected date: Not selected</Typography>
                <FormControlLabel control={<Checkbox />} label="Not possible to sanction in this month or the next month" />
            </Card>

            <Grid container spacing={3}>
                {renderTextField("lastCallDate", "Last call date", lead.lastCallDate, handleChange, { xs: 12, sm: 6, md: 3 })}
                {renderTextField("reminderCallDate", "Next call date", lead.reminderCallDate, handleChange, { xs: 12, sm: 6, md: 3 })}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Final Status</InputLabel>
                        <Select name="leadStatus" label="Final Status" value={lead.leadStatus} onChange={handleChange}>
                            <MenuItem value="No status">No status</MenuItem>
                            <MenuItem value="Sanctioned">Sanctioned</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                            <MenuItem value="Application Incomplete">Application Incomplete</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {renderTextField("preferredNextCallTime", "Preferred Next Call time", lead.preferredNextCallTime || '', handleChange, { xs: 12, sm: 6, md: 3 })}

                <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox />} label="Clear Preferred Next Call Time" sx={{ mr: 3 }} />
                    <FormControlLabel control={<Checkbox />} label="Student is not eligible for Connecting to Advisar" />
                </Grid>
            </Grid>

            {/* Main Submit Button */}
            <Button variant="contained" color="primary" sx={{ mt: 5, p: 1.5 }} type="submit" size="large" fullWidth>
                ✅ SUBMIT LEAD DATA & SAVE NOTES
            </Button>
        </form>
    </Paper>
);
};

export default LeadForm;