import React from 'react';
import {
    Card,
    Typography,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    IconButton
} from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { assetTypes, physicalPropertyTypes, propertyAuthorities, licPolicyTypes } from '../constants';

const AssetCard = ({
    asset,
    index,
    onUpdate,
    onRemove,
    renderTextField,
    renderSelectField
}) => {

    const handleAssetChange = (e) => {
        onUpdate(index, e);
    };

    return (
        <Card variant="outlined" sx={{ my: 2, p: 2, bgcolor: '#f9f9f9', position: 'relative' }}>
            <IconButton
                aria-label="remove asset"
                onClick={() => onRemove(index)}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <RemoveCircleOutlineIcon color="error" />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>
                Asset {index + 1}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                {renderSelectField(`assetType`, "Asset Type", asset.assetType, handleAssetChange, assetTypes, { xs: '100%', sm: '50%', md: '33.33%' })}

                {/* Common Fields */}
                {asset.assetType && (
                    <>
                        {renderTextField(`ownerName`, "Owner Name", asset.ownerName, handleAssetChange, { xs: '100%', sm: '50%', md: '33.33%' })}
                        {renderTextField(`assetValue`, "Asset Value (in Lakhs)", asset.assetValue, handleAssetChange, { xs: '100%', sm: '50%', md: '33.33%' })}
                    </>
                )}

                {/* Conditional Fields for Physical Property */}
                {asset.assetType === 'Physical Property' && (
                    <>
                        {renderSelectField(`propertyType`, "Property Type", asset.propertyType, handleAssetChange, physicalPropertyTypes, { xs: '100%', sm: '50%', md: '33.33%' })}
                        {renderTextField(`pendingLoan`, "Pending Loan (if any)", asset.pendingLoan, handleAssetChange, { xs: '100%', sm: '50%', md: '33.33%' })}
                        {renderTextField(`locationPincode`, "Location Pincode", asset.locationPincode, handleAssetChange, { xs: '100%', sm: '50%', md: '33.33%' })}
                        <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '33.33%' }, boxSizing: 'border-box' }}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>Documents Available?</FormLabel>
                                <RadioGroup row name="documentsAvailable" value={String(asset.documentsAvailable)} onChange={handleAssetChange}>
                                    <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        {renderSelectField(`authority`, "Property Authority", asset.authority, handleAssetChange, propertyAuthorities, { xs: '100%', sm: '50%', md: '33.33%' })}
                    </>
                )}

                {/* Conditional Fields for Fixed Deposit */}
                {asset.assetType === 'Fixed Deposit' && (
                    <>
                        {renderTextField(`bankName`, "Bank Name", asset.bankName, handleAssetChange, { xs: '100%', sm: '50%', md: '33.33%' })}
                    </>
                )}

                {/* Conditional Fields for LIC Policy */}
                {asset.assetType === 'LIC Policy' && (
                    <>
                        {renderSelectField(`policyType`, "Policy Type", asset.policyType, handleAssetChange, licPolicyTypes, { xs: '100%', sm: '50%', md: '33.33%' })}
                    </>
                )}

                {/* No extra fields for Government Bond, as value and owner are common */}

            </Box>
        </Card>
    );
};

export default AssetCard;