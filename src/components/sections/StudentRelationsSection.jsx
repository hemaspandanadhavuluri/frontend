import React from 'react';
import RelationCard from '../RelationCard';
import { EMPTY_LEAD_STATE, employmentTypes, referenceRelationships, countryPhoneCodes } from '../../constants';
import './StudentRelationsSection.css';

const StudentRelationsSection = ({
    lead,
    setLead,
    updateRelation,
    removeRelation,
    addRelation,
    handleNestedChange,
    renderTextField,
    renderSelectField,
    showOHGFields,
    setShowOHGFields,
    isSelectingOHG,
    setIsSelectingOHG,
    handleSelectOHG
}) => {
    return (
        <div className="section-block">
            {lead.relations.map((relation, index) => (
                <RelationCard
                    key={index}
                    relation={relation}
                    index={index}
                    onUpdate={updateRelation}
                    onRemove={removeRelation}
                    renderTextField={renderTextField}
                    renderSelectField={renderSelectField}
                    employmentTypes={employmentTypes}
                />
            ))}

            <button type="button" className="add-relation-btn" onClick={addRelation}>
                <svg className="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add New Relation
            </button>

            <div className="ohg-container">
                <h4 className="ohg-title">🏠 Own House Guarantor (OHG)</h4>
                <p className="ohg-note">
                    Note: Own house guarantor should be one of your family members or relatives who owns a house/flat.
                </p>
                <p className="ohg-note">This property is NOT taken as a collateral.</p>
                <a href="#" className="ohg-link" onClick={(e) => { e.preventDefault(); if (showOHGFields) { setShowOHGFields(false); setLead(prev => ({...prev, ownHouseGuarantor: EMPTY_LEAD_STATE.ownHouseGuarantor})); } else { setIsSelectingOHG(!isSelectingOHG); } }}>
                    {showOHGFields ? 'Hide Guarantor Fields' : 'Add/Change Own House Guarantor'}
                </a>

                {isSelectingOHG && !showOHGFields && (
                    <div className="relation-selector">
                        <p className="selector-text">Select a relation type:</p>
                        <div className="relation-buttons">
                            {['Father', 'Mother', 'Spouse', 'Brother', 'Uncle', 'Aunt'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className="relation-btn"
                                    onClick={() => handleSelectOHG(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {showOHGFields && (
                    <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
                        <h5 className="text-xl font-bold mb-4 text-blue-700">Own House Guarantor Details</h5>
                        <div className="flex flex-wrap -mx-2">
                            {renderTextField("name", "Guarantor Name", lead.ownHouseGuarantor.name, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderSelectField("relationshipType", "Relationship to Student", lead.ownHouseGuarantor.relationshipType, (e) => handleNestedChange('ownHouseGuarantor', e), ['Father', 'Mother', 'Spouse', 'Brother', 'Other', 'Uncle', 'Aunt', 'Cousin', 'Grandparent', 'Other Relative'], "w-full sm:w-1/2 md:w-1/4")}
                            <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guarantor Phone Number</label>
                                <div className="flex">
                                    <select
                                        value={(lead.ownHouseGuarantor.phoneNumber || '+91-').split('-')[0]}
                                        onChange={(e) => handleNestedChange('ownHouseGuarantor', { target: { name: 'phoneNumber', value: `${e.target.value}-${(lead.ownHouseGuarantor.phoneNumber || '').split('-')[1] || ''}` } })}
                                        className="p-2 border border-gray-300 rounded-l-md bg-gray-50"
                                    >
                                        {countryPhoneCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                    </select>
                                    <input
                                        type="text"
                                        value={(lead.ownHouseGuarantor.phoneNumber || '').split('-')[1] || ''}
                                        onChange={(e) => handleNestedChange('ownHouseGuarantor', { target: { name: 'phoneNumber', value: `${(lead.ownHouseGuarantor.phoneNumber || '+91-').split('-')[0]}-${e.target.value}` } })}
                                        className="w-full p-2 border-t border-b border-r border-gray-300 rounded-r-md"
                                    />
                                </div>
                            </div>
                            {renderSelectField("employmentType", "Employment Type", lead.ownHouseGuarantor.employmentType, (e) => handleNestedChange('ownHouseGuarantor', e), employmentTypes, "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("annualIncome", "Annual Income (lacs)", lead.ownHouseGuarantor.annualIncome, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("currentObligations", "Current Obligations", lead.ownHouseGuarantor.currentObligations, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                            {renderTextField("cibilScore", "CIBIL Score", lead.ownHouseGuarantor.cibilScore, (e) => handleNestedChange('ownHouseGuarantor', e), "w-full sm:w-1/2 md:w-1/4")}
                            <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                                <fieldset>
                                    <legend className="text-sm font-medium text-gray-700">CIBIL Issues?</legend>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="flex items-center"><input type="radio" name="hasCibilIssues" value="true" checked={lead.ownHouseGuarantor.hasCibilIssues === true} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} className="form-radio" /> <span className="ml-2">Yes</span></label>
                                        <label className="flex items-center"><input type="radio" name="hasCibilIssues" value="false" checked={lead.ownHouseGuarantor.hasCibilIssues === false} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} className="form-radio" /> <span className="ml-2">No</span></label>
                                    </div>
                                </fieldset>
                                {lead.ownHouseGuarantor.hasCibilIssues && <input type="text" name="cibilIssues" placeholder="CIBIL Issues" value={lead.ownHouseGuarantor.cibilIssues} onChange={(e) => handleNestedChange('ownHouseGuarantor', e)} className="mt-2 w-full p-2 border border-gray-300 rounded-md" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRelationsSection;
