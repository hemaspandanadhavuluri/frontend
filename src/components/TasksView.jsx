import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography, Tabs, Tab, Button } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';
import './Dashboard.css';
import Sidebar from './Sidebar';

const TasksView = ({ onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [myTasks, setMyTasks] = useState([]);
    const [assignedByMeTasks, setAssignedByMeTasks] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            fetchTasks(user);
        }
    }, []);

    // periodically refresh tasks to pick up external updates (e.g. BE marked done)
    useEffect(() => {
        if (!currentUser) return;
        const interval = setInterval(() => fetchTasks(currentUser), 30000); // every 30s
        return () => clearInterval(interval);
    }, [currentUser]);

    const fetchTasks = async (user) => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        try {
            // Fetch tasks assigned to the current user
            const myTasksResponse = await axios.get(API_URL.replace('/leads', '/tasks'), { 
                params: { assignedToId: user._id } 
            });
            setMyTasks(myTasksResponse.data);

            // Fetch tasks created/assigned by the current user
            const assignedByMeResponse = await axios.get(API_URL.replace('/leads', '/tasks'), { 
                params: { createdById: user._id } 
            });
            // exclude most self‑assigned tasks to prevent duplicate rows, but keep
            // FO action tasks (contact ASAP / wrong update / negotiate) even if they
            // land back on the creator when no bank executive exists.
            const assignedByMeFiltered = assignedByMeResponse.data.filter(t => {
                if (t.assignedToId === user._id) {
                    const subj = (t.subject || '').toLowerCase();
                    // keep if special notification/requirement
                    if (subj.includes('contact asap') || subj.includes('wrong update') || subj.includes('negotiate')) {
                        return true;
                    }
                    return false;
                }
                return true;
            });
            setAssignedByMeTasks(assignedByMeFiltered);
        } catch (error) { 
            console.error('Error:', error); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const openLeadInTab = (leadId) => {
        const leadUrl = `/leads/${leadId}`;
        window.open(leadUrl, 'leadFormTab');
    };

    const getPendingCount = (tasks) => {
        return tasks.filter(t => t.status === 'Open').length;
    };
    
    // compute set union size for overall count without duplication
    const getUnionCount = (listA, listB) => {
        const ids = new Set();
        listA.forEach(t => { if (t.status === 'Open') ids.add(t._id); });
        listB.forEach(t => { if (t.status === 'Open') ids.add(t._id); });
        return ids.size;
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
        </Box>
    );

    // filter out tasks that the current user created themselves; those belong in "assigned by me" instead
    const myTasksForDisplay = myTasks.filter(t => !(t.createdById === currentUser?._id));
    const myPendingCount = getPendingCount(myTasksForDisplay);
    const assignedByMePendingCount = getPendingCount(assignedByMeTasks);
    // avoid double counting tasks that appear in both lists (e.g. self‑assigned or special cases)
    const totalPendingCount = getUnionCount(myTasksForDisplay, assignedByMeTasks);

    return (
        <main className="main-content-fo">
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                <h2 style={{ margin: '40px 0px 0px 0px', fontSize: '27px', fontWeight: 'bold', textAlign: 'center', color: '#360d4c' }}>
                    <span style={{ color: 'red' }}>({totalPendingCount}) </span>
                    Task Management
                </h2>

                <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', marginBottom: 2, marginTop: 3 }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab label={`My Tasks (${myPendingCount} pending)`} />
                        <Tab label={`Assigned by Me (${assignedByMePendingCount} pending)`} />
                    </Tabs>
                </Box>

                {/* --- MY TASKS TAB --- */}
                {currentTab === 0 && (
                    <div className="table-container-fo">
                        <table className="table-fo">
                            <thead className="thead-tasks-fo">
                                <tr>
                                    <th>Subject</th>
                                    <th>Created By</th>
                                    <th>Created On</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myTasksForDisplay.filter(t => t.status === 'Open').length > 0 ? (
                                    myTasksForDisplay.filter(t => t.status === 'Open').map(task => (
                                        <tr key={task._id} className="row-hover-fo">
                                            <td><div><strong>{task.subject}</strong><br /><small>{task.body}</small></div></td>
                                            <td>{task.createdByName}</td>
                                            <td>{moment(task.createdAt).format('DD MMM YYYY')}</td>
                                            <td><span className="chip-fo status-info">{task.status}</span></td>
                                            <td>
                                                <button onClick={() => openLeadInTab(task.leadId)} className="btn-fo btn-warning-fo">Open Lead</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                            No pending tasks assigned to you.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- ASSIGNED BY ME TAB --- */}
                {currentTab === 1 && (
                    <div className="table-container-fo">
                        <table className="table-fo">
                            <thead className="thead-tasks-fo">
                                <tr>
                                    <th>Subject</th>
                                    <th>Assigned To</th>
                                    <th>Created On</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedByMeTasks.filter(t => t.status === 'Open').length > 0 ? (
                                    assignedByMeTasks.filter(t => t.status === 'Open').map(task => (
                                        <tr key={task._id} className="row-hover-fo">
                                            <td><div><strong>{task.subject}</strong><br /><small>{task.body}</small></div></td>
                                            <td>{task.assignedToName}</td>
                                            <td>{moment(task.createdAt).format('DD MMM YYYY')}</td>
                                            <td><span className="chip-fo status-info">{task.status}</span></td>
                                            <td>
                                                <button onClick={() => openLeadInTab(task.leadId)} className="btn-fo btn-warning-fo">Open Lead</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                            No pending tasks assigned by you.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TasksView;
