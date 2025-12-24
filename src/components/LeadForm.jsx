
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Autocomplete, TextField as MuiTextField, Button as MuiButton, Box, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { ContentCopy as ContentCopyIcon, Close as CloseIcon } from '@mui/icons-material';
import moment from 'moment'; 

// You should ensure this file exists for custom styles like container width
import CallHistorySection from "./CallHistorySection";
import BasicDetailsSection from "./BasicDetailsSection";
import RelationCard from "./RelationCard";
import AssetCard from "./AssetCard";
import {
    EMPTY_LEAD_STATE, loanIssues, miscSituations, emailTemplates, banksDocs, documentStatus,
    indianStates, indianCitiesWithState, courseStartQuarters, courseStartYears, degrees, EMAIL_TEMPLATE_CONTENT,
    fieldsOfInterest, admissionStatuses, universities, employmentTypes, courseDurations, referenceRelationships, currencies, countryPhoneCodes, leadStatusOptions, priorityReasons, closeReasons,
    allCountries, API_URL, MOCK_USER_FULLNAME,
    NLTemplates,
} from "../constants";

// --- NEW: API Key for Currency Conversion ---
const EXCHANGE_RATE_API_KEY = 'ddf59026d05ae4b9a8461fcf'; 
// IMPORTANT: Get a free key from https://www.exchangerate-api.com and replace this placeholder.

