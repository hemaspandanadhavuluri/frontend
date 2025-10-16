// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 1. Import Router components
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import your components
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import HrPanel from './components/HrPanel';
import EmployeeLogin from './components/EmployeeLogin';

const App = () => {
    // State to hold the ID of the currently selected lead (or null if none)
    const [selectedLeadId, setSelectedLeadId] = useState(null);

    // State for employee authentication
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Handler to open the flyout
    const handleSelectLead = (id) => {
        setSelectedLeadId(id);
    };

    // Handler to close the flyout
    const handleCloseFlyout = () => {
        setSelectedLeadId(null);
    };

    // Check if the flyout is open
    const isFlyoutOpen = !!selectedLeadId;

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
        <Router> {/* 2. Wrap the entire application in <Router> */}
            <div className="App">
                {!isLoggedIn ? (
                    <EmployeeLogin onLoginSuccess={handleLoginSuccess} />
                ) : (
                    <>
                        {/* 3. Define the routes */}
                        <Routes>
                            {/* Dashboard/Leads Route (This will be the default/root path) */}
                            <Route path="/" element={<Dashboard onSelectLead={handleSelectLead} onLogout={handleLogout} />} />

                            {/* HR Panel Route */}
                            <Route path="/hr-panel" element={<HrPanel />} />
                        </Routes>

                        {/* 4. Flyout/Dialog Component - Remains outside <Routes>
                               so it can overlay any route when opened. */}
                        <Dialog
                            open={isFlyoutOpen}
                            onClose={handleCloseFlyout}
                            maxWidth="lg"
                            fullWidth
                        >
                            <DialogTitle>
                                {selectedLeadId === 'new' ? 'Create New Lead' : `Lead Details: ${selectedLeadId}`}
                                <IconButton
                                    aria-label="close"
                                    onClick={handleCloseFlyout}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers>
                                {isFlyoutOpen && (
                                    <LeadForm
                                        leadId={selectedLeadId}
                                        onBack={handleCloseFlyout}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
        </Router>
    );
};

export default App;
