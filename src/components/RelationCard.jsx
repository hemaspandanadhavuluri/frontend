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
    Checkbox,
    IconButton
} from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const RelationCard = ({
    relation,
    index,
    onUpdate,
    onRemove,
    renderTextField,
    renderSelectField,
    employmentTypes
}) => {

    const handleRelationChange = (e) => {
        onUpdate(index, e);
    };

    return (
        <Card variant="outlined" sx={{ my: 2, p: 2, bgcolor: '#f9f9f9', position: 'relative' }}>
            <IconButton
                aria-label="remove relation"
                onClick={() => onRemove(index)}
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8 }}
            >
                <RemoveCircleOutlineIcon color="error" />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'info.main' }}>
                {relation.relationshipType || `Relation ${index + 1}`}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                {renderSelectField(`relationshipType`, "Relationship Type", relation.relationshipType, handleRelationChange, ['Father', 'Mother', 'Spouse', 'Brother', 'Sister', 'Guardian'], { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`name`, "Name", relation.name, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                {renderSelectField(`employmentType`, "Employment Type", relation.employmentType, handleRelationChange, employmentTypes, { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`annualIncome`, "Annual Income (lacs)", relation.annualIncome, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`phoneNumber`, "Phone Number", relation.phoneNumber, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`currentObligations`, "Current Obligations", relation.currentObligations, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                {renderTextField(`cibilScore`, "CIBIL Score", relation.cibilScore, handleRelationChange, { xs: '100%', sm: '50%', md: '25%' })}
                <Box sx={{ p: 1.5, width: { xs: '100%', sm: '50%', md: '25%' }, boxSizing: 'border-box' }}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>CIBIL Issues?</FormLabel>
                        <RadioGroup
                            row
                            name="hasCibilIssues"
                            value={String(relation.hasCibilIssues)}
                            onChange={handleRelationChange}
                        >
                            <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                            <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                        </RadioGroup>
                    </FormControl>
                    {relation.hasCibilIssues && (
                        <TextField fullWidth size="small" margin="dense" name="cibilIssues" label="CIBIL Issues" value={relation.cibilIssues} onChange={handleRelationChange} />
                    )}
                </Box>
                <Box sx={{ width: '100%', p: 1.5 }}>
                    <FormControlLabel
                        control={<Checkbox checked={relation.isCoApplicant} name="isCoApplicant" onChange={handleRelationChange} />}
                        label="This is a Co-applicant"
                    />
                </Box>
            </Box>
        </Card>
    );
};

export default RelationCard;