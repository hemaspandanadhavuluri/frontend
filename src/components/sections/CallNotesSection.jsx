import React from 'react';
import moment from 'moment';
import './CallNotesSection.css';

const CallNotesSection = ({
    lead,
    newNote,
    handleNoteChange,
    onSendNote,
    onSubmitLeadData,
    isSubmitDisabled
}) => {
    return (
        <div className="section-block">
            {/* History View */}
            <div className="history-container">
                <h4 className="history-title">History</h4>
                {lead.callHistory && lead.callHistory.length > 0 ? (
                    lead.callHistory.slice().reverse().map((log, index) => (
                        <div key={index} className={`history-item ${log.callStatus === 'Log' ? 'log' : 'connected'}`}>
                            <div className="history-item-header">
                                <p className="history-item-author">
                                    Note by {log.loggedByName}
                                </p>
                                <p className="history-item-time">{moment(log.createdAt).format('DD MMM YYYY, h:mm a')}</p>
                            </div>
                            <p className="history-item-notes">{log.notes}</p>
                            {log.callStatus && <span className={`call-status-chip ${log.callStatus === 'Log' ? 'call-status-log' : 'call-status-connected'}`}>{log.callStatus}</span>}
                        </div>
                    ))
                ) : (
                    <p className="empty-history">No notes for this lead yet.</p>
                )}
            </div>

            {/* Add New Note Form */}
            <div className="add-note-form">
                <h4 className="form-title">Add New Note</h4>
                <div>
                    <div className="add-note-form-fields">
                        <textarea
                            name="notes"
                            rows="4"
                            className="notes-form-textarea"
                            placeholder="Enter detailed notes from the conversation..."
                            value={newNote.notes}
                            onChange={handleNoteChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Call Status *</label>
                        <select name="callStatus" value={newNote.callStatus} onChange={handleNoteChange} className="form-select">
                            <option>Connected</option>
                            <option>Not Reached</option>
                            <option>Busy</option>
                            <option>Scheduled</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="send-note-btn"
                            onClick={onSendNote}
                            disabled={!newNote.notes.trim()}
                        >
                            Send Note
                        </button>
                    </div>
                </div>
            </div>

            {/* SUBMIT LEAD DATA Button */}
            <div className="submit-lead-data-container">
                <button
                    type="button"
                    className={`submit-lead-data-btn ${isSubmitDisabled ? 'disabled' : 'enabled'}`}
                    onClick={onSubmitLeadData}
                >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', marginRight: '8px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    SUBMIT LEAD DATA
                </button>
            </div>
        </div>
    );
};

export default CallNotesSection;
