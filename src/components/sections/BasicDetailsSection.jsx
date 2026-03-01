import React, { useState, useEffect } from 'react';
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
    indianCities,
    disabled = false,
    enableOnlyEmptyFields = false
}) => {

    // Store initial field values when component mounts
    const [initialFieldValues, setInitialFieldValues] = useState({});

    useEffect(() => {
        // Capture initial field values when lead data is first available
        if (lead && Object.keys(initialFieldValues).length === 0) {
            const initialValues = {
                fullName: lead.fullName,
                email: lead.email,
                source: lead.source?.source,
                permanentLocation: lead.permanentLocation,
                state: lead.state,
                regionalHead: lead.regionalHead,
                region: lead.region,
                planningToStudy: lead.planningToStudy,
                mobileNumbers: lead.mobileNumbers,
            };
            setInitialFieldValues(initialValues);
        }
    }, [lead]);

    // Helper function to check if a mobile number had value initially
    const isMobileNumberInitiallyFilled = (mobile, index) => {
        if (!enableOnlyEmptyFields) return disabled;
        const initialMobiles = initialFieldValues.mobileNumbers || [];
        if (initialMobiles[index]) {
            const parts = initialMobiles[index].split('-');
            const num = parts.length > 1 ? parts[1] : initialMobiles[index];
            return !!num && num.trim() !== '';
        }
        return false;
    };

    // Helper function to determine if a field should be disabled
    // If enableOnlyEmptyFields is true:
    //   - If field had value initially → disabled (read-only)
    //   - If field was empty initially → enabled (can edit, even after filling)
    // If enableOnlyEmptyFields is false:
    //   - Use the disabled prop value
    const isFieldDisabled = (fieldName, fieldValue) => {
        if (!enableOnlyEmptyFields) {
            return disabled;
        }
        // Check if the field had a value initially (when component mounted)
        const initialValue = initialFieldValues[fieldName];
        const hadValueInitially = initialValue !== undefined && initialValue !== null && initialValue !== '';
        return hadValueInitially;
    };

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
                {renderTextField("fullName", "Full Name *", lead.fullName, handleChange, "field-container", "", isFieldDisabled("fullName", lead.fullName))}
                
                {/* Email field: if empty, enable with blinking effect and show mobile-based placeholder */}
                {(() => {
                    const isEmailEmpty = !lead.email || lead.email.trim() === '';
                    
                    // Get first mobile number and extract digits after country code
                    let mobileNumber = '';
                    
                    if (lead.mobileNumbers && lead.mobileNumbers.length > 0) {
                        const firstMobile = lead.mobileNumbers[0];
                        if (firstMobile) {
                            // Handle different formats: "+91-9876543210" or "+91-9876543210 " or just "9876543210"
                            const mobileParts = firstMobile.split('-');
                            if (mobileParts.length > 1) {
                                // Format is "+91-number" - get the number part after the dash
                                mobileNumber = mobileParts[1]?.replace(/\s/g, '') || '';
                            } else {
                                // Try to extract just digits from the string
                                const digitsOnly = firstMobile.replace(/\D/g, '');
                                if (digitsOnly.length >= 10) {
                                    mobileNumber = digitsOnly.slice(-10); // Get last 10 digits
                                }
                            }
                        }
                    }
                    
                    // Create email placeholder from student's mobile number (use last 10 digits if longer)
                    const displayMobile = mobileNumber.length > 10 ? mobileNumber.slice(-10) : mobileNumber;
                    const emailPlaceholder = displayMobile ? `${displayMobile}@gmail.com` : 'Enter email id';
                    
                    // If email is empty, field is enabled with blinking class
                    // If email exists, use normal disabled state
                    const isEmailDisabled = isEmailEmpty ? false : isFieldDisabled("email", lead.email);
                    const emailContainerClass = isEmailEmpty ? "field-container blinking-field" : "field-container";
                    
                    return renderTextField("email", "Email id *", lead.email, handleChange, emailContainerClass, emailPlaceholder, isEmailDisabled);
                })()}

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
                            disabled={isFieldDisabled("source", lead.source?.source)}
                        />
                    </div>
                )}

                {/* Mobile Numbers - Each number is disabled if it has a value, Add button always enabled */}
                <div className="mobile-wrapper">
                    <label className="mobile-title">Mobile Numbers</label>

                    <div className="mobile-list">
                        {lead.mobileNumbers.map((mobile, index) => {
                            const parts = mobile.split('-');
                            const code = parts.length > 1 ? parts[0] : '+91';
                            const num = parts.length > 1 ? parts[1] : mobile;
                            
                            // For mobile numbers: if enableOnlyEmptyFields is true, disable if had value initially
                            const isMobileDisabled = isMobileNumberInitiallyFilled(mobile, index);

                            return (
                                <div key={index} className="mobile-row">
                                    <div className="mobile-input-group">
                                        <select
                                            className="country-code"
                                            value={code}
                                            onChange={(e) =>
                                                handleMobileNumberChange(index, `${e.target.value}-${num || ''}`)
                                            }
                                            disabled={isMobileDisabled}
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
                                            disabled={isMobileDisabled}
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

            {renderAutocompleteField("permanentLocation", "Permanent Location in INDIA", lead.permanentLocation, handleChange, indianCities, "w-full", isFieldDisabled("permanentLocation", lead.permanentLocation))}
            {renderSelectField("state", "State", lead.state, handleChange, indianStates, "field-container", isFieldDisabled("state", lead.state))}
            {renderTextField("regionalHead", "Regional Head Name", lead.regionalHead, handleChange, "field-container", "", isFieldDisabled("regionalHead", lead.regionalHead))}
            {renderTextField("region", "Region Name", lead.region, handleChange, "field-container", "", isFieldDisabled("region", lead.region))}
            {renderSelectField("planningToStudy", "Planning to Study in", lead.planningToStudy, handleChange, ['India', 'Abroad'], "field-container", isFieldDisabled("planningToStudy", lead.planningToStudy))}
        </>
    );
};

export default BasicDetailsSection;
