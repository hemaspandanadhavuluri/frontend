import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Counsellor_Stylling/LeadDetailView_Counsellor.css";
import { API_URL } from "../../constants";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip
} from '@mui/material';
import { CheckCircle, UploadFile, Visibility } from '@mui/icons-material';

const LeadDetailView_Counsellor = ({ lead, onBack, currentUser }) => {
  // start with whatever we already have from the list (lead prop)
  // so that loan requirement values are immediately visible even before the
  // detailed fetch completes.  The FO panel populates these fields and the
  // lead prop passed down from the list already contains them.
  const [fullLead, setFullLead] = useState(lead || null);
  const [loading, setLoading] = useState(!lead); // if we already had some data, avoid spinner
  const [newNote, setNewNote] = useState('');
  const [sendingNote, setSendingNote] = useState(false);

  useEffect(() => {
    // whenever the selected lead changes we want to show any values that were
    // already available (especially the loan requirement fields) and then
    // re-fetch the full record in case additional fields were added by the FO.
    if (lead) {
      setFullLead(lead);
      setLoading(!lead); // if lead prop was nullish we'll show loader
    }

    const fetchFullLead = async () => {
      try {
        const response = await axios.get(`${API_URL}/${lead._id}`);
        setFullLead(response.data);
      } catch (error) {
        console.error('Error fetching full lead details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (lead && lead._id) {
      fetchFullLead();
    }
  }, [lead]);

  const handleSendNote = async () => {
    if (!newNote.trim()) return;

    try {
      setSendingNote(true);
      const response = await fetch(`${API_URL}/${lead._id}`, {
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

      // Refresh the lead data
      const updatedResponse = await axios.get(`${API_URL}/${lead._id}`);
      setFullLead(updatedResponse.data);
      setNewNote('');
    } catch (err) {
      console.error('Error sending note:', err);
      alert('Failed to send note: ' + err.message);
    } finally {
      setSendingNote(false);
    }
  };

  if (loading) {
    return <div>Loading lead details...</div>;
  }

  if (!fullLead) {
    return <div>Error loading lead details.</div>;
  }

  // Map callHistory to messages, filtering to only counsellor notes
  const messages = fullLead.callHistory ? fullLead.callHistory.filter(call => call.callStatus === 'Counsellor Note').map(call => ({
    sender: call.loggedByName,
    text: call.notes,
    time: new Date(call.createdAt).toLocaleTimeString(),
    type: call.callStatus === 'Log' ? 'log' : 'message'
  })) : [];

  // Use the date of the latest call or a default
  const notesDate = fullLead.callHistory && fullLead.callHistory.length > 0
    ? new Date(fullLead.callHistory[fullLead.callHistory.length - 1].createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  const displayLead = {
    ...fullLead,
    id: fullLead.leadID,
    name: fullLead.fullName,
    phone: fullLead.mobileNumbers && fullLead.mobileNumbers.length > 0 ? fullLead.mobileNumbers[0] : 'N/A',
    email: fullLead.email || 'N/A',
    city: fullLead.permanentLocation || 'N/A',
    citizenship: 'Indian', // Assuming default
    amount: fullLead.loanAmountRequired ? `₹${fullLead.loanAmountRequired.toLocaleString('en-IN')}` : '₹0',
    courseDuration: fullLead.courseDuration || 'N/A',
    fee: fullLead.fee ? `₹${fullLead.fee.toLocaleString('en-IN')}` : '₹0',
    living: fullLead.living ? `₹${fullLead.living.toLocaleString('en-IN')}` : '₹0',
    otherExpenses: fullLead.otherExpenses ? `₹${fullLead.otherExpenses.toLocaleString('en-IN')}` : '₹0',
    lender: fullLead.approachedBanks && fullLead.approachedBanks.length > 0 ? fullLead.approachedBanks[0].bankName : 'N/A',
    university: fullLead.admittedUniversities && fullLead.admittedUniversities.length > 0 ? fullLead.admittedUniversities[0] : 'N/A',
    course: fullLead.degree || 'N/A',
    intake: fullLead.courseStartMonth && fullLead.courseStartYear ? `${fullLead.courseStartMonth} ${fullLead.courseStartYear}` : 'N/A',
    // include any original tuition fee and conversion rate captured by FO panel
    originalFee: fullLead.originalFee ? fullLead.originalFee : null,
    conversionRate: fullLead.conversionRate ? fullLead.conversionRate : null,
    status: fullLead.leadStatus || 'No status',
    submittedDate: new Date(fullLead.createdAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    lastUpdated: new Date(fullLead.updatedAt).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    notes: {
      date: notesDate,
      messages: messages
    }
  };
  return (
    <div className="ld-container">
      {/* HEADER SECTION */}
      <div className="ld-header">
        <div className="ld-title-group">
          <h1>Lead #{displayLead.id}: {displayLead.name}</h1>
          <p>Submitted on {displayLead.submittedDate} • Last updated {displayLead.lastUpdated}</p>
        </div>


      </div>

      <div className="ld-main-grid">
        {/* LEFT COLUMN: INFORMATION */}
        <div className="ld-left-col">

          {/* Applicant Details */}
          <div className="ld-card">
            <h3 className="card-title"><i className="icon-user"></i> Applicant Details</h3>
            <div className="info-row"><span>Full Name</span><strong>{displayLead.name}</strong></div>
            <div className="info-row"><span>Phone</span><strong>{displayLead.phone}</strong></div>
            <div className="info-row"><span>Email</span><strong>{displayLead.email}</strong></div>
            <div className="info-row"><span>City</span><strong>{displayLead.city}</strong></div>
            <div className="info-row"><span>Citizenship</span><strong>{displayLead.citizenship}</strong></div>
          </div>

        </div>

        {/* RIGHT COLUMN: PROCESSING NOTES */}
        <div className="ld-right-col">
          <div className="ld-notes-card">
            <div className="notes-header">
              <h3>Processing Notes</h3>
              <span className="online-indicator">Team Online</span>
            </div>

            <div className="chat-thread">
              <div className="date-separator">{displayLead.notes.date}</div>
              <p className="system-msg">Lead application submitted by Counsellor</p>

              {displayLead.notes.messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.type}`}>
                  <div className="bubble-meta">{msg.sender} • {msg.time}</div>
                  <div className="bubble-header">
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <textarea
                placeholder="Type a message or reply to the team..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="input-footer">
                <span>Press Enter to send</span>
                <button
                  className="send-btn"
                  onClick={handleSendNote}
                  disabled={!newNote.trim() || sendingNote}
                >
                  {sendingNote ? 'Sending...' : 'Send ➤'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={onBack} className="back-btn">← Back to Leads</button>
    </div>
  );
};

export default LeadDetailView_Counsellor;
