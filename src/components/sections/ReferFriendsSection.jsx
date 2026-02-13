import React from 'react';
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

    return (
        <div className="referFriendsSection__section-block">
            <div className="referFriendsSection__refer-friends-box">
                {lead.referralList.map((ref, index) => (
                    <div className="referFriendsSection-item" key={index}>
                        <div className="referFriendsSection__referral-card">
                            <h5 className="referFriendsSection__referral-title">
                                Referral {index + 1}
                            </h5>

                            <input
                                type="text"
                                placeholder="Name"
                                value={ref.name || ''}
                                name={`referralList[${index}].name`}
                                onChange={(e) => handleNestedChange('referralList', e)}
                                className="referFriendsSection__input"
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
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Code"
                                value={ref.code || ''}
                                name={`referralList[${index}].code`}
                                onChange={(e) => handleNestedChange('referralList', e)}
                                className="referFriendsSection__input"
                            />

                            <button
                                type="button"
                                className="referFriendsSection__create-lead-btn"
                                onClick={() => handleCreateReferralLead(ref)}
                                disabled={!ref.name || !ref.phoneNumber}
                            >
                                Create Lead
                            </button>
                        </div>
                    </div>
                ))}
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
