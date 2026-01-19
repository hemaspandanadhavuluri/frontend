import React from 'react';
import { courseStartQuarters, courseStartYears, degrees, fieldsOfInterest, admissionStatuses, allCountries, universities } from '../../constants';

const FurtherEducationSection = ({
    lead,
    setLead,
    handleChange,
    handleDateChange,
    renderSelectField,
    renderAutocompleteField,
    handleShowPrimeBanks,
    primeBankList,
    fetchedForUniversity
}) => {
    return (
        <div className="section-block">
            <h1 style={{ color: '#512967', fontWeight: 'bold' ,fontSize:'24px'}}>🎓Further Education Details</h1>
            <div className="further-education-fields">
                {renderSelectField("courseStartMonth", "Course Start Month", lead.courseStartMonth, handleChange, courseStartQuarters, "w-full sm:w-1/2 md:w-1/4")}
                {renderSelectField("courseStartYear", "Course Start Year", lead.courseStartYear, handleChange, courseStartYears, "w-full sm:w-1/2 md:w-1/4")}
                {renderSelectField("degree", "Degree", lead.degree, handleChange, degrees, "w-full sm:w-1/2 md:w-1/4")}
                {renderSelectField("fieldOfInterest", "Field of Interest", lead.fieldOfInterest, handleChange, fieldsOfInterest)}
                {renderAutocompleteField("interestedCountries", "Interested Countries", lead.interestedCountries, handleChange, allCountries)}
                {renderSelectField("admissionStatus", "Admission Status", lead.admissionStatus, handleChange, admissionStatuses)}
                
                {lead.admissionStatus === 'Applied - No Admit Yet' && (
                    <div className="date-field md:w-1/3">
                        <label className="date-label">Expected Admit Date</label>
                        <input
                            type="date"
                            value={lead.expectedAdmitDate ? new Date(lead.expectedAdmitDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange('expectedAdmitDate', e.target.value ? new Date(e.target.value) : null)}
                            className="form-input"
                        />
                    </div>
                )}
                {lead.admissionStatus === 'Not Yet Applied' && (
                    <div className="date-field md:w-1/3">
                        <label className="date-label">Expected Application Date</label>
                        <input
                            type="date"
                            value={lead.expectedApplicationDate ? new Date(lead.expectedApplicationDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleDateChange('expectedApplicationDate', e.target.value ? new Date(e.target.value) : null)}
                            className="form-input"
                        />
                    </div>
                )}

                {renderAutocompleteField("admittedUniversities", "Admitted Universities", lead.admittedUniversities, handleChange, universities, "w-full md:w-1/2")}
                
                <div className="p-2 w-full md:w-1/2">
                    <fieldset>
                        <legend className="text-sm font-medium text-gray-700">Has the student already approached any bank? *</legend>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center">
                                <input type="radio" name="approachedAnyBank" value="true" checked={lead.approachedAnyBank === true} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="approachedAnyBank" value="false" checked={lead.approachedAnyBank === false} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                    </fieldset>
                    {lead.approachedAnyBank && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Approached Banks</label>
                            {lead.approachedBanks.map((bank, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Bank Name"
                                            value={bank.bankName}
                                            onChange={(e) => {
                                                const newBanks = [...lead.approachedBanks];
                                                newBanks[index].bankName = e.target.value;
                                                setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                            }}
                                            className="flex-1 p-2 border border-gray-300 rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newBanks = lead.approachedBanks.filter((_, i) => i !== index);
                                                setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                            }}
                                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <fieldset className="mb-4">
                                        <legend className="text-sm font-medium text-gray-700">Has the file been logged in at {bank.bankName || 'this bank'}?</legend>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`fileLoggedIn-${index}`}
                                                    value="true"
                                                    checked={bank.fileLoggedIn === true}
                                                    onChange={(e) => {
                                                        const newBanks = [...lead.approachedBanks];
                                                        newBanks[index].fileLoggedIn = e.target.value === 'true';
                                                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                    }}
                                                    className="form-radio"
                                                />
                                                <span className="ml-2">Yes</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`fileLoggedIn-${index}`}
                                                    value="false"
                                                    checked={bank.fileLoggedIn === false}
                                                    onChange={(e) => {
                                                        const newBanks = [...lead.approachedBanks];
                                                        newBanks[index].fileLoggedIn = e.target.value === 'true';
                                                        setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                    }}
                                                    className="form-radio"
                                                />
                                                <span className="ml-2">No</span>
                                            </label>
                                        </div>
                                    </fieldset>

                                    {bank.fileLoggedIn === false && (
                                        <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 mb-4">
                                            <h4 className="font-bold">Advantages of going with Justap:</h4>
                                            <ul className="list-disc list-inside text-sm mt-2">
                                                <li>We have direct tie-ups which can speed up your application.</li>
                                                <li>Our expert team ensures your file is complete and correct, reducing rejection chances.</li>
                                                <li>You get a dedicated advisor to guide you through the entire process.</li>
                                            </ul>
                                        </div>
                                    )}

                                    {bank.fileLoggedIn === true && (
                                        <fieldset className="mb-4">
                                            <legend className="text-sm font-medium text-gray-700">Has the loan been sanctioned?</legend>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`loanSanctioned-${index}`}
                                                        value="true"
                                                        checked={bank.loanSanctioned === true}
                                                        onChange={(e) => {
                                                            const newBanks = [...lead.approachedBanks];
                                                            newBanks[index].loanSanctioned = e.target.value === 'true';
                                                            setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                        }}
                                                        className="form-radio"
                                                    />
                                                    <span className="ml-2">Yes</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={`loanSanctioned-${index}`}
                                                        value="false"
                                                        checked={bank.loanSanctioned === false}
                                                        onChange={(e) => {
                                                            const newBanks = [...lead.approachedBanks];
                                                            newBanks[index].loanSanctioned = e.target.value === 'true';
                                                            setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                        }}
                                                        className="form-radio"
                                                    />
                                                    <span className="ml-2">No</span>
                                                </label>
                                            </div>
                                        </fieldset>
                                    )}

                                    {bank.loanSanctioned === true && (
                                        <div className="p-4 border rounded-md bg-white space-y-4">
                                            <h4 className="font-bold text-gray-800">Sanction Details for {bank.bankName}</h4>
                                            <div className="flex flex-wrap -mx-2">
                                                <div className="p-2 w-full sm:w-1/2 md:w-1/3">
                                                    <label htmlFor={`rateOfInterest-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Rate of Interest (%)</label>
                                                    <input
                                                        type="text"
                                                        id={`rateOfInterest-${index}`}
                                                        name={`rateOfInterest-${index}`}
                                                        value={bank.sanctionDetails.rateOfInterest || ''}
                                                        onChange={(e) => {
                                                            const newBanks = [...lead.approachedBanks];
                                                            newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, rateOfInterest: e.target.value };
                                                            setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                        }}
                                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="p-2 w-full sm:w-1/2 md:w-1/3">
                                                    <label htmlFor={`loanAmount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (Lakhs)</label>
                                                    <input
                                                        type="text"
                                                        id={`loanAmount-${index}`}
                                                        name={`loanAmount-${index}`}
                                                        value={bank.sanctionDetails.loanAmount || ''}
                                                        onChange={(e) => {
                                                            const newBanks = [...lead.approachedBanks];
                                                            newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, loanAmount: e.target.value };
                                                            setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                        }}
                                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="p-2 w-full sm:w-1/2 md:w-1/3">
                                                    <label htmlFor={`coApplicant-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Co-Applicant</label>
                                                    <input
                                                        type="text"
                                                        id={`coApplicant-${index}`}
                                                        name={`coApplicant-${index}`}
                                                        value={bank.sanctionDetails.coApplicant || ''}
                                                        onChange={(e) => {
                                                            const newBanks = [...lead.approachedBanks];
                                                            newBanks[index].sanctionDetails = { ...newBanks[index].sanctionDetails, coApplicant: e.target.value };
                                                            setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                                        }}
                                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const newBanks = [...lead.approachedBanks, { bankName: '', fileLoggedIn: false, loanSanctioned: false, sanctionDetails: {} }];
                                    setLead(prev => ({ ...prev, approachedBanks: newBanks }));
                                }}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                + Add Bank
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
                Enter a university and click the button below to check the prime university list.
            </div>
            <button type="button" className="mt-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600" onClick={handleShowPrimeBanks}>PRIME UNIVERSITY LIST</button>

            {primeBankList.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-xl font-semibold mb-2">Prime Banks for "{fetchedForUniversity}"</h4>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max Loan Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {primeBankList.map((bank, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bank.bankName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{bank.maxLoanAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FurtherEducationSection;
