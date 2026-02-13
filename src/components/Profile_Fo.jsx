import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import './Profile_Fo.css';

const Profile_Fo = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetchUserDetails(user._id);
        } else {
            setError('User not found in localStorage');
            setLoading(false);
        }
    }, []);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`${API_URL.replace('/leads', '/users')}/${userId}`);
            setUserDetails(response.data);
        } catch (err) {
            setError('Failed to fetch user details');
            console.error('Error fetching user details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="profile-container">Loading...</div>;
    }

    if (error) {
        return <div className="profile-container">Error: {error}</div>;
    }

    return (
        <div className="profile-container">
            {userDetails && (
                <>
                    <div className="profile-name-role">
                        <h2>{userDetails.fullName}</h2>
                        <p className="profile-role">{userDetails.role}</p>
                    </div>
                    <div className="profile-header">
                        {userDetails.profilePictureUrl ? (
                            <img src={`https://justtapcapital.com/${userDetails.profilePictureUrl}`} alt="Profile" className="profile-picture" />
                        ) : (
                            <div className="profile-picture-placeholder">
                                <span>{userDetails.fullName.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                    <div className="profile-details">
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Email:</label>
                                <span>{userDetails.email}</span>
                            </div>
                            <div className="profile-field">
                                <label>Phone Number:</label>
                                <span>{userDetails.phoneNumber}</span>
                            </div>
                            <div className="profile-field">
                                <label>Date of Birth:</label>
                                <span>{userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Gender:</label>
                                <span>{userDetails.gender}</span>
                            </div>
                            <div className="profile-field">
                                <label>PAN Number:</label>
                                <span>{userDetails.panNumber}</span>
                            </div>
                            <div className="profile-field">
                                <label>Aadhar Number:</label>
                                <span>{userDetails.aadharNumber}</span>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Current Address:</label>
                                <span>{userDetails.currentAddress}</span>
                            </div>
                            <div className="profile-field">
                                <label>Permanent Address:</label>
                                <span>{userDetails.permanentAddress}</span>
                            </div>
                            <div className="profile-field">
                                <label>Father's Name:</label>
                                <span>{userDetails.fatherName}</span>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Father's DOB:</label>
                                <span>{userDetails.fatherDob ? new Date(userDetails.fatherDob).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="profile-field">
                                <label>Father's Mobile:</label>
                                <span>{userDetails.fatherMobile}</span>
                            </div>
                            <div className="profile-field">
                                <label>Mother's Name:</label>
                                <span>{userDetails.motherName}</span>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Mother's DOB:</label>
                                <span>{userDetails.motherDob ? new Date(userDetails.motherDob).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="profile-field">
                                <label>Mother's Mobile:</label>
                                <span>{userDetails.motherMobile}</span>
                            </div>
                            <div className="profile-field">
                                <label>Zone:</label>
                                <span>{userDetails.zone}</span>
                            </div>
                        </div>
                        <div className="profile-row">
                            <div className="profile-field">
                                <label>Region:</label>
                                <span>{userDetails.region}</span>
                            </div>
                            <div className="profile-field">
                                <label>Bank:</label>
                                <span>{userDetails.bank}</span>
                            </div>
                            <div className="profile-field">
                                <label>Consultancy:</label>
                                <span>{userDetails.consultancy}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile_Fo;
