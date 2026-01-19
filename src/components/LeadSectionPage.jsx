import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeadForm from './LeadForm';
import { Container } from '@mui/material';

const LeadSectionPage = () => {
    const { id, tab } = useParams();
    const navigate = useNavigate();

    const handleUpdate = () => {
        navigate(-1);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const leadData = id === 'new' ? {} : { _id: id };

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <LeadForm
                leadData={leadData}
                onUpdate={handleUpdate}
                onBack={handleBack}
                initialTab={tab}
            />
        </Container>
    );
};

export default LeadSectionPage;
