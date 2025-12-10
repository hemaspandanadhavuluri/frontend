import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LeadForm from './LeadForm';

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
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={() => navigate(-1)} edge="start" color="inherit" aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {id ? 'Lead Details' : 'Create New Lead'}
                    </Typography>
                </Toolbar>
            </AppBar>
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