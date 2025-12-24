import React from 'react';
import Accordion from '../Accordion';
import { currencies } from '../../constants';

const FinancialDetailsSection = ({
    lead,
    handleChange,
    renderTextField,
    renderSelectField,
    totalFee,
    activeConverter,
    setActiveConverter,
    isConversionRateEditable,
    setIsConversionRateEditable
}) => {
    return (
        <Accordion title="Course & Financial Details" icon="📄">
            <div className="flex flex-wrap -mx-2 items-start">
                <div className="w-full p-2 mb-4 border-b pb-4">
                    <h4 className="font-bold text-gray-800 mb-2">Tuition Fee Options</h4>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setActiveConverter(null)} className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center justify-center shadow-sm ${!activeConverter ? 'bg-green-600 text-white font-bold ring-2 ring-offset-1 ring-green-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                            <span className="font-bold text-lg mr-2">₹</span>
                            Enter in INR
                        </button>
                        {currencies.map(c => (
                            <button type="button" key={c.code} onClick={() => setActiveConverter(c.code)} className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 flex items-center justify-center shadow-sm ${activeConverter === c.code ? 'bg-blue-600 text-white font-bold ring-2 ring-offset-1 ring-blue-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                                <span className="font-bold text-lg mr-2">{c.symbol}</span>
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {activeConverter && (
                        <div className="flex flex-wrap -mx-2 items-end bg-gray-50 p-4 rounded-lg mt-4">
                            {renderTextField("originalFee", `Tuition Fee (in ${activeConverter})`, lead.originalFee, handleChange, "w-full sm:w-1/2 md:w-1/3")}
                            <div className="p-2 w-full sm:w-1/2 md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Rate</label>
                                <div className="flex items-center">
                                    <input type="text" name="conversionRate" value={lead.conversionRate} onChange={handleChange} readOnly={!isConversionRateEditable} className={`w-full p-2 border rounded-md ${!isConversionRateEditable ? 'bg-gray-100' : 'bg-white'}`} />
                                    <button type="button" onClick={() => setIsConversionRateEditable(!isConversionRateEditable)} className="ml-2 p-1 text-xs bg-gray-200 hover:bg-gray-300 rounded">
                                        {isConversionRateEditable ? 'Lock' : 'Edit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-2 w-full sm:w-1/2 md:w-1/4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee (in Lakhs)</label>
                    <input
                        type="text"
                        name="fee"
                        value={lead.fee}
                        onChange={handleChange}
                        readOnly={!!activeConverter}
                        className={`w-full p-2 border rounded-md ${!!activeConverter ? 'bg-gray-100' : 'bg-white'}`}
                    />
                </div>
                {renderTextField("living", "Living (in Lakhs)", lead.living, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                {renderTextField("otherExpenses", "Other Expenses (in Lakhs)", lead.otherExpenses, handleChange, "w-full sm:w-1/2 md:w-1/4")}
                {renderTextField("loanAmountRequired", "Loan Amount Required (Lakhs)", lead.loanAmountRequired, handleChange, "w-full sm:w-1/2 md:w-1/4")}

                <div className="p-2 w-full md:w-1/4 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Loan Amount (in Lakhs)</label>
                    <input type="text" value={totalFee.toFixed(2)} readOnly className="w-full p-2 bg-gray-200 border border-gray-300 rounded-md font-bold text-lg" />
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min((totalFee / 200) * 100, 100)}%` }}></div>
                    </div>
                </div>
            </div>
        </Accordion>
    );
};

export default FinancialDetailsSection;