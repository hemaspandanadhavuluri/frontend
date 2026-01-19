import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import TasksView from './TasksView';
import LeadDetailPage from './LeadDetailPage';
import CreateNewLeadPage from './CreateNewLeadPage';
import HrPanel from './HrPanel';
import LeadSectionPage from './LeadSectionPage';
import { API_URL } from '../constants';

const FoApp = ({ onLogout }) => {
    const [leads, setLeads] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            axios.get(API_URL.replace('/leads', '/tasks'), { params: { assignedToId: currentUser._id } })
                .then(res => setTasks(res.data)).catch(console.error);
        }
    }, [currentUser]);

    return (
        <div className="dashboard-container-fo">
            <Sidebar onLogout={onLogout} currentUser={currentUser} activePage={window.location.pathname === '/' ? 'home' : window.location.pathname === '/tasks' ? 'tasks' : ''} tasksCount={tasks.filter(t => t.status === 'Open').length} />
            <main className="main-content-fo">
                <Routes>
                    <Route
                        path="/"
                        element={<Dashboard
                            onLogout={onLogout}
                            leads={leads}
                            setLeads={setLeads} />}
                    />
                    <Route path="/tasks" element={<TasksView onLogout={onLogout} />} />
                    <Route path="/leads/new" element={<CreateNewLeadPage />} />
                    <Route path="/leads/:id" element={<LeadDetailPage />} />
                    <Route path="/leads/:id/:tab" element={<LeadSectionPage />} />
                    <Route path="/leads/new/:tab" element={<LeadSectionPage />} />
                    <Route path="/hr-panel" element={<HrPanel />} />
                </Routes>
            </main>
        </div>
    );
};

export default FoApp;
