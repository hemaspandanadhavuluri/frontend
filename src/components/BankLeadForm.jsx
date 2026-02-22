import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Autocomplete, TextField as MuiTextField, Button as MuiButton, Box, Paper, Typography, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers';
import { Phone as PhoneIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import moment from 'moment';

import BasicDetailsSection from "./sections/BasicDetailsSection";
import RelationCard from "./RelationCard";
import AssetCard from "./AssetCard";
import {
    EMPTY_LEAD_STATE,
    courseStartQuarters, courseStartYears, degrees,
    fieldsOfInterest, admissionStatuses, universities, employmentTypes, courseDurations, referenceRelationships, currencies, countryPhoneCodes, leadStatusOptions,
    allCountries, API_URL, BANK_EMAIL_TEMPLATE_CONTENT
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

const bankLeadStatusOptions = [
    "In Progress",
    "Logged In",
    "Sanctioned",
    "Rejected",
    "Disbursed",
    "Closed"
];

const applicationStatusOptions = [
    "Not Contactable",
    "Not Answering",
    "Switched Off",
    "Student Busy",
    "Call Back Later",
    "Not Interested",
    "Not Eligible",
    "Doable",
    "Logged from Other Source",
    "Spoken – Under Discussion",
    "Doable – Docs Reqested"
];

const subStatusOptions = [
    "Docs Pending",
    "Docs Received",
    "Logged In",
    "App ID Generated",
    "Under Process",
    "Sanctioned",
    "Rejected",
    "Disbursed"
];

// Helper to generate a valid MongoDB ObjectId string
const generateObjectId = () => {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase();
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
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [emailContent, setEmailContent] = useState('');

    // --- Email Modal State ---
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [currentEmailTemplate, setCurrentEmailTemplate] = useState({ name: '', subject: '', body: '' });
    const [emailModalStatus, setEmailModalStatus] = useState('');

    const [bankStatus, setBankStatus] = useState('In Progress');
    const [applicationStatus, setApplicationStatus] = useState('');
    const [subStatus, setSubStatus] = useState('');
    const [appId, setAppId] = useState('');
    const [newReminderDate, setNewReminderDate] = useState('');
    const [bankReminders, setBankReminders] = useState([]);
    const [actionPerformed, setActionPerformed] = useState(false);
    const [bankLastCallDate, setBankLastCallDate] = useState(null);

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
                if (!dataToSet.externalCallHistory) dataToSet.externalCallHistory = [];

                setLead(dataToSet);
                setLeadTasks(tasksResponse.data);

                // Initialize Application Status from Assigned Banks
                const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
                if (currentUser && currentUser.bank && dataToSet.assignedBanks) {
                    const myAssignment = dataToSet.assignedBanks.find(
                        b =>
                            b.bankName?.toLowerCase().trim() ===
                            currentUser.bank?.toLowerCase().trim()
                    );
                    if (myAssignment) {
                        setBankStatus(myAssignment.bankLeadStatus || 'In Progress');
                        setApplicationStatus(myAssignment.bankApplicationStatus || '');
                        setSubStatus(myAssignment.bankSubStatus || '');
                        setAppId(myAssignment.bankAppId || '');
                        setBankReminders(myAssignment.bankReminders || []);
                        setBankLastCallDate(myAssignment.bankLastCallDate || null);
                    }
                }

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

    // Helper function to get the current bank's assignment from lead
    const getCurrentBankAssignment = () => {
        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser || !currentUser.bank || !lead.assignedBanks) return null;
        return lead.assignedBanks.find(
            b => b.bankName?.toLowerCase().trim() === currentUser.bank?.toLowerCase().trim()
        );
    };

    // Helper function to format amount in INR
    const formatAmount = (amount) => {
        if (!amount) return '';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Helper function to replace all placeholders in template
    const replaceTemplatePlaceholders = (templateBody, lead, currentUser) => {
        let body = templateBody;
        const bankAssignment = getCurrentBankAssignment();

        // Replace student-related placeholders
        body = body.replace(/\[Student Name\]/g, lead.fullName || '');
        
        // Replace bank-related placeholders
        body = body.replace(/\[Bank Name\]/g, currentUser?.bank || '');
        body = body.replace(/\[Executive Name\]/g, currentUser?.fullName || '');
        
        // Replace company/DSA name
        body = body.replace(/\[Company\/DSA Name\]/g, 'Just Tap Capital');
        
        // Replace contact number (from current user or use default)
        body = body.replace(/\[Contact Number\]/g, currentUser?.phoneNumber || '7013148402');
        
        // Replace App ID from bank assignment
        body = body.replace(/\[App ID\]/g, bankAssignment?.bankAppId || '');
        
        // Replace amount (优先使用sanctioned金额，否则使用required金额)
        const loanAmount = lead.sanctionDetails?.loanAmount || lead.loanAmountRequired || '';
        body = body.replace(/\[Amount\]/g, loanAmount ? formatAmount(loanAmount) : '');

        return body;
    };

    const handleTemplateChange = (e) => {
        const templateKey = e.target.value;
        setSelectedTemplate(templateKey);

        if (templateKey && BANK_EMAIL_TEMPLATE_CONTENT[templateKey]) {
            const template = BANK_EMAIL_TEMPLATE_CONTENT[templateKey];
            const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
            
            const body = replaceTemplatePlaceholders(template.body, lead, currentUser);

            setEmailContent(body);
            setNote(body); // Also update the note field to show the content
        } else {
            setEmailContent('');
            setNote('');
        }
    };

    // --- Email Modal Handlers ---
   const handleOpenEmailModal = (templateKey) => {
    const template = BANK_EMAIL_TEMPLATE_CONTENT[templateKey];
    if (!template) return;

    const currentUser = JSON.parse(localStorage.getItem('employeeUser'));

    let body = template.body;
    let subject = template.subject;

    const bankName = currentUser?.bank || "";
    const executiveName = currentUser?.fullName || "";
    const contactNumber = currentUser?.phoneNumber || "";
    const companyName = "Justap Capital";

    // Replace ALL placeholders
    const values = {
        "Student Name": lead.fullName,
        "Bank Name": bankName,
        "Bank": bankName,                // 🔥 This handles [Bank]
        "Executive Name": executiveName,
        "Company/DSA Name": companyName,
        "Contact Number": contactNumber
    };

    const replacePlaceholders = (text) =>
        text.replace(/\[(.*?)\]/g, (_, key) => values[key] || "");

    body = replacePlaceholders(body);
    subject = replacePlaceholders(subject);

    setCurrentEmailTemplate({
        name: templateKey,
        subject,
        body
    });

    setIsEmailModalOpen(true);
};
    const handleCloseEmailModal = () => {
        setIsEmailModalOpen(false);
    };

    const handleCopyEmailBody = () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = currentEmailTemplate.body;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        navigator.clipboard.writeText(textContent);
        setEmailModalStatus('Content copied to clipboard!');
        setTimeout(() => setEmailModalStatus(''), 2000);
    };

    const handleSendEmail = async () => {
        if (!selectedTemplate) {
            alert("Please select an email template first.");
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser || !currentUser._id) {
            alert("User session invalid. Please re-login.");
            return;
        }

        const updatePayload = {
            externalCallNote: {
                notes: emailContent,
                loggedByName: `${currentUser.fullName} (${currentUser.bank})`,
                callStatus: 'Email'
            }
        };

        try {
            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            // Update last call date locally (will be saved on Submit)
            setBankLastCallDate(new Date().toISOString());
            setLead(response.data); // Update with fresh data from backend

            // Reset fields
            setNote('');
            setEmailContent('');
            setSelectedTemplate('');
            setActionPerformed(true);
            alert("Email content has been added to the notes history.");
        } catch (error) {
            console.error("Failed to save email note:", error);
            alert("Failed to save email note.");
        }
    };

    // --- Note Handlers ---
    const handleSaveNote = async () => {
        if (!note.trim()) return;
        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));

        if (!currentUser || !currentUser._id) {
            alert("User session invalid. Please re-login.");
            return;
        }

        const updatePayload = {
            externalCallNote: {
                notes: note,
                loggedByName: `${currentUser.fullName} (${currentUser.bank})`,
                callStatus: 'Log'
            }
        };

        try {
            const response = await axios.put(`${API_URL}/${lead._id}`, updatePayload, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            
            setBankLastCallDate(new Date().toISOString());
            setLead(response.data); // Update with fresh data from backend
            setNote('');
            setActionPerformed(true);
        } catch (error) {
            console.error("Failed to save note:", error);
            alert("Failed to save note.");
        }
    };

    // --- Reminder Handlers ---
    const handleSetReminder = () => {
        if (!lead._id) return;
        if (!newReminderDate) {
            alert('Please select a date and time for the reminder.');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        const newReminder = {
            date: new Date(newReminderDate).toISOString(),
            done: false,
            createdAt: new Date().toISOString(),
            status: bankStatus || 'No status'
        };

        setBankReminders(prev => [...prev, newReminder]);

        setNewReminderDate('');
        setActionPerformed(true);
        alert(`Reminder queued for ${new Date(newReminder.date).toLocaleString()}. Click Submit to save.`);
    };

    const handleLastCallDateChange = (e) => {
        const val = e.target.value;
        const dateStr = val ? new Date(val).toISOString() : null;
        setBankLastCallDate(dateStr);
        setActionPerformed(true);
    };

    const handleApplicationStatusChange = (newAppStatus, newSubStatus = '') => {
        setApplicationStatus(newAppStatus);
        setSubStatus(newSubStatus);
        setActionPerformed(true);
    };

    const handleAppIdUpdate = () => {
        setActionPerformed(true);
    };

    const handleStatusChange = (e) => {
        setBankStatus(e.target.value);
        setActionPerformed(true);
    };

    // --- Mark Reminder Done Handler ---
    const handleMarkReminderDone = (reminderIndex) => {
        setBankReminders(prev => {
            const updatedReminders = [...prev];
            updatedReminders[reminderIndex].done = true;
            return updatedReminders;
        });
        setActionPerformed(true);
    };

    // Helper to check if the lead is currently saved as closed in DB
    const isLeadClosedInDB = () => {
        if (!lead.assignedBanks) return false;
        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser || !currentUser.bank) return false;
        const myAssignment = lead.assignedBanks.find(
            b => b.bankName?.toLowerCase().trim() === currentUser.bank?.toLowerCase().trim()
        );
        return myAssignment?.bankLeadStatus === 'Closed';
    };

    // --- NEW: Centralized Submit Handler ---
    // const handleSubmit = async () => {
    //     try {
    //         const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
    //         if (!currentUser) return;

    //         // Construct updated assignedBanks array
    //         let updatedAssignedBanks = lead.assignedBanks || [];
    //         if (currentUser.bank) {
    //             updatedAssignedBanks = updatedAssignedBanks.map(assignment => {
    //                 // Clean assignment object to ensure it matches schema (remove _id if present as schema has _id: false)
    //                 const cleanAssignment = {
    //                     bankId: assignment.bankId,
    //                     bankName: assignment.bankName,
    //                     assignedRMName: assignment.assignedRMName,
    //                     assignedRMEmail: assignment.assignedRMEmail,
    //                     state: assignment.state,
    //                     bankLeadStatus: assignment.bankLeadStatus,
    //                     contactible: assignment.contactible,
    //                     bankApplicationStatus: assignment.bankApplicationStatus,
    //                     bankSubStatus: assignment.bankSubStatus,
    //                     bankAppId: assignment.bankAppId,
    //                     bankLastCallDate: assignment.bankLastCallDate,
    //                     bankNextCallDate: assignment.bankNextCallDate,
    //                     crmId: assignment.crmId,
    //                     assignedAt: assignment.assignedAt,
    //                     bankReminders: assignment.bankReminders
    //                 };

    //                 if (assignment.bankName === currentUser.bank) {
    //                     const updatedAssignment = { 
    //                         ...cleanAssignment, 
    //                         bankLeadStatus: bankStatus || 'In Progress',
    //                         bankLastCallDate: bankLastCallDate,
    //                         bankApplicationStatus: applicationStatus,
    //                         bankSubStatus: subStatus,
    //                         bankAppId: appId
    //                     };

    //                     // Save local reminders state to the bank assignment
    //                     updatedAssignment.bankReminders = bankReminders;
    //                     // Also update nextCall for the table view based on the earliest pending reminder
    //                     const pendingReminders = bankReminders.filter(r => !r.done).sort((a, b) => new Date(a.date) - new Date(b.date));
    //                     if (pendingReminders.length > 0) {
    //                         updatedAssignment.bankNextCallDate = pendingReminders[0].date;
    //                     } else {
    //                         updatedAssignment.bankNextCallDate = null;
    //                     }

    //                     return updatedAssignment;
    //                 }
    //                 return cleanAssignment;
    //             });
    //         }

    //         const payload = {
    //             // STRICTLY EXCLUDE global fields: leadStatus, reminders, lastCallDate, reminderCallDate to prevent FO Panel reflection
    //             externalCallHistory: (lead.externalCallHistory || []).map(note => ({
    //                 loggedById: note.loggedById || (currentUser._id && currentUser._id.length === 24 ? currentUser._id : generateObjectId()),
    //                 loggedByName: note.loggedByName || 'Bank Executive',
    //                 notes: note.notes,
    //                 callStatus: note.callStatus || 'Log',
    //                 createdAt: note.createdAt || new Date().toISOString(),
    //                 _id: note._id // Keep _id if it exists
    //             })),
    //             assignedBanks: updatedAssignedBanks
    //         };

    //         await axios.put(`${API_URL}/${lead._id}`, payload, {
    //             headers: { Authorization: `Bearer ${currentUser.token}` }
    //         });

    //         alert('Lead data updated successfully!');
    //         if (onUpdate) onUpdate();
    //     } catch (error) {
    //         console.error('Failed to submit lead data:', error);
    //         if (error.response) {
    //             alert(`Failed to submit data: ${error.response.data.message || error.message}`);
    //         } else {
    //             alert('Failed to submit data.');
    //         }
    //     }
    // };

    const handleSubmit = async (statusOverride) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
            if (!currentUser) {
                alert("User session expired. Please login again.");
                return;
            }

            const finalStatus = typeof statusOverride === 'string' ? statusOverride : (bankStatus || "In Progress");

            let updatedAssignedBanks = lead.assignedBanks || [];

            updatedAssignedBanks = updatedAssignedBanks.map((assignment) => {

                // SAFE match (case insensitive + trim)
                const isMyBank =
                    assignment.bankName?.toLowerCase().trim() ===
                    currentUser.bank?.toLowerCase().trim();

                if (!isMyBank) {
                    return assignment; // return untouched
                }

                // Find earliest pending reminder for next call
                const pendingReminders = (bankReminders || [])
                    .filter(r => !r.done)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                const nextCallDate =
                    pendingReminders.length > 0
                        ? pendingReminders[0].date
                        : null;

                return {
                    ...assignment,

                    bankLeadStatus: finalStatus,
                    bankApplicationStatus: applicationStatus || "",
                    bankSubStatus: subStatus || "",
                    bankAppId: appId || "",
                    bankLastCallDate: bankLastCallDate || null,
                    bankNextCallDate: nextCallDate,
                    bankReminders: bankReminders || []
                };
            });

            const payload = {
                externalCallHistory: lead.externalCallHistory || [],
                assignedBanks: updatedAssignedBanks
            };

            await axios.put(`${API_URL}/${lead._id}`, payload, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });

            alert("Lead updated successfully!");

            if (onUpdate) onUpdate();

        } catch (error) {
            console.error("Submit error:", error);
            alert("Failed to update lead.");
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
                <MuiButton variant="contained" color="primary" onClick={() => setShowTaskCreator(!showTaskCreator)}>
                    {showTaskCreator ? 'Cancel Task' : 'Create Task'}
                </MuiButton>
            </Box>

            <div className="flex flex-col gap-6">
                {/* Main Content - Full Width */}
                <div className="w-full">
                    {/* --- 1. BASIC DETAILS --- */}
                    <BasicDetailsSection
                        lead={lead}
                        setLead={() => { }} // No-op
                        handleChange={() => { }} // No-op
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
                                    onUpdate={() => { }}
                                    onRemove={() => { }}
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
                                    onUpdate={() => { }}
                                    onRemove={() => { }}
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
                        {/* --- email templates --- */}
                        {/* --- EMAIL TEMPLATES SECTION --- */}
                        <Accordion title="Email Templates" icon="📧" defaultExpanded>
                            <div className="flex flex-wrap gap-3">

                                {Object.keys(BANK_EMAIL_TEMPLATE_CONTENT).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => handleOpenEmailModal(key)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition-all"
                                    >
                                        📧 {BANK_EMAIL_TEMPLATE_CONTENT[key].subject}
                                    </button>
                                ))}

                            </div>
                        </Accordion>
                        {/* --- 9. NOTES & HISTORY --- */}
                        <Accordion title="Notes & History" icon="💬" defaultExpanded>
                            <div className="space-y-4 max-h-96 overflow-y-auto border p-4 rounded-md bg-gray-50 mb-6">
                                {lead.externalCallHistory && lead.externalCallHistory.length > 0 ? (
                                    lead.externalCallHistory.slice().reverse().map((log, index) => (
                                        <div key={index} className={`p-3 rounded-lg border-l-4 bg-white ${log.callStatus === 'Email' ? 'border-green-400' : 'border-blue-400'} shadow-sm`}>
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
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
                                    <MuiButton variant="contained" onClick={handleSaveNote} disabled={!note.trim()}>
                                        Save Note
                                    </MuiButton>

                                </Box>
                            </div>
                        </Accordion>

                        {/* --- 10. REMINDERS --- */}
                        <Accordion title="Reminders" icon="🗓️" defaultExpanded>
                            {/* Pending Reminders List to allow marking as done */}
                            {bankReminders.some(r => !r.done) && (
                                <div className="w-full p-2 mb-4 border-b">
                                    <h4 className="font-bold text-sm text-gray-700 mb-2">Pending Reminders</h4>
                                    <div className="space-y-2">
                                        {bankReminders.map((rem, idx) => (
                                            !rem.done && (
                                                <div key={idx} className="flex justify-between items-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                    <span className="text-sm text-gray-700">
                                                        {moment(rem.date).format('DD MMM YYYY, h:mm a')} - {rem.status}
                                                    </span>
                                                    <MuiButton
                                                        size="small"
                                                        variant="outlined"
                                                        color="success"
                                                        onClick={() => handleMarkReminderDone(idx)}
                                                    >
                                                        Mark Done
                                                    </MuiButton>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-wrap -mx-2 items-end">
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Call Date</label>
                                    <input
                                        type="date"
                                        value={bankLastCallDate ? new Date(bankLastCallDate).toISOString().split('T')[0] : ''}
                                        onChange={handleLastCallDateChange}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-600"
                                    />
                                </div>
                                {bankStatus !== 'Closed' && (
                                    <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Set New Reminder</label>
                                        <input
                                            type="datetime-local"
                                            value={newReminderDate}
                                            onChange={(e) => setNewReminderDate(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-600"
                                        />
                                    </div>
                                )}
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Status</label>
                                    <select
                                        value={bankStatus}
                                        onChange={handleStatusChange}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-600"
                                    >
                                        {bankLeadStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Status</label>
                                    <select
                                        value={applicationStatus}
                                        onChange={(e) => handleApplicationStatusChange(e.target.value, '')}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-600"
                                    >
                                        <option value="">Select Status</option>
                                        {applicationStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Status</label>
                                    <select
                                        value={subStatus}
                                        onChange={(e) => handleApplicationStatusChange(applicationStatus, e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-600"
                                    >
                                        <option value="">Select Sub Status</option>
                                        {subStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                {(lead.leadStatus === 'Logged In' || subStatus === 'Logged In') && (
                                    <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">App ID <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={appId}
                                            onChange={(e) => setAppId(e.target.value)}
                                            onBlur={handleAppIdUpdate}
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-600"
                                            placeholder="Enter App ID"
                                            required
                                        />
                                    </div>
                                )}

                                {bankStatus !== 'Closed' && (
                                    <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                        <MuiButton variant="contained" color="primary" onClick={handleSetReminder} disabled={!newReminderDate}>Set Reminder</MuiButton>
                                    </div>
                                )}
                            </div>
                        </Accordion>

                        {/* --- 11. TASK HISTORY --- */}
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

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end">
                            {isLeadClosedInDB() && bankStatus === 'Closed' ? (
                                <MuiButton
                                    variant="contained"
                                    color="warning"
                                    size="large"
                                    onClick={() => handleSubmit('In Progress')}
                                >
                                    Reopen Lead
                                </MuiButton>
                            ) : (
                                <MuiButton
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    disabled={!actionPerformed}
                                    onClick={() => handleSubmit()}
                                >
                                    Submit Lead Data
                                </MuiButton>
                            )}
                        </div>
                        {/* EMAIL PREVIEW MODAL */}
                        <Dialog
                            open={isEmailModalOpen}
                            onClose={handleCloseEmailModal}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle sx={{ fontWeight: "bold" }}>
                                Send Email: {currentEmailTemplate.name}
                            </DialogTitle>

                            <DialogContent dividers>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Subject: {currentEmailTemplate.subject}
                                </Typography>

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 2,
                                        background: "#fafafa",
                                        whiteSpace: "pre-wrap",
                                        fontSize: "14px",
                                        lineHeight: 1.6
                                    }}
                                    dangerouslySetInnerHTML={{ __html: currentEmailTemplate.body }}
                                />
                            </DialogContent>

                            <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                                <MuiButton
                                    variant="outlined"
                                    color="success"
                                    onClick={handleCopyEmailBody}
                                >
                                    Copy Content
                                </MuiButton>

                                <Box>
                                    <MuiButton onClick={handleCloseEmailModal}>
                                        Cancel
                                    </MuiButton>

                                    <MuiButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setSelectedTemplate(currentEmailTemplate.name);
                                            setEmailContent(currentEmailTemplate.body);
                                            handleSendEmail();
                                            handleCloseEmailModal();
                                        }}
                                    >
                                        Send Email
                                    </MuiButton>
                                </Box>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankLeadForm;
