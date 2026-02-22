import React, { useState } from "react";
import axios from 'axios';
import { API_URL, contactAsapOptions, negotiationOptions } from '../../constants';
import "./RecommendedBanksSection.css";

// Issue Categories Data
const issueCategories = {
    "📞 Contact Related": [
        "Bank marked not contactable but student available",
        "Bank did not contact student",
        "Bank delayed contact",
        "Bank contacted wrong number"
    ],
    "📄 Processing Issues": [
        "Bank asked wrong documents",
        "Bank not updating status",
        "Bank delayed processing",
        "Bank not responding to student",
        "Bank rejected without proper reason"
    ],
    "🏦 Login/Application Issues": [
        "File already logged but not updated",
        "App ID not updated by bank",
        "Logged in but status not changed",
        "Wrong status updated by bank"
    ],
    "💰 Sanction/Offer Issues": [
        "Sanction received but not updated",
        "Wrong sanction details updated",
        "Disbursement done but not updated"
    ],
    "🔴 Assignment Issues": [
        "Wrong bank assigned (need change)",
        "Duplicate bank assigned",
        "Bank not supporting this profile."
    ]
};

const RecommendedBanksSection = ({ lead, setLead, tiedUpBanks, handleOpenAssignModal }) => {
    // State for Wrong Update Modal
    const [isWrongUpdateModalOpen, setIsWrongUpdateModalOpen] = useState(false);
    const [selectedBankForUpdate, setSelectedBankForUpdate] = useState(null);
    const [wrongUpdateType, setWrongUpdateType] = useState('');
    const [wrongUpdateSubType, setWrongUpdateSubType] = useState('');
    const [wrongUpdateNote, setWrongUpdateNote] = useState('');
    const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

    // State for Notification Modals (Contact ASAP / Negotiate)
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [notificationModalType, setNotificationModalType] = useState(''); // 'Contact ASAP' or 'Negotiate'
    const [selectedBankForNotification, setSelectedBankForNotification] = useState(null);
    const [notificationSubType, setNotificationSubType] = useState('');
    const [notificationNote, setNotificationNote] = useState('');
    const [isSubmittingNotification, setIsSubmittingNotification] = useState(false);

    // --------- Separate assigned & unassigned ----------
    const assignedBanks = tiedUpBanks.filter(bank =>
        lead.assignedBanks?.some(b => b.bankId === bank._id)
    );

    const unassignedBanks = tiedUpBanks.filter(bank =>
        !lead.assignedBanks?.some(b => b.bankId === bank._id)
    );

    // --------- Date formatter ----------
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-GB");
        } catch {
            return "N/A";
        }
    };

    // --- Handlers for Wrong Update ---
    const handleOpenWrongUpdateModal = (bankId, bankName) => {
        setSelectedBankForUpdate({ bankId, bankName });
        setWrongUpdateType('');
        setWrongUpdateSubType('');
        setWrongUpdateNote('');
        setIsWrongUpdateModalOpen(true);
    };

    const handleCloseWrongUpdateModal = () => {
        setIsWrongUpdateModalOpen(false);
        setSelectedBankForUpdate(null);
    };

    const handleSubmitWrongUpdate = async () => {
        if (!wrongUpdateType || !wrongUpdateSubType) {
            alert("Please select both Type and Sub-Type.");
            return;
        }

        setIsSubmittingUpdate(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
            
            const response = await axios.post(`${API_URL}/${lead._id}/wrong-update`, {
                bankId: selectedBankForUpdate.bankId,
                issueType: wrongUpdateType,
                subType: wrongUpdateSubType,
                notes: wrongUpdateNote,
                fromName: currentUser?.fullName || 'FO',
                fromRole: currentUser?.role || 'FO'
            });

            // Update local lead state with the response (which contains the new history note)
            if (setLead && response.data.lead) setLead(response.data.lead);

            alert("Wrong update reported successfully.");
            handleCloseWrongUpdateModal();
        } catch (error) {
            console.error("Failed to report wrong update:", error);
            alert("Failed to report wrong update. Please try again.");
        } finally {
            setIsSubmittingUpdate(false);
        }
    };

    // --- Handlers for Notification Modals (Contact ASAP / Negotiate) ---
    const handleOpenNotificationModal = (bankId, bankName, type) => {
        setSelectedBankForNotification({ bankId, bankName });
        setNotificationModalType(type);
        setNotificationSubType('');
        setNotificationNote('');
        setIsNotificationModalOpen(true);
    };

    const handleCloseNotificationModal = () => {
        setIsNotificationModalOpen(false);
        setSelectedBankForNotification(null);
        setNotificationModalType('');
    };

    const handleSubmitNotification = async () => {
        if (!notificationSubType) {
            alert("Please select a sub-type.");
            return;
        }

        setIsSubmittingNotification(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
            
            const response = await axios.post(`${API_URL}/${lead._id}/notify-bank`, {
                bankId: selectedBankForNotification.bankId,
                type: notificationModalType,
                subType: notificationSubType,
                notes: notificationNote,
                fromName: currentUser?.fullName || 'FO',
                fromRole: currentUser?.role || 'FO'
            });

            // Update local lead state with the response (which contains the new history note)
            if (setLead && response.data.lead) setLead(response.data.lead);

            alert(`${notificationModalType} request sent successfully.`);
            handleCloseNotificationModal();
        } catch (error) {
            console.error(`Failed to send ${notificationModalType} request:`, error);
            alert(`Failed to send ${notificationModalType} request. Please try again.`);
        } finally {
            setIsSubmittingNotification(false);
        }
    };

    return (
        <div className="section-block">

            {/* ================= ASSIGNED BANKS ================= */}
            {assignedBanks.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold mb-4 text-gray-800">
                        Assigned Banks
                    </h4>

                    <div className="assigned-banks-grid">

                        {assignedBanks.map((bank) => {

                            const assignment = lead.assignedBanks.find(
                                b => b.bankId === bank._id
                            );

                            if (!assignment) return null;

                            return (
                                <div
                                    key={bank._id}
                                    className={`assigned-bank-card ${
                                        assignment.bankLeadStatus === "Closed"
                                            ? "closed"
                                            : "ongoing"
                                    }`}
                                >

                                    {/* ===== HEADER ===== */}
                                    <div className="bank-header">
                                        <div>
                                            <div className="bank-name">
                                                {bank.name}
                                            </div>
                                            <div className="bank-state">
                                                State: {assignment.state || "N/A"}
                                            </div>
                                        </div>

                                        {/* STATUS BADGE (Lead Status) */}
                                        <span
                                            className={`status-badge ${
                                                assignment.bankLeadStatus === "Closed"
                                                    ? "closed"
                                                    : "ongoing"
                                            }`}
                                        >
                                            {assignment.bankLeadStatus || "In Progress"}
                                        </span>
                                    </div>

                                    {/* ===== EXECUTIVE INFO ===== */}
                                    <div className="executive-info">
                                        <div>
                                            <strong>
                                                {assignment.assignedRMName || "N/A"}
                                            </strong>
                                        </div>
                                        <div className="text-xs">
                                            {assignment.assignedRMEmail || ""}
                                        </div>
                                    </div>

                                    {/* ===== APPLICATION DETAILS ===== */}
                                    <div className="bank-details">

                                        <div className="detail-row">
                                            <span>Application Status:</span>
                                            <span>
                                                {assignment.bankApplicationStatus || "N/A"}
                                            </span>
                                        </div>

                                        <div className="detail-row">
                                            <span>Sub Status:</span>
                                            <span>
                                                {assignment.bankSubStatus || "N/A"}
                                            </span>
                                        </div>

                                        <div className="detail-row">
                                            <span>App ID:</span>
                                            <span>
                                                {assignment.bankAppId || "N/A"}
                                            </span>
                                        </div>

                                    </div>

                                    {/* ===== ASSIGNED DATE ===== */}
                                    <div className="assigned-date">
                                        Assigned Date: {formatDate(assignment.assignedAt)}
                                    </div>

                                    {/* ===== CALL DETAILS ===== */}
                                    <div className="bottom-row">
                                        <div>
                                            <span>Last Call:</span>
                                            <span>
                                                {formatDate(assignment.bankLastCallDate)}
                                            </span>
                                        </div>

                                        <div>
                                            <span>Next Call:</span>
                                            <span>
                                                {formatDate(assignment.bankNextCallDate)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ===== ACTION BUTTONS ===== */}
                                    <div className="action-buttons">
                                        <button 
                                            className="action-button contact-asap"
                                            onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Contact ASAP')}
                                        >
                                            Contact ASAP
                                        </button>
                                        <button 
                                            className="action-button wrong-update"
                                            onClick={() => handleOpenWrongUpdateModal(bank._id, bank.name)}
                                        >
                                            Wrong Update
                                        </button>
                                        <button 
                                            className="action-button negotiate"
                                            onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Negotiate')}
                                        >
                                            Negotiate
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ================= AVAILABLE BANKS ================= */}
            {unassignedBanks.length > 0 && (
                <div>
                    <h4 className="font-bold mb-4 text-gray-800">
                        Available Banks
                    </h4>

                    <div className="available-banks-grid">
                        {unassignedBanks.map((bank) => (
                            <div key={bank._id} className="available-bank-card">
                                <p className="available-bank-name">{bank.name}</p>

                                <button
                                    type="button"
                                    onClick={() => handleOpenAssignModal(bank)}
                                    className="assign-button"
                                >
                                    Assign to this Bank
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ================= WRONG UPDATE MODAL ================= */}
            {isWrongUpdateModalOpen && (
                <div className="modal-overlay" onClick={handleCloseWrongUpdateModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Wrong Update - {selectedBankForUpdate?.bankName}</h2>
                            <button className="modal-close-btn" onClick={handleCloseWrongUpdateModal}>
                                <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={wrongUpdateType}
                                    onChange={(e) => {
                                        setWrongUpdateType(e.target.value);
                                        setWrongUpdateSubType(''); // Reset sub-type when type changes
                                    }}
                                >
                                    <option value="">Select Issue Type</option>
                                    {Object.keys(issueCategories).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Type</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={wrongUpdateSubType}
                                    onChange={(e) => setWrongUpdateSubType(e.target.value)}
                                    disabled={!wrongUpdateType}
                                >
                                    <option value="">Select Sub Type</option>
                                    {wrongUpdateType && issueCategories[wrongUpdateType].map((sub) => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Matter / Notes</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="4"
                                    style={{color:"black"}}
                                    placeholder="Enter details here..."
                                    value={wrongUpdateNote}
                                    onChange={(e) => setWrongUpdateNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px', borderTop: '1px solid #eee' }}>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                onClick={handleCloseWrongUpdateModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                onClick={handleSubmitWrongUpdate}
                                disabled={isSubmittingUpdate}
                            >
                                {isSubmittingUpdate ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= NOTIFICATION MODAL (Contact ASAP / Negotiate) ================= */}
            {isNotificationModalOpen && (
                <div className="modal-overlay" onClick={handleCloseNotificationModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{notificationModalType} - {selectedBankForNotification?.bankName}</h2>
                            <button className="modal-close-btn" onClick={handleCloseNotificationModal}>
                                <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {notificationModalType === 'Negotiate' ? 'Negotiation Type' : 'Type'}
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={notificationSubType}
                                    onChange={(e) => setNotificationSubType(e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    {(notificationModalType === 'Contact ASAP' ? contactAsapOptions : negotiationOptions).map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Matter / Notes</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="4"
                                    style={{color:"black"}}
                                    placeholder="Enter details here..."
                                    value={notificationNote}
                                    onChange={(e) => setNotificationNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px', borderTop: '1px solid #eee' }}>
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                onClick={handleCloseNotificationModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={handleSubmitNotification}
                                disabled={isSubmittingNotification}
                            >
                                {isSubmittingNotification ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RecommendedBanksSection;