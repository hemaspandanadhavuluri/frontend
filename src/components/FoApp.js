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
import Profile_Fo from './Profile_Fo';
import EMICalculator from './sections/EmiCalculatorFo';
import { API_URL } from '../constants';

const FoApp = ({ onLogout }) => {
    const [leads, setLeads] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [assignedByMeTasks, setAssignedByMeTasks] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            // Fetch tasks assigned to the current user
            axios.get(API_URL.replace('/leads', '/tasks'), { params: { assignedToId: currentUser._id } })
                .then(res => setMyTasks(res.data)).catch(console.error);

            // Fetch tasks assigned by the current user
            axios.get(API_URL.replace('/leads', '/tasks'), { params: { createdById: currentUser._id } })
                .then(res => {
                    // remove tasks that were also assigned to me so they don't show in both boxes
                    const filtered = res.data.filter(t => t.assignedToId !== currentUser._id);
                    setAssignedByMeTasks(filtered);
                }).catch(console.error);
        }
    }, [currentUser]);

    const myTasksPendingCount = myTasks.filter(t => t.status === 'Open').length;
    const assignedByMePendingCount = assignedByMeTasks.filter(t => t.status === 'Open' && t.assignedToId !== currentUser._id).length;
    // compute union to avoid double counting tasks self‑assigned
    const totalIds = new Set();
    myTasks.filter(t => t.status === 'Open').forEach(t => totalIds.add(t._id));
    assignedByMeTasks.filter(t => t.status === 'Open' && t.assignedToId !== currentUser._id).forEach(t => totalIds.add(t._id));
    const totalPendingCount = totalIds.size;

    return (
        <div className="dashboard-container-fo">
            <Sidebar onLogout={onLogout} currentUser={currentUser} activePage={window.location.pathname === '/' ? 'home' : window.location.pathname === '/tasks' ? 'tasks' : ''} tasksCount={totalPendingCount} />
            <main className="main-content-fo">
                <Routes>
                    <Route
                        path="/"
                        element={<Dashboard
                            onLogout={onLogout}
                            leads={leads}
                            setLeads={setLeads} />}
                    />
                    {/* <Route path="/profile" element={<Profile_Fo currentUser={currentUser} />} /> */}
                    <Route path="/tasks" element={<TasksView onLogout={onLogout} />} />
                    <Route path="/leads/new" element={<CreateNewLeadPage />} />
                    <Route path="/leads/:id" element={<LeadDetailPage />} />
                    <Route path="/leads/:id/:tab" element={<LeadSectionPage />} />
                    <Route path="/leads/new/:tab" element={<LeadSectionPage />} />
                    <Route path="/hr-panel" element={<HrPanel />} />
                    <Route path="/profile" element={<Profile_Fo />} />
                    <Route path="/emi-calculator" element={<EMICalculator />} />
                </Routes>
            </main>
        </div>
    );
};

export default FoApp;
