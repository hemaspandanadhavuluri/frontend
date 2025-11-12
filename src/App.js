// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // 1. Import Router and useNavigate
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import your components
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import HrPanel from './components/HrPanel';
import EmployeeLogin from './components/EmployeeLogin';
import BankLogin from './components/BankLogin';
import BankExecutivePanel from './components/BankExecutivePanel';

const AppContent = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    // This effect will run when currentUser state changes, handling redirection.
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'BankExecutive') {
                navigate('/bank-panel');
            } else {
                // Redirect all other logged-in users to the main dashboard
                navigate('/');
            }
        }
    }, [currentUser, navigate]);

    // ... rest of the App logic will be moved inside here
    // For now, we just need to wrap the existing App component's return
};

const App = () => {
    // State to hold the ID of the currently selected lead (or null if none)
    const [selectedLead, setSelectedLead] = useState(null);
    const [leads, setLeads] = useState([]); // To hold all leads for the dashboard

    // State for employee authentication
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Add useNavigate hook

    // Handler to open the flyout
    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
    };

    // Handler to close the flyout
    const handleCloseFlyout = () => {
        setSelectedLead(null);
    };

    // Handler to update the list of leads after an edit or create
    const handleUpdateLeadList = (updatedLead) => {
        const leadIndex = leads.findIndex(lead => lead._id === updatedLead._id);
        
        if (leadIndex > -1) {
            // Update existing lead
            const newLeads = [...leads];
            // The dashboard shows a subset of fields, so we need to merge
            // to preserve the full object for the form while updating the list item.
            newLeads[leadIndex] = { 
                ...newLeads[leadIndex], // Keep existing data from dashboard fetch
                ...updatedLead          // Overwrite with fresh data from the update response
            };
            setLeads(newLeads);
        } else {
            // Add new lead to the top of the list
            setLeads([updatedLead, ...leads]);
        }
        handleCloseFlyout(); // Close the modal after update/create
    };

    // Check if the flyout is open by seeing if an object is selected
    const isFlyoutOpen = !!selectedLead;

    // Check for existing login on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('employeeUser');
            }
        }
    }, []);

    // This effect will run when isLoggedIn state changes, handling redirection.
    useEffect(() => {
        if (isLoggedIn && currentUser) {
            if (currentUser.role === 'BankExecutive') {
                navigate('/bank-panel');
            } else {
                // For other roles, they are likely already on '/' or will be.
                // A specific redirect can be added if needed, e.g., navigate('/');
            }
        }
    }, [isLoggedIn, currentUser, navigate]);

    // Handler for successful login
    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
    };

    // Handler for logout
    const handleLogout = () => {
        localStorage.removeItem('employeeUser');
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    return (
        <>
            <Routes>
                {/* Public Login Routes */}
                <Route path="/login" element={<EmployeeLogin onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/bank-login" element={<BankLogin onLoginSuccess={handleLoginSuccess} />} />

                {/* Protected Routes */}
                {isLoggedIn ? (
                    <>
                        {currentUser?.role === 'BankExecutive' ? (
                            // Bank Executive gets a single route
                            <Route path="/bank-panel" element={<BankExecutivePanel onLogout={handleLogout} />} />
                        ) : (
                            // Internal employees get their set of routes
                            <>
                                <Route 
                                    path="/" 
                                    element={<Dashboard 
                                        onSelectLead={handleSelectLead} 
                                        onLogout={handleLogout} 
                                        leads={leads} 
                                        setLeads={setLeads} />} 
                                />
                                <Route path="/hr-panel" element={<HrPanel />} />
                            </>
                        )}
                    </>
                ) : (
                    // If not logged in, default to the employee login page
                    <Route path="*" element={<EmployeeLogin onLoginSuccess={handleLoginSuccess} />} />
                )}
            </Routes>

            {/* Flyout/Dialog for lead details - remains outside main routing to overlay everything */}
            {isLoggedIn && currentUser?.role !== 'BankExecutive' && (
                <Dialog open={isFlyoutOpen} onClose={handleCloseFlyout} maxWidth="lg" fullWidth>
                    <DialogTitle>
                        {selectedLead?.leadID ? `Lead Details: ${selectedLead.leadID}` : 'Create New Lead'}
                        <IconButton aria-label="close" onClick={handleCloseFlyout} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        {isFlyoutOpen && (
                            <LeadForm leadData={selectedLead} onBack={handleCloseFlyout} onUpdate={handleUpdateLeadList} />
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

// We need to wrap App in a component that is a child of Router
// to be able to use the useNavigate hook.
const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
