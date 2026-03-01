import React, { useState } from 'react';
import { countryPhoneCodes as defaultCountryPhoneCodes } from '../../constants';
import './ReferFriendsSection.css';

const ReferFriendsSection = ({
    lead,
    setLead,
    handleNestedChange,
    handleCreateReferralLead,
    countryPhoneCodes
}) => {
    const phoneCodes = countryPhoneCodes || defaultCountryPhoneCodes;
    
    // State to track which referrals have leads created
    const [leadCreatedIndices, setLeadCreatedIndices] = useState([]);

    // Handler for creating lead and updating the state
    const handleCreateLead = async (ref, index) => {
        // Call the original handler
        await handleCreateReferralLead(ref);
        
        // Mark this referral as having a lead created
        if (!leadCreatedIndices.includes(index)) {
            setLeadCreatedIndices(prev => [...prev, index]);
        }
    };

    return (
        <div className="referFriendsSection__section-block">
            <div className="referFriendsSection__refer-friends-box">
                {lead.referralList.map((ref, index) => {
                    const isLeadCreated = leadCreatedIndices.includes(index);
                    
                    return (
                        <div className="referFriendsSection-item" key={index}>
                            <div className={`referFriendsSection__referral-card ${isLeadCreated ? 'lead-created' : ''}`}>
                                <h5 className="referFriendsSection__referral-title">
                                    Referral {index + 1}
                                </h5>

                                {/* Show "Lead Created" text when lead is created */}
                                {isLeadCreated && (
                                    <span className="referFriendsSection__lead-created-text">
                                        ✓ Lead Created
                                    </span>
                                )}

                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={ref.name || ''}
                                    name={`referralList[${index}].name`}
                                    onChange={(e) => handleNestedChange('referralList', e)}
                                    className="referFriendsSection__input"
                                    disabled={isLeadCreated}
                                />

                                <div className="referFriendsSection__phone-input-group">
                                    <select
                                        value={(ref.phoneNumber || '+91-').split('-')[0]}
                                        onChange={(e) =>
                                            handleNestedChange('referralList', {
                                                target: {
                                                    name: `referralList[${index}].phoneNumber`,
                                                    value: `${e.target.value}-${(ref.phoneNumber || '').split('-')[1] || ''}`
                                                }
                                            })
                                        }
                                        className="referFriendsSection__phone-country-select"
                                        disabled={isLeadCreated}
                                    >
                                        {phoneCodes.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.name} ({c.code})
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={(ref.phoneNumber || '').split('-')[1] || ''}
                                        onChange={(e) =>
                                            handleNestedChange('referralList', {
                                                target: {
                                                    name: `referralList[${index}].phoneNumber`,
                                                    value: `${(ref.phoneNumber || '+91-').split('-')[0]}-${e.target.value}`
                                                }
                                            })
                                        }
                                        className="referFriendsSection__phone-number-input"
                                        disabled={isLeadCreated}
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Code"
                                    value={ref.code || ''}
                                    name={`referralList[${index}].code`}
                                    onChange={(e) => handleNestedChange('referralList', e)}
                                    className="referFriendsSection__input"
                                    disabled={isLeadCreated}
                                />

                                {/* Hide the Create Lead button after lead is created */}
                                {!isLeadCreated && (
                                    <button
                                        type="button"
                                        className="referFriendsSection__create-lead-btn"
                                        onClick={() => handleCreateLead(ref, index)}
                                        disabled={!ref.name || !ref.phoneNumber}
                                    >
                                        Create Lead
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="referFriendsSection__add-referral-wrapper">
                <button
                    type="button"
                    className="referFriendsSection__add-referral-btn"
                    onClick={() =>
                        setLead((p) => ({
                            ...p,
                            referralList: [...p.referralList, { name: '', code: '', phoneNumber: '' }]
                        }))
                    }
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Referral
                </button>
            </div>
        </div>
    );
};

export default ReferFriendsSection;
