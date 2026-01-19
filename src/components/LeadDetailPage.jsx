import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import LeadForm from './LeadForm';

const styles={

}

const LeadDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // The onUpdate handler can now simply close the tab or navigate back
    const handleUpdate = () => {
        // You can add a success message here if desired
        // For now, let's navigate back to the dashboard
        navigate('/');
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
                <LeadForm 
                    leadData={{ _id: id }} // Pass the ID to the form
                    onUpdate={handleUpdate} 
                    onBack={() => navigate(-1)} // Go back to the previous page
                />
            </Container>
        </>
    );
};

export default LeadDetailPage;