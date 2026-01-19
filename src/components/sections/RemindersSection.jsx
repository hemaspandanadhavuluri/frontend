import React from 'react';
import { leadStatusOptions, priorityReasons, closeReasons } from '../../constants';
import './RemindersSection.css';

const RemindersSection = ({
    lead,
    handleChange,
    handleDateChange,
    handleSanctionDetailsChange,
    handleSetReminder,
    leadStatusOptions: statusOptions,
    priorityReasons: priorReasons,
    closeReasons: clReasons
}) => {
    const useStatusOptions = statusOptions || leadStatusOptions;
    const usePriorityReasons = priorReasons || priorityReasons;
    const useCloseReasons = clReasons || closeReasons;

    // Helper function to format date for datetime-local input
    const formatLocalDateTime = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className="section-block">
         <h1 style={{ color: '#512967', fontWeight: 'bold', fontSize: '24px' }}>🗓️Reminders and Final Status</h1>
            <div className="target-sanction-date">
                <label className="form-label">Target Sanction Date</label>
                <input
                    type="date"
                    value={lead.targetSanctionDate ? new Date(lead.targetSanctionDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleDateChange('targetSanctionDate', e.target.value ? new Date(e.target.value) : null)}
                    className="form-input"
                />
            </div>
            <div className="reminders-fields">
                <div className="date-field sm:w-1/2 md:w-1/4">
                    <label className="date-label">Last Call Date</label>
                    <input
                        type="date"
                        value={lead.lastCallDate ? new Date(lead.lastCallDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleDateChange('lastCallDate', e.target.value ? new Date(e.target.value) : null)}
                        className="form-input"
                    />
                </div>
                <div className="date-field sm:w-1/2 md:w-1/4">
                    <label className="date-label">Set New Reminder Date & Time</label>
                    <input
                        type="datetime-local"
                        value={lead.reminderCallDate ? formatLocalDateTime(lead.reminderCallDate) : ''}
                        onChange={(e) => handleDateChange('reminderCallDate', e.target.value ? new Date(e.target.value + ':00') : null)}
                        className="form-input"
                    />
                    <button
                        type="button"
                        onClick={handleSetReminder}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        style={{ background: '#512967' }}
                    >
                        Set Reminder
                    </button>
                </div>

                <div className="form-group">
                    <label className="form-label">Final Status</label>
                    <select name="leadStatus" value={lead.leadStatus} onChange={handleChange} className="form-select">
                        {useStatusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
                {/* --- NEW: Conditional Dropdown for Priority Status --- */}
                {lead.leadStatus === 'On Priority' && (
                    <div className="form-group">
                        <label className="form-label">Reason for Priority</label>
                        <select name="priorityReason" value={lead.priorityReason || ''} onChange={handleChange} className="form-select priority-select">
                            <option value="" disabled>Select a reason...</option>
                            {usePriorityReasons.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                        </select>
                    </div>
                )}
                {/* --- NEW: Conditional Dropdown for Close Status --- */}
                {lead.leadStatus === 'Close' && (
                    <div className="form-group">
                        <label className="form-label">Reason for Closing</label>
                        <select name="closeReason" value={lead.closeReason || ''} onChange={handleChange} className="form-select close-select">
                            <option value="" disabled>Select a reason...</option>
                            {useCloseReasons.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                        </select>
                    </div>
                )}
                {lead.leadStatus === 'Sanctioned' && (
                    <div className="form-group">
                        <label className="form-label">Date of Sanction</label>
                        <input
                            type="date"
                            value={lead.sanctionDetails.sanctionDate ? new Date(lead.sanctionDetails.sanctionDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleSanctionDetailsChange({ target: { name: 'sanctionDate', value: e.target.value ? new Date(e.target.value).toISOString() : null } })}
                            className="form-input"
                        />
                    </div>
                )}
                {lead.leadStatus === 'On Priority' && <div className="status-section"><strong>Why mark as Priority?</strong> A lead is a priority if they have an admit, have shortlisted universities, or their intake is very soon. This helps focus on leads closest to conversion.</div>}
                {lead.leadStatus === 'Close' && <div className="status-section"><strong>When to Close a Lead?</strong> Close a lead if the student is definitively not interested, cannot be reached after multiple attempts, or is clearly not eligible for any loan product.</div>}
            </div>
        </div>
    );
};

export default RemindersSection;
