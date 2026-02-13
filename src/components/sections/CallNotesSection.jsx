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
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenSection, setFullscreenSection] = useState(null);
    const [fullscreenNote, setFullscreenNote] = useState({ notes: '', callStatus: 'Connected' });
    const [fullscreenCounsellorNote, setFullscreenCounsellorNote] = useState({ notes: '' });

    const openFullscreen = (section) => {
        setFullscreenSection(section);
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
        setFullscreenSection(null);
        setFullscreenNote({ notes: '', callStatus: 'Connected' });
        setFullscreenCounsellorNote({ notes: '' });
    };

    const handleFullscreenNoteChange = (e) => {
        setFullscreenNote({ ...fullscreenNote, [e.target.name]: e.target.value });
    };

    const handleFullscreenCounsellorNoteChange = (e) => {
        setFullscreenCounsellorNote({ ...fullscreenCounsellorNote, notes: e.target.value });
    };

    const handleSendFullscreenNote = () => {
        if (fullscreenNote.notes.trim()) {
            handleNoteChange({ target: { name: 'notes', value: fullscreenNote.notes } });
            handleNoteChange({ target: { name: 'callStatus', value: fullscreenNote.callStatus } });
            onSendNote();
            setFullscreenNote({ notes: '', callStatus: 'Connected' });
        }
    };

    const handleSendFullscreenCounsellorNote = () => {
        if (fullscreenCounsellorNote.notes.trim()) {
            handleCounsellorNoteChange({ target: { name: 'notes', value: fullscreenCounsellorNote.notes } });
            onSendCounsellorNote();
            setFullscreenCounsellorNote({ notes: '' });
        }
    };

    // Render main notes content
    const renderMainNotesContent = (isFullscreenView = false) => {
        const combinedHistory = [
            ...(lead.callHistory ? lead.callHistory.filter(log => log.callStatus !== 'Counsellor Note') : []),
            ...(lead.externalCallHistory ? lead.externalCallHistory : [])
        ];
        const filteredHistory = combinedHistory
            .filter(log => {
                if (!searchMain) return true;
                const searchTerm = searchMain.toLowerCase().trim();
                if (log.notes.toLowerCase().trim().includes(searchTerm)) return true;
                if (log.loggedByName && log.loggedByName.toLowerCase().trim().includes(searchTerm)) return true;
                if (lead.approachedBanks && lead.approachedBanks.some(bank => bank.bankName && bank.bankName.toLowerCase().trim().includes(searchTerm))) return true;
                if (lead.assignedBanks && lead.assignedBanks.some(bank => bank.bankName && bank.bankName.toLowerCase().trim().includes(searchTerm))) return true;
                if (lead.assignedBanks && lead.assignedBanks.some(bank => bank.assignedRMName && bank.assignedRMName.toLowerCase().trim().includes(searchTerm))) return true;
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
    };

    // Render counsellor notes content
    const renderCounsellorNotesContent = (isFullscreenView = false) => {
        const filteredCounsellorHistory = lead.callHistory
            ? lead.callHistory
                .filter(log => log.callStatus === 'Counsellor Note')
                .filter(log => {
                    if (!searchCounsellor) return true;
                    const searchTerm = searchCounsellor.toLowerCase().trim();
                    if (log.notes.toLowerCase().trim().includes(searchTerm)) return true;
                    if (lead.counsellorName && lead.counsellorName.toLowerCase().trim().includes(searchTerm)) return true;
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
    };

    // Fullscreen modal content
    const renderFullscreenContent = () => {
        if (fullscreenSection === 'main') {
            return (
                <div className="fullscreen-notes-container">
                    <div className="fullscreen-header">
                        <h2>All Notes History</h2>
                        <button className="fullscreen-close-btn" onClick={closeFullscreen}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="fullscreen-notes-search">
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchMain}
                            onChange={(e) => setSearchMain(e.target.value)}
                            className="notes-search-input"
                        />
                    </div>
                    <div className="fullscreen-notes-content">
                        {renderMainNotesContent(true)}
                    </div>
                    {/* Add Note Form in Fullscreen */}
                    <div className="fullscreen-add-note-form">
                        <h4 className="form-title">Add New Note</h4>
                        <div className="add-note-form-fields">
                            <textarea
                                style={{color: 'black', height: '150px'}}
                                name="notes"
                                rows="3"
                                className="notes-form-textarea"
                                placeholder="Enter detailed notes from the conversation..."
                                value={fullscreenNote.notes}
                                onChange={handleFullscreenNoteChange}
                            ></textarea>
                        </div>
                        <div className="form-group" style={{display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'}}>
                            <div>
                                <label className="form-label">Call Status *</label>
                                <select 
                                    name="callStatus" 
                                    value={fullscreenNote.callStatus} 
                                    onChange={handleFullscreenNoteChange} 
                                    className="form-select"
                                >
                                    <option>Connected</option>
                                    <option>Not Reached</option>
                                    <option>Busy</option>
                                    <option>Scheduled</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                className="call-notes-send-btn"
                                onClick={handleSendFullscreenNote}
                                disabled={!fullscreenNote.notes.trim()}
                            >
                                Send Note
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (fullscreenSection === 'counsellor') {
            return (
                <div className="fullscreen-notes-container">
                    <div className="fullscreen-header">
                        <h2>Counsellor Notes History</h2>
                        <button className="fullscreen-close-btn" onClick={closeFullscreen}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="fullscreen-notes-search">
                        <input
                            type="text"
                            placeholder="Search counsellor notes..."
                            value={searchCounsellor}
                            onChange={(e) => setSearchCounsellor(e.target.value)}
                            className="notes-search-input"
                        />
                    </div>
                    <div className="fullscreen-notes-content">
                        {renderCounsellorNotesContent(true)}
                    </div>
                    {/* Add Counsellor Note Form in Fullscreen */}
                    <div className="fullscreen-add-note-form">
                        <h4 className="form-title">Add Counsellor Note</h4>
                        <div className="add-note-form-fields">
                            <textarea
                                style={{color: 'black'}}
                                name="notes"
                                rows="2"
                                className="notes-form-textarea"
                                placeholder="Enter notes to send to the counsellor..."
                                value={fullscreenCounsellorNote.notes}
                                onChange={handleFullscreenCounsellorNoteChange}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="counsellor-send-btn"
                                onClick={handleSendFullscreenCounsellorNote}
                                disabled={!fullscreenCounsellorNote.notes.trim()}
                            >
                                Send Counsellor Note
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="section-block">
            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fullscreen-modal-overlay" onClick={closeFullscreen}>
                    <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
                        {renderFullscreenContent()}
                    </div>
                </div>
            )}

            {/* Add New Note Form */}
            <div className="add-note-form">
                {/* History View */}
                <div className="history-header">
                    <div className="history-title-wrapper">
                        <h4 className="history-title">History</h4>
                        <button 
                            className="fullscreen-btn" 
                            onClick={() => openFullscreen('main')}
                            title="View all notes in fullscreen"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                        </button>
                    </div>
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
                {renderMainNotesContent()}
            </div>
                <h4 className="form-title">Add New Note</h4>
                <div>
                    <div className="add-note-form-fields">
                        <textarea style={{color: 'black',height: '150px'}}
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
                            <div className="counsellor-history-title-wrapper">
                                <h5 className="counsellor-history-title">Counsellor Notes History</h5>
                                <button 
                                    className="fullscreen-btn" 
                                    onClick={() => openFullscreen('counsellor')}
                                    title="View all counsellor notes in fullscreen"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                                    </svg>
                                </button>
                            </div>
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
                            {renderCounsellorNotesContent()}
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
