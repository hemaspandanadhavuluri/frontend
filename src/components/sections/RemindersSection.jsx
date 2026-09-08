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

    // Helper functions to format date and time for split inputs
    const getDatePart = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getTimePart = (date) => {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const reminderDateVal = lead.reminderCallDate ? getDatePart(lead.reminderCallDate) : '';
    const reminderTimeVal = lead.reminderCallDate ? getTimePart(lead.reminderCallDate) : '';

    const handleReminderChange = (dateVal, timeVal) => {
        if (!dateVal) {
            handleDateChange('reminderCallDate', null);
            return;
        }
        const timePart = timeVal ? `${timeVal}:00` : '00:00:00';
        const combinedStr = `${dateVal}T${timePart}`;
        handleDateChange('reminderCallDate', new Date(combinedStr));
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
                {lead.leadStatus === 'Close' ? (
                    <div className="date-field sm:w-1/2 md:w-1/4" style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#92400e', lineHeight: '1.4' }}>
                            ℹ️ Status is <strong>Close</strong>. No reminder is needed. Go to <strong>Call Notes</strong> to write a note and click <strong>SUBMIT LEAD DATA</strong>.
                        </div>
                    </div>
                ) : (
                    <div className="date-field sm:w-1/2 md:w-1/4">
                        <label className="date-label">Set New Reminder Date & Time</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="date"
                                value={reminderDateVal}
                                onChange={(e) => handleReminderChange(e.target.value, reminderTimeVal)}
                                className="form-input"
                                style={{ flex: 3 }}
                            />
                            <input
                                type="time"
                                value={reminderTimeVal}
                                onChange={(e) => handleReminderChange(reminderDateVal, e.target.value)}
                                className="form-input"
                                style={{ flex: 2 }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSetReminder}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            style={{ background: '#512967' }}
                        >
                            Set Reminder
                        </button>
                    </div>
                )}

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
