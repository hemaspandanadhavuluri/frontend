import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, IconButton, Typography, Box, createTheme, ThemeProvider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LeadForm from './LeadForm';
import BankLeadForm from './BankLeadForm';
import logo from './logo.jpeg';

// --- Custom Theme with Logo Colors ---
const theme = createTheme({
    palette: {
        primary: {
            main: '#ec4c23', // Orange
        },
        secondary: {
            main: '#4f2b68', // Purple
        },
    },
});

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
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <IconButton onClick={() => navigate(-1)} edge="start" color="inherit" aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Box component="img" src={logo} alt="Logo" sx={{ height: 30, mr: 2, ml: 2 }} />
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
        </ThemeProvider>
    );
};

export default LeadDetailPage;