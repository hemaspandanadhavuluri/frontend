import React from 'react';

const BankSearchSection = ({
    bankSearchPincode,
    setBankSearchPincode,
    handleBankSearch,
    isBankSearching,
    bankSearchResults,
    bankSearchMessage,
    handleOpenAssignModal
}) => {
    return (
        <div className="section-block">
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={bankSearchPincode}
                    onChange={(e) => setBankSearchPincode(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="button" onClick={handleBankSearch} disabled={isBankSearching} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                    {isBankSearching ? 'Searching...' : 'Search Banks'}
                </button>
            </div>
            {bankSearchMessage && <p className="text-sm text-gray-600">{bankSearchMessage}</p>}
            {bankSearchResults.length > 0 && (
                <div className="mt-4 space-y-3">
                    <h4 className="text-lg font-semibold">Search Results for Pincode: {bankSearchPincode}</h4>
                    {bankSearchResults.map(bank => (
                        <div key={bank._id} className="p-4 border rounded-lg bg-gray-50">
                            <p className="font-bold text-blue-800">{bank.name}</p>
                            <div className="mt-2 pl-4 border-l-2 border-gray-300">
                                {bank.branches.filter(branch => branch.pincode === bankSearchPincode).map((branch, idx) => (
                                    <div key={idx} className="text-sm text-gray-700 mb-3 pb-2 border-b last:border-b-0">
                                        <p><strong>Branch:</strong> {branch.branchName}</p>
                                        <p><strong>IFSC:</strong> {branch.ifsc}</p>
                                        <p><strong>Address:</strong> {branch.address}</p>
                                        <p><strong>Location:</strong> {branch.city}, {branch.district}, {branch.state} - {branch.pincode}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BankSearchSection;