// Custom Accordion component using Tailwind CSS
const Accordion = ({ title, icon, children, defaultExpanded = false }) => {
    const [isOpen, setIsOpen] = useState(defaultExpanded);

    return (
        <div className="border border-gray-200 rounded-lg mb-2">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none">
                <h3 className="text-lg font-bold text-gray-700 flex items-center">{icon} {title}</h3>
                <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200">{children}</div>
            )}
        </div>
    );
};

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
    // --- NEW: State for Task Creation ---
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [task, setTask] = useState({ assignedTo: null, subject: '', body: '' });
    const [taskMessage, setTaskMessage] = useState('');
    const [combinedHistory, setCombinedHistory] = useState([]);
    const [showTaskCreator, setShowTaskCreator] = useState(false);
    const [emailMessage, setEmailMessage] = useState('');
    // --- NEW: State for Email Modal ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [currentEmailTemplate, setCurrentEmailTemplate] = useState({ name: '', subject: '', body: '' });
    const [emailStatus, setEmailStatus] = useState('');
    const [isConversionRateEditable, setIsConversionRateEditable] = useState(false);
    const [activeConverter, setActiveConverter] = useState(null); // NEW: To manage which converter is active
    // --- NEW: State for Bank Search ---
    const [bankSearchPincode, setBankSearchPincode] = useState('');
    const [bankSearchResults, setBankSearchResults] = useState([]);
    const [isBankSearching, setIsBankSearching] = useState(false);
    const [bankSearchMessage, setBankSearchMessage] = useState('');

    // --- NEW: State for Bank Assignment Modal ---
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedBankForAssignment, setSelectedBankForAssignment] = useState(null);
    const [assignmentRegion, setAssignmentRegion] = useState('');
    const [assignmentRM, setAssignmentRM] = useState('');
    const [assignmentError, setAssignmentError] = useState('');


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

        // --- NEW: Fetch assignable users for the task dropdown ---
        const fetchAssignableUsers = async () => {
            try {
                const response = await axios.get(`${API_URL.replace('/leads', '/users')}/assignable`);
                setAssignableUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch assignable users:", error);
            }
        };
        fetchAssignableUsers();

        const fetchAndCombineHistory = async (leadId) => {
            try {
                // Fetch both call history (from lead object) and tasks
                const [leadResponse, tasksResponse] = await Promise.all([
                    axios.get(`${API_URL}/${leadId}`),
                    axios.get(`${API_URL.replace('/leads', '/tasks')}/lead/${leadId}`)
                ]);

                const leadResult = leadResponse.data;
                const tasksResult = tasksResponse.data;

                // Combine and sort
                const callHistory = leadResult.callHistory.map(note => ({ ...note, type: 'note' }));
                const taskHistory = tasksResult.map(task => ({ ...task, type: 'task' }));
                const allHistory = [...callHistory, ...taskHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setCombinedHistory(allHistory);
                return leadResult; // Return lead data to be processed
            } catch (error) {
                console.error("Failed to fetch combined history:", error);
            }
        };
        const processLeadData = (data) => {
            const dataToSet = { ...EMPTY_LEAD_STATE, ...data };
            if (!dataToSet.mobileNumbers || dataToSet.mobileNumbers.length === 0) { dataToSet.mobileNumbers = ["+91-"]; }
            if (!dataToSet.relations || dataToSet.relations.length === 0) { dataToSet.relations = [{ relationshipType: 'Father', name: '', employmentType: '', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false }]; }
            if (!dataToSet.relations || dataToSet.relations.length === 0) { dataToSet.relations = [{ relationshipType: 'Father', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false, documents: [] }]; }
            if (!dataToSet.references || dataToSet.references.length < 2) {
                const existingRefs = dataToSet.references || [];
                dataToSet.references = [...existingRefs, ...Array(2 - existingRefs.length).fill({ relationship: '', name: '', address: '', phoneNumber: '' })].slice(0, 2);
            }
            setLead(dataToSet);
            setLoading(false);
        };

        if (leadData && leadData._id) {
            // If we only have an ID (from task click), fetch the full lead.
            // The presence of `fullName` is a good indicator we have the full object.
            if (!leadData.fullName) {
                const fetchFullLead = async (id) => {
                    setLoading(true);
                    const fullLeadData = await fetchAndCombineHistory(id);
                    if (fullLeadData) processLeadData(fullLeadData);
                };
                fetchFullLead(leadData._id);
            } else {
                // Full lead object was passed, process it directly.
                processLeadData(leadData);
            }
        } else { 
            // This is for creating a new lead
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
                relations: [{ relationshipType: 'Father', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false, documents: [] }],
                mobileNumbers: leadData?.mobileNumber ? [leadData.mobileNumber] : ["+91- "],
                referralList: [{ name: "", code: "", phoneNumber: "" }],
            });
        }
    // This effect now runs whenever the selected lead object changes.
    }, [leadData]);

    // --- EFFECT: Pre-populate fields from Sanction Details ---
    useEffect(() => {
        // When a sanctioned loan amount is entered, update the main 'fee' field.
        if (lead.sanctionDetails.loanAmount) {
            const sanctionedAmount = parseFloat(lead.sanctionDetails.loanAmount);
            if (!isNaN(sanctionedAmount) && sanctionedAmount !== parseFloat(lead.fee)) {
                setLead(prev => ({ ...prev, fee: sanctionedAmount.toString() }));
            }
        }

        // When a co-applicant name is entered, update the relations array.
        if (lead.sanctionDetails.coApplicant) {
            const coApplicantName = lead.sanctionDetails.coApplicant;
            const existingRelations = lead.relations || [];
            const coApplicantExists = existingRelations.some(rel => rel.name.toLowerCase() === coApplicantName.toLowerCase());

            if (!coApplicantExists) {
                // Un-mark any previous co-applicants
                const updatedRelations = existingRelations.map(rel => ({ ...rel, isCoApplicant: false }));
                
                // Add the new co-applicant
                updatedRelations.push({
                    ...EMPTY_LEAD_STATE.relations[0], // Start with a blank relation object
                    name: coApplicantName,
                    isCoApplicant: true,
                });

                setLead(prev => ({ ...prev, relations: updatedRelations }));
            }
        }
    }, [lead.sanctionDetails.loanAmount, lead.sanctionDetails.coApplicant]);

    // --- NEW EFFECT: Fetch conversion rate when currency changes ---
    useEffect(() => {
        // Only fetch if a converter is active
        if (!activeConverter || EXCHANGE_RATE_API_KEY === 'YOUR_API_KEY_HERE') {
            if (EXCHANGE_RATE_API_KEY === 'YOUR_API_KEY_HERE') {
                console.warn("Exchange rate API key is not set. Conversion rates will not be fetched automatically. Please get a free key from exchangerate-api.com and add it to LeadForm.jsx");
            }
            return;
        }

        // Set the currency in the lead state
        setLead(prev => ({ ...prev, originalFeeCurrency: activeConverter }));



        const fetchConversionRate = async () => {
            try {
                const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${activeConverter}`);
                const rate = response.data.conversion_rates.INR;
                if (rate) {
                    setLead(prev => ({ ...prev, conversionRate: rate.toFixed(2) }));
                    setIsConversionRateEditable(false); // Make it read-only after fetching
                }
            } catch (error) {
                console.error("Failed to fetch conversion rate:", error);
            }
        };

        fetchConversionRate();
    }, [activeConverter]); // Re-fetch when the active converter changes

    // --- EFFECT: Calculate Fee in INR from original currency ---
    useEffect(() => {
        const originalFee = parseFloat(lead.originalFee);
        const rate = parseFloat(lead.conversionRate);

        if (!isNaN(originalFee) && !isNaN(rate) && rate > 0) {
            const feeInLakhs = (originalFee * rate) / 100000;
            // Update the main 'fee' field, keeping it as a string.
            setLead(prev => ({ ...prev, fee: feeInLakhs.toFixed(2).toString() }));
        }
    }, [lead.originalFee, lead.conversionRate]);

    // --- Handlers ---

    // Helper for text fields (updated to handle both flat and nested state)
    const renderTextField = (name, label, value, onChange, widthClass = "w-full md:w-1/3", placeholder = "") => (
        <div className={`p-2 ${widthClass}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                id={name}
                name={name}
                placeholder={placeholder}
                value={value !== undefined && value !== null ? (Array.isArray(value) ? value.join(', ') : value.toString()) : ''}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
    );

    // Helper for select/dropdown fields
    const renderSelectField = (name, label, value, onChange, options, widthClass = "w-full md:w-1/3") => (
        <div className={`p-2 ${widthClass}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
                {options && options.length > 0 ?
                    options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    )) : (
                    <option value="" disabled>
                        No options available
                    </option>
                )}
            </select>
        </div>
    );

    // Simplified handler for flat state
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (
            name === 'approachedAnyBank' || 
            name === 'hasStudentLoans' || 
            name === 'hasCibilIssues' || 
            name === 'documentsAvailable' ||
            name === 'fileLoggedIn' || name === 'loanSanctioned'
        ) {
            // Radio group value is a string, convert to boolean
            const boolValue = value === 'true';
            setLead((prev) => ({
                ...prev,
                [name]: boolValue,
                // Also clear dependent fields if user selects "No"
                previousBankApproached: name === 'approachedAnyBank' && !boolValue ? '' : prev.previousBankApproached,
                fileLoggedIn: name === 'approachedAnyBank' && !boolValue ? null : (name === 'fileLoggedIn' ? boolValue : prev.fileLoggedIn),
                loanSanctioned: name === 'approachedAnyBank' && !boolValue ? null : (name === 'loanSanctioned' ? boolValue : prev.loanSanctioned),
                sanctionDetails: name === 'approachedAnyBank' && !boolValue ? EMPTY_LEAD_STATE.sanctionDetails : prev.sanctionDetails, // Clear sanction details
            }));
        } else if (name === 'admissionStatus' && value === 'Received Admission') {
            setLead(prev => ({
                ...prev,
                leadStatus: 'On Priority',
                [name]: value
            }));
        } else {
            setLead((prev) => ({ 
                ...prev, 
                [name]: type === 'checkbox' ? checked : value 
            }));
        }
    };

    // Handler for DatePicker changes
    const handleDateChange = (name, newValue) => {
        setLead(prev => ({
            ...prev,
            [name]: newValue ? new Date(newValue).toISOString() : null
        }));
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
    
    const handleSanctionDetailsChange = (e) => { // Renamed and corrected
        const { name, value, type, checked } = e.target;
        // For radio buttons, the value is a string 'true' or 'false', or 'Secure'/'Unsecure'
        const finalValue = (value === 'true') ? true : (value === 'false' ? false : value);
        
        setLead(prev => ({
            ...prev, sanctionDetails: { ...prev.sanctionDetails, [name]: finalValue }
        }));
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
        const newRelation = { relationshipType: '', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false, documents: [] };
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
        const newAsset = { assetType: 'Physical Property', ownerName: '', ownerRelationship: '', assetValue: '' };
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
    const renderAutocompleteField = (name, label, value, onChange, options, widthClass = "w-full md:w-1/3") => (
        <div className={`p-2 ${widthClass}`}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                id={name}
                name={name}
                value={value || ''}
                onChange={onChange}
                list={`${name}-list`}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <datalist id={`${name}-list`}>
                {options.map(option => (
                    <option key={option} value={option} />
                ))}
            </datalist>
        </div>
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
                newNote: {
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
    const handleBankSearch = async () => {
    if (!bankSearchPincode.trim()) {
        setBankSearchMessage('Please enter a pincode to search.');
        return;
    }

    setIsBankSearching(true);
    setBankSearchResults([]);
    setBankSearchMessage('');

    try {
        const response = await axios.get(
            `${API_URL.replace('/leads', '/banks')}/search-by-pincode`,
            {
                params: { pincode: bankSearchPincode }
            }
        );

        if (response.data.length === 0) {
            setBankSearchMessage(
                `No tied-up banks found for pincode ${bankSearchPincode}.`
            );
        }

        setBankSearchResults(response.data);
    } catch (error) {
        console.error('Failed to search for banks:', error);
        setBankSearchMessage('Failed to search for banks. Please try again.');
    } finally {
        setIsBankSearching(false);
    }
};


    const handleOpenAssignModal = (bank) => {
        setSelectedBankForAssignment(bank);
        setAssignmentRegion('');
        setAssignmentRM('');
        setAssignmentError('');
        setIsAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedBankForAssignment(null);
    };

    const handleAssignToBank = async () => {
        if (!lead._id) {
            alert('Please save the lead before assigning it to a bank.');
            return;
        }
        if (!assignmentRM) {
            setAssignmentError('Please select a Relationship Manager.');
            return;
        }

        const rmDetails = JSON.parse(assignmentRM);

        try {
            const response = await axios.post(`${API_URL}/${lead._id}/assign-bank`, {
                bankId: selectedBankForAssignment._id,
                bankName: selectedBankForAssignment.name,
                assignedRMName: rmDetails.name,
                assignedRMEmail: rmDetails.email
            });
            onUpdate(response.data.lead); // Pass the updated lead object to the parent
            alert(response.data.message); // Show the specific success message from the backend
            handleCloseAssignModal();
        } catch (error) {
            console.error('Failed to assign lead to bank:', error);
            setAssignmentError(error.response?.data?.message || 'An error occurred during assignment.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since the lead form is large, the main submit should trigger the full update
        handleSaveNote(); 
    };

    // --- NEW: Task Creation Handler ---
    const handleCreateTask = async () => {
        if (!lead._id || !task.assignedTo || !task.subject) {
            setTaskMessage('Please select an employee and enter a subject.');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser) {
            setTaskMessage('Could not identify the creator. Please log in again.');
            return;
        }

        const payload = {
            leadId: lead._id,
            assignedToId: task.assignedTo._id,
            assignedToName: task.assignedTo.fullName,
            subject: task.subject,
            body: task.body,
            createdById: currentUser._id,
            createdByName: currentUser.fullName,
        };

        try {
            await axios.post(API_URL.replace('/leads', '/tasks'), payload);
            setTaskMessage('Task created successfully!');
            // Reset task form
            setTask({ assignedTo: null, subject: '', body: '' });
            setTimeout(() => setTaskMessage(''), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error('Failed to create task:', error);
            setTaskMessage(error.response?.data?.message || 'Failed to create task.');
        }
    };

    const handleTaskChange = (e) => {
        setTask(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // --- NEW: Email Modal Handlers ---
    const handleOpenEmailModal = (templateName) => {
        const template = EMAIL_TEMPLATE_CONTENT[templateName];
        if (template) {
            let finalBody = template.body.replace(/\[Student Name\]/g, lead.fullName || 'Student');

            // If it's a bank connection email, inject the document upload link
            if (banksDocs.includes(templateName) || documentStatus.includes(templateName)) { // Also check documentStatus templates
                const uploadLink = `http://localhost:3000/leads/${lead._id}/documents`;
                const uploadLinkHtml = `<p>To proceed, please upload your documents using the secure link below:</p><p><a href="${uploadLink}" style="color: #007bff; text-decoration: underline;">${uploadLink}</a></p>`;
                // Replace a placeholder in the template with the actual link
                finalBody = finalBody.replace('[UPLOAD_LINK_PLACEHOLDER]', uploadLinkHtml);
            }

            setCurrentEmailTemplate({ name: templateName, subject: template.subject, body: finalBody });
            setIsEmailModalOpen(true);
            setEmailStatus('');
        }
    };

    const handleCloseEmailModal = () => {
        setIsEmailModalOpen(false);
    };

    const handleCopyEmailBody = () => {
        // Create a temporary element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentEmailTemplate.body;
        // Get the text content, which strips HTML tags
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        navigator.clipboard.writeText(textContent);
        setEmailStatus('Content copied to clipboard!');
        setTimeout(() => setEmailStatus(''), 2000);
    };

    const handleSendTemplateEmail = async () => {
        if (!lead._id) {
            setEmailStatus('Please save the lead before sending an email.');
            return;
        }
        setEmailStatus('Sending...');
        try {
            const response = await axios.post(`${API_URL}/${lead._id}/send-email`, {
                subject: currentEmailTemplate.subject,
                body: currentEmailTemplate.body
            });
            setEmailStatus(response.data.message);
            setTimeout(() => {
                handleCloseEmailModal();
            }, 2000);
        } catch (error) {
            setEmailStatus(error.response?.data?.message || 'Failed to send email.');
            console.error('Failed to send template email:', error);
        }
    };

    const handleSendDocumentEmail = async () => {
        if (!lead._id) {
            setEmailMessage('Please save the lead before sending an email.');
            return;
        }
        setEmailMessage('Sending email...');
        try {
            const response = await axios.post(`${API_URL}/${lead._id}/send-document-link`);
            setEmailMessage(response.data.message);
        } catch (error) {
            setEmailMessage(error.response?.data?.message || 'Failed to send email.');
            console.error('Failed to send email:', error);
        } finally {
            setTimeout(() => setEmailMessage(''), 5000); // Clear message after 5 seconds
        }
    };

    if (loading) return <p className="text-center mt-5">Loading Lead Details...</p>;

    // Calculate total expenses (Unchanged)
    const totalFee = (parseFloat(lead.fee) || 0) + (parseFloat(lead.living) || 0) + (parseFloat(lead.otherExpenses) || 0);

    return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-xl">
        {/* --- Header with Create Task Button --- */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <h1 className="text-3xl font-bold text-gray-800">
                {lead._id ? `Lead: ${lead.fullName}` : 'Create New Lead'}
            </h1>
            {lead._id && (
                <MuiButton variant="contained" color="secondary" onClick={() => setShowTaskCreator(!showTaskCreator)}>
                    {showTaskCreator ? 'Cancel Task' : 'Create Task'}
                </MuiButton>
            )}
        </Box>

        {/* --- NEW: Inline Task Creator --- */}
        {showTaskCreator && (
            <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>Create New Task for {lead.fullName}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Autocomplete
                        options={assignableUsers}
                        getOptionLabel={(option) => `${option.fullName} (${option.role})`}
                        value={task.assignedTo}
                        onChange={(event, newValue) => setTask(prev => ({ ...prev, assignedTo: newValue }))}
                        renderInput={(params) => <MuiTextField {...params} label="Assign Task To" variant="outlined" size="small" />}
                    />
                    <MuiTextField fullWidth label="Task Subject" name="subject" value={task.subject} onChange={handleTaskChange} variant="outlined" size="small" />
                    <MuiTextField fullWidth label="Task Body (Optional)" name="body" value={task.body} onChange={handleTaskChange} multiline rows={3} variant="outlined" size="small" />
                    {taskMessage && <p className={`text-sm ${taskMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{taskMessage}</p>}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <MuiButton onClick={() => setShowTaskCreator(false)}>Cancel</MuiButton>
                        <MuiButton variant="contained" onClick={handleCreateTask}>
                            Create Task
                        </MuiButton>
                    </Box>
                </Box>
            </Paper>
        )}
        
        {/* --- UNIFIED HISTORY SECTION --- */}
        {/* <Accordion title="Lead History" icon="📜" defaultExpanded>
            <div className="space-y-4">
                {combinedHistory.length > 0 ? (
                    combinedHistory.map((item) => (
                        <div key={item._id} className={`p-3 rounded-lg border-l-4 ${item.type === 'note' ? 'bg-blue-50 border-blue-400' : 'bg-yellow-50 border-yellow-400'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-bold text-sm">
                                    {item.type === 'note' ? `Note by ${item.loggedByName}` : `Task Created by ${item.createdByName}`}
                                </p>
                                <p className="text-xs text-gray-500">{moment(item.createdAt).format('DD MMM YYYY, h:mm a')}</p>
                            </div>
                            {item.type === 'note' ? (
                                <p className="text-gray-700 text-sm">{item.notes}</p>
                            ) : (
                                <div>
                                    <p className="text-gray-800 text-sm">
                                        <span className="font-semibold">Subject:</span> {item.subject}
                                    </p>
                                    <p className="text-gray-800 text-sm">
                                        <span className="font-semibold">Assigned to:</span> {item.assignedToName}
                                    </p>
                                    {item.body && <p className="text-gray-600 text-xs mt-1 pl-2 border-l-2 border-gray-300">{item.body}</p>}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No history or tasks for this lead yet.</p>
                )}
            </div>
        </Accordion> */}

        <form onSubmit={handleSubmit}>

            {/* 1. TOP METADATA & SOURCE INFO - Organized into a Card */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="p-2 space-y-2">
                    {/* First line: Applied Date and FO */}
                    <div className="flex flex-wrap items-center gap-2">
                        {lead.studentAppliedDate ? (
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                {`Applied On: Date: ${moment(lead.studentAppliedDate).format('DD MMM YYYY')} | Time: ${moment(lead.studentAppliedDate).format('h:mm A')}`}
                            </span>
                        ) : null}
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">{`FO: ${lead.assignedFO || 'N/A'} (${lead.assignedFOPhone || 'N/A'})`}</span>
                        <span className="text-xs font-mono inline-block py-1 px-2 border border-gray-300 rounded">{`Loan ID: ${lead.loanId || 'N/A'}`}</span>
                        <span className="text-xs font-mono inline-block py-1 px-2 border border-gray-300 rounded">{`User ID: ${lead.leadID || 'N/A'}`}</span>
                    </div>
                    {/* Second line: IDs and Source */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-gray-600">
                            <strong className="font-bold text-gray-800">Source/Referal:</strong> {lead.source.source || 'N/A'}
                            {lead.source.source === 'Referral' ? 
                                ` - ${lead.source.name || 'N/A'} (${lead.source.email || 'N/A'}, ${lead.source.phoneNumber || 'N/A'})` :
                                ` - ${lead.source.name || 'N/A'}`
                            }
                        </span>
                    </div>
                </div>
            </div>

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
            <div className="mt-4">
                {/* 3. FURTHER EDUCATION DETAILS */}
                <Accordion title="Further Education Details" icon="🎓" defaultExpanded>
                    <div className="flex flex-wrap -mx-2">
                            {renderSelectField("loanType", "Loan Type", lead.loanType, handleChange, ['Balance Transfer', 'New Loan'], "w-full sm:w-1/2 md:w-1/4")}
                            {renderSelectField("courseStartMonth", "Course Start Month", lead.courseStartMonth, handleChange, courseStartQuarters, "w-full sm:w-1/2 md:w-1/4")}
                            {renderSelectField("courseStartYear", "Course Start Year", lead.courseStartYear, handleChange, courseStartYears, "w-full sm:w-1/2 md:w-1/4")}
                            {renderSelectField("degree", "Degree", lead.degree, handleChange, degrees, "w-full sm:w-1/2 md:w-1/4")}
                            {renderSelectField("fieldOfInterest", "Field of Interest", lead.fieldOfInterest, handleChange, fieldsOfInterest)}
                            {renderAutocompleteField("interestedCountries", "Interested Countries", lead.interestedCountries, handleChange, allCountries)}
                            {renderSelectField("admissionStatus", "Admission Status", lead.admissionStatus, handleChange, admissionStatuses)}
                            {/* --- NEW: Conditional Date Pickers --- */}
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                {lead.admissionStatus === 'Applied - No Admit Yet' && (
                                    <div className="p-2 w-full md:w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Admit Date</label>
                                        <DatePicker
                                            value={lead.expectedAdmitDate ? moment(lead.expectedAdmitDate) : null}
                                            onChange={(newValue) => handleDateChange('expectedAdmitDate', newValue)}
                                        />
                                    </div>
                                )}
                                {lead.admissionStatus === 'Not Yet Applied' && (
                                    <div className="p-2 w-full md:w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Application Date</label>
                                        <DatePicker
                                            value={lead.expectedApplicationDate ? moment(lead.expectedApplicationDate) : null}
                                            onChange={(newValue) => handleDateChange('expectedApplicationDate', newValue)}
                                        />
                                    </div>
                                )}
                            </LocalizationProvider>
                            {renderAutocompleteField("admittedUniversities", "Admitted Universities", lead.admittedUniversities, handleChange, universities, "w-full md:w-1/2")}
                            <div className="p-2 w-full md:w-1/2">
                                <fieldset>
                                    <legend className="text-sm font-medium text-gray-700">Has the student already approached any bank? *</legend>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="flex items-center">
                                            <input type="radio" name="approachedAnyBank" value="true" checked={lead.approachedAnyBank === true} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600" />
                                            <span className="ml-2">Yes</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="approachedAnyBank" value="false" checked={lead.approachedAnyBank === false} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600" />
                                            <span className="ml-2">No</span>
                                        </label>
                                    </div>
                                </fieldset>
                                {lead.approachedAnyBank && <input type="text" name="previousBankApproached" placeholder="Previous Bank Approached" value={lead.previousBankApproached} onChange={handleChange} className="mt-2 w-full p-2 border border-gray-300 rounded-md" />}
                            </div>
                            {/* --- NEW: Dynamic Section for Bank Approach --- */}
                            {lead.approachedAnyBank && (
                                <div className="w-full p-2 mt-4 border-t pt-4">
                                    <fieldset className="mb-4">
                                        <legend className="text-sm font-medium text-gray-700">Has the file been logged in at {lead.previousBankApproached || 'the bank'}?</legend>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <label className="flex items-center"><input type="radio" name="fileLoggedIn" value="true" checked={lead.fileLoggedIn === true} onChange={handleChange} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                            <label className="flex items-center"><input type="radio" name="fileLoggedIn" value="false" checked={lead.fileLoggedIn === false} onChange={handleChange} className="form-radio" /> <span className="ml-2">No</span></label>
                                        </div>
                                    </fieldset>

                                    {lead.fileLoggedIn === false && (
                                        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800">
                                            <h4 className="font-bold">Advantages of going with Justap:</h4>
                                            <ul className="list-disc list-inside text-sm mt-2">
                                                <li>We have direct tie-ups which can speed up your application.</li>
                                                <li>Our expert team ensures your file is complete and correct, reducing rejection chances.</li>
                                                <li>You get a dedicated advisor to guide you through the entire process.</li>
                                            </ul>
                                        </div>
                                    )}

                                    {lead.fileLoggedIn === true && (
                                        <fieldset className="mb-4">
                                            <legend className="text-sm font-medium text-gray-700">Has the loan been sanctioned?</legend>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <label className="flex items-center"><input type="radio" name="loanSanctioned" value="true" checked={lead.loanSanctioned === true} onChange={handleChange} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                                <label className="flex items-center"><input type="radio" name="loanSanctioned" value="false" checked={lead.loanSanctioned === false} onChange={handleChange} className="form-radio" /> <span className="ml-2">No</span></label>
                                            </div>
                                        </fieldset>
                                    )}

                                    {lead.loanSanctioned === true && (
                                        <div className="p-4 border rounded-md bg-gray-50 space-y-4">
                                            <h4 className="font-bold text-gray-800">Sanction Details</h4>
                                            <div className="flex flex-wrap -mx-2">
                                                {renderTextField("rateOfInterest", "Rate of Interest (%)", lead.sanctionDetails.rateOfInterest, (e) => handleNestedChange('sanctionDetails', e), "w-full sm:w-1/2 md:w-1/3")}
                                                {renderTextField("loanAmount", "Loan Amount (Lakhs)", lead.sanctionDetails.loanAmount, (e) => handleNestedChange('sanctionDetails', e), "w-full sm:w-1/2 md:w-1/3")}
                                                {renderTextField("coApplicant", "Co-Applicant", lead.sanctionDetails.coApplicant, (e) => handleNestedChange('sanctionDetails', e), "w-full sm:w-1/2 md:w-1/3")}
                                                <div className="p-2 w-full sm:w-1/2 md:w-1/3"><fieldset><legend className="text-sm">Processing Fee Paid?</legend><label><input type="radio" name="processingFeePaid" value="true" checked={lead.sanctionDetails.processingFeePaid === true} onChange={handleSanctionDetailsChange} /> Yes</label><label className="ml-4"><input type="radio" name="processingFeePaid" value="false" checked={lead.sanctionDetails.processingFeePaid === false} onChange={handleSanctionDetailsChange} /> No</label></fieldset></div>
                                                <div className="p-2 w-full sm:w-1/2 md:w-1/3"><fieldset><legend className="text-sm">Disbursement Done?</legend><label><input type="radio" name="disbursementDone" value="true" checked={lead.sanctionDetails.disbursementDone === true} onChange={handleSanctionDetailsChange} /> Yes</label><label className="ml-4"><input type="radio" name="disbursementDone" value="false" checked={lead.sanctionDetails.disbursementDone === false} onChange={handleSanctionDetailsChange} /> No</label></fieldset></div>
                                                <div className="p-2 w-full sm:w-1/2 md:w-1/3"><fieldset><legend className="text-sm">Loan Security</legend><label><input type="radio" name="loanSecurity" value="Secure" checked={lead.sanctionDetails?.loanSecurity === 'Secure'} onChange={handleSanctionDetailsChange} /> Secure</label><label className="ml-4"><input type="radio" name="loanSecurity" value="Unsecure" checked={lead.sanctionDetails.loanSecurity === 'Unsecure'} onChange={handleSanctionDetailsChange} /> Unsecure</label></fieldset></div>
                                            </div>
                                        </div>
                                    )}

                                    {lead.fileLoggedIn && lead.loanSanctioned !== null && (
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
                                                <h4 className="font-bold">Disadvantages of Current Choice:</h4>
                                                <ul className="list-disc list-inside text-sm mt-2">
                                                    <li>You might be missing out on better interest rates from other lenders.</li>
                                                    <li>The process could be slower without a dedicated follow-up team.</li>
                                                    <li>Hidden charges or complex terms might not be immediately obvious.</li>
                                                    <li>Lack of a single point of contact for all your queries.</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800">
                                                <h4 className="font-bold">Advantages if you go with Justap:</h4>
                                                <ul className="list-disc list-inside text-sm mt-2">
                                                    <li>We compare offers from multiple banks to find you the best deal.</li>
                                                    <li>Our team actively follows up to ensure the fastest possible sanction.</li>
                                                    <li>Complete transparency on all fees and charges.</li>
                                                    <li>A dedicated Justap advisor as your single point of contact.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
                            Enter a university and click the button below to check the prime university list.
                    </div>
                    <button type="button" className="mt-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600" onClick={handleShowPrimeBanks}>PRIME UNIVERSITY LIST</button>

                        {/* Inline Bank List Display */}
                        {primeBankList.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-xl font-semibold mb-2">Prime Banks for "{fetchedForUniversity}"</h4>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max Loan Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {primeBankList.map((bank, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bank.bankName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{bank.maxLoanAmount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                </Accordion>
                
                {/* NEW: Test Scores Section */}
                <Accordion title="Test Scores" icon="📝">
                    <div className="flex flex-wrap -mx-2">
                            {renderTextField("GRE", "GRE (200-990)", lead.testScores.GRE, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("IELTS", "IELTS (0-9)", lead.testScores.IELTS, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("TOEFL", "TOEFL (0-120)", lead.testScores.TOEFL, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("GMAT", "GMAT (200-800)", lead.testScores.GMAT, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("SAT", "SAT (400-1600)", lead.testScores.SAT, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("PTE", "PTE (10-90)", lead.testScores.PTE, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("ACT", "ACT (1-36)", lead.testScores.ACT, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w1/4")}
                            {renderTextField("DUOLINGO", "DuoLingo (10-160)", lead.testScores.DUOLINGO, (e) => handleNestedChange('testScores', e), "w-full sm:w-1/2 md:w-1/4")}
                    </div>
                </Accordion>

                {/* --- REFACTORED: Course Details Section --- */}
                <Accordion title="Course Details" icon="📄">
                    <div className="flex flex-wrap -mx-2 items-start">
                        {/* --- MOVED: Currency Converter --- */}
                        <div className="w-full p-2 mb-4 border-b pb-4">
                            <h4 className="font-bold text-gray-800 mb-2">Tuition Fee Options</h4>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setActiveConverter(null)} className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center justify-center shadow-sm ${!activeConverter ? 'bg-green-600 text-white font-bold ring-2 ring-offset-1 ring-green-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                                    <span className="font-bold text-lg mr-2">₹</span>
                                    Enter in INR
                                </button>
                                {currencies.map(c => (
                                    <button type="button" key={c.code} onClick={() => setActiveConverter(c.code)} className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center justify-center shadow-sm ${activeConverter === c.code ? 'bg-blue-600 text-white font-bold ring-2 ring-offset-1 ring-blue-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                                        <span className="font-bold text-lg mr-2">{c.symbol}</span>
                                        {c.label}
                                    </button>
                                ))}
                            </div>

                            {activeConverter && (
                                <div className="flex flex-wrap -mx-2 items-end bg-gray-50 p-4 rounded-lg mt-4">
                                    {renderTextField("originalFee", `Tuition Fee (in ${activeConverter})`, lead.originalFee, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                                    <div className="p-2 w-full sm:w-1/2 md:w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Rate</label>
                                        <div className="flex items-center">
                                            <input type="text" name="conversionRate" value={lead.conversionRate} onChange={handleChange} readOnly={!isConversionRateEditable} className={`w-full p-2 border rounded-md ${!isConversionRateEditable ? 'bg-gray-100' : 'bg-white'}`} />
                                            <button type="button" onClick={() => setIsConversionRateEditable(!isConversionRateEditable)} className="ml-2 p-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">
                                                {isConversionRateEditable ? 'Lock' : 'Edit'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {renderSelectField("courseDuration", "Course Duration", lead.courseDuration, handleChange, courseDurations, "w-full sm:w-1/2 md:w-1/4")}
                        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee (in Lakhs)</label>
                            <input type="text" name="fee" value={lead.fee} onChange={handleChange} readOnly={!!activeConverter} className={`w-full p-2 border rounded-md ${!!activeConverter ? 'bg-gray-100' : 'bg-white'}`} />
                        </div>
                        {renderTextField("living", "Living (in Lakhs)", lead.living, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                        {renderTextField("otherExpenses", "Other Expenses (in Lakhs)", lead.otherExpenses, handleChange, "w-full sm:w-1/2 md:w-1/4")}

                        <div className="p-2 w-full md:w-1/4 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Loan Amount (in Lakhs)</label>
                            <input type="text" value={totalFee.toFixed(2)} readOnly className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md font-bold text-lg" />
                            {/* --- NEW: Progress Bar for Total Amount --- */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((totalFee / 200) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </Accordion>

                {/* --- REFACTORED: Other Details Section --- */}
                <Accordion title="Other Details" icon="📋">
                    <div className="flex flex-wrap -mx-2 items-start">
                        {renderTextField("age", "Age", lead.age, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                        {renderTextField("workExperience", "Work Experience (in months)", lead.workExperience, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                        <div className="p-2 w-full md:w-1/3">
                            <fieldset>
                                <legend className="text-sm font-medium text-gray-700">Is there any loan on the student?</legend>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label className="flex items-center"><input type="radio" name="hasStudentLoans" value="true" checked={lead.hasStudentLoans === true} onChange={handleChange} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                    <label className="flex items-center"><input type="radio" name="hasStudentLoans" value="false" checked={lead.hasStudentLoans === false} onChange={handleChange} className="form-radio" /> <span className="ml-2">No</span></label>
                                </div>
                            </fieldset>
                            {lead.hasStudentLoans && renderTextField("studentLoanDetails", "Details about the loan", lead.studentLoanDetails, handleChange, "w-full", "e.g., Personal Loan, 2 Lakhs outstanding")}
                        </div>
                    </div>
                </Accordion>

                {/* NEW: Assets Available Section */}
                <Accordion title="Assets Available" icon="🏠">
                        <fieldset className="mb-4">
                            <legend className="text-sm font-medium text-gray-700">Are assets available?</legend>
                            <div className="flex items-center space-x-4 mt-2">
                                <label className="flex items-center"><input type="radio" value="true" checked={hasAssets === true} onChange={(e) => setHasAssets(e.target.value === 'true')} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                <label className="flex items-center"><input type="radio" value="false" checked={hasAssets === false} onChange={(e) => setHasAssets(e.target.value === 'true')} className="form-radio" /> <span className="ml-2">No</span></label>
                            </div>
                        </fieldset>

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
                                <button type="button" onClick={addAsset} className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Add Asset
                                </button>
                            </>
                        )}
                </Accordion>

                {/* --- NEW: Bank Search by Pincode --- */}
                <Accordion title="Bank Search by Pincode" icon="🏦">
                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Enter Pincode"
                            value={bankSearchPincode}
                            onChange={(e) => setBankSearchPincode(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button type="button" onClick={handleBankSearch} disabled={isBankSearching} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                            {isBankSearching ? 'Searching...' : 'Search Banks'}
                        </button>
                    </div>
                    {bankSearchMessage && <p className="text-sm text-gray-600">{bankSearchMessage}</p>}
                    {bankSearchResults.length > 0 && (
                        <div className="mt-4 space-y-3">
                            <h4 className="text-lg font-semibold">Search Results for Pincode: {bankSearchPincode}</h4>
                            {bankSearchResults.map(bank => (
                                <div key={bank._id} className="p-4 border rounded-lg bg-gray-50">
                                    <p className="font-bold text-blue-800">{bank.name}</p>
                                    <div className="mt-2 pl-4 border-l-2 border-gray-300">
                                        {bank.branches.filter(branch => branch.pincode === bankSearchPincode).map((branch, idx) => (
                                            <div key={idx} className="text-sm text-gray-700 mb-3 pb-2 border-b last:border-b-0">
                                                <p><strong>Branch:</strong> {branch.branchName}</p>
                                                <p><strong>IFSC:</strong> {branch.ifsc}</p>
                                                <p><strong>Address:</strong> {branch.address}</p>
                                                <p><strong>Location:</strong> {branch.city}, {branch.district}, {branch.state} - {branch.pincode}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Accordion>

                {/* 4. FAMILY/CO-APPLICANT INFO */}
                <Accordion title="Student Relations (Co-Applicant/Guarantor)" icon="👨‍👩‍👧‍👦">
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

                        <button type="button" className="mt-4 mb-4 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center" onClick={addRelation}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Add New Relation
                        </button>

                        <div className="p-4 border border-dashed border-gray-400 rounded-md">
                            <h4 className="font-bold text-gray-800">🏠 Own House Guarantor (OHG)</h4>
                            <p className="text-xs text-gray-600 mt-1 mb-1">
                                Note: Own house guarantor should be one of your family members or relatives who owns a house/flat.
                            </p>
                            <p className="text-xs text-gray-600 mb-2">This property is NOT taken as a collateral.</p>
                            <a href="#" className="text-sm text-blue-600 hover:underline" onClick={(e) => { e.preventDefault(); if (showOHGFields) { setShowOHGFields(false); setLead(prev => ({...prev, ownHouseGuarantor: EMPTY_LEAD_STATE.ownHouseGuarantor})); } else { setIsSelectingOHG(!isSelectingOHG); } }}>
                                {showOHGFields ? 'Hide Guarantor Fields' : 'Add/Change Own House Guarantor'}
                            </a>

                            {/* Inline OHG Selection */}
                            {isSelectingOHG && !showOHGFields && (
                                <div className="mt-2 p-2 border border-gray-200 rounded-md">
                                    <p className="text-sm mb-2">Select a relation type:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Father', 'Mother', 'Spouse', 'Brother', 'Other'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                                                onClick={() => handleSelectOHG(type)}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Conditionally rendered card for OHG details */}
                            {showOHGFields && (
                                <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                                    <h5 className="text-xl font-bold mb-4 text-blue-700">Own House Guarantor Details</h5>
                                    <div className="flex flex-wrap -mx-2">
                                        {renderTextField("name", "Guarantor Name", lead.ownHouseGuarantor.name, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                                        {renderSelectField("relationshipType", "Relationship to Student", lead.ownHouseGuarantor.relationshipType, (e) => handleNestedChange('ownHouseGuarantor', e), ['Uncle', 'Aunt', 'Cousin', 'Grandparent', 'Other Relative'], "w-full sm:w-1/2 md:w-1/4")}
                                        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Guarantor Phone Number</label>
                                            <div className="flex">
                                                <select
                                                    value={(lead.ownHouseGuarantor.phoneNumber || '+91-').split('-')[0]}
                                                    onChange={(e) => handleNestedChange('ownHouseGuarantor', { target: { name: 'phoneNumber', value: `${e.target.value}-${(lead.ownHouseGuarantor.phoneNumber || '').split('-')[1] || ''}` } })}
                                                    className="p-2 border border-gray-300 rounded-l-md bg-gray-50"
                                                >
                                                    {countryPhoneCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={(lead.ownHouseGuarantor.phoneNumber || '').split('-')[1] || ''}
                                                    onChange={(e) => handleNestedChange('ownHouseGuarantor', { target: { name: 'phoneNumber', value: `${(lead.ownHouseGuarantor.phoneNumber || '+91-').split('-')[0]}-${e.target.value}` } })}
                                                    className="w-full p-2 border-t border-b border-r border-gray-300 rounded-r-md"
                                                />
                                            </div>
                                        </div>
                                        {renderSelectField("employmentType", "Employment Type", lead.ownHouseGuarantor.employmentType, (e) => handleNestedChange('ownHouseGuarantor', e), employmentTypes, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("annualIncome", "Annual Income (lacs)", lead.ownHouseGuarantor.annualIncome, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("currentObligations", "Current Obligations", lead.ownHouseGuarantor.currentObligations, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("cibilScore", "CIBIL Score", lead.ownHouseGuarantor.cibilScore, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                                        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                            <fieldset>
                                                <legend className="text-sm font-medium text-gray-700">CIBIL Issues?</legend>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <label className="flex items-center"><input type="radio" name="hasCibilIssues" value="true" checked={lead.ownHouseGuarantor.hasCibilIssues === true} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                                    <label className="flex items-center"><input type="radio" name="hasCibilIssues" value="false" checked={lead.ownHouseGuarantor.hasCibilIssues === false} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} className="form-radio" /> <span className="ml-2">No</span></label>
                                                </div>
                                            </fieldset>
                                            {lead.ownHouseGuarantor.hasCibilIssues && <input type="text" name="cibilIssues" placeholder="CIBIL Issues" value={lead.ownHouseGuarantor.cibilIssues} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} className="mt-2 w-full p-2 border border-gray-300 rounded-md" />}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                </Accordion>

                {/* 5. STUDENT REFERENCES & PAN DETAILS */}
                <Accordion title="Student References & PAN Details" icon="🤝">
                        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 mb-4">
                            <p className="text-sm">
                                References are people other than your parents and siblings who you know (e.g., friends, neighbours, relatives).
                                They will NOT be added to the loan; they are for contact purposes only if the student/family are not contactable.
                            </p>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">Student References</h4>
                        {lead.references.map((ref, index) => (
                            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                <h5 className="font-bold mb-2 text-gray-600">Reference {index + 1}</h5>
                                <div className="flex flex-wrap -mx-2">
                                    {renderTextField(`references[${index}].name`, "Name*", ref.name, (e) => handleNestedChange('references', e), "w-full sm:w-1/2 md:w-1/4")}
                                    {renderSelectField(`references[${index}].relationship`, "Relationship*", ref.relationship, (e) => handleNestedChange('references', e), referenceRelationships, "w-full sm:w-1/2 md:w-1/4")}
                                    {renderTextField(`references[${index}].address`, "Address*", ref.address, (e) => handleNestedChange('references', e), "w-full sm:w-1/2 md:w-1/2")}
                                    <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <div className="flex">
                                            <select
                                                value={(ref.phoneNumber || '+91-').split('-')[0]}
                                                onChange={(e) => handleNestedChange('references', { target: { name: `references[${index}].phoneNumber`, value: `${e.target.value}-${(ref.phoneNumber || '').split('-')[1] || ''}` } })}
                                                className="p-2 border border-gray-300 rounded-l-md bg-gray-50"
                                            >
                                                {countryPhoneCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                            </select>
                                            <input
                                                type="text"
                                                value={(ref.phoneNumber || '').split('-')[1] || ''}
                                                onChange={(e) => handleNestedChange('references', { target: { name: `references[${index}].phoneNumber`, value: `${(ref.phoneNumber || '+91-').split('-')[0]}-${e.target.value}` } })}
                                                className="w-full p-2 border-t border-b border-r border-gray-300 rounded-r-md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <hr className="my-4" />
                        <h4 className="text-xl font-semibold mb-2">Student PAN Details</h4>
                        <fieldset>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                <label className="flex items-center"><input type="radio" name="panStatus" value="Not Interested" checked={lead.panStatus === 'Not Interested'} onChange={handleChange} className="form-radio" /> <span className="ml-2">Not Interested</span></label>
                                <label className="flex items-center"><input type="radio" name="panStatus" value="Not Available" checked={lead.panStatus === 'Not Available'} onChange={handleChange} className="form-radio" /> <span className="ml-2">Not Available</span></label>
                                <label className="flex items-center"><input type="radio" name="panStatus" value="Applied" checked={lead.panStatus === 'Applied'} onChange={handleChange} className="form-radio" /> <span className="ml-2">Applied</span></label>
                            </div>
                            {lead.panStatus === 'Applied' && <input type="text" placeholder="PAN Card Number" value={lead.panNumber} onChange={handleChange} name="panNumber" className="mt-2 p-2 border border-gray-300 rounded-md w-full md:w-1/2" />}
                        </fieldset>
                </Accordion>

                {/* 6. REFER APPLICANT'S FRIENDS */}
                <Accordion title="Refer Applicant's Friends" icon="👥">
                        <div className="flex flex-wrap -mx-2">
                            {lead.referralList.map((ref, index) => (
                                <div className="p-2 w-full sm:w-1/2 md:w-1/3" key={index}>
                                    <div className="p-4 border rounded-lg h-full flex flex-col">
                                        <h5 className="font-bold mb-2 text-blue-700">Referral {index + 1}</h5>
                                        <input type="text" placeholder="Name" value={ref.name || ''} name={`referralList[${index}].name`} onChange={(e) => handleNestedChange('referralList', e)} className="w-full p-2 border rounded-md mb-2" />
                                        <div className="flex mb-2">
                                            <select
                                                value={(ref.phoneNumber || '+91-').split('-')[0]}
                                                onChange={(e) => handleNestedChange('referralList', { target: { name: `referralList[${index}].phoneNumber`, value: `${e.target.value}-${(ref.phoneNumber || '').split('-')[1] || ''}` } })}
                                                className="p-2 border border-gray-300 rounded-l-md bg-gray-50"
                                            >
                                                {countryPhoneCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Phone Number"
                                                value={(ref.phoneNumber || '').split('-')[1] || ''}
                                                onChange={(e) => handleNestedChange('referralList', { target: { name: `referralList[${index}].phoneNumber`, value: `${(ref.phoneNumber || '+91-').split('-')[0]}-${e.target.value}` } })}
                                                className="w-full p-2 border-t border-b border-r border-gray-300 rounded-r-md"
                                            />
                                        </div>
                                        <input type="text" placeholder="Code" value={ref.code || ''} name={`referralList[${index}].code`} onChange={(e) => handleNestedChange('referralList', e)} className="w-full p-2 border rounded-md" />
                                        <button type="button" className="mt-4 px-3 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-400" onClick={() => handleCreateReferralLead(ref)} disabled={!ref.name || !ref.phoneNumber}>
                                            Create Lead
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="mt-4 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center" onClick={() => setLead(p => ({...p, referralList: [...p.referralList, { name: "", code: "", phoneNumber: "" }] }))}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Add Referral
                        </button>
                </Accordion>

                {/* 9. Email Templates */}
                <Accordion title="Email Templates" icon="🛠️">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">NL Normal</h4>
                            <div className="flex flex-wrap gap-2">{NLTemplates.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="px-3 py-1.5 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Banks Connection - Intro & Docs Upload</h4>
                            <div className="flex flex-wrap gap-2">{banksDocs.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:bg-purple-700 flex items-center" style={{backgroundColor:'#AA60C8'}}><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Document Upload</h4>
                            <div className="flex flex-wrap gap-2">{documentStatus.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} key={index} className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        {emailMessage && (
                            <div className="mt-4 p-3 text-sm text-center bg-blue-100 text-blue-800 rounded-md">{emailMessage}</div>
                        )}
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Loan Calculators</h4>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>EDUCATION LOAN EMI CALCULATOR</button>
                                <button type="button" className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>$ USD TO INR EDUCATION LOAN CALCULATOR</button>
                                <button type="button" className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>Saves Lakhs By Educational Loan Transfer</button>
                                <button type="button" className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>EL TAX Rebate Calculator</button>
                            </div>
                        </div>
                        <hr/>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Banks Related - Issues</h4>
                            <div className="flex flex-wrap gap-2">{loanIssues.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} style={{backgroundColor:'purple'}} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-80 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.2-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Miscellaneous Situations</h4>
                            <div className="flex flex-wrap gap-2">{miscSituations.map((item, index) => (<button type="button" onClick={() => handleOpenEmailModal(item)} style={{backgroundColor:'#11224E'}} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-80 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                    </div>
                </Accordion>
                 {/* 8. RECOMMENDED BANKS & ISSUES */}
                <Accordion title="Recommended Banks" icon="💳">
                    <div>
                        <h4 className="font-bold mb-4 text-gray-800">Tied-Up Banks</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tiedUpBanks.map((bank) => (
                                <div key={bank._id} className="p-4 border rounded-lg shadow-sm bg-white flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-base text-gray-900">{bank.name}</p>
                                            {lead.assignedBanks?.some(b => b.bankId === bank._id) && (
                                                <span className="text-xs font-semibold inline-flex items-center py-1 px-2 rounded-full text-green-600 bg-green-200">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                    Assigned
                                                </span>
                                            )}
                                        </div>
                                        {lead.assignedBanks?.find(b => b.bankId === bank._id) && (
                                            <div className="mt-2 p-2 bg-green-50 rounded-md text-xs">
                                                <p>Assigned To: <strong>{lead.assignedBanks.find(b => b.bankId === bank._id).assignedRMName}</strong></p>
                                                <p>Email: {lead.assignedBanks.find(b => b.bankId === bank._id).assignedRMEmail}</p>
                                            </div>
                                        )}
                                    </div>
                                    <button type="button" onClick={() => handleOpenAssignModal(bank)} disabled={lead.assignedBanks?.some(b => b.bankId === bank._id)} className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                                        {lead.assignedBanks?.some(b => b.bankId === bank._id) ? 'Assigned' : 'Assign to this Bank'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Accordion>

                {/* 10. REMINDERS & FINAL STATUS */}
                <Accordion title="Reminders & Final Status" icon="🗓️">
                        <div className="flex flex-wrap -mx-2">
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Sanction Date</label>
                                    <DatePicker
                                        value={lead.targetSanctionDate ? moment(lead.targetSanctionDate) : null}
                                        onChange={(newValue) => handleDateChange('targetSanctionDate', newValue)}
                                    />
                                </div>
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Call Date</label>
                                    <DatePicker
                                        value={lead.lastCallDate ? moment(lead.lastCallDate) : null}
                                        onChange={(newValue) => handleDateChange('lastCallDate', newValue)}
                                    />
                                </div>
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Call Date & Time</label>
                                    <DateTimePicker
                                        value={lead.reminderCallDate ? moment(lead.reminderCallDate) : null}
                                        onChange={(newValue) => handleDateChange('reminderCallDate', newValue)}
                                    />
                                </div>
                            </LocalizationProvider>
                            <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Final Status</label>
                                <select name="leadStatus" value={lead.leadStatus} onChange={handleChange} className="w-full p-2 border rounded-md">
                                    {leadStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                            {/* --- NEW: Conditional Dropdown for Priority Status --- */}
                            {lead.leadStatus === 'On Priority' && (
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Priority</label>
                                    <select name="priorityReason" value={lead.priorityReason || ''} onChange={handleChange} className="w-full p-2 border rounded-md bg-yellow-50">
                                        <option value="" disabled>Select a reason...</option>
                                        {priorityReasons.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                                    </select>
                                </div>
                            )}
                            {/* --- NEW: Conditional Dropdown for Close Status --- */}
                            {lead.leadStatus === 'Close' && (
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Closing</label>
                                    <select name="closeReason" value={lead.closeReason || ''} onChange={handleChange} className="w-full p-2 border rounded-md bg-red-50">
                                        <option value="" disabled>Select a reason...</option>
                                        {closeReasons.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                                    </select>
                                </div>
                            )}
                            {lead.leadStatus === 'Sanctioned' && (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Sanction</label>
                                        <DatePicker value={lead.sanctionDetails.sanctionDate ? moment(lead.sanctionDetails.sanctionDate) : null} onChange={(newValue) => handleSanctionDetailsChange({ target: { name: 'sanctionDate', value: newValue ? new Date(newValue).toISOString() : null } })} />
                                    </div>
                                </LocalizationProvider>
                            )}
                            {lead.leadStatus === 'On Priority' && <div className="w-full p-2 text-xs text-gray-500"><strong>Why mark as Priority?</strong> A lead is a priority if they have an admit, have shortlisted universities, or their intake is very soon. This helps focus on leads closest to conversion.</div>}
                            {lead.leadStatus === 'Close' && <div className="w-full p-2 text-xs text-gray-500"><strong>When to Close a Lead?</strong> Close a lead if the student is definitively not interested, cannot be reached after multiple attempts, or is clearly not eligible for any loan product.</div>}
                            <div className="w-full p-2 space-y-2">
                                <label className="flex items-center"><input type="checkbox" className="form-checkbox" /> <span className="ml-2 text-sm">Clear Preferred Next Call Time</span></label>
                                <label className="flex items-center"><input type="checkbox" className="form-checkbox" /> <span className="ml-2 text-sm">Student is not eligible for Connecting to Advisar</span></label>
                            </div>
                        </div>
                </Accordion>
            </div>


            {/* Main Submit Button */}
            <button
                type="submit"
                className="w-full mt-8 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                // disabled={!lead.reminderCallDate || !newNote.notes.trim()}
            >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ✅ SUBMIT LEAD DATA 
            </button>
        </form>

        {/* --- NEW: Email Template Modal --- */}
        <Dialog open={isEmailModalOpen} onClose={handleCloseEmailModal} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Send Email: {currentEmailTemplate.name}
                <IconButton aria-label="close" onClick={handleCloseEmailModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6" gutterBottom>Subject: {currentEmailTemplate.subject}</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, maxHeight: '50vh', overflowY: 'auto' }}>
                    <div dangerouslySetInnerHTML={{ __html: currentEmailTemplate.body }} />
                </Paper>
                {emailStatus && (
                    <Typography sx={{ mt: 2, color: emailStatus.includes('success') ? 'success.main' : 'info.main' }}>
                        {emailStatus}
                    </Typography>
                )}
            </DialogContent>
            {/* Conditionally render actions only for actual email templates */}
            {(NLTemplates.includes(currentEmailTemplate.name) ||
              banksDocs.includes(currentEmailTemplate.name) ||
              documentStatus.includes(currentEmailTemplate.name) ||
              loanIssues.includes(currentEmailTemplate.name) ||
              miscSituations.includes(currentEmailTemplate.name)
            ) && (
                <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
                    <MuiButton
                        startIcon={<ContentCopyIcon />}
                        onClick={handleCopyEmailBody}
                    >
                        Copy Content
                    </MuiButton>
                    <MuiButton variant="contained" onClick={handleSendTemplateEmail} disabled={emailStatus === 'Sending...'}>
                        {emailStatus === 'Sending...' ? 'Sending...' : 'Send Email'}
                    </MuiButton>
                </DialogActions>
            )}
        </Dialog>

        {/* --- NEW: Bank Assignment Modal --- */}
        <Dialog open={isAssignModalOpen} onClose={handleCloseAssignModal} maxWidth="sm" fullWidth>
            <DialogTitle>
                Assign Lead to {selectedBankForAssignment?.name}
                <IconButton aria-label="close" onClick={handleCloseAssignModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="region-select-label">1. Select Region</InputLabel>
                        <Select
                            labelId="region-select-label"
                            value={assignmentRegion}
                            label="1. Select Region"
                            onChange={(e) => {
                                setAssignmentRegion(e.target.value);
                                setAssignmentRM(''); // Reset RM selection when region changes
                            }}
                        >
                            {/* Get unique regions from the bank's RMs */}
                            {[...new Set(selectedBankForAssignment?.relationshipManagers.map(rm => rm.region))].map(region => (
                                <MenuItem key={region} value={region}>{region}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={!assignmentRegion}>
                        <InputLabel id="rm-select-label">2. Select Relationship Manager</InputLabel>
                        <Select
                            labelId="rm-select-label"
                            value={assignmentRM}
                            label="2. Select Relationship Manager"
                            onChange={(e) => setAssignmentRM(e.target.value)}
                        >
                            {selectedBankForAssignment?.relationshipManagers.filter(rm => rm.region === assignmentRegion).map(rm => (
                                <MenuItem key={rm.email} value={JSON.stringify({ name: rm.name, email: rm.email })}>{rm.name} ({rm.email})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {assignmentError && <Typography color="error.main" variant="body2">{assignmentError}</Typography>}
                </Box>
            </DialogContent>
            <DialogActions>
                <MuiButton onClick={handleCloseAssignModal}>Cancel</MuiButton>
                <MuiButton variant="contained" onClick={handleAssignToBank} disabled={!assignmentRM}>Assign Lead</MuiButton>
            </DialogActions>
        </Dialog>
    </div>);
};

export default LeadForm;