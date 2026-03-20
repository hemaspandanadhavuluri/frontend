import React, { useState } from "react";
import axios from 'axios';
import { API_URL, contactAsapOptions, negotiationOptions, reopenOptions } from '../../constants';
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
    const [copiedWrongUpdate, setCopiedWrongUpdate] = useState(false);
    const [copiedNotification, setCopiedNotification] = useState(false);
    const [copiedReopen, setCopiedReopen] = useState(false);

    // State for Reopen Modal
    const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
    const [selectedBankForReopen, setSelectedBankForReopen] = useState(null);
    const [reopenSubType, setReopenSubType] = useState('');
    const [reopenNote, setReopenNote] = useState('');
    const [isSubmittingReopen, setIsSubmittingReopen] = useState(false);

    // State for Sanctioned Fields
    const [sanctionedFields, setSanctionedFields] = useState({});

    // --------- Separate assigned & unassigned ----------
    const assignedBanks = tiedUpBanks.filter(bank =>
        lead.assignedBanks?.some(b => b.bankId === bank._id)
    );

    const unassignedBanks = tiedUpBanks.filter(bank =>
        !lead.assignedBanks?.some(b => b.bankId === bank._id)
    );

    // --------- Segregate banks by type (Public, Private, NBFC) ----------
    const assignedPublicBanks = assignedBanks.filter(bank => bank.type === 'public');
    const assignedPrivateBanks = assignedBanks.filter(bank => bank.type === 'private');
    const assignedNbfcBanks = assignedBanks.filter(bank => bank.type === 'nbfc');

    const unassignedPublicBanks = unassignedBanks.filter(bank => bank.type === 'public');
    const unassignedPrivateBanks = unassignedBanks.filter(bank => bank.type === 'private');
    const unassignedNbfcBanks = unassignedBanks.filter(bank => bank.type === 'nbfc');

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
    const handleOpenWrongUpdateModal = (bankId, bankName, assignment) => {
        // Use assignment.bankName to ensure consistency with stored bank name
        const storedBankName = assignment?.bankName || bankName;
        setSelectedBankForUpdate({ bankId, bankName: storedBankName });
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
                bankName: selectedBankForUpdate.bankName,
                issueType: wrongUpdateType,
                subType: wrongUpdateSubType,
                notes: wrongUpdateNote,
                fromName: currentUser?.fullName || 'FO',
                fromRole: currentUser?.role || 'FO',
                createdById: currentUser?._id,
                createdByName: currentUser?.fullName,
                targetBank: selectedBankForUpdate.bankName
            });

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

    // --- Handlers for Copy Functions ---
    const handleCopyWrongUpdate = () => {
        let content = `WRONG UPDATE\n`;
        content += `=============================================\n\n`;
        content += `Type: ${wrongUpdateType}\n`;
        content += `Sub Type: ${wrongUpdateSubType}\n`;
        content += `Notes: ${wrongUpdateNote}\n`;
        navigator.clipboard.writeText(content).then(() => {
            setCopiedWrongUpdate(true);
            setTimeout(() => setCopiedWrongUpdate(false), 2000);
        });
    };

    const handleCopyNotification = () => {
        let content = `${notificationModalType.toUpperCase()}\n`;
        content += `=============================================\n\n`;
        content += `Type: ${notificationSubType}\n`;
        content += `Notes: ${notificationNote}\n`;
        navigator.clipboard.writeText(content).then(() => {
            setCopiedNotification(true);
            setTimeout(() => setCopiedNotification(false), 2000);
        });
    };

    const handleCopyReopen = () => {
        let content = `REOPEN REQUEST\n`;
        content += `=============================================\n\n`;
        content += `Type: ${reopenSubType}\n`;
        content += `Notes: ${reopenNote}\n`;
        navigator.clipboard.writeText(content).then(() => {
            setCopiedReopen(true);
            setTimeout(() => setCopiedReopen(false), 2000);
        });
    };

    // --- Handlers for Notification Modals (Contact ASAP / Negotiate) ---
    const handleOpenNotificationModal = (bankId, bankName, type, assignment) => {
        // Use assignment.bankName to ensure consistency with stored bank name
        const storedBankName = assignment?.bankName || bankName;
        setSelectedBankForNotification({ bankId, bankName: storedBankName });
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
                bankName: selectedBankForNotification.bankName,
                type: notificationModalType,
                subType: notificationSubType,
                notes: notificationNote,
                fromName: currentUser?.fullName || 'FO',
                fromRole: currentUser?.role || 'FO',
                createdById: currentUser?._id,
                createdByName: currentUser?.fullName,
                targetBank: selectedBankForNotification.bankName
            });

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

    // --- Handlers for Reopen Modal ---
    const handleOpenReopenModal = (bankId, bankName, assignment) => {
        // Use assignment.bankName to ensure consistency with stored bank name
        const storedBankName = assignment?.bankName || bankName;
        setSelectedBankForReopen({ bankId, bankName: storedBankName });
        setReopenSubType('');
        setReopenNote('');
        setIsReopenModalOpen(true);
    };

    const handleCloseReopenModal = () => {
        setIsReopenModalOpen(false);
        setSelectedBankForReopen(null);
    };

    const handleSubmitReopen = async () => {
        if (!reopenSubType) {
            alert("Please select a reason.");
            return;
        }

        setIsSubmittingReopen(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
            
            const response = await axios.post(`${API_URL}/${lead._id}/notify-bank`, {
                bankId: selectedBankForReopen.bankId,
                bankName: selectedBankForReopen.bankName,
                type: 'Reopen',
                subType: reopenSubType,
                notes: reopenNote,
                fromName: currentUser?.fullName || 'FO',
                fromRole: currentUser?.role || 'FO',
                createdById: currentUser?._id,
                createdByName: currentUser?.fullName,
                targetBank: selectedBankForReopen.bankName
            });

            if (setLead && response.data.lead) setLead(response.data.lead);

            alert('Reopen request sent successfully.');
            handleCloseReopenModal();
        } catch (error) {
            console.error('Failed to send reopen request:', error);
            alert('Failed to send reopen request. Please try again.');
        } finally {
            setIsSubmittingReopen(false);
        }
    };

    return (
        <div className="section-block">

            {/* ================= ASSIGNED PUBLIC BANKS ================= */}
            {assignedPublicBanks.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold mb-4 text-gray-800">
                        🏦 Assigned Public Banks
                    </h4>

                    <div className="assigned-banks-grid">

                        {assignedPublicBanks.map((bank) => {

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

                                        {/* NEW: DSA Code display */}
                                        <div className="detail-row">
                                            <span>Logged IN:</span>
                                            <span>
                                                {assignment.bankDsaCode || "N/A"}
                                            </span>
                                        </div>

                                        {/* SANCTIONED FIELDS - Conditional Display */}
                                        {assignment.bankLeadStatus === "Sanctioned" && (
                                            <>
                                                <div className="detail-row">
                                                    <span>Sanction Acc:</span>
                                                    <span>
                                                        {assignment.sanctionAcc || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>Sanction ROI:</span>
                                                    <span>
                                                        {assignment.sanctionRoi || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>PF Paid:</span>
                                                    <span>
                                                        {assignment.pfPaid || "N/A"}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                    </div>

                                    {/* ===== ASSIGNED DATE ===== */}
                                    <div className="assigned-date">
                                        Assigned Date: {formatDate(assignment.assignedAt)}
                                    </div>

                                    {/* ===== CALL DETAILS ===== */}
                                    <div className="bottom-row">
                                        {assignment.bankLastCallDate && (
                                            <div>
                                                <span>Last Call:</span>
                                                <span>
                                                    {formatDate(assignment.bankLastCallDate)}
                                                </span>
                                            </div>
                                        )}

                                        {assignment.bankNextCallDate && (
                                            <div>
                                                <span>Next Call:</span>
                                                <span>
                                                    {formatDate(assignment.bankNextCallDate)}
                                                </span>
                                            </div>
                                        )}

                                        {assignment.sanctionedDate && (
                                            <div>
                                                <span>Sanctioned:</span>
                                                <span>
                                                    {formatDate(assignment.sanctionedDate)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

{/* ===== ACTION BUTTONS ===== */}
                                    <div className="action-buttons">
                                        {assignment.bankLeadStatus === "Closed" ? (
                                            <button 
                                                type="button"
                                                className="action-button reopen"
                                                onClick={() => handleOpenReopenModal(bank._id, bank.name, assignment)}
                                            >
                                                Reopen
                                            </button>
                                        ) : (
                                            <button 
                                                type="button"
                                                className="action-button contact-asap"
                                                onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Contact ASAP', assignment)}
                                            >
                                                Contact ASAP
                                            </button>
                                        )}
                                        <button 
                                            type="button"
                                            className="action-button wrong-update"
                                            onClick={() => handleOpenWrongUpdateModal(bank._id, bank.name, assignment)}
                                        >
                                            Wrong Update
                                        </button>
                                        <button 
                                            type="button"
                                            className="action-button negotiate"
                                            onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Negotiate', assignment)}
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

            {/* ================= ASSIGNED PRIVATE BANKS ================= */}
            {assignedPrivateBanks.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold mb-4 text-gray-800">
                        🏦 Assigned Private Banks
                    </h4>

                    <div className="assigned-banks-grid">

                        {assignedPrivateBanks.map((bank) => {

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

                                        {/* NEW: DSA Code display */}
                                        <div className="detail-row">
                                            <span>Logged IN:</span>
                                            <span>
                                                {assignment.bankDsaCode || "N/A"}
                                            </span>
                                        </div>

                                        {/* SANCTIONED FIELDS - Conditional Display */}
                                        {assignment.bankLeadStatus === "Sanctioned" && (
                                            <>
                                                <div className="detail-row">
                                                    <span>Sanction Acc:</span>
                                                    <span>
                                                        {assignment.sanctionAcc || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>Sanction ROI:</span>
                                                    <span>
                                                        {assignment.sanctionRoi || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>PF Paid:</span>
                                                    <span>
                                                        {assignment.pfPaid || "N/A"}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                    </div>

                                    {/* ===== ASSIGNED DATE ===== */}
                                    <div className="assigned-date">
                                        Assigned Date: {formatDate(assignment.assignedAt)}
                                    </div>

                                    {/* ===== CALL DETAILS ===== */}
                                    <div className="bottom-row">
                                        {assignment.bankLastCallDate && (
                                            <div>
                                                <span>Last Call:</span>
                                                <span>
                                                    {formatDate(assignment.bankLastCallDate)}
                                                </span>
                                            </div>
                                        )}

                                        {assignment.bankNextCallDate && (
                                            <div>
                                                <span>Next Call:</span>
                                                <span>
                                                    {formatDate(assignment.bankNextCallDate)}
                                                </span>
                                            </div>
                                        )}

                                        {assignment.sanctionedDate && (
                                            <div>
                                                <span>Sanctioned:</span>
                                                <span>
                                                    {formatDate(assignment.sanctionedDate)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ===== ACTION BUTTONS ===== */}
                                    <div className="action-buttons">
                                        {assignment.bankLeadStatus === "Closed" ? (
                                            <button 
                                                type="button"
                                                className="action-button reopen"
                                                onClick={() => handleOpenReopenModal(bank._id, bank.name, assignment)}
                                            >
                                                Reopen
                                            </button>
                                        ) : (
                                            <button 
                                                type="button"
                                                className="action-button contact-asap"
                                                onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Contact ASAP', assignment)}
                                            >
                                                Contact ASAP
                                            </button>
                                        )}
                                        <button 
                                            type="button"
                                            className="action-button wrong-update"
                                            onClick={() => handleOpenWrongUpdateModal(bank._id, bank.name, assignment)}
                                        >
                                            Wrong Update
                                        </button>
                                        <button 
                                            type="button"
                                            className="action-button negotiate"
                                            onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Negotiate', assignment)}
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

            {/* ================= ASSIGNED NBFCS ================= */}
            {assignedNbfcBanks.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-bold mb-4 text-gray-800">
                        🏢 Assigned NBFCs
                    </h4>

                    <div className="assigned-banks-grid">

                        {assignedNbfcBanks.map((bank) => {

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

                                        {/* NEW: DSA Code display */}
                                        <div className="detail-row">
                                            <span>Logged IN:</span>
                                            <span>
                                                {assignment.bankDsaCode || "N/A"}
                                            </span>
                                        </div>

                                        {/* SANCTIONED FIELDS - Conditional Display */}
                                        {assignment.bankLeadStatus === "Sanctioned" && (
                                            <>
                                                <div className="detail-row">
                                                    <span>Sanction Acc:</span>
                                                    <span>
                                                        {assignment.sanctionAcc || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>Sanction ROI:</span>
                                                    <span>
                                                        {assignment.sanctionRoi || "N/A"}
                                                    </span>
                                                </div>

                                                <div className="detail-row">
                                                    <span>PF Paid:</span>
                                                    <span>
                                                        {assignment.pfPaid || "N/A"}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                    </div>

                                    {/* ===== ASSIGNED DATE ===== */}
                                    <div className="assigned-date">
                                        Assigned Date: {formatDate(assignment.assignedAt)}
                                    </div>

                                    {/* ===== CALL DETAILS ===== */}
                                    <div className="bottom-row">
                                        {assignment.bankLastCallDate && (
                                            <div>
                                                <span>Last Call:</span>
                                                <span>
                                                    {formatDate(assignment.bankLastCallDate)}
                                                </span>
                                            </div>
                                        )}

                                        {assignment.bankNextCallDate && (
                                            <div>
                                                <span>Next Call:</span>
                                                <span>
                                                    {formatDate(assignment.bankNextCallDate)}
                                                </span>
                                            </div>
                                        )}

                                        {assignment.sanctionedDate && (
                                            <div>
                                                <span>Sanctioned:</span>
                                                <span>
                                                    {formatDate(assignment.sanctionedDate)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ===== ACTION BUTTONS ===== */}
                                    <div className="action-buttons">
                                        {assignment.bankLeadStatus === "Closed" ? (
                                            <button 
                                                type="button"
                                                className="action-button reopen"
                                                onClick={() => handleOpenReopenModal(bank._id, bank.name, assignment)}
                                            >
                                                Reopen
                                            </button>
                                        ) : (
                                            <button 
                                                type="button"
                                                className="action-button contact-asap"
                                                onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Contact ASAP', assignment)}
                                            >
                                                Contact ASAP
                                            </button>
                                        )}
                                        <button 
                                            type="button"
                                            className="action-button wrong-update"
                                            onClick={() => handleOpenWrongUpdateModal(bank._id, bank.name, assignment)}
                                        >
                                            Wrong Update
                                        </button>
                                        <button 
                                            type="button"
                                            className="action-button negotiate"
                                            onClick={() => handleOpenNotificationModal(bank._id, bank.name, 'Negotiate', assignment)}
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

            {/* ================= AVAILABLE PUBLIC BANKS ================= */}
            {unassignedPublicBanks.length > 0 && (
                <div>
                    <h4 className="font-bold mb-4 text-gray-800">
                        🏦 Available Public Banks
                    </h4>

                    <div className="available-banks-grid">
                        {unassignedPublicBanks.map((bank) => (
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

            {/* ================= AVAILABLE PRIVATE BANKS ================= */}
            {unassignedPrivateBanks.length > 0 && (
                <div>
                    <h4 className="font-bold mb-4 text-gray-800">
                        🏦 Available Private Banks
                    </h4>

                    <div className="available-banks-grid">
                        {unassignedPrivateBanks.map((bank) => (
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

            {/* ================= AVAILABLE NBFCS ================= */}
            {unassignedNbfcBanks.length > 0 && (
                <div>
                    <h4 className="font-bold mb-4 text-gray-800">
                        🏢 Available NBFCs
                    </h4>

                    <div className="available-banks-grid">
                        {unassignedNbfcBanks.map((bank) => (
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
                            <button type="button" className="modal-close-btn" onClick={handleCloseWrongUpdateModal}>
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
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                onClick={handleCloseWrongUpdateModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-md text-white ${copiedWrongUpdate ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                                onClick={handleCopyWrongUpdate}
                            >
                                {copiedWrongUpdate ? '✓ Copied' : 'Copy'}
                            </button>
                            <button
                                type="button"
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
                            <button type="button" className="modal-close-btn" onClick={handleCloseNotificationModal}>
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
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                onClick={handleCloseNotificationModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-md text-white ${copiedNotification ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                                onClick={handleCopyNotification}
                            >
                                {copiedNotification ? '✓ Copied' : 'Copy'}
                            </button>
                            <button
                                type="button"
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

            {/* ================= REOPEN MODAL ================= */}
            {isReopenModalOpen && (
                <div className="modal-overlay" onClick={handleCloseReopenModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Reopen - {selectedBankForReopen?.bankName}</h2>
                            <button type="button" className="modal-close-btn" onClick={handleCloseReopenModal}>
                                <svg className="accordion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={reopenSubType}
                                    onChange={(e) => setReopenSubType(e.target.value)}
                                >
                                    <option value="">Select Reason</option>
                                    {reopenOptions.map((opt) => (
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
                                    value={reopenNote}
                                    onChange={(e) => setReopenNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px', borderTop: '1px solid #eee' }}>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                onClick={handleCloseReopenModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-md text-white ${copiedReopen ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                                onClick={handleCopyReopen}
                            >
                                {copiedReopen ? '✓ Copied' : 'Copy'}
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                onClick={handleSubmitReopen}
                                disabled={isSubmittingReopen}
                            >
                                {isSubmittingReopen ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default RecommendedBanksSection;