// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import your components
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import HrPanel from './components/HrPanel';
import EmployeeLogin from './components/EmployeeLogin';
import BankLogin from './components/BankLogin';
import BankExecutivePanel from './components/BankExecutivePanel';
import StudentForm from './components/StudentForm';
import LeadDocumentPage from './components/LeadDocumentPage'; // Import the new document page
import './components/leadForm.css'; // Import LeadForm styles globally
import AssignerApp from './components/Assigner_Panel/AssignerApp'; // Import the new component
import AssignerLogin from './components/Assigner_Panel/AssignerLogin'; // Import the Assigner login component
import FoApp from './components/FoApp'; // Import the FoApp component
import CounsellorApp from './components/Counsellor_Panel/CounsellorApp';
import LeadDetailPage from './components/LeadDetailPage';


const App = () => {
    // State to hold the ID of the currently selected lead (or null if none)
    const [leads, setLeads] = useState([]); // To hold all leads for the dashboard

    // State for employee authentication
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
            const currentPath = location.pathname;
            if (currentUser.role === 'BankExecutive') {
                // Allowed paths for BankExecutive. Prevents redirect loop when opening lead details.
                const isAllowedPath = currentPath === '/bank-panel' || 
                                      /^\/leads\/[a-f0-9]+\/view$/.test(currentPath) ||
                                      /^\/leads\/[a-f0-9]+\/documents$/.test(currentPath);

                if (!isAllowedPath) {
                    navigate('/bank-panel');
                }
            } else if (currentUser.role.toLowerCase() === 'assigner') {
                if (currentPath !== '/assigner') {
                    navigate('/assigner');
                }
            }
        }
    }, [isLoggedIn, currentUser, navigate, location.pathname]);

    // Handler for successful login
    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('employeeUser', JSON.stringify(user)); // <-- CRITICAL FIX: Save user to localStorage
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
                <Route path="/assigner-login" element={<AssignerLogin onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/leads/:id/documents" element={<LeadDocumentPage />} />
                <Route path = '/studentForm' element = {<StudentForm />} />
                <Route path= '/counsellor/*' element={<CounsellorApp />} />

                {/* Protected Routes */}
                {isLoggedIn ? (
                    <>
                        {currentUser?.role === 'BankExecutive' ? (
                            <>
                                <Route path="/bank-panel" element={<BankExecutivePanel onLogout={handleLogout} />} />
                                {/* Add route for bank executives to view lead details */}
                                <Route path="/leads/:id/view" element={<LeadDetailPage />} />
                            </>
                        ) : currentUser?.role.toLowerCase() === 'assigner' ? (
                            // Assigner gets their own route
                            <Route path="/assigner" element={<AssignerApp onLogout={handleLogout} />} />
                        ) : (
                            // Internal employees get their set of routes
                            <Route path="/*" element={<FoApp onLogout={handleLogout} />} />
                        )}
                    </>
                ) : (
                    // If not logged in, default to the employee login page
                    <Route path="*" element={<EmployeeLogin onLoginSuccess={handleLoginSuccess} />} />
                    
                )}
                <Route path="/hr-panel" element={<HrPanel />} />
            </Routes>
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
