import React, { useState } from 'react';
import moment from 'moment';
import './CallNotesSection.css';

const CallNotesSection = ({
    lead,
    newNote,
    counsellorNote,
    handleNoteChange,
    handleCounsellorNoteChange,
    onSendNote,
    onSendCounsellorNote,
    onSubmitLeadData,
    isSubmitDisabled
}) => {
    const [searchMain, setSearchMain] = useState('');
    const [searchCounsellor, setSearchCounsellor] = useState('');
    return (
        <div className="section-block">
            

            {/* Add New Note Form */}
            <div className="add-note-form">
                {/* History View */}
                <div className="history-header">
                    <h4 className="history-title">History</h4>
                    <div className="notes-search-box">
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchMain}
                            onChange={(e) => setSearchMain(e.target.value)}
                            className="notes-search-input"
                        />
                    </div>
                </div>
            <div className="history-container">
                {(() => {
                    const combinedHistory = [
                        ...(lead.callHistory ? lead.callHistory.filter(log => log.callStatus !== 'Counsellor Note') : []),
                        ...(lead.externalCallHistory ? lead.externalCallHistory : [])
                    ];
                    const filteredHistory = combinedHistory
                        .filter(log => {
                            if (!searchMain) return true;
                            const searchTerm = searchMain.toLowerCase().trim();
                            // Search in notes
                            if (log.notes.toLowerCase().trim().includes(searchTerm)) return true;
                            // Search in FO name
                            if (log.loggedByName && log.loggedByName.toLowerCase().trim().includes(searchTerm)) return true;
                            // Search in bank names
                            if (lead.approachedBanks && lead.approachedBanks.some(bank => bank.bankName && bank.bankName.toLowerCase().trim().includes(searchTerm))) return true;
                            if (lead.assignedBanks && lead.assignedBanks.some(bank => bank.bankName && bank.bankName.toLowerCase().trim().includes(searchTerm))) return true;
                            // Search in bank executive names
                            if (lead.assignedBanks && lead.assignedBanks.some(bank => bank.assignedRMName && bank.assignedRMName.toLowerCase().trim().includes(searchTerm))) return true;
                            // Search in post sanction officer names (counsellor)
                            if (lead.counsellorName && lead.counsellorName.toLowerCase().trim().includes(searchTerm)) return true;
                            return false;
                        })
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    return filteredHistory.length > 0 ? (
                        filteredHistory.map((log, index) => (
                            <div key={index} className={`history-item ${log.callStatus === 'Log' ? 'log' : 'connected'}`}>
                                <div className="history-item-header">
                                    <p className="history-item-author">
                                        Note by {log.loggedByName}
                                    </p>
                                    <p className="history-item-time">{moment(log.createdAt).format('DD MMM YYYY, h:mm a')}</p>
                                </div>
                                <p className="history-item-notes">{log.notes}</p>
                                {log.callStatus && <span style={{fontSize: '12px'}} className={`call-status-chip ${log.callStatus === 'Log' ? 'call-status-log' : 'call-status-connected'}`}>{log.callStatus}</span>}
                            </div>
                        ))
                    ) : (
                        <p className="empty-history">No notes for this lead yet.</p>
                    );
                })()}
            </div>
                <h4 className="form-title">Add New Note</h4>
                <div>
                    <div className="add-note-form-fields">
                        <textarea style={{color: 'black',height: '50px'}}
                            name="notes"
                            rows="3"
                            className="notes-form-textarea"
                            placeholder="Enter detailed notes from the conversation..."
                            value={newNote.notes}
                            onChange={handleNoteChange}
                        ></textarea>
                    </div>
                    <div className="form-group" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                        <div>
                            <label className="form-label">Call Status *</label>
                            <select name="callStatus" value={newNote.callStatus} onChange={handleNoteChange} className="form-select">
                                <option>Connected</option>
                                <option>Not Reached</option>
                                <option>Busy</option>
                                <option>Scheduled</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="call-notes-send-btn"
                            onClick={onSendNote}
                            disabled={!newNote.notes.trim()}
                        >
                            Send Note
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Counsellor Note Form - Only show if lead has counsellor */}
            {lead.counsellorId && (
                <div className="add-note-form counsellor-note-form">
                    {/* Counsellor History */}
                    <div className="counsellor-history-container">
                        <div className="counsellor-history-header">
                            <h5 className="counsellor-history-title">Counsellor Notes History</h5>
                            <div className="notes-search-box">
                                <input
                                    type="text"
                                    placeholder="Search counsellor notes..."
                                    value={searchCounsellor}
                                    onChange={(e) => setSearchCounsellor(e.target.value)}
                                    className="notes-search-input"
                                />
                            </div>
                        </div>
                        <div className="counsellor-history-list">
                            {(() => {
                                const filteredCounsellorHistory = lead.callHistory
                                    ? lead.callHistory
                                        .filter(log => log.callStatus === 'Counsellor Note')
                                        .filter(log => {
                                            if (!searchCounsellor) return true;
                                            const searchTerm = searchCounsellor.toLowerCase().trim();
                                            // Search in notes
                                            if (log.notes.toLowerCase().trim().includes(searchTerm)) return true;
                                            // Search in counsellor name
                                            if (lead.counsellorName && lead.counsellorName.toLowerCase().trim().includes(searchTerm)) return true;
                                            // Search in FO name
                                            if (log.loggedByName && log.loggedByName.toLowerCase().trim().includes(searchTerm)) return true;
                                            return false;
                                        })
                                        .reverse()
                                    : [];
                                return filteredCounsellorHistory.map((log, index) => (
                                    <div key={index} className="counsellor-history-item">
                                        <div className="counsellor-history-header">
                                            <p className="counsellor-history-author">
                                                Note by {log.loggedByName}
                                            </p>
                                            <p className="counsellor-history-time">{moment(log.createdAt).format('DD MMM YYYY, h:mm a')}</p>
                                        </div>
                                        <p className="counsellor-history-notes">{log.notes}</p>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                    <h4 className="form-title">Add Counsellor Note</h4>
                    <div>
                        <div className="add-note-form-fields">
                            <textarea
                                style={{color: 'black'}}
                                name="notes"
                                rows="2"
                                className="notes-form-textarea"
                                placeholder="Enter notes to send to the counsellor..."
                                value={counsellorNote.notes}
                                onChange={handleCounsellorNoteChange}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="counsellor-send-btn"
                                onClick={onSendCounsellorNote}
                                disabled={!counsellorNote.notes.trim()}
                            >
                                Send Counsellor Note
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
