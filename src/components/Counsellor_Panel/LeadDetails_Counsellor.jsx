import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Counsellor_Stylling/LeadDetails_Counsellor.css";
import LeadDetailView_Counsellor from "./LeadDetailView_Counsellor";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";

const LeadDetails_Counsellor = ({ currentUser }) => {
  const navigate = useNavigate();
  const [view, setView] = useState("table"); // "table" or "detail"
  const [selectedLead, setSelectedLead] = useState(null);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!currentUser?._id) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/counsellor/${currentUser._id}`);
        setAllLeads(response.data);
      } catch (error) {
        console.error('Error fetching counsellor leads:', error);
        setAllLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [currentUser?._id]);

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setView("detail");
  };

  const handleBack = () => {
    setView("table");
    setSelectedLead(null);
  };

  if (view === "detail" && selectedLead) {
    return <LeadDetailView_Counsellor lead={selectedLead} onBack={handleBack} />;
  }

  return (
    <div className="ld-container">
      <div className="ld-header">
        <div className="ld-title-group">
          <h1>All Leads</h1>
          <p>View and manage all your submitted leads</p>
        </div>
      </div>

      <div className="leads-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>Loading leads...</p>
          </div>
        ) : allLeads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <p>No leads found</p>
          </div>
        ) : (
          <table className="counsellor-leads-table">
            <thead>
              <tr>
                <th className="counsellor-table-header">Lead ID</th>
                <th className="counsellor-table-header">Name</th>
                <th className="counsellor-table-header">Amount</th>
                <th className="counsellor-table-header">Country</th>
                <th className="counsellor-table-header">Submitted</th>
                <th className="counsellor-table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allLeads.map((lead) => (
                <tr key={lead._id} className="counsellor-table-row">
                  <td className="counsellor-table-cell">#{lead.id}</td>
                  <td className="counsellor-table-cell">{lead.name}</td>
                  <td className="counsellor-table-cell">{lead.amount}</td>
                  <td className="counsellor-table-cell">{lead.country}</td>
                  <td className="counsellor-table-cell">{lead.submittedDate}</td>
                  <td className="counsellor-table-cell">
                    <button
                      className="view-btn counsellor-view-btn"
                      onClick={() => handleLeadClick(lead)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeadDetails_Counsellor;
 