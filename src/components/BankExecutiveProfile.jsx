import React from 'react';
import './profile_user.css';

const BankExecutiveProfile = ({ currentUser, onClose }) => {
    const user = currentUser;

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
                                <p className="profile-role-user">{user.role || 'Bank Executive'}</p>
                            </div>
                        </div>
                        <div className="profile-details-user">
                            {hasValue(user.email) && (
                                <div className="profile-row-user">
                                    <div className="profile-field-user">
                                        <label>Email:</label>
                                        <span>{user.email}</span>
                                    </div>
                                    {hasValue(user.phoneNumber) && (
                                        <div className="profile-field-user">
                                            <label>Phone Number:</label>
                                            <span>{user.phoneNumber}</span>
                                        </div>
                                    )}
                                     {hasValue(user.bank) && (
                                    <div className="profile-field-user">
                                        <label>Bank:</label>
                                        <span>{user.bank}</span>
                                    </div>
                            )}
                                </div>
                            )}
                           
                            {(hasValue(user.state) || hasValue(user.branch)) && (
                                <div className="profile-row-user">
                                    {hasValue(user.state) && (
                                        <div className="profile-field-user">
                                            <label>State:</label>
                                            <span>{user.state}</span>
                                        </div>
                                    )}
                                    {hasValue(user.branch) && (
                                        <div className="profile-field-user">
                                            <label>Branch:</label>
                                            <span>{user.branch}</span>
                                        </div>
                                    )}
                                    {hasValue(user.employeeId) && (
                                    <div className="profile-field-user">
                                        <label>Employee ID:</label>
                                        <span>{user.employeeId}</span>
                                    </div>
                            )}
                                </div>
                            )}
                            
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BankExecutiveProfile;
