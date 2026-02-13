import React, { useState, useEffect } from "react";
import "./Counsellor_Stylling/MyNotes_Counsellor.css";
import { API_URL } from "../../constants";

const MyNotes_Counsellor = ({ currentUser }) => {
  const [recentLeads, setRecentLeads] = useState([]);
  const [messages, setMessages] = useState({});
  const [counsellorName, setCounsellorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [searchNotes, setSearchNotes] = useState('');

  // Fetch messages on component mount
  useEffect(() => {
    if (currentUser?._id) {
      fetchMessages();
    }
  }, [currentUser]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/messages/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setRecentLeads(data.recentLeads || []);
      setMessages(data.messages || {});
      setCounsellorName(data.counsellorName || '');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    // Update active state for leads
    setRecentLeads(prevLeads =>
      prevLeads.map(l => ({ ...l, active: l.id === lead.id }))
    );
  };

  const handleSendNote = async () => {
    if (!selectedLead || !newNote.trim()) return;

    try {
      setSendingNote(true);
      const response = await fetch(`${API_URL}/${selectedLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newNote: {
            loggedById: currentUser._id,
            loggedByName: currentUser.fullName || 'Counsellor',
            notes: newNote.trim(),
            callStatus: 'Counsellor Note'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send note');
      }

      // Refresh messages after sending
      await fetchMessages();
      setNewNote('');
      setSelectedLead(null);
    } catch (err) {
      setError('Failed to send note: ' + err.message);
      console.error('Error sending note:', err);
    } finally {
      setSendingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="notes-page-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-page-container">
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          Error: {error}
          <button onClick={fetchMessages} style={{ marginLeft: '10px' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page-container">
      {/* LEFT SIDEBAR */}
      <aside className="notes-sidebar">
        <div className="sidebar-header">
          <h2>My Notes</h2>
          <p>Manage all communications</p>
        </div>



        <div className="leads-list-section">
          <label className="section-title">RECENT LEADS</label>
          <div className="search-box">
            <input type="text" placeholder="Filter leads..." />
          </div>
          <div className="leads-list">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className={`lead-item ${lead.active ? "active" : ""}`}
                onClick={() => handleLeadSelect(lead)}
                style={{ cursor: 'pointer' }}
              >
                <div className="lead-avatar">{lead.initial}</div>
                <div className="lead-info">
                  <span className="lead-name">{lead.name}</span>
                  <span className="lead-id">ID: #{lead.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <span>⚙️ Notification Preferences</span>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="notes-thread-area">
        <div className="notes-search-header">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchNotes}
              onChange={(e) => setSearchNotes(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="thread-timeline">
          {Object.keys(messages).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No messages yet. Select a lead to start communicating.
            </div>
          ) : (
            Object.entries(messages).map(([date, msgs]) => (
              <React.Fragment key={date}>
                <div className="timeline-divider">
                  <span>{new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                {msgs.filter(msg => msg.callStatus === 'Counsellor Note').filter(msg => {
                  if (!searchNotes) return true;
                  const searchTerm = searchNotes.toLowerCase().trim();
                  // Search in sender name
                  if (msg.sender && msg.sender.toLowerCase().trim().includes(searchTerm)) return true;
                  // Search in message content
                  if (msg.message && msg.message.toLowerCase().trim().includes(searchTerm)) return true;
                  // Search in lead name
                  if (msg.leadName && msg.leadName.toLowerCase().trim().includes(searchTerm)) return true;
                  return false;
                }).map((msg) => (
                  <div key={msg.id} className={`note-group ${msg.type === 'internal' && msg.sender === (currentUser?.fullName || 'Counsellor') ? 'sent' : 'received'}`}>
                    <div className="sender-meta">
                      <strong>{msg.sender}</strong>
                      <span className="time">
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                    <div className={`note-bubble ${msg.type === 'internal' && msg.sender === (currentUser?.fullName || 'Counsellor') ? 'sent-bg' : msg.type === 'external' ? 'received' : 'system'}`}>
                      {msg.type === 'internal' && msg.sender === (currentUser?.fullName || 'Counsellor') && msg.callStatus === 'Counsellor Note' && (
                        <div className="bubble-header">
                          <span className="subject">Re: {msg.leadName} (Lead #{msg.leadId})</span>
                        </div>
                      )}
                      {msg.type === 'external' && (
                        <div className="bubble-header">
                          <span className="info-tag">BANK NOTE</span>
                          <span className="subject">Re: {msg.leadName} (Lead #{msg.leadId})</span>
                        </div>
                      )}
                      {msg.type === 'internal' && msg.sender !== (currentUser?.fullName || 'Counsellor') && (
                        <div className="bubble-header">
                          <span className="action-tag">INTERNAL NOTE</span>
                          <span className="subject">Re: {msg.leadName} (Lead #{msg.leadId})</span>
                        </div>
                      )}
                      <p>{msg.message}</p>
                      {msg.callStatus && msg.callStatus !== 'Log' && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                          Status: {msg.callStatus}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))
          )}
        </div>

        {/* COMPOSER AREA */}
        <div className="composer-container">
          <div className="composer-meta">
            <div className="regarding-box">
              <label>REGARDING LEAD</label>
              <select
                value={selectedLead?.id || ''}
                onChange={(e) => {
                  const lead = recentLeads.find(l => l.id === e.target.value);
                  if (lead) handleLeadSelect(lead);
                }}
              >
                <option value="" disabled>Select a lead...</option>
                {recentLeads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} (#{lead.id})
                  </option>
                ))}
              </select>
              <div className="visibility-tip">
                <span>⚠️ This note will be visible to the Loan Team.</span>
              </div>
            </div>
            <div className="input-box">
              <textarea
                placeholder="Type your message, update, or reply here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={!selectedLead}
              />
              <div className="input-actions">
                <button
                  className="send-note-btn"
                  onClick={handleSendNote}
                  disabled={!selectedLead || !newNote.trim() || sendingNote}
                >
                  {sendingNote ? 'Sending...' : 'Send Note ➤'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyNotes_Counsellor;