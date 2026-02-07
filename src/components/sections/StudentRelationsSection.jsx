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
        <div className="StudentRelationsSection-section-block">
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

            <button type="button" className="StudentRelationsSection-add-relation-btn" onClick={addRelation}>
                <svg className="StudentRelationsSection-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Relation
            </button>

            <div className="StudentRelationsSection-ohg-container">
                <h4 className="StudentRelationsSection-ohg-title">🏠 Own House Guarantor (OHG)</h4>

                <p className="StudentRelationsSection-ohg-note">
                    Note: Own house guarantor should be one of your family members or relatives who owns a house/flat.
                </p>
                <p className="StudentRelationsSection-ohg-note">This property is NOT taken as a collateral.</p>

                <a
                    href="#"
                    className="StudentRelationsSection-ohg-link"
                    onClick={(e) => {
                        e.preventDefault();
                        if (showOHGFields) {
                            setShowOHGFields(false);
                            setLead(prev => ({ ...prev, ownHouseGuarantor: EMPTY_LEAD_STATE.ownHouseGuarantor }));
                        } else {
                            setIsSelectingOHG(!isSelectingOHG);
                        }
                    }}
                >
                    {showOHGFields ? 'Hide Guarantor Fields' : 'Add/Change Own House Guarantor'}
                </a>

                {isSelectingOHG && !showOHGFields && (
                    <div className="StudentRelationsSection-relation-selector">
                        <p className="StudentRelationsSection-selector-text">Select a relation type:</p>

                        <div className="StudentRelationsSection-relation-buttons">
                            {['Father', 'Mother', 'Spouse', 'Brother', 'Uncle', 'Aunt'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className="StudentRelationsSection-relation-btn"
                                    onClick={() => handleSelectOHG(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {showOHGFields && (
                    <div className="StudentRelationsSection-ohg-details">
                        <h5 className="StudentRelationsSection-ohg-details-title">
                            Own House Guarantor Details
                        </h5>

                        <div className="StudentRelationsSection-ohg-fields">
                            {renderTextField("name", "Guarantor Name", lead.ownHouseGuarantor.name, (e) => handleNestedChange('ownHouseGuarantor', e))}
                            {renderSelectField("relationshipType", "Relationship to Student", lead.ownHouseGuarantor.relationshipType, (e) => handleNestedChange('ownHouseGuarantor', e), referenceRelationships)}
                            {renderSelectField("employmentType", "Employment Type", lead.ownHouseGuarantor.employmentType, (e) => handleNestedChange('ownHouseGuarantor', e), employmentTypes)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRelationsSection;
