import React from 'react';
import { courseDurations, currencies } from '../../constants';
import './CourseDetailsSection.css';

const CourseDetailsSection = ({
    lead,
    handleChange,
    renderTextField,
    renderSelectField,
    setActiveConverter,
    activeConverter,
    isConversionRateEditable,
    setIsConversionRateEditable,
    totalFee
}) => {
    return (
        <div className="section-block">
            <h4 className="section-title">Tuition Fee Options</h4>

            {/* Currency Buttons */}
            <div className="currency-buttons">
                <button
                    type="button"
                    onClick={() => setActiveConverter(null)}
                    className={`currency-btn ${!activeConverter ? 'currency-btn-active' : 'currency-btn-inactive'}`}
                >
                    ₹ Enter in INR
                </button>

                {currencies.map(c => (
                    <button
                        key={c.code}
                        type="button"
                        onClick={() => setActiveConverter(c.code)}
                        className={`currency-btn ${activeConverter === c.code ? 'currency-btn-active' : 'currency-btn-inactive'}`}
                    >
                        {c.symbol} {c.label}
                    </button>
                ))}
            </div>

            {/* Converter Section */}
            {activeConverter && (
                <div className="converter-section">
                    <div className="converter-row">
                        {renderTextField(
                            "originalFee",
                            `Tuition Fee (in ${activeConverter})`,
                            lead.originalFee,
                            handleChange
                        )}

                        <div className="converter-rate">
                            <label className="form-label">Conversion Rate</label>
                            <div className="rate-input-wrapper">
                                <input
                                    type="text"
                                    name="conversionRate"
                                    value={lead.conversionRate}
                                    onChange={handleChange}
                                    readOnly={!isConversionRateEditable}
                                    className={`rate-input ${!isConversionRateEditable ? 'readonly' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsConversionRateEditable(!isConversionRateEditable)}
                                    className="edit-btn"
                                >
                                    {isConversionRateEditable ? 'Lock' : 'Edit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Form Grid */}
            <div className="course-details-grid">
                {renderSelectField(
                    "courseDuration",
                    "Course Duration",
                    lead.courseDuration,
                    handleChange,
                    courseDurations
                )}

                <div className="tution-fee">
                    <label className="form-label">Tuition Fee (in Lakhs)</label>
                    <input
                        type="text"
                        name="fee"
                        value={lead.fee}
                        onChange={handleChange}
                        readOnly={!!activeConverter}
                        className={`form-input ${activeConverter ? 'readonly' : ''}`}
                    />
                </div>

                {renderTextField("living", "Living (in Lakhs)", lead.living, handleChange)}
                {renderTextField("otherExpenses", "Other Expenses (in Lakhs)", lead.otherExpenses, handleChange)}
                {renderTextField("loanAmountRequired", "Loan Amount Required (Lakhs)", lead.loanAmountRequired, handleChange)}
            </div>

            {/* Total Section */}
            <div className="total-amount-section">
                <label className="form-label">Total Loan Amount (in Lakhs)</label>
                <input
                    type="text"
                    value={totalFee.toFixed(2)}
                    readOnly
                    className="total-amount-input"
                />
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${Math.min((totalFee / 200) * 100, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsSection;
