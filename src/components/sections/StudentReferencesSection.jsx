import React from 'react';
import { countryPhoneCodes, referenceRelationships } from '../../constants';
import './StudentReferencesSection.css';

const StudentReferencesSection = ({
    lead,
    handleNestedChange,
    renderTextField,
    renderSelectField,
    handleChange,
    countryPhoneCodes: codes
}) => {
    return (
        <div className="section-block">
            <div className="info-box">
                <p className="info-text">
                    References are people other than your parents and siblings who you know (e.g., friends, neighbours, relatives).
                    They will NOT be added to the loan; they are for contact purposes only if the student/family are not contactable.
                </p>
            </div>
            <h4 className="section-title">Student References</h4>
            {lead.references.map((ref, index) => (
                <div key={index} className="reference-card">
                    <h5 className="reference-title">Reference {index + 1}</h5>
                    <div className="reference-fields">
                        {renderTextField(`references[${index}].name`, "Name*", ref.name, (e) => handleNestedChange('references', e), "w-full sm:w-1/2 md:w-1/4")}
                        {renderSelectField(`references[${index}].relationship`, "Relationship*", ref.relationship, (e) => handleNestedChange('references', e), referenceRelationships, "w-full sm:w-1/2 md:w-1/4")}
                        {/* <div className="w-full sm:w-1/2 md:w-1/4">
                            <label>Relationship *</label>
                            <input type="text" value="Friend" disabled className="form-input" />
                        </div> */}
                        {renderTextField(`references[${index}].address`, "Address*", ref.address, (e) => handleNestedChange('references', e), "w-full sm:w-1/2 md:w-1/2")}
                        <div className="phone-field md:w-1/4">
                            <label className="phone-label">Phone Number *</label>
                            <div className="phone-input-group">
                                <select
                                    value={(ref.phoneNumber || '+91-').split('-')[0]}
                                    onChange={(e) => handleNestedChange('references', { target: { name: `references[${index}].phoneNumber`, value: `${e.target.value}-${(ref.phoneNumber || '').split('-')[1] || ''}` } })}
                                    className="country-code-select"
                                >
                                    {countryPhoneCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                </select>
                                <input
                                    type="text"
                                    value={(ref.phoneNumber || '').split('-')[1] || ''}
                                    onChange={(e) => handleNestedChange('references', { target: { name: `references[${index}].phoneNumber`, value: `${(ref.phoneNumber || '+91-').split('-')[0]}-${e.target.value}` } })}
                                    className="phone-number-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <hr className="section-divider" />
            <h4 className="section-title">Student PAN Details</h4>
            <fieldset className="pan-fieldset">
                <div className="radio-group">
                    <label className="radio-label"><input type="radio" name="panStatus" value="Not Interested" checked={lead.panStatus === 'Not Interested'} onChange={handleChange} className="radio-input" /> <span className="radio-text">Not Interested</span></label>
                    <label className="radio-label"><input type="radio" name="panStatus" value="Not Available" checked={lead.panStatus === 'Not Available'} onChange={handleChange} className="radio-input" /> <span className="radio-text">Not Available</span></label>
                    <label className="radio-label"><input type="radio" name="panStatus" value="Applied" checked={lead.panStatus === 'Applied'} onChange={handleChange} className="radio-input" /> <span className="radio-text">Applied</span></label>
                </div>
                {lead.panStatus === 'Applied' && <input type="text" placeholder="PAN Card Number" value={lead.panNumber} onChange={handleChange} name="panNumber" className="pan-input" />}
            </fieldset>
            <div className="jtc-info-section">
                <div className="jtc-step">
                  <h4>Step 1: JTC Introduction</h4>
                  <p>1. Best EduLoan suiting your profile</p>
                  <p>2. No service charges</p>
                </div>
                <div className="jtc-step">
                    <h4>Step 2: Benefits of JTC</h4>
                  <p>1. Convienient Process & negotiation support</p>
                  <p>2. Experienced in Handling Files</p>
                  <p>3. Upto 3000 Cashback</p>
                </div>
                <div className="jtc-step">
                    <h4>Step 3: Product Details</h4>
                  <p>1. Rate of Intrest</p>
                  <p>2. Moratorium period + Repayment Duration</p>
                  <p>3. Processing fee</p>
                </div>
            </div>
        </div>
    );
};

export default StudentReferencesSection;
