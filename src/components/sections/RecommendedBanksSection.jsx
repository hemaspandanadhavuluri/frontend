import React from 'react';

const RecommendedBanksSection = ({ lead, tiedUpBanks, handleOpenAssignModal }) => {
    // Separate assigned and unassigned banks
    const assignedBanks = tiedUpBanks.filter(bank => lead.assignedBanks?.some(b => b.bankId === bank._id));
    const unassignedBanks = tiedUpBanks.filter(bank => !lead.assignedBanks?.some(b => b.bankId === bank._id));

    return (
        <div className="section-block">
            <div>
                {/* Assigned Banks - Each in Full Row */}
                {assignedBanks.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-bold mb-4 text-gray-800">Assigned Banks</h4>
                        <div className="space-y-4">
                            {assignedBanks.map((bank) => (
                                <div key={bank._id} className="p-4 border rounded-lg shadow-sm bg-white w-full">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-bold text-base text-gray-900">{bank.name}</p>
                                            <div className="mt-2 p-2 bg-green-50 rounded-md text-xs">
                                                <p>Assigned To: <strong>{lead.assignedBanks.find(b => b.bankId === bank._id).assignedRMName}</strong></p>
                                                <p>Email: {lead.assignedBanks.find(b => b.bankId === bank._id).assignedRMEmail}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold inline-flex items-center py-1 px-2 rounded-full text-green-600 bg-green-200 ml-4">
                                            <svg className="w-4 h-4 mr-1" fill="#512967" viewBox="0 0 20 20"><path fillRule="#512967" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            Assigned
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Unassigned Banks in Grid */}
                <h4 className="font-bold mb-4 text-gray-800">Available Banks</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unassignedBanks.map((bank) => (
                        <div key={bank._id} className="p-4 border rounded-lg shadow-sm bg-white flex flex-col justify-between">
                            <div>
                                <p className="font-bold text-base text-gray-900">{bank.name}</p>
                            </div>
                            <button type="button" onClick={() => handleOpenAssignModal(bank)} className="mt-3 w-full px-3 py-1.5 text-white text-sm font-semibold rounded-md" style={{ background: '#512967' }}>
                                Assign to this Bank
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendedBanksSection;
