import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Autocomplete, TextField as MuiTextField, Button as MuiButton, Box, Paper, Typography, Chip, Divider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment'; 

import BasicDetailsSection from "./BasicDetailsSection";
import RelationCard from "./RelationCard";
import AssetCard from "./AssetCard";
import {
    EMPTY_LEAD_STATE, 
    courseStartQuarters, courseStartYears, degrees,
    fieldsOfInterest, admissionStatuses, universities, employmentTypes, courseDurations, referenceRelationships, currencies, countryPhoneCodes,
    allCountries, API_URL
} from "../constants";

// Custom Accordion component using Tailwind CSS
const Accordion = ({ title, icon, children, defaultExpanded = true }) => {
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

const BankLeadForm = ({ leadData, onBack, onUpdate }) => {
    const [lead, setLead] = useState(EMPTY_LEAD_STATE);
    const [loading, setLoading] = useState(true);
    const isReadOnly = true; // Always read-only for Bank Executives

    // Task Creation State
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [task, setTask] = useState({ assignedTo: null, subject: '', body: '' });
    const [taskMessage, setTaskMessage] = useState('');
    const [showTaskCreator, setShowTaskCreator] = useState(false);
    const [leadTasks, setLeadTasks] = useState([]);
    const [note, setNote] = useState('');

    // --- EFFECT: Fetch Lead Data & Assignable Users ---
    useEffect(() => {
        const fetchAssignableUsers = async () => {
            try {
                const response = await axios.get(`${API_URL.replace('/leads', '/users')}/assignable`);
                setAssignableUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch assignable users:", error);
            }
        };
        fetchAssignableUsers();

        const fetchLeadAndTasks = async (leadId) => {
            try {
                const [leadResponse, tasksResponse] = await Promise.all([
                    axios.get(`${API_URL}/${leadId}`),
                    axios.get(`${API_URL.replace('/leads', '/tasks')}/lead/${leadId}`)
                ]);
                
                const dataToSet = { ...EMPTY_LEAD_STATE, ...leadResponse.data };
                // Ensure arrays exist
                if (!dataToSet.mobileNumbers || dataToSet.mobileNumbers.length === 0) dataToSet.mobileNumbers = ["+91-"];
                if (!dataToSet.relations) dataToSet.relations = [];
                if (!dataToSet.assets) dataToSet.assets = [];
                
                setLead(dataToSet);
                setLeadTasks(tasksResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch lead data:", error);
                setLoading(false);
            }
        };

        if (leadData && leadData._id) {
            fetchLeadAndTasks(leadData._id);
        }
    }, [leadData]);

    // --- Handlers ---
    const renderTextField = (name, label, value, onChange, widthClass = "w-full md:w-1/3") => (
        <div className={`p-2 ${widthClass}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                disabled={true}
                value={value !== undefined && value !== null ? (Array.isArray(value) ? value.join(', ') : value.toString()) : ''}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600"
            />
        </div>
    );

    const renderSelectField = (name, label, value, onChange, options, widthClass = "w-full md:w-1/3") => (
        <div className={`p-2 ${widthClass}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                disabled={true}
                value={value || ''}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600"
            />
        </div>
    );

    const renderAutocompleteField = (name, label, value, onChange, options, widthClass = "w-full md:w-1/3") => (
        <div className={`p-2 ${widthClass}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type="text"
                disabled={true}
                value={value || ''}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600"
            />
        </div>
    );

    // --- Task Handlers ---
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
            creatorRole: currentUser.role
        };

        try {
            const response = await axios.post(API_URL.replace('/leads', '/tasks'), payload);
            setLeadTasks(prev => [...prev, response.data]);
            setTaskMessage('Task created successfully!');
            setTask({ assignedTo: null, subject: '', body: '' });
            setShowTaskCreator(false);
        } catch (error) {
            console.error('Failed to create task:', error);
            setTaskMessage(error.response?.data?.message || 'Failed to create task.');
        }
    };

    // --- Note Handlers ---
    const handleSaveNote = async () => {
        if (!note.trim()) return;
        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        try {
            const payload = {
                externalCallNote: {
                    notes: note,
                    loggedByName: `${currentUser.fullName} (${currentUser.bank})`
                }
            };
            const response = await axios.put(`${API_URL}/${lead._id}`, payload);
            setLead(prev => ({ ...prev, externalCallHistory: response.data.externalCallHistory }));
            setNote('');
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading Lead Details...</p>;

    return (
        <div className="p-4 md:p-8 w-full mx-auto my-8 bg-white rounded-lg shadow-xl">
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    Lead: {lead.fullName}
                    <Chip label="View Only" color="warning" sx={{ ml: 2 }} />
                </h1>
                <MuiButton variant="contained" color="secondary" onClick={() => setShowTaskCreator(!showTaskCreator)}>
                    {showTaskCreator ? 'Cancel Task' : 'Create Task'}
                </MuiButton>
            </Box>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Lead Details */}
                <div className="flex-1 min-w-0">
                    {/* --- 1. BASIC DETAILS --- */}
                    <BasicDetailsSection
                        lead={lead}
                        setLead={() => {}} // No-op
                        handleChange={() => {}} // No-op
                        renderTextField={renderTextField}
                        renderSelectField={renderSelectField}
                        renderAutocompleteField={renderAutocompleteField}
                        indianStates={[]} // Not needed for read-only
                        indianCities={[]} // Not needed for read-only
                    />

                    <div className="mt-4">
                        {/* --- 2. FURTHER EDUCATION DETAILS --- */}
                        <Accordion title="Further Education Details" icon="🎓" defaultExpanded>
                            <div className="flex flex-wrap -mx-2">
                                {renderSelectField("loanType", "Loan Type", lead.loanType, null, [], "w-full sm:w-1/2 md:w-1/4")}
                                {renderSelectField("courseStartMonth", "Course Start Month", lead.courseStartMonth, null, [], "w-full sm:w-1/2 md:w-1/4")}
                                {renderSelectField("courseStartYear", "Course Start Year", lead.courseStartYear, null, [], "w-full sm:w-1/2 md:w-1/4")}
                                {renderSelectField("degree", "Degree", lead.degree, null, [], "w-full sm:w-1/2 md:w-1/4")}
                                {renderSelectField("fieldOfInterest", "Field of Interest", lead.fieldOfInterest, null, [])}
                                {renderAutocompleteField("interestedCountries", "Interested Countries", lead.interestedCountries, null, [])}
                                {renderSelectField("admissionStatus", "Admission Status", lead.admissionStatus, null, [])}
                                
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    {lead.admissionStatus === 'Applied - No Admit Yet' && (
                                        <div className="p-2 w-full md:w-1/3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Admit Date</label>
                                            <DatePicker readOnly value={lead.expectedAdmitDate ? moment(lead.expectedAdmitDate) : null} />
                                        </div>
                                    )}
                                    {lead.admissionStatus === 'Not Yet Applied' && (
                                        <div className="p-2 w-full md:w-1/3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Application Date</label>
                                            <DatePicker readOnly value={lead.expectedApplicationDate ? moment(lead.expectedApplicationDate) : null} />
                                        </div>
                                    )}
                                </LocalizationProvider>
                                
                                {renderAutocompleteField("admittedUniversities", "Admitted Universities", lead.admittedUniversities, null, [], "w-full md:w-1/2")}
                                
                                <div className="p-2 w-full md:w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Has the student already approached any bank?</label>
                                    <input type="text" disabled value={lead.approachedAnyBank ? "Yes" : "No"} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                                    {lead.approachedAnyBank && <input type="text" disabled value={lead.previousBankApproached} className="mt-2 w-full p-2 border border-gray-300 rounded-md bg-gray-50" />}
                                    
                                    {lead.approachedAnyBank && (
                                        <div className="mt-4">
                                            <div className="flex flex-wrap -mx-2">
                                                <div className="p-2 w-full md:w-1/2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">File Logged In?</label>
                                                    <input type="text" disabled value={lead.fileLoggedIn ? "Yes" : "No"} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                                                </div>
                                                {lead.fileLoggedIn && (
                                                    <div className="p-2 w-full md:w-1/2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loan Sanctioned?</label>
                                                        <input type="text" disabled value={lead.loanSanctioned ? "Yes" : "No"} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                                                    </div>
                                                )}
                                            </div>
                                            {lead.loanSanctioned && lead.sanctionDetails && (
                                                <div className="mt-2 p-4 border rounded-md bg-gray-50">
                                                    <h4 className="font-bold text-gray-800 mb-2">Sanction Details</h4>
                                                    <div className="flex flex-wrap -mx-2">
                                                        {renderTextField("rateOfInterest", "Rate of Interest (%)", lead.sanctionDetails.rateOfInterest, null, "w-full sm:w-1/2 md:w-1/3")}
                                                        {renderTextField("loanAmount", "Loan Amount (Lakhs)", lead.sanctionDetails.loanAmount, null, "w-full sm:w-1/2 md:w-1/3")}
                                                        {renderTextField("coApplicant", "Co-Applicant", lead.sanctionDetails.coApplicant, null, "w-full sm:w-1/2 md:w-1/3")}
                                                        {renderTextField("processingFeePaid", "Processing Fee Paid?", lead.sanctionDetails.processingFeePaid ? "Yes" : "No", null, "w-full sm:w-1/2 md:w-1/3")}
                                                        {renderTextField("disbursementDone", "Disbursement Done?", lead.sanctionDetails.disbursementDone ? "Yes" : "No", null, "w-full sm:w-1/2 md:w-1/3")}
                                                        {renderTextField("loanSecurity", "Loan Security", lead.sanctionDetails.loanSecurity, null, "w-full sm:w-1/2 md:w-1/3")}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Accordion>

                        {/* --- 3. TEST SCORES --- */}
                        <Accordion title="Test Scores" icon="📝">
                            <div className="flex flex-wrap -mx-2">
                                {renderTextField("GRE", "GRE", lead.testScores.GRE, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("IELTS", "IELTS", lead.testScores.IELTS, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("TOEFL", "TOEFL", lead.testScores.TOEFL, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("GMAT", "GMAT", lead.testScores.GMAT, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("SAT", "SAT", lead.testScores.SAT, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("PTE", "PTE", lead.testScores.PTE, null, "w-full sm:w-1/2 md:w-1/4")}
                            </div>
                        </Accordion>

                        {/* --- 4. OTHER DETAILS --- */}
                        <Accordion title="Other Details" icon="📋">
                            <div className="flex flex-wrap -mx-2 items-start">
                                {renderTextField("age", "Age", lead.age, null, "w-full sm:w-1/2 md:w-1/3")}
                                {renderTextField("workExperience", "Work Experience (months)", lead.workExperience, null, "w-full sm:w-1/2 md:w-1/3")}
                                <div className="p-2 w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Any existing loans?</label>
                                    <input type="text" disabled value={lead.hasStudentLoans ? "Yes" : "No"} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                                    {lead.hasStudentLoans && (
                                        <>
                                            <input type="text" disabled value={lead.studentLoanDetails} className="mt-2 w-full p-2 border border-gray-300 rounded-md bg-gray-50" placeholder="Details" />
                                            <input type="text" disabled value={lead.studentLoanAmount} className="mt-2 w-full p-2 border border-gray-300 rounded-md bg-gray-50" placeholder="Amount" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </Accordion>

                        {/* --- 5. COURSE DETAILS --- */}
                        <Accordion title="Course Details" icon="📄">
                            <div className="flex flex-wrap -mx-2 items-start">
                                {renderSelectField("courseDuration", "Course Duration", lead.courseDuration, null, [], "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("fee", "Tuition Fee (Lakhs)", lead.fee, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("living", "Living (Lakhs)", lead.living, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("otherExpenses", "Other Expenses (Lakhs)", lead.otherExpenses, null, "w-full sm:w-1/2 md:w-1/4")}
                                {renderTextField("loanAmountRequired", "Loan Amount Required (Lakhs)", lead.loanAmountRequired, null, "w-full sm:w-1/2 md:w-1/3")}
                            </div>
                        </Accordion>

                        {/* --- 6. ASSETS AVAILABLE --- */}
                        <Accordion title="Assets Available" icon="🏠">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Are assets available?</label>
                                <input type="text" disabled value={lead.hasAssets ? "Yes" : "No"} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                            </div>
                            {(lead.hasAssets || (lead.assets && lead.assets.length > 0)) && lead.assets.map((asset, index) => (
                                <AssetCard
                                    key={index}
                                    asset={asset}
                                    index={index}
                                    onUpdate={() => {}}
                                    onRemove={() => {}}
                                    renderTextField={renderTextField}
                                    renderSelectField={renderSelectField}
                                />
                            ))}
                        </Accordion>

                        {/* --- 7. STUDENT RELATIONS --- */}
                        <Accordion title="Student Relations (Co-Applicant/Guarantor)" icon="👨‍👩‍👧‍👦">
                            {lead.relations.map((relation, index) => (
                                <RelationCard
                                    key={index}
                                    relation={relation}
                                    index={index}
                                    onUpdate={() => {}}
                                    onRemove={() => {}}
                                    renderTextField={renderTextField}
                                    renderSelectField={renderSelectField}
                                    employmentTypes={[]}
                                />
                            ))}
                            {/* Own House Guarantor Display */}
                            {lead.ownHouseGuarantor && lead.ownHouseGuarantor.name && (
                                <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                                    <h5 className="text-xl font-bold mb-4 text-blue-700">Own House Guarantor Details</h5>
                                    <div className="flex flex-wrap -mx-2">
                                        {renderTextField("name", "Guarantor Name", lead.ownHouseGuarantor.name, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("relationshipType", "Relationship", lead.ownHouseGuarantor.relationshipType, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("phoneNumber", "Phone", lead.ownHouseGuarantor.phoneNumber, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("employmentType", "Employment", lead.ownHouseGuarantor.employmentType, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("annualIncome", "Annual Income (lacs)", lead.ownHouseGuarantor.annualIncome, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("currentObligations", "Current Obligations", lead.ownHouseGuarantor.currentObligations, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField("cibilScore", "CIBIL Score", lead.ownHouseGuarantor.cibilScore, null, "w-full sm:w-1/2 md:w-1/4")}
                                        <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CIBIL Issues?</label>
                                            <input type="text" disabled value={lead.ownHouseGuarantor.hasCibilIssues ? "Yes" : "No"} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600" />
                                        </div>
                                        {lead.ownHouseGuarantor.hasCibilIssues && renderTextField("cibilIssues", "CIBIL Issues", lead.ownHouseGuarantor.cibilIssues, null, "w-full sm:w-1/2 md:w-1/4")}
                                    </div>
                                </div>
                            )}
                        </Accordion>

                        {/* --- 8. REFERENCES & PAN --- */}
                        <Accordion title="Student References & PAN Details" icon="🤝">
                            {lead.references.map((ref, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                    <h5 className="font-bold mb-2 text-gray-600">Reference {index + 1}</h5>
                                    <div className="flex flex-wrap -mx-2">
                                        {renderTextField(`refName${index}`, "Name", ref.name, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField(`refRel${index}`, "Relationship", ref.relationship, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField(`refPhone${index}`, "Phone", ref.phoneNumber, null, "w-full sm:w-1/2 md:w-1/4")}
                                        {renderTextField(`refAddr${index}`, "Address", ref.address, null, "w-full sm:w-1/2 md:w-1/4")}
                                    </div>
                                </div>
                            ))}
                            <hr className="my-4" />
                            <h4 className="text-xl font-semibold mb-2">Student PAN Details</h4>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="p-2 w-full md:w-1/3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PAN Status</label>
                                    <input type="text" disabled value={lead.panStatus} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
                                </div>
                                {lead.panStatus === 'Applied' && renderTextField("panNumber", "PAN Number", lead.panNumber, null, "w-full md:w-1/3")}
                            </div>
                        </Accordion>
                    </div>
                </div>

                {/* Right Column: Tasks & Notes */}
                <div className="w-full lg:w-1/3 space-y-4">
                    {/* Task Creator */}
                    {showTaskCreator && (
                        <Paper elevation={3} sx={{ p: 3, bgcolor: 'grey.50' }}>
                            <Typography variant="h6" gutterBottom>Create New Task for {lead.fullName}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Auto-assign to FO if available, otherwise allow selection */}
                                {lead.assignedFOId ? (
                                    <MuiTextField
                                        label="Assign Task To"
                                        value={`Automatically assigned to ${lead.assignedFO}`}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined" size="small"
                                    />
                                ) : (
                                    <Autocomplete
                                        options={assignableUsers}
                                        getOptionLabel={(option) => `${option.fullName} (${option.role})`}
                                        value={task.assignedTo}
                                        onChange={(event, newValue) => setTask(prev => ({ ...prev, assignedTo: newValue }))}
                                        renderInput={(params) => <MuiTextField {...params} label="Assign Task To" variant="outlined" size="small" />}
                                    />
                                )}
                                
                                {/* If FO is assigned, we need to set it in state for the payload if not already set */}
                                {lead.assignedFOId && !task.assignedTo && (() => {
                                    const foUser = assignableUsers.find(u => u._id === lead.assignedFOId);
                                    if (foUser) setTask(prev => ({...prev, assignedTo: foUser}));
                                })()}

                                <MuiTextField fullWidth label="Task Subject" name="subject" value={task.subject} onChange={(e) => setTask({...task, subject: e.target.value})} variant="outlined" size="small" />
                                <MuiTextField fullWidth label="Task Body (Optional)" name="body" value={task.body} onChange={(e) => setTask({...task, body: e.target.value})} multiline rows={3} variant="outlined" size="small" />
                                {taskMessage && <p className={`text-sm ${taskMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{taskMessage}</p>}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                    <MuiButton onClick={() => setShowTaskCreator(false)}>Cancel</MuiButton>
                                    <MuiButton variant="contained" onClick={handleCreateTask}>Create Task</MuiButton>
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {/* --- 9. NOTES & HISTORY --- */}
                    <Accordion title="Notes & History" icon="💬" defaultExpanded>
                        <div className="space-y-4 max-h-96 overflow-y-auto border p-4 rounded-md bg-gray-50 mb-6">
                            {lead.externalCallHistory && lead.externalCallHistory.length > 0 ? (
                                lead.externalCallHistory.slice().reverse().map((log, index) => (
                                    <div key={index} className="p-3 rounded-lg border-l-4 bg-white border-blue-400 shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-sm text-gray-800">
                                                {log.loggedByName}
                                            </p>
                                            <p className="text-xs text-gray-500">{moment(log.createdAt).format('DD MMM YYYY, h:mm a')}</p>
                                        </div>
                                        <p className="text-gray-700 text-sm">{log.notes}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No notes recorded yet.</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <MuiTextField fullWidth multiline rows={3} label="Add a Note" placeholder="Enter your note here..." value={note} onChange={(e) => setNote(e.target.value)} variant="outlined" />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <MuiButton variant="contained" onClick={handleSaveNote} disabled={!note.trim()}>
                                    Save Note
                                </MuiButton>
                            </Box>
                        </div>
                    </Accordion>

                    {/* --- 10. TASK HISTORY --- */}
                    <Accordion title="Task History" icon="📝" defaultExpanded>
                        <div className="space-y-4">
                            {leadTasks.length > 0 ? (
                                leadTasks.slice().reverse().map((task) => {
                                    const isBankTask = task.creatorRole === 'BankExecutive';
                                    return (
                                    <Paper key={task._id} elevation={isBankTask ? 3 : 2} sx={{ p: 2, position: 'relative', bgcolor: task.status === 'Done' ? '#f1f8e9' : (isBankTask ? '#fff3e0' : 'white'), borderLeft: `4px solid ${task.status === 'Done' ? '#81c784' : (isBankTask ? '#ff9800' : '#64b5f6')}` }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{task.subject}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{task.body}</Typography>
                                            </div>
                                            <Chip label={task.status} color={task.status === 'Open' ? 'info' : 'success'} size="small" />
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                            <Typography variant="caption" color={isBankTask ? "text.primary" : "text.secondary"} sx={{ fontWeight: isBankTask ? 500 : 400 }}>
                                                Created by: <strong>{task.createdByName}</strong> on {moment(task.createdAt).format('DD MMM YYYY')}
                                                <br />
                                                Assigned to: <strong>{task.assignedToName}</strong>
                                            </Typography>
                                        </Box>
                                    </Paper>
                                    );
                                })
                            ) : (
                                <Typography sx={{ textAlign: 'center', color: 'text.secondary', p: 2 }}>
                                    No tasks have been created for this lead.
                                </Typography>
                            )}
                        </div>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default BankLeadForm;
