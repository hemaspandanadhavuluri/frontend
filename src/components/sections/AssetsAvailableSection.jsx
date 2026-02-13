import React from 'react';
import AssetCard from '../AssetCard';

const AssetsAvailableSection = ({
    lead,
    setLead,
    hasAssets,
    setHasAssets,
    updateAsset,
    removeAsset,
    addAsset,
    renderTextField,
    renderSelectField
}) => {
    return (
        <div className="section-block">
            <fieldset className="mb-4">
                <legend className="text-sm font-medium text-gray-700">Are assets available?</legend>
                <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center"><input type="radio" value="true" checked={hasAssets === true} onChange={(e) => setHasAssets(e.target.value === 'true')} className="form-radio" /> <span className="ml-2">Yes</span></label>
                    <label className="flex items-center"><input type="radio" value="false" checked={hasAssets === false} onChange={(e) => setHasAssets(e.target.value === 'true')} className="form-radio" /> <span className="ml-2">No</span></label>
                </div>
            </fieldset>

            {hasAssets && (
                <>
                    {lead.assets.map((asset, index) => (
                        <AssetCard
                            key={index}
                            asset={asset}
                            index={index}
                            onUpdate={updateAsset}
                            onRemove={removeAsset}
                            renderTextField={renderTextField}
                            renderSelectField={renderSelectField}
                        />
                    ))}
                    <button type="button" onClick={addAsset} className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Add Asset
                    </button>
                </>
            )}
        </div>
    );
};

export default AssetsAvailableSection;
