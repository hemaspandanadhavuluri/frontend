import React from 'react';
import { regions, countryPhoneCodes } from '../../constants';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import "./BasicDetailsSection.css";

const BasicDetailsSection = ({
    lead,
    setLead,
    handleChange,
    renderTextField,
    renderSelectField,
    renderAutocompleteField,
    indianStates,
    indianCities
}) => {

    const handleMobileNumberChange = (index, value) => {
        const newMobileNumbers = [...lead.mobileNumbers];
        newMobileNumbers[index] = value;
        setLead(p => ({ ...p, mobileNumbers: newMobileNumbers }));
    };

    const addMobileNumber = () => {
        setLead(p => ({ ...p, mobileNumbers: [...p.mobileNumbers, '+91-'] }));
    };

    const removeMobileNumber = (index) => {
        const newMobileNumbers = lead.mobileNumbers.filter((_, i) => i !== index);
        setLead(p => ({ ...p, mobileNumbers: newMobileNumbers }));
    };

    return (
        <>
            <h2 className="basic-details-section-title">👤 Basic Details</h2>

            <div className="form-row">
                {renderTextField("fullName", "Full Name *", lead.fullName, handleChange)}
                {renderTextField("email", "Email id *", lead.email, handleChange)}

                {!lead._id && (
                    <div className="field-wrapper">
                        <label className="field-label">Source</label>
                        <input
                            type="text"
                            name="source"
                            value={lead.source?.source || ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setLead(prev => ({
                                    ...prev,
                                    source: { ...prev.source, source: newValue }
                                }));
                            }}
                            className="field-input"
                        />
                    </div>
                )}

                {/* Mobile Numbers */}
                <div className="mobile-wrapper">
                    <label className="mobile-title">Mobile Numbers</label>

                    <div className="mobile-list">
                        {lead.mobileNumbers.map((mobile, index) => {
                            const parts = mobile.split('-');
                            const code = parts.length > 1 ? parts[0] : '+91';
                            const num = parts.length > 1 ? parts[1] : mobile;

                            return (
                                <div key={index} className="mobile-row">
                                    <div className="mobile-input-group">
                                        <select
                                            className="country-code"
                                            value={code}
                                            onChange={(e) =>
                                                handleMobileNumberChange(index, `${e.target.value}-${num || ''}`)
                                            }
                                        >
                                            {countryPhoneCodes.map(country => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name} ({country.code})
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            className="mobile-input"
                                            placeholder="Enter mobile number"
                                            value={num || ''}
                                            onChange={(e) =>
                                                handleMobileNumberChange(index, `${code}-${e.target.value}`)
                                            }
                                        />
                                    </div>

                                    {lead.mobileNumbers.length > 1 && (
                                        <button
                                            type="button"
                                            className="icon-btn danger"
                                            onClick={() => removeMobileNumber(index)}
                                        >
                                            <RemoveCircleOutlineIcon />
                                        </button>
                                    )}

                                    {index === lead.mobileNumbers.length - 1 && (
                                        <button
                                            type="button"
                                            className="icon-btn primary"
                                            onClick={addMobileNumber}
                                        >
                                            <AddIcon />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {renderAutocompleteField("permanentLocation", "Permanent Location in INDIA", lead.permanentLocation, handleChange, indianCities, "w-full")}
            {renderSelectField("state", "State", lead.state, handleChange, indianStates)}
            {renderTextField("regionalHead", "Regional Head Name", lead.regionalHead, handleChange)}
            {renderTextField("region", "Region Name", lead.region, handleChange)}
            {renderSelectField("planningToStudy", "Planning to Study in", lead.planningToStudy, handleChange, ['India', 'Abroad'])}
        </>
    );
};

export default BasicDetailsSection;
