import React from 'react';
import { countryPhoneCodes as defaultCountryPhoneCodes } from '../../constants';

const ReferFriendsSection = ({
    lead,
    setLead,
    handleNestedChange,
    handleCreateReferralLead,
    countryPhoneCodes
}) => {
    const phoneCodes = countryPhoneCodes || defaultCountryPhoneCodes;
    return (
        <div className="section-block">
            <div className="flex flex-wrap -mx-2">
                {lead.referralList.map((ref, index) => (
                    <div className="p-2 w-full sm:w-1/2 md:w-1/3" key={index}>
                        <div className="p-4 border rounded-lg h-full flex flex-col">
                            <h5 className="font-bold mb-2 text-blue-700">Referral {index + 1}</h5>
                            <input type="text" placeholder="Name" value={ref.name || ''} name={`referralList[${index}].name`} onChange={(e) => handleNestedChange('referralList', e)} className="w-full p-2 border rounded-md mb-2" />
                            <div className="flex mb-2">
                                <select
                                    value={(ref.phoneNumber || '+91-').split('-')[0]}
                                    onChange={(e) => handleNestedChange('referralList', { target: { name: `referralList[${index}].phoneNumber`, value: `${e.target.value}-${(ref.phoneNumber || '').split('-')[1] || ''}` } })}
                                    className="border border-gray-300 rounded-l-md bg-gray-50" style= {{width: '60px'}}
                                >
                                    {phoneCodes.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={(ref.phoneNumber || '').split('-')[1] || ''}
                                    onChange={(e) => handleNestedChange('referralList', { target: { name: `referralList[${index}].phoneNumber`, value: `${(ref.phoneNumber || '+91-').split('-')[0]}-${e.target.value}` } })}
                                    className="w-full p-2 border-t border-b border-r border-gray-300 rounded-r-md"
                                />
                            </div>
                            <input type="text" placeholder="Code" value={ref.code || ''} name={`referralList[${index}].code`} onChange={(e) => handleNestedChange('referralList', e)} className="w-full p-2 border rounded-md" />
                            <button type="button" className="mt-4 px-3 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 disabled:bg-gray-400" onClick={() => handleCreateReferralLead(ref)} disabled={!ref.name || !ref.phoneNumber}>
                                Create Lead
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-center">
                <button type="button" className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center" onClick={() => setLead(p => ({...p, referralList: [...p.referralList, { name: "", code: "", phoneNumber: "" }] }))}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Referral
                </button>
            </div>
        </div>
    );
};

export default ReferFriendsSection;
