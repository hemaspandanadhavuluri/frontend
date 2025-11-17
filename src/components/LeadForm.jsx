
import React, { useState, useEffect } from "react";
import axios from 'axios';
import moment from 'moment'; // Import moment for date/time formatting

// You should ensure this file exists for custom styles like container width
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

        if (name === 'approachedAnyBank' || name === 'hasStudentLoans' || name === 'hasCibilIssues' || name === 'documentsAvailable') {
            // Radio group value is a string, convert to boolean
            const boolValue = value === 'true';
            setLead((prev) => ({
                ...prev,
                [name]: boolValue,
                // Also clear dependent fields if user selects "No"
                previousBankApproached: name === 'approachedAnyBank' && !boolValue ? '' : prev.previousBankApproached,
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

    if (loading) return <p className="text-center mt-5">Loading Lead Details...</p>;

    // Calculate total expenses (Unchanged)
    const totalFee = (parseFloat(lead.fee) || 0) + (parseFloat(lead.living) || 0) + (parseFloat(lead.otherExpenses) || 0);

    return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {lead._id ? `Lead: ${lead.fullName}` : 'Create New Lead'}
        </h1>
        <form onSubmit={handleSubmit}>

            {/* 1. TOP METADATA & SOURCE INFO - Organized into a Card */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="p-2">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full md:w-2/3 p-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">{`Applied: ${lead.studentAppliedDate || 'N/A'} ${lead.studentAppliedTime || ''}`}</span>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">{`FO: ${lead.assignedFO || 'N/A'} (${lead.assignedFOPhone || 'N/A'})`}</span>
                            </div>
                            <span className="text-sm font-bold">Sources / Referral:</span>
                            <a href="#" className="text-sm text-blue-600 hover:underline ml-2 mr-4">Show History</a>
                            <span className="text-sm text-gray-600">
                                **{lead.source.source || 'N/A'}**: {lead.source.name || 'N/A'} | {lead.source.email || 'N/A'} | {lead.source.phoneNumber || 'N/A'}
                            </span>
                        </div>
                        <div className="w-full md:w-1/3 p-1">
                            <div className="flex flex-col gap-1 items-start md:items-end">
                                <span className="text-xs font-mono inline-block py-1 px-2 border border-gray-300 rounded">{`Loan ID: ${lead.loanId || 'N/A'}`}</span>
                                <span className="text-xs font-mono inline-block py-1 px-2 border border-gray-300 rounded">{`User ID: ${lead.leadID || 'N/A'}`}</span>
                            </div>
                        </div>
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

                {/* NEW: Other & Course Details Section */}
                <Accordion title="Other & Course Details" icon="📄">
                    <div className="flex flex-wrap -mx-2 items-center">
                            {renderTextField("age", "Age", lead.age, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("workExperience", "Work Experience (in months)", lead.workExperience, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                            <div className="p-2 w-full md:w-1/2">
                                <fieldset>
                                    <legend className="text-sm font-medium text-gray-700">Is there any loan on the student?</legend>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="flex items-center"><input type="radio" name="hasStudentLoans" value="true" checked={lead.hasStudentLoans === true} onChange={handleChange} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                        <label className="flex items-center"><input type="radio" name="hasStudentLoans" value="false" checked={lead.hasStudentLoans === false} onChange={handleChange} className="form-radio" /> <span className="ml-2">No</span></label>
                                    </div>
                                </fieldset>
                            </div>
                            <hr className="w-full my-4" />
                            {renderSelectField("courseDuration", "Course Duration", lead.courseDuration, handleChange, courseDurations, "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("fee", "Fee (in Lakhs)", lead.fee, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("living", "Living (in Lakhs)", lead.living, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("otherExpenses", "Other Expenses (in Lakhs)", lead.otherExpenses, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                            <div className="p-2 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Fee (in Lakhs)</label>
                                <input type="text" value={totalFee.toFixed(2)} readOnly className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
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
                                        {renderTextField("phoneNumber", "Guarantor Phone Number", lead.ownHouseGuarantor.phoneNumber, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
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
                                    {renderTextField(`references[${index}].address`, "Address*", ref.address, (e) => handleNestedChange('references', e), "w-full sm:w-1/2 md:w-1/4")}
                                    {renderTextField(`references[${index}].phoneNumber`, "Phone Number *", ref.phoneNumber, (e) => handleNestedChange('references', e), "w-full sm:w-1/2 md:w-1/4")}
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
                                        <input type="text" placeholder="Phone Number" value={ref.phoneNumber || ''} name={`referralList[${index}].phoneNumber`} onChange={(e) => handleNestedChange('referralList', e)} className="w-full p-2 border rounded-md mb-2" />
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
                            <div className="flex flex-wrap gap-2">{NLTemplates.map((item, index) => (<button type="button" key={index} className="px-3 py-1.5 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Banks Connection - Intro & Docs Upload</h4>
                            <div className="flex flex-wrap gap-2">{banksDocs.map((item, index) => (<button type="button" key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:bg-purple-700 flex items-center" style={{backgroundColor:'#AA60C8'}}><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Document Upload</h4>
                            <div className="flex flex-wrap gap-2">{documentStatus.map((item, index) => (<button type="button" key={index} className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2_0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
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
                            <div className="flex flex-wrap gap-2">{loanIssues.map((item, index) => (<button type="button" style={{backgroundColor:'purple'}} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-80 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.2-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Miscellaneous Situations</h4>
                            <div className="flex flex-wrap gap-2">{miscSituations.map((item, index) => (<button type="button" style={{backgroundColor:'#11224E'}} key={index} className="px-3 py-1.5 text-sm font-medium text-white rounded-md hover:opacity-80 flex items-center"><svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>{item}</button>))}</div>
                        </div>
                    </div>
                </Accordion>
                 {/* 8. RECOMMENDED BANKS & ISSUES */}
                <Accordion title="Recommended Banks" icon="💳">
                        <div className="flex flex-wrap -mx-2">
                            <div className="w-full md:w-1/2 p-2">
                                <h4 className="font-bold mb-2 text-gray-800">Tied-Up Banks</h4>
                                <div className="flex flex-col gap-2">
                                    {tiedUpBanks.map((bank) => (
                                        <div key={bank._id} className="p-3 border rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold">{bank.name}</p>
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
                                            <button type="button" onClick={() => handleAssignToBank(bank)} disabled={lead.assignedBanks?.some(b => b.bankId === bank._id)} className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                                                {lead.assignedBanks?.some(b => b.bankId === bank._id) ? 'Assigned' : 'Assign'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                </Accordion>

                {/* 10. REMINDERS & FINAL STATUS */}
                <Accordion title="Reminders & Final Status" icon="🗓️">
                        <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-lg">
                            <h5 className="font-bold mb-1">Targeted Sanction Date</h5>
                            <p className="text-xs">Previous selected date: Not selected</p>
                            <label className="flex items-center mt-2">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2 text-sm">Not possible to sanction in this month or the next month</span>
                            </label>
                        </div>
                        <div className="flex flex-wrap -mx-2">
                            <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last call date</label>
                                <input type="date" value={lead.lastCallDate ? moment(lead.lastCallDate).format('YYYY-MM-DD') : ''} onChange={(e) => handleDateChange('lastCallDate', e.target.value)} className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Next call date</label>
                                <input type="date" value={lead.reminderCallDate ? moment(lead.reminderCallDate).format('YYYY-MM-DD') : ''} onChange={(e) => handleDateChange('reminderCallDate', e.target.value)} className="w-full p-2 border rounded-md" />
                            </div>
                            <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Final Status</label>
                                <select name="leadStatus" value={lead.leadStatus} onChange={handleChange} className="w-full p-2 border rounded-md">
                                    {['No status', 'Sanctioned', 'Rejected', 'Application Incomplete','On Priority'].map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                            <div className="w-full p-2 space-y-2">
                                <label className="flex items-center"><input type="checkbox" className="form-checkbox" /> <span className="ml-2 text-sm">Clear Preferred Next Call Time</span></label>
                                <label className="flex items-center"><input type="checkbox" className="form-checkbox" /> <span className="ml-2 text-sm">Student is not eligible for Connecting to Advisar</span></label>
                            </div>
                        </div>
                </Accordion>
            </div>

            {/* --- CALL HISTORY & NOTES SECTION (MOVED TO BOTTOM) --- */}
            <CallHistorySection
                lead={lead}
                newNote={newNote}
                handleNoteChange={handleNoteChange}
                handleSaveNote={handleSaveNote}
                MOCK_USER_FULLNAME={MOCK_USER_FULLNAME}
            />


            {/* Main Submit Button */}
            <button
                type="submit"
                className="w-full mt-8 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!lead.reminderCallDate || !newNote.notes.trim()}
            >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ✅ SUBMIT LEAD DATA 
            </button>
        </form>
    </div>);
};

export default LeadForm;