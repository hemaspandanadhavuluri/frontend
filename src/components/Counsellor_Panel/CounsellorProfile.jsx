import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../profile_user.css';

const API_URL = 'https://justtapcapital.com/api/leads';

const CounsellorProfile = ({ currentUser, onClose }) => {
    const user = currentUser;
    const [totalLeads, setTotalLeads] = useState(0);
    const [leadsLoading, setLeadsLoading] = useState(true);

    useEffect(() => {
        const fetchLeadCount = async () => {
            if (!currentUser?._id) {
                setLeadsLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/stats/${currentUser._id}`);
                setTotalLeads(response.data.totalLeads || 0);
            } catch (error) {
                console.error('Error fetching lead count:', error);
                setTotalLeads(0);
            } finally {
                setLeadsLoading(false);
            }
        };

        fetchLeadCount();
    }, [currentUser?._id]);

    const hasValue = (value) => {
        return value !== undefined && value !== null && value !== '';
    };

    return (
        <div className="profile-overlay-user" onClick={onClose}>
            <div className="profile-container-user" onClick={(e) => e.stopPropagation()}>
                <button className="profile-close-btn-user" onClick={onClose}>×</button>
                {user && (
                    <>
                        <div className="profile-header-user">
                            {user.profilePictureUrl ? (
                                <img 
                                    src={`https://justtapcapital.com/${user.profilePictureUrl}`} 
                                    alt="Profile" 
                                    className="profile-picture-user" 
                                />
                            ) : (
                                <div className="profile-picture-placeholder-user">
                                    <span>{user.fullName?.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                            <div className="profile-name-role-user">
                                <h2>{user.fullName}</h2>
                                <p className="profile-role-user">{user.role || 'Counsellor'}</p>
                            </div>
                        </div>
                        <div className="profile-details-user">
                            {/* Required Fields - Always Displayed */}
                            <div className="profile-row-user">
                                <div className="profile-field-user">
                                    <label>Email:</label>
                                    <span>{user.email || 'Not available'}</span>
                                </div>
                                <div className="profile-field-user">
                                    <label>Mobile Number:</label>
                                    <span>{user.phoneNumber || 'Not available'}</span>
                                </div>
                                 <div className="profile-field-user">
                                    <label>Consultancy Name:</label>
                                    <span>{user.consultancy || 'Not available'}</span>
                                </div>
                            </div>

                            {/* Professional Info - Always Displayed */}
                            <div className="profile-row-user">
                                <div className="profile-field-user">
                                    <label>No of Leads:</label>
                                    <span>{leadsLoading ? 'Loading...' : totalLeads}</span>
                                </div>
                            </div>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CounsellorProfile;
