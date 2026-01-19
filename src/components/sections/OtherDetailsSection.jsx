import React from 'react';

const OtherDetailsSection = ({ lead, handleChange, renderTextField }) => {
    return (
        <div className="section-block">
            <h1 style={{ color: '#512967', fontWeight: 'bold', fontSize: '24px' }}>📋Other Details</h1>
            <div className="flex flex-wrap -mx-2 items-start">
                {renderTextField("age", "Age", lead.age, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                {renderTextField("workExperience", "Work Experience (in months)", lead.workExperience, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                {renderTextField("cibilScore", "CIBIL Score", lead.cibilScore, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                
                <fieldset style={{ width: '100%', padding: '8px' }}>
                        <legend className="text-sm font-medium text-gray-700">Is there any loan on the student?</legend>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center"><input type="radio" name="hasStudentLoans" value="true" checked={lead.hasStudentLoans === true} onChange={handleChange} className="form-radio" /> <span className="ml-2">Yes</span></label>
                            <label className="flex items-center"><input type="radio" name="hasStudentLoans" value="false" checked={lead.hasStudentLoans === false} onChange={handleChange} className="form-radio" /> <span className="ml-2">No</span></label>
                        </div>
                    </fieldset>
                    {lead.hasStudentLoans && renderTextField("studentLoanDetails", "Details about the loan", lead.studentLoanDetails, handleChange, "w-full", "e.g., Personal Loan, 2 Lakhs outstanding")}
            </div>
        </div>
    );
};

export default OtherDetailsSection;
