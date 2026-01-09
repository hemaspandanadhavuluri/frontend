import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LeadForm from './LeadForm';
import BankLeadForm from './BankLeadForm';

const LeadDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [userRole, setUserRole] = React.useState('');

    React.useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (storedUser) setUserRole(storedUser.role);
    }, []);

    // The onUpdate handler can now simply close the tab or navigate back
    const handleUpdate = () => {
        // You can add a success message here if desired
        // For now, let's navigate back to the dashboard
        navigate('/');
    };

    // Determine if the form should be in read-only mode
    const isReadOnly = location.pathname.endsWith('/view');

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={() => navigate(-1)} edge="start" color="inherit" aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {id ? (isReadOnly ? 'View Lead Details' : 'Edit Lead') : 'Create New Lead'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth={false} sx={{ mt: 2, mb: 4 }}>
                {userRole === 'BankExecutive' ? (
                    <BankLeadForm 
                        leadData={{ _id: id }} 
                        onUpdate={handleUpdate}
                        onBack={() => navigate(-1)}
                    />
                ) : (
                    <LeadForm 
                        leadData={{ _id: id }} // Pass the ID to the form
                        isReadOnly={isReadOnly} // Pass the read-only flag
                        onUpdate={handleUpdate} 
                        onBack={() => navigate(-1)} // Go back to the previous page
                    />
                )}
            </Container>
        </>
    );
};

export default LeadDetailPage;