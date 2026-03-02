import React from 'react';
import '../profile_user.css';

const AssignerProfile = ({ currentUser, onClose }) => {
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
                                <p className="profile-role-user">{user.role || 'Assigner'}</p>
                            </div>
                        </div>
                        <div className="profile-details-user">
                            
                                <div className="profile-row-user">
                                    <div className="profile-field-user">
                                        <label>Email:</label>
                                        <span>{user.email}</span>
                                    </div>
                                    
                                        <div className="profile-field-user">
                                            <label>Phone Number:</label>
                                            <span>{user.phoneNumber}</span>
                                        </div>
                                     <div className="profile-field-user">
                                        <label>Date of Birth:</label>
                                        <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                                    </div>
                                </div>
                           
                                
                            
                                <div className="profile-row-user">
                                   
                                        <div className="profile-field-user">
                                            <label>Gender:</label>
                                            <span>{user.gender}</span>
                                        </div>
                                   
                                        <div className="profile-field-user">
                                            <label>PAN Number:</label>
                                            <span>{user.panNumber}</span>
                                        </div>
                                        <div className="profile-field-user">
                                        <label>Aadhar Number:</label>
                                        <span>{user.aadharNumber}</span>
                                    </div>
                                    
                                </div>
                           
                                
                                <div className="profile-row-user">
                                    <div className="profile-field-user">
                                        <label>Current Address:</label>
                                        <span>{user.currentAddress}</span>
                                    </div>
                                     <div className="profile-field-user">
                                        <label>Permanent Address:</label>
                                        <span>{user.permanentAddress}</span>
                                    </div>
                                     <div className="profile-field-user">
                                        <label>Zone:</label>
                                        <span>{user.zone}</span>
                                    </div>
                                </div>
                            
                                <div className="profile-row-user">
                                   
                                        <div className="profile-field-user">
                                            <label>Region:</label>
                                            <span>{user.region}</span>
                                        </div>
                                   
                                        <div className="profile-field-user">
                                            <label>Employee ID:</label>
                                            <span>{user.employeeId}</span>
                                        </div>
                                          <div className="profile-field-user">
                                        <label>Bank:</label>
                                        <span>{user.bank}</span>
                                    </div>
                                    
                                </div>
                           
                               
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AssignerProfile;
