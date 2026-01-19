import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './leadForm.css';
import BasicDetailsSection from "./BasicDetailsSection";
import FurtherEducationSection from "./sections/FurtherEducationSection";
import TestScoresSection from "./sections/TestScoresSection";
import OtherDetailsSection from "./sections/OtherDetailsSection";
import CourseDetailsSection from "./sections/CourseDetailsSection";
import AssetsAvailableSection from "./sections/AssetsAvailableSection";
import BankSearchSection from "./sections/BankSearchSection";
import StudentRelationsSection from "./sections/StudentRelationsSection";
import StudentReferencesSection from "./sections/StudentReferencesSection";
import ReferFriendsSection from "./sections/ReferFriendsSection";
import EmailTemplatesSection from "./sections/EmailTemplatesSection";
import RecommendedBanksSection from "./sections/RecommendedBanksSection";
import RemindersSection from "./sections/RemindersSection";
import CallNotesSection from "./sections/CallNotesSection";
import TaskHistorySection from "./sections/TaskHistorySection";
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

// Custom Accordion component using custom CSS classes
const Accordion = ({ title, icon, children, defaultExpanded = false }) => {
    const [isOpen, setIsOpen] = useState(defaultExpanded);

    return (
        <div className="accordion">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="accordion-header">
                <h3 className="accordion-title">{icon} {title}</h3>
                <svg className={`accordion-icon ${isOpen ? 'open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="accordion-content">{children}</div>
            )}
        </div>
    );
};

// IMPORTANT: LeadForm now accepts leadId and onBack as props
const LeadForm = ({ leadData, onBack, onUpdate, initialTab }) => {
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
    // UI-only state to control which tab/section is visible
    const [activeTab, setActiveTab] = useState(initialTab || 'basic');
    const navigate = useNavigate();
    // --- NEW: State for Task Creation ---
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [task, setTask] = useState({ assignedTo: null, subject: '', body: '' });
    const [taskMessage, setTaskMessage] = useState('');
    const [combinedHistory, setCombinedHistory] = useState([]);
    const [leadTasks, setLeadTasks] = useState([]);
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
    const [quickNote, setQuickNote] = useState('');
    const [showRemindersDropdown, setShowRemindersDropdown] = useState(false);
    const [autocompleteStates, setAutocompleteStates] = useState({});

    // Calculate pending reminders count
    const pendingRemindersCount = (lead.reminders ? lead.reminders.filter(reminder => !reminder.done).length : 0) + (lead.reminderCallDate ? 1 : 0);

    // Initialize autocomplete states for all possible fields
    useEffect(() => {
        const initialStates = {
            permanentLocation: { inputValue: '', showDropdown: false, filteredOptions: [], optionClicked: false },
            interestedCountries: { inputValue: '', showDropdown: false, filteredOptions: [], optionClicked: false },
            admittedUniversities: { inputValue: '', showDropdown: false, filteredOptions: [], optionClicked: false },
            location: { inputValue: '', showDropdown: false, filteredOptions: [], optionClicked: false } // for ownHouseGuarantor
        };
        setAutocompleteStates(initialStates);
    }, []);




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
                setLeadTasks(tasksResult);
                return leadResult; // Return lead data to be processed
            } catch (error) {
                console.error("Failed to fetch combined history:", error);
            }
        };
        const processLeadData = (data) => {
            const storedUser = localStorage.getItem('employeeUser');
            let currentUser = null;
            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }

            const dataToSet = { ...EMPTY_LEAD_STATE };
            // Only override defaults with non-null values from data
            Object.keys(data).forEach(key => {
                if (data[key] != null) {
                    dataToSet[key] = data[key];
                }
            });

            // Special handling for panStatus: default to "Applied" for existing leads if not set or "Not Interested"
            if (!dataToSet.panStatus || dataToSet.panStatus === 'Not Interested') {
                dataToSet.panStatus = 'Applied';
            }
            // Populate zone, region, and regionalHead from current user if not already set
            if (!dataToSet.zone && currentUser?.zone) dataToSet.zone = currentUser.zone;
            if (!dataToSet.region && currentUser?.region) dataToSet.region = currentUser.region;
            if (!dataToSet.regionalHead && currentUser?.regionalHead) dataToSet.regionalHead = currentUser.regionalHead;

            if (!dataToSet.mobileNumbers || dataToSet.mobileNumbers.length === 0) { dataToSet.mobileNumbers = ["+91-"]; }
            if (!dataToSet.relations || dataToSet.relations.length === 0) { dataToSet.relations = [{ relationshipType: 'Father', name: '', employmentType: '', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false }]; }
            if (!dataToSet.relations || dataToSet.relations.length === 0) { dataToSet.relations = [{ relationshipType: 'Father', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false, documents: [] }]; }
            if (!dataToSet.references || dataToSet.references.length < 2) {
                const existingRefs = dataToSet.references || [];
                dataToSet.references = [...existingRefs, ...Array(2 - existingRefs.length).fill({ relationship: '', name: '', address: '', phoneNumber: '' })].slice(0, 2);
            }
            if (!dataToSet.referralList || dataToSet.referralList.length < 1) {
                const existingRefs = dataToSet.referralList || [];
                dataToSet.referralList = [...existingRefs, ...Array(1 - existingRefs.length).fill({ name: "", code: "", phoneNumber: "" })].slice(0, 1);
            }
            // Ensure array fields are arrays to prevent errors in autocomplete
            dataToSet.interestedCountries = Array.isArray(dataToSet.interestedCountries) ? dataToSet.interestedCountries : [];
            dataToSet.admittedUniversities = Array.isArray(dataToSet.admittedUniversities) ? dataToSet.admittedUniversities : [];
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
            // Commented out existing code for creating new lead
            /*
            setLead({
                ...EMPTY_LEAD_STATE,
                ...leadData, // Pre-fill from the small dialog if available
                zone: currentUser?.zone || '',
                region: currentUser?.region || '',
                regionalHead: currentUser?.regionalHead || '',
                relations: [{ relationshipType: 'Father', name: '', employmentType: '', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false }],
                relations: [{ relationshipType: 'Father', name: '', employmentType: 'Salaried', annualIncome: '', phoneNumber: '', currentObligations: '', cibilScore: '', hasCibilIssues: false, cibilIssues: '', isCoApplicant: false, documents: [] }],
                mobileNumbers: leadData?.mobileNumber ? [leadData.mobileNumber] : ["+91- "],
                referralList: [{ name: "", code: "", phoneNumber: "" }],
            });
            */
            // New code for creating new lead with only basic details and source
            setLead({
                fullName: '',
                email: '',
                source: { source: '', name: '', email: '', phoneNumber: '' },
                mobileNumbers: ["+91- "],
                permanentLocation: '',
                state: '',
                regionalHead: currentUser?.regionalHead || '',
                region: currentUser?.region || '',
                planningToStudy: '',
                sanctionDetails: EMPTY_LEAD_STATE.sanctionDetails,
                // Add other basic fields as needed
            });
        }
    // This effect now runs whenever the selected lead object changes.
    }, [leadData]);

    // --- EFFECT: Pre-populate fields from Sanction Details ---
    useEffect(() => {
        // When a sanctioned loan amount is entered, update the main 'fee' field.
        if (lead.sanctionDetails && lead.sanctionDetails.loanAmount) {
            const sanctionedAmount = parseFloat(lead.sanctionDetails.loanAmount);
            if (!isNaN(sanctionedAmount) && sanctionedAmount !== parseFloat(lead.fee)) {
                setLead(prev => ({ ...prev, fee: sanctionedAmount.toString() }));
            }
        }

        // When a co-applicant name is entered, update the relations array.
        if (lead.sanctionDetails && lead.sanctionDetails.coApplicant) {
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
    }, [lead.sanctionDetails?.loanAmount, lead.sanctionDetails?.coApplicant]);

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
    const renderTextField = (name, label, value, onChange, widthClass = "field-container", placeholder = "") => (
        <div className={`field-wrapper ${widthClass}`}>
            <label htmlFor={name} className="field-label">{label}</label>
            <input
                type="text"
                id={name}
                name={name}
                placeholder={placeholder}
                value={value !== undefined && value !== null ? (Array.isArray(value) ? value.join(', ') : value.toString()) : ''}
                onChange={onChange}
                className="field-input"
            />
        </div>
    );

    // Helper for select/dropdown fields
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

        // Handle array values for multi-select fields
        if (Array.isArray(value)) {
            setLead((prev) => ({
                ...prev,
                [name]: value
            }));
            return;
        }

        // Handle nested fields like source.source
        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setLead(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
            return;
        }

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

        // Add notes to call history for reminder date, including last call if set
        if (newValue && name === 'reminderCallDate') {
            const formattedDate = new Date(newValue).toLocaleString();
            let noteText = `Next call reminder set for ${formattedDate}`;
            if (lead.lastCallDate) {
                const lastFormatted = new Date(lead.lastCallDate).toLocaleString();
                noteText = `Last call date set to ${lastFormatted} and Next call reminder set for ${formattedDate}`;
            }
            logActionAsNote(noteText);
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
                    ...existingRelation,
                relationshipType: existingRelation.relationshipType // Explicitly set the relationship type
                }
            }));
        } else {
            // If not found, set the relationshipType for manual entry.
            // If 'Other' is clicked, clear the type to allow selection from the dropdown.
            setLead(prev => ({
                ...prev,
                ownHouseGuarantor: {
                    ...EMPTY_LEAD_STATE.ownHouseGuarantor, // Reset to blank slate
                    relationshipType: relationshipType === 'Other' ? '' : relationshipType,
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


    // Helper for Autocomplete fields (supports multi-select for arrays)
    const renderAutocompleteField = (name, label, value, onChange, options, widthClass = "w-full md:w-1/3") => {
        const isMultiSelect = Array.isArray(value);

        // Initialize state for this field if not exists
        if (!autocompleteStates[name]) {
            setAutocompleteStates(prev => ({
                ...prev,
                [name]: { inputValue: '', showDropdown: false, filteredOptions: [], optionClicked: false }
            }));
        }

        const state = autocompleteStates[name] || { inputValue: '', showDropdown: false, filteredOptions: [] };

        const handleInputChange = (e) => {
            const newValue = e.target.value;
            const filtered = options.filter(option =>
                option.toLowerCase().includes(newValue.toLowerCase()) &&
                (!isMultiSelect || !value.includes(option))
            );
            setAutocompleteStates(prev => ({
                ...prev,
                [name]: { ...prev[name], inputValue: newValue, showDropdown: true, filteredOptions: filtered }
            }));
        };

        const handleFocus = () => {
            const current = autocompleteStates[name];
            const newShow = !current.showDropdown;
            const filtered = newShow ? options.filter(option =>
                (!isMultiSelect || !value.includes(option))
            ) : [];
            setAutocompleteStates(prev => ({
                ...prev,
                [name]: { ...prev[name], showDropdown: newShow, filteredOptions: filtered }
            }));
        };

        const handleBlur = () => {
            if (isMultiSelect) return; // Don't hide dropdown for multi-select on blur
            setTimeout(() => {
                setAutocompleteStates(prev => {
                    const current = prev[name];
                    if (current.optionClicked) {
                        return {
                            ...prev,
                            [name]: { ...current, optionClicked: false }
                        };
                    } else {
                        return {
                            ...prev,
                            [name]: { ...current, showDropdown: false }
                        };
                    }
                });
            }, 200);
        };

        const handleOptionClick = (option) => {
            if (isMultiSelect) {
                const currentArray = value || [];
                if (!currentArray.includes(option)) {
                    const newArray = [...currentArray, option];
                    onChange({ target: { name, value: newArray } });
                    const filtered = options.filter(opt => !newArray.includes(opt));
                    setAutocompleteStates(prev => ({
                        ...prev,
                        [name]: { ...prev[name], inputValue: '', showDropdown: true, filteredOptions: filtered, optionClicked: true }
                    }));
                }
            } else {
                onChange({ target: { name, value: option } });
                setAutocompleteStates(prev => ({
                    ...prev,
                    [name]: { ...prev[name], inputValue: '', showDropdown: false }
                }));
            }
        };

        const handleAddItem = (newValue) => {
            if (!newValue.trim()) return;
            const currentArray = isMultiSelect ? value : [];
            if (!currentArray.includes(newValue) && options.includes(newValue)) {
                onChange({ target: { name, value: [...currentArray, newValue] } });
            }
            setAutocompleteStates(prev => ({
                ...prev,
                [name]: { ...prev[name], inputValue: '', showDropdown: false }
            }));
        };

        const handleRemoveItem = (itemToRemove) => {
            const newArray = value.filter(item => item !== itemToRemove);
            onChange({ target: { name, value: newArray } });
        };

        const handleInputKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAddItem(state.inputValue);
            }
        };

        return (
            <div className={`p-2 ${widthClass}`}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {isMultiSelect && <span className="text-gray-500 text-xs ml-1">(you can select multiple)</span>}
                </label>
                {isMultiSelect && value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {value.map((item, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item)}
                                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                                >
                                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <div className="relative">
                    <input
                        type="text"
                        id={`${name}-input`}
                        name={name}
                        value={state.inputValue}
                        onChange={handleInputChange}
                        onClick={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleInputKeyDown}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={isMultiSelect ? "Type to add..." : "Select or type..."}
                    />
                    {state.showDropdown && state.filteredOptions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {state.filteredOptions.map(option => (
                                <div
                                    key={option}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };
    // --- New Note Handlers ---

    const handleNoteChange = (e) => {
        setNewNote(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveNote = async () => {
        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser) {
            alert('You must be logged in to save notes.');
            return;
        }

        // If there's no lead._id, this is a create operation (for new leads, create silently without navigation)
        if (!lead._id) {
            // CREATE logic here (POST /api/leads)
            try {
                const createPayload = {
                    ...lead,
                };

                const response = await axios.post(API_URL, createPayload);
                // Update local state with the created lead, but don't navigate
                setLead({ ...EMPTY_LEAD_STATE, ...response.data });
                setNewNote({ notes: '', callStatus: 'Connected' });
                // Optionally show a success message
                alert('Lead created and note added successfully!');
            } catch (error) {
                console.error('Failed to create lead:', error);
                alert('Failed to create lead. Check console for details.');
            }
            return;
        }

        // For existing leads, only send the note, not the entire lead
        try {
            const updatePayload = {
                newNote: {
                    notes: newNote.notes,
                    callStatus: newNote.callStatus,
                    loggedById: currentUser._id,
                    loggedByName: currentUser.fullName
                }
            };

            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload);

            // Update local state with the new, updated lead data (including the new callHistory entry)
            setLead({ ...lead, ...response.data });
            setNewNote({ notes: '', callStatus: 'Connected' }); // Clear the note field
            // No navigation, just update the history

        } catch (error) {
            console.error('Failed to save note:', error);
            alert('Failed to save note. Check console for details.');
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
     const logActionAsNote = async (noteText) => {
        if (!lead._id) return;

        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser) {
            console.error("Cannot log action, user not found.");
            return;
        }

        const payload = {
            newNote: {
                notes: noteText,
                callStatus: 'Log', // A new status for automated logs
                loggedById: currentUser._id,
                loggedByName: currentUser.fullName
            }
        };

        try {
            const response = await axios.put(`${API_URL}/${lead._id}`, payload);
            setLead(prev => ({
                ...prev,
                callHistory: response.data.callHistory // Update only the callHistory to preserve local changes
            }));
        } catch (error) {
            console.error('Failed to log action as note:', error);
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

    const handleSetReminder = async () => {
        if (!lead._id) {
            alert('Please save the lead first before setting a reminder.');
            return;
        }
        if (!lead.reminderCallDate) {
            alert('Please select a date and time for the reminder.');
            return;
        }

        try {
            const newReminder = {
                date: lead.reminderCallDate,
                done: false,
                createdAt: new Date().toISOString(),
                status: lead.leadStatus || 'No status' // Capture the current lead status, default to 'No status'
            };
            const updatePayload = {
                reminders: [...(lead.reminders || []), newReminder],
                reminderCallDate: null // Clear the current reminder date after setting
            };
            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload);
            setLead(response.data);
            alert(`Reminder set for ${new Date(lead.reminderCallDate).toLocaleString()}`);
        } catch (error) {
            console.error('Failed to set reminder:', error);
            alert('Failed to set reminder. Please try again.');
        }
    };

    const handleMarkReminderDone = async (reminderIndex) => {
        if (!lead._id) return;

        try {
            const updatedReminders = [...(lead.reminders || [])];
            updatedReminders[reminderIndex].done = true;

            const updatePayload = {
                reminders: updatedReminders
            };
            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload);
            setLead(response.data);
        } catch (error) {
            console.error('Failed to mark reminder as done:', error);
            alert('Failed to mark reminder as done. Please try again.');
        }
    };

    const handleMarkCurrentReminderDone = async () => {
        if (!lead._id) return;

        try {
            const updatePayload = {
                reminderCallDate: null
            };
            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload);
            setLead(response.data);
        } catch (error) {
            console.error('Failed to mark current reminder as done:', error);
            alert('Failed to mark current reminder as done. Please try again.');
        }
    };

    const handleAddQuickNote = async () => {
        if (!quickNote.trim()) {
            alert('Please enter a note before adding.');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser) {
            alert('You must be logged in to add notes.');
            return;
        }

        const payload = {
            newNote: {
                notes: quickNote,
                callStatus: 'Quick Note',
                loggedById: currentUser._id,
                loggedByName: currentUser.fullName
            }
        };

        try {
            const response = await axios.put(`${API_URL}/${lead._id}`, payload);
            setLead(prev => ({
                ...prev,
                callHistory: response.data.callHistory
            }));
            setQuickNote('');
            alert('Quick note added successfully!');
        } catch (error) {
            console.error('Failed to add quick note:', error);
            alert('Failed to add quick note. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Since the lead form is large, the main submit should trigger the full update
        handleSaveNote();
    };

    const handleSubmitLeadData = async () => {
        if (!lead.callHistory || lead.callHistory.length === 0) {
            alert('Please add at least one note before submitting the lead data.');
            return;
        }
        if (!lead.reminderCallDate && (!lead.reminders || lead.reminders.length === 0)) {
            alert('Please set a reminder before submitting the lead data.');
            return;
        }
        // Trigger form submission
        const form = document.querySelector('form');
        if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            // This endpoint needs to be created on the backend: PUT /api/tasks/:id
            const response = await axios.put(`${API_URL.replace('/leads', '/tasks')}/${taskId}`, { status: newStatus });
            
            // Update the task in the local state to reflect the change immediately
            setLeadTasks(prevTasks => prevTasks.map(task => 
                task._id === taskId ? response.data : task
            ));
            
            // Also add a log to the notes history for audit trail
            await logActionAsNote(`Task "${response.data.subject}" marked as ${newStatus}.`);
        } catch (error) {
            console.error('Failed to update task status:', error);
            alert('Failed to update task status. Please ensure the backend is running and the endpoint is configured.');
        }
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
            
            // NEW: Log this action as a note
            await logActionAsNote(`${currentEmailTemplate.name} is sent - ${currentEmailTemplate.subject}`);

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

    if (loading) return <p className="loading-text">Loading Lead Details...</p>;

    // Calculate total expenses (Unchanged)
    const totalFee = (parseFloat(lead.fee) || 0) + (parseFloat(lead.living) || 0) + (parseFloat(lead.otherExpenses) || 0);

    return (
    <div className="lead-form-container">
        {/* --- Header with Create Task Button --- */}
        <div className="lead-form-header">
            <h1 className="lead-form-title">
                {lead._id ? (
                    <>
                        Lead: {lead.fullName}
                        <div style={{ display: 'inline-block', marginLeft: '20px', fontSize: '16px', fontWeight: 'normal' }}>
                            <label htmlFor="loanType" style={{ marginRight: '8px', color: '#512967' }}>Loan Type:</label>
                            <select
                                id="loanType"
                                name="loanType"
                                value={lead.loanType || ''}
                                onChange={handleChange}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    fontSize: '14px',
                                    minWidth: '120px'
                                }}
                            >
                                <option value="">Select Loan Type</option>
                                <option value="Balance Transfer">Balance Transfer</option>
                                <option value="New Loan">New Loan</option>
                            </select>
                        </div>
                    </>
                ) : 'Create New Lead'}
            </h1>
            {lead._id && (
                <div className="header-buttons">
                    <button className="task-creator-button" onClick={() => setShowTaskCreator(!showTaskCreator)}>
                        {showTaskCreator ? 'Cancel Task' : 'Create Task'}
                    </button>
                </div>
            )}
        </div>

        {/* --- NEW: Inline Task Creator --- */}
        {showTaskCreator && (
            <div className="task-creator">
                <h3 className="task-creator-title">Create New Task for {lead.fullName}</h3>
                <div className="task-creator-form">
                    <div className="task-creator-field">
                        <label htmlFor="assignTo" className="task-creator-label">Assign Task To</label>
                        <select
                            id="assignTo"
                            className="task-creator-input"
                            value={task.assignedTo ? task.assignedTo._id : ''}
                            onChange={(e) => {
                                const selected = assignableUsers.find(u => u._id === e.target.value);
                                setTask(prev => ({ ...prev, assignedTo: selected }));
                            }}
                        >
                            <option value="">Select User</option>
                            {assignableUsers.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.fullName} ({user.role})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="task-creator-field">
                        <label htmlFor="subject" className="task-creator-label">Task Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="task-creator-input"
                            value={task.subject}
                            onChange={handleTaskChange}
                            placeholder="Enter task subject"
                        />
                    </div>
                    <div className="task-creator-field">
                        <label htmlFor="body" className="task-creator-label">Task Body (Optional)</label>
                        <textarea
                            id="body"
                            name="body"
                            className="task-creator-textarea"
                            value={task.body}
                            onChange={handleTaskChange}
                            rows={3}
                            placeholder="Enter task details"
                        />
                    </div>
                    {taskMessage && <p className={`task-message ${taskMessage.includes('success') ? 'success' : 'error'}`}>{taskMessage}</p>}
                    <div className="task-creator-actions">
                        <button type="button" className="task-cancel-button" onClick={() => setShowTaskCreator(false)}>Cancel</button>
                        <button type="button" className="task-creator-button " onClick={handleCreateTask}>Create Task</button>
                    </div>
                </div>
            </div>
        )}
        
        <form onSubmit={handleSubmit}>

            {/* 1. TOP METADATA & SOURCE INFO - Organized into a Card */}
            <div className="metadata-section">
                <div className="metadata-content">
                    {/* First line: Applied Date and FO */}
                    <div className="metadata-row">
                        {lead.studentAppliedDate ? (
                            <span className="metadata-badge applied">
                                {`Applied On: Date: ${moment(lead.studentAppliedDate).format('DD MMM YYYY')} | Time: ${moment(lead.studentAppliedDate).format('h:mm A')}`}
                            </span>
                        ) : null}
                        <span className="metadata-badge fo">{`FO: ${lead.assignedFO || 'N/A'} (${lead.assignedFOPhone || 'N/A'})`}</span>
                        <span className="metadata-id">{`Loan ID: ${lead.loanId || 'N/A'}`}</span>
                        <span className="metadata-id">{`User ID: ${lead.leadID || 'N/A'}`}</span>
                    </div>
                    {/* Second line: IDs and Source */}
                    <div className="metadata-row">
                        <span className="metadata-source">
                            <strong>Source/Referal:</strong> {lead.source.source || 'N/A'}
                            {lead.source.source === 'Referral' ?
                                ` - ${lead.source.name || 'N/A'} (${lead.source.email || 'N/A'}, ${lead.source.phoneNumber || 'N/A'})` :
                                ` - ${lead.source.name || 'N/A'}`
                            }
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. BASIC DETAILS: compact summary shown in sidebar; full form appears below when the 'Basic Details' tab is active */}
            <div className="form-layout">
                <aside className="sidebar">
                    <div className="sidebar-content">
                        <div className="sidebar-summary">
                            <h3 className="summary-name">{lead.fullName || '—'}</h3>
                            <p className="summary-phone">{(lead.mobileNumbers && lead.mobileNumbers[0]) ? lead.mobileNumbers[0] : ''}</p>
                            <p className="summary-email">{lead.email || lead.emailId || ''}</p>
                        </div>
                        

                        <div className="sidebar-tabs">
                            <div className="tabs-list">
                                <button type="button" onClick={() => setActiveTab('basic')} className={`tab-button ${activeTab==='basic' ? 'active' : ''}`}>
                                👤Basic Details
                            </button>
                                <button type="button" onClick={() => setActiveTab('furtherEducation')} className={`tab-button ${activeTab==='furtherEducation' ? 'active' : ''}`}>🎓Further Education Details</button>
                                <button type="button" onClick={() => setActiveTab('testScores')} className={`tab-button ${activeTab==='testScores' ? 'active' : ''}`}>📝Test Scores</button>
                                <button type="button" onClick={() => setActiveTab('otherDetails')} className={`tab-button ${activeTab==='otherDetails' ? 'active' : ''}`}>📋Other Details</button>
                                <button type="button" onClick={() => setActiveTab('courseDetails')} className={`tab-button ${activeTab==='courseDetails' ? 'active' : ''}`}>💰Course Details</button>
                                <button type="button" onClick={() => setActiveTab('assetsAvailable')} className={`tab-button ${activeTab==='assetsAvailable' ? 'active' : ''}`}>🏠Assets Available</button>
                                <button type="button" onClick={() => setActiveTab('studentRelations')} className={`tab-button ${activeTab==='studentRelations' ? 'active' : ''}`}>👨‍👩‍👧‍👦Student Relations</button>
                                <button type="button" onClick={() => setActiveTab('studentReferences')} className={`tab-button ${activeTab==='studentReferences' ? 'active' : ''}`}>🤝Student References & PAN</button>
                                <button type="button" onClick={() => setActiveTab('bankSearch')} className={`tab-button ${activeTab==='bankSearch' ? 'active' : ''}`}>🏦Bank Search by Pincode</button>
                                <button type="button" onClick={() => setActiveTab('referFriends')} className={`tab-button ${activeTab==='referFriends' ? 'active' : ''}`}>👥Refer Applicant's Friends</button>
                                <button type="button" onClick={() => setActiveTab('emailTemplates')} className={`tab-button ${activeTab==='emailTemplates' ? 'active' : ''}`}>🛠️Email Templates</button>
                                <button type="button" onClick={() => setActiveTab('recommendedBanks')} className={`tab-button ${activeTab==='recommendedBanks' ? 'active' : ''}`}>💳Recommended Banks</button>
                                <button type="button" onClick={() => setActiveTab('reminders')} className={`tab-button ${activeTab==='reminders' ? 'active' : ''}`}>🗓️Reminders & Final Status</button>
                                <button type="button" onClick={() => setActiveTab('callNotes')} className={`tab-button ${activeTab==='callNotes' ? 'active' : ''}`}>📞Call Notes & History</button>
                                <button type="button" onClick={() => setActiveTab('taskHistory')} className={`tab-button ${activeTab==='taskHistory' ? 'active' : ''}`}>🕘Task History</button>
                            </div>
                        </div>
                    </div>
                </aside>
                <main className="main-content">
                    <div className="tab-content">
                        {/* Basic Details (full form shown in main when the Basic Details tab is active) */}
                        {activeTab === 'basic' && (
                        <div className="section-block">
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
                        </div>
                        )}

                        {/* 3. FURTHER EDUCATION DETAILS */}
                        {activeTab==='furtherEducation' && (
                            <FurtherEducationSection
                                lead={lead}
                                setLead={setLead}
                                handleChange={handleChange}
                                handleDateChange={handleDateChange}
                                renderSelectField={renderSelectField}
                                renderAutocompleteField={renderAutocompleteField}
                                handleShowPrimeBanks={handleShowPrimeBanks}
                                primeBankList={primeBankList}
                                fetchedForUniversity={fetchedForUniversity}
                            />
                        )}

                        {/* NEW: Test Scores Section */}
                        {activeTab==='testScores' && (
                            <TestScoresSection
                                lead={lead}
                                handleNestedChange={handleNestedChange}
                                renderTextField={renderTextField}
                            />
                        )}

                        {/* --- REFACTORED: Other Details Section --- */}
                        {activeTab==='otherDetails' && (
                            <OtherDetailsSection
                                lead={lead}
                                handleChange={handleChange}
                                renderTextField={renderTextField}
                            />
                        )}

                        {/* --- REFACTORED: Course Details Section --- */}
                        {activeTab==='courseDetails' && (
                            <CourseDetailsSection
                                lead={lead}
                                setLead={setLead}
                                handleChange={handleChange}
                                renderTextField={renderTextField}
                                renderSelectField={renderSelectField}
                                setActiveConverter={setActiveConverter}
                                activeConverter={activeConverter}
                                isConversionRateEditable={isConversionRateEditable}
                                setIsConversionRateEditable={setIsConversionRateEditable}
                                totalFee={totalFee}
                            />
                        )}

                        {/* NEW: Assets Available Section */}
                        {activeTab==='assetsAvailable' && (
                            <AssetsAvailableSection
                                lead={lead}
                                setLead={setLead}
                                hasAssets={hasAssets}
                                setHasAssets={setHasAssets}
                                updateAsset={updateAsset}
                                removeAsset={removeAsset}
                                addAsset={addAsset}
                                renderTextField={renderTextField}
                                renderSelectField={renderSelectField}
                            />
                        )}

                        {/* --- NEW: Bank Search by Pincode --- */}
                        {activeTab==='bankSearch' && (
                            <BankSearchSection
                                bankSearchPincode={bankSearchPincode}
                                setBankSearchPincode={setBankSearchPincode}
                                handleBankSearch={handleBankSearch}
                                isBankSearching={isBankSearching}
                                bankSearchResults={bankSearchResults}
                                bankSearchMessage={bankSearchMessage}
                                handleOpenAssignModal={handleOpenAssignModal}
                            />
                        )}

                        {/* 4. FAMILY/CO-APPLICANT INFO */}
                        {/* REFACTORED: Student Relations Section */}
                        {activeTab==='studentRelations' && (
                            <StudentRelationsSection
                                lead={lead}
                                setLead={setLead}
                                updateRelation={updateRelation}
                                removeRelation={removeRelation}
                                addRelation={addRelation}
                                renderTextField={renderTextField}
                                renderSelectField={renderSelectField}
                                handleNestedChange={handleNestedChange}
                                employmentTypes={employmentTypes}
                                showOHGFields={showOHGFields}
                                setShowOHGFields={setShowOHGFields}
                                isSelectingOHG={isSelectingOHG}
                                setIsSelectingOHG={setIsSelectingOHG}
                                handleSelectOHG={handleSelectOHG}
                                countryPhoneCodes={countryPhoneCodes}
                            />
                        )}

                        {/* REFACTORED: Student References Section */}
                        {activeTab==='studentReferences' && (
                            <StudentReferencesSection
                                lead={lead}
                                handleChange={handleChange}
                                handleNestedChange={handleNestedChange}
                                renderTextField={renderTextField}
                                renderSelectField={renderSelectField}
                                referenceRelationships={referenceRelationships}
                                countryPhoneCodes={countryPhoneCodes}
                            />
                        )}

                        {/* REFACTORED: Refer Friends Section */}
                        {activeTab==='referFriends' && (
                            <ReferFriendsSection
                                lead={lead}
                                setLead={setLead}
                                handleNestedChange={handleNestedChange}
                                handleCreateReferralLead={handleCreateReferralLead}
                                countryPhoneCodes={countryPhoneCodes}
                            />
                        )}

                        {/* REFACTORED: Email Templates Section */}
                        {activeTab==='emailTemplates' && (
                            <EmailTemplatesSection
                                handleOpenEmailModal={handleOpenEmailModal}
                                emailMessage={emailMessage}
                            />
                        )}
                        {/* REFACTORED: Recommended Banks Section */}
                        {activeTab==='recommendedBanks' && (
                            <RecommendedBanksSection
                                lead={lead}
                                tiedUpBanks={tiedUpBanks}
                                handleOpenAssignModal={handleOpenAssignModal}
                            />
                        )}

                        {/* REFACTORED: Reminders & Final Status Section */}
                        {activeTab==='reminders' && (
                            <RemindersSection
                                lead={lead}
                                handleChange={handleChange}
                                handleDateChange={handleDateChange}
                                handleSanctionDetailsChange={handleSanctionDetailsChange}
                                handleSetReminder={handleSetReminder}
                            />
                        )}


                        {/* REFACTORED: Call Notes & History Section */}
                        {activeTab==='callNotes' && (
                            <CallNotesSection
                                lead={lead}
                                newNote={newNote}
                                handleNoteChange={handleNoteChange}
                                onSendNote={handleSaveNote}
                                onSubmitLeadData={() => {
                                    if (!lead.callHistory || lead.callHistory.length === 0) {
                                        alert('Please add at least one note before submitting the lead data.');
                                        return;
                                    }
                                    if (!lead.reminderCallDate && (!lead.reminders || lead.reminders.length === 0)) {
                                        alert('Please set a reminder before submitting the lead data.');
                                        return;
                                    }
                                    // Trigger form submission
                                    const form = document.querySelector('form');
                                    if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                                }}
                                isSubmitDisabled={false}
                            />
                        )}

                        {/* REFACTORED: Task History Section */}
                        {activeTab==='taskHistory' && (
                            <TaskHistorySection
                                leadTasks={leadTasks}
                                handleUpdateTaskStatus={handleUpdateTaskStatus}
                            />
                        )}
                    </div>
                     <div className="notes-container">
                        <h3>Quick Notes</h3>
                        <textarea
                            value={quickNote}
                            onChange={(e) => setQuickNote(e.target.value)}
                            placeholder="Enter quick note..."
                            rows={10}
                            className="notes-textarea"
                        />
                        <button
                            type="button"
                            onClick={handleAddQuickNote}
                            className="add-note-btn"
                        >
                            Add Note
                        </button>
                    </div>
                </main>
            </div> 

            {/* Main Submit Button - SUBMIT LEAD DATA Button moved to CallNotesSection */}
            <div className="form-submit-section">
                <button
                    type="submit"
                    className="submit-button"
                    style={{
                        background: '#512967',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '20px',
                        width: '100%',
                        maxWidth: '200px'
                    }}
                >
                    Save Lead
                </button>
            </div>
        </form>

        {/* --- NEW: Email Template Modal --- */}
        {isEmailModalOpen && (
            <div className="modal-overlay" onClick={handleCloseEmailModal}>
                <div className="modal-content email-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">Send Email: {currentEmailTemplate.name}</h2>
                        <button className="modal-close-btn" onClick={handleCloseEmailModal}>
                            <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="modal-body email-modal-body">
                        <div className="email-subject">
                            <h3 className="text-lg font-semibold mb-2">Subject: {currentEmailTemplate.subject}</h3>
                        </div>
                        <div className="email-content border border-gray-300 rounded p-4 max-h-96 overflow-y-auto bg-white">
                            <div dangerouslySetInnerHTML={{ __html: currentEmailTemplate.body }} />
                        </div>
                        {emailStatus && (
                            <div className={`mt-4 p-2 rounded ${emailStatus.includes('success') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {emailStatus}
                            </div>
                        )}
                    </div>
                    {/* Conditionally render actions only for actual email templates */}
                    {(NLTemplates.includes(currentEmailTemplate.name) ||
                      banksDocs.includes(currentEmailTemplate.name) ||
                      documentStatus.includes(currentEmailTemplate.name) ||
                      loanIssues.includes(currentEmailTemplate.name) ||
                      miscSituations.includes(currentEmailTemplate.name)
                    ) && (
                        <div className="email-modal-actions">
                            <button
                                className="btn secondary flex items-center gap-2"
                                onClick={handleCopyEmailBody}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                Copy Content
                            </button>
                            <button
                                className="btn primary"
                                onClick={handleSendTemplateEmail}
                                disabled={emailStatus === 'Sending...'}
                            >
                                {emailStatus === 'Sending...' ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- NEW: Bank Assignment Modal --- */}
        {isAssignModalOpen && (
            <div className="modal-overlay" onClick={handleCloseAssignModal}>
                <div className="modal-content bank-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">Assign Lead to {selectedBankForAssignment?.name}</h2>
                        <button className="modal-close-btn" onClick={handleCloseAssignModal}>
                            <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="modal-body bank-modal-body">
                        <div className="bank-modal-form-group">
                            <label htmlFor="region-select" className="form-label">1. Select Region</label>
                            <select
                                id="region-select"
                                className="form-select"
                                value={assignmentRegion}
                                onChange={(e) => {
                                    setAssignmentRegion(e.target.value);
                                    setAssignmentRM(''); // Reset RM selection when region changes
                                }}
                            >
                                <option value="">Select Region</option>
                                {/* Get unique regions from the bank's RMs */}
                                {[...new Set(selectedBankForAssignment?.relationshipManagers.map(rm => rm.region))].map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>

                        <div className="bank-modal-form-group">
                            <label htmlFor="rm-select" className="form-label">2. Select Relationship Manager</label>
                            <select
                                id="rm-select"
                                className="form-select"
                                value={assignmentRM}
                                disabled={!assignmentRegion}
                                onChange={(e) => setAssignmentRM(e.target.value)}
                            >
                                <option value="">Select Relationship Manager</option>
                                {selectedBankForAssignment?.relationshipManagers.filter(rm => rm.region === assignmentRegion).map(rm => (
                                    <option key={rm.email} value={JSON.stringify({ name: rm.name, email: rm.email })}>{rm.name} ({rm.email})</option>
                                ))}
                            </select>
                        </div>
                        {assignmentError && <div className="error-message">{assignmentError}</div>}
                    </div>
                    <div className="bank-modal-actions">
                        <button className="bank-modal-btn btn secondary" onClick={handleCloseAssignModal}>Cancel</button>
                        <button className="bank-modal-btn btn primary" onClick={handleAssignToBank} disabled={!assignmentRM}>Assign Lead</button>
                    </div>
                </div>
            </div>
        )}

    </div>
    );
};
    
export default LeadForm;