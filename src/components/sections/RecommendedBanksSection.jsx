import React, { useState } from 'react';
import './RecommendedBanksSection.css';

const RecommendedBanksSection = ({ lead, tiedUpBanks, handleOpenAssignModal }) => {
    // Separate assigned and unassigned banks
    const assignedBanks = tiedUpBanks.filter(bank => lead.assignedBanks?.some(b => b.bankId === bank._id));
    const unassignedBanks = tiedUpBanks.filter(bank => !lead.assignedBanks?.some(b => b.bankId === bank._id));

    const [changeExecutiveStates, setChangeExecutiveStates] = useState({});
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    return (
        <div className="section-block">
            <div>
                {/* Assigned Banks in Grid Layout */}
                {assignedBanks.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-bold mb-4 text-gray-800">Assigned Banks</h4>
                        <div className="assigned-banks-grid">
                            {assignedBanks.map((bank) => {
                                const assignment = lead.assignedBanks.find(b => b.bankId === bank._id);
                                const assignmentIndex = lead.assignedBanks.indexOf(assignment);
                                const stateKey = `${bank._id}-${assignmentIndex}`;
                                
                                return (
                                    <div 
                                        key={bank._id} 
                                        className={`assigned-bank-card ${assignment.status === 'ongoing' ? 'ongoing' : 'closed'}`}
                                    >
                                        {/* TOP ROW: Bank Name | State | Executive Name & Email */}
                                        <div className="bank-header">
                                            <div className="bank-info">
                                                <div>
                                                    <div className="bank-name">{bank.name}</div>
                                                    <div className="bank-state">State: {assignment.state || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <span className={`status-badge ${assignment.status === 'ongoing' ? 'ongoing' : 'closed'}`}>
                                                {assignment.status === 'ongoing' ? 'Ongoing' : 'Closed'}
                                            </span>
                                        </div>

                                        {/* Executive Info (beside bank details) */}
                                        <div className="executive-info">
                                            <div><strong>{assignment.assignedRMName}</strong></div>
                                            <div className="text-xs">{assignment.assignedRMEmail}</div>
                                        </div>

                                        {/* Bank Details: Application Status & Contactible (in a line) */}
                                        <div className="bank-details">
                                            <div className="detail-row">
                                                <span>Application Status:</span> <span>{assignment.applicationStatus || ''}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span>Contactable:</span> 
                                                <span className={assignment.contactible ? 'text-green-600' : 'text-red-600'}>
                                                    {assignment.contactible ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Change Executive Option */}
                                        {/* <div className="change-executive">
                                            <select className="change-executive-select">
                                                <option value="">Change Executive</option>
                                                <option value={assignment.assignedRMEmail}>{assignment.assignedRMName} (Current)</option>
                                            </select>
                                        </div> */}

                                        {/* Assigned Date */}
                                        <div className="assigned-date">
                                            Assigned Date: {formatDate(assignment.assignedAt)}
                                        </div>

                                        {/* BOTTOM ROW: Lender | Last Call | Next Call | CRM ID */}
                                        <div className="bottom-row">
                                            <div>
                                                <span>Lender:</span>
                                                <span>{bank.name}</span>
                                            </div>
                                            <div>
                                                <span>Last Call:</span>
                                                <span>{formatDate(assignment.lastCall)}</span>
                                            </div>
                                            <div>
                                                <span>Next Call:</span>
                                                <span>{formatDate(assignment.nextCall)}</span>
                                            </div>
                                            <div>
                                                <span>CRM ID:</span>
                                                <span>{assignment.crmId || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="action-buttons">
                                            <button className="action-button contact-asap">Contact ASAP</button>
                                            <button className="action-button wrong-update">Wrong Update</button>
                                            <button className="action-button negotiate">Negotiate</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Unassigned Banks in Grid */}
                {unassignedBanks.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-4 text-gray-800">Available Banks</h4>
                        <div className="available-banks-grid">
                            {unassignedBanks.map((bank) => (
                                <div key={bank._id} className="available-bank-card">
                                    <div>
                                        <p className="available-bank-name">{bank.name}</p>
                                    </div>
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

                
            </div>
        </div>
    );
};

export default RecommendedBanksSection;
