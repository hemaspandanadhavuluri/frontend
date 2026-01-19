import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';
import './Dashboard.css';

const getStatusClass = (status) => {
    switch (status) {
        case 'Sanctioned': return 'status-primary';
        case 'On Priority': return 'status-success';
        case 'In Progress': return 'status-warning';
        case 'New': return 'status-info';
        case 'Close': return 'status-error';
        default: return '';
    }
};

const Dashboard = ({ onLogout, leads, setLeads }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTime, setSearchTime] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [newLeads, setNewLeads] = useState([]);
    const [activeView, setActiveView] = useState('all');
    const [reminderLeads, setReminderLeads] = useState([]);
    const [upcomingReminders, setUpcomingReminders] = useState([]);
    const [tasks, setTasks] = useState([]);

    const fetchAllLeads = React.useCallback(async (user) => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                params: { userId: user._id, role: user.role, zone: user.zone, region: user.region }
            });
            setLeads(response.data);
        } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    }, [setLeads]);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            fetchAllLeads(user);
        }
    }, [fetchAllLeads]);

    useEffect(() => {
        if (currentUser) {
            axios.get(API_URL.replace('/leads', '/tasks'), { params: { assignedToId: currentUser._id } })
                .then(res => setTasks(res.data)).catch(console.error);
        }
    }, [currentUser]);

    useEffect(() => {
        const now = moment();
        setNewLeads(leads.filter(lead => !lead.callHistory || lead.callHistory.length === 0));
        const allReminders = leads.filter(lead =>
            lead.reminderCallDate || (lead.reminders && lead.reminders.some(reminder => !reminder.done))
        ).sort((a, b) => {
            const dateA = a.reminderCallDate || (a.reminders && a.reminders.find(reminder => !reminder.done)?.date);
            const dateB = b.reminderCallDate || (b.reminders && b.reminders.find(reminder => !reminder.done)?.date);
            return new Date(dateA) - new Date(dateB);
        });
        const upcomingRemindersFiltered = allReminders.filter(lead => {
            const reminderDate = lead.reminderCallDate || (lead.reminders && lead.reminders.find(reminder => !reminder.done)?.date);
            return reminderDate && moment(reminderDate).isSame(moment(), 'day');
        });
        setReminderLeads(upcomingRemindersFiltered);
        setUpcomingReminders(upcomingRemindersFiltered);
    }, [leads]);

    const handleSearch = async () => {
        if (!currentUser) return;
        setIsSearching(true);
        const startTime = performance.now();
        try {
            const res = await axios.get(API_URL, {
                params: { userId: currentUser._id, role: currentUser.role, zone: currentUser.zone, region: currentUser.region, searchTerm }
            });
            setLeads(res.data);
            setSearchTime((performance.now() - startTime).toFixed(2));
        } finally { setIsSearching(false); }
    };

    const openTasksCount = tasks.filter(task => task.status === 'Open').length;

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading leads...</Typography>
        </Box>
    );

    return (
        <div style={{ margin: '0 auto', padding: '0 0px' }}>
            <div style={{ padding: '0 20px' }}>
                <div className="dashboard-header-fo">
                    <h2 style={{
                    margin: '40px 0px 0px 0px',
                    fontSize: '27px',
                    fontWeight: 'bold',
                    color: '#360d4c'
                }}>
                    {currentUser?.role} Lead Dashboard
                    </h2>

                {/* Search Bar */}
                <div className="search-paper-fo">
                    <input
                        className="search-input-fo"
                        placeholder="Search by Lead ID, Name, Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <a href="/leads/new" className="btn-fo btn-warning-fo">+ Create New Lead</a>
                    {searchTime && <span style={{ fontSize: '12px', color: '#666' }}>{searchTime} ms</span>}
                </div>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Left Side: Leads and Table */}
                    <div style={{ flex: 2 }}>
                        {/* Navigation and View Toggles */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                            <div>
                                <button className={`btn-fo ${activeView === 'all' ? 'btn-primary-fo' : 'btn-outlined-fo'}`} onClick={() => setActiveView('all')} style={{ marginRight: '10px' }}>
                                    All Leads ({leads.length})
                                </button>
                                <button className={`btn-fo ${activeView === 'reminders' ? 'btn-primary-fo' : 'btn-outlined-fo'}`} onClick={() => setActiveView('reminders')} style={{ marginRight: '10px' }}>
                                    Reminders ({reminderLeads.length})
                                </button>
                                <button className={`btn-fo ${activeView === 'newLeads' ? 'btn-secondary-fo' : 'btn-outlined-fo'}`} onClick={() => setActiveView('newLeads')}>
                                    New Leads ({newLeads.length})
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="table-container-fo">
                            <table className="table-fo">
                                <thead className={activeView === 'tasks' ? 'thead-tasks-fo' : activeView === 'newLeads' ? 'thead-new-fo' : 'thead-all-fo'}>
                                    {activeView === 'all' || activeView === 'reminders' ? (
                                        <tr>
                                            <th>Lead ID</th><th>Student</th><th>Contact</th><th>Status</th><th>Next Follow-up</th><th>FO / RH</th><th>Location</th><th>Action</th>
                                        </tr>
                                    ) : activeView === 'tasks' ? (
                                        <tr>
                                            <th>Subject</th><th>Created By</th><th>Created On</th><th>Status</th><th>Action</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th>Lead ID</th><th>Student</th><th>Loan Type</th><th>Created On</th><th>FO / RH</th><th>Location</th><th>Action</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {/* --- ALL LEADS VIEW --- */}
                                    {activeView === 'all' && leads.map(lead => {
                                        const reminderDate = lead.reminderCallDate || (lead.reminders && lead.reminders.find(reminder => !reminder.done)?.date);
                                        const isMissed = reminderDate && moment(reminderDate).isBefore(moment(), 'day');
                                        const reminder = lead.reminders && lead.reminders.find(r => !r.done);
                                        const statusToShow = reminder ? reminder.status : lead.leadStatus;
                                        return (
                                            <tr key={lead._id} className={`row-hover-fo ${isMissed ? 'row-missed-fo' : ''}`}>
                                                <td><strong>{lead.leadID}</strong></td>
                                                <td>{lead.fullName}</td>
                                                <td><div style={{ fontSize: '12px' }}>{lead.email}<br />{lead.mobileNumbers?.[0]}</div></td>
                                                <td><span className={`chip-fo ${getStatusClass(statusToShow)}`}>{statusToShow}</span></td>
                                                <td>{reminderDate ? moment(reminderDate).format('DD MMM YYYY') : 'SET DATE'}</td>
                                                <td>{lead.assignedFO || 'Unassigned'}</td>
                                                <td>{lead.permanentLocation || 'N/A'}</td>
                                                <td><a href={`/leads/${lead._id}`} target="_blank" className="btn-fo btn-view-fo">View</a></td>
                                            </tr>
                                        )
                                    })}

                                    {/* --- REMINDERS VIEW --- */}
                                    {activeView === 'reminders' && reminderLeads.map(lead => {
                                        const reminderDate = lead.reminderCallDate || (lead.reminders && lead.reminders.find(reminder => !reminder.done)?.date);
                                        const reminder = lead.reminders && lead.reminders.find(r => !r.done);
                                        const statusToShow = reminder ? reminder.status : lead.leadStatus;
                                        return (
                                            <tr key={lead._id} className="row-hover-fo">
                                                <td><strong>{lead.leadID}</strong></td>
                                                <td>{lead.fullName}</td>
                                                <td>{lead.mobileNumbers?.[0]}</td>
                                                <td><span className={`chip-fo ${getStatusClass(statusToShow)}`}>{statusToShow}</span></td>
                                                <td>{reminderDate ? moment(reminderDate).format('DD MMM YYYY') : 'N/A'}</td>
                                                <td>{lead.assignedFO}</td>
                                                <td>{lead.permanentLocation || 'N/A'}</td>
                                                <td><a href={`/leads/${lead._id}`} target="_blank" className="btn-fo btn-primary-fo">View</a></td>
                                            </tr>
                                        );
                                    })}

                                    {/* --- TASKS VIEW --- */}
                                    {activeView === 'tasks' && tasks.filter(t => t.status === 'Open').map(task => (
                                        <tr key={task._id} className="row-hover-fo">
                                            <td><div><strong>{task.subject}</strong><br /><small>{task.body}</small></div></td>
                                            <td>{task.createdByName}</td>
                                            <td>{moment(task.createdAt).format('DD MMM YYYY')}</td>
                                            <td><span className="chip-fo status-info">{task.status}</span></td>
                                            <td><a href={`/leads/${task.leadId}`} target="_blank" className="btn-fo btn-warning-fo">Open Lead</a></td>
                                        </tr>
                                    ))}

                                    {/* --- NEW LEADS VIEW --- */}
                                    {activeView === 'newLeads' && newLeads.map(lead => (
                                        <tr key={lead._id} className="row-hover-fo">
                                            <td><strong>{lead.leadID}</strong></td>
                                            <td>{lead.fullName}</td>
                                            <td>{lead.loanType || 'N/A'}</td>
                                            <td>{moment(lead.createdAt).format('DD MMM YYYY')}</td>
                                            <td>{lead.assignedFO}</td>
                                            <td>{lead.zone} / {lead.region}</td>
                                            <td><a href={`/leads/${lead._id}`} target="_blank" className="btn-fo btn-secondary-fo">Open</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Side: My Tasks and Reminders */}
                    <div style={{ flex: 1 }}>
                        <div className="tasks-sidebar">
                            <h3>My Tasks</h3>
                            <div>
                                <h4>Priority Action Items ({openTasksCount})</h4>
                                {tasks.filter(t => t.status === 'Open').map(task => (
                                    <div key={task._id} className="task-item">
                                        <div className="task-subject">{task.subject}</div>
                                        <div className="task-body">{task.body}</div>
                                        <div className="task-time">{moment(task.createdAt).fromNow()}</div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h4>Reminders</h4>
                                {upcomingReminders.length > 0 ? (
                                    (() => {
                                        const reminderDate = upcomingReminders[0].reminderCallDate || (upcomingReminders[0].reminders && upcomingReminders[0].reminders.find(reminder => !reminder.done)?.date);
                                        const reminder = upcomingReminders[0].reminders && upcomingReminders[0].reminders.find(r => !r.done);
                                        const statusToShow = reminder ? reminder.status : upcomingReminders[0].leadStatus;
                                        const isToday = reminderDate && moment(reminderDate).isSame(moment(), 'day');
                                        return (
                                            <div className={`reminder-item ${isToday ? 'blinking-reminder' : ''}`}>
                                                <div className="reminder-title">{upcomingReminders[0].leadID} - {upcomingReminders[0].fullName}</div>
                                                <div className="reminder-date">{moment(reminderDate).format('DD MMM YYYY HH:mm')}</div>
                                                <div className="reminder-status"><span className={`chip-fo ${getStatusClass(statusToShow)}`}>{statusToShow}</span></div>
                                                <div className="reminder-note">
                                                    Last Action: {upcomingReminders[0].callHistory?.length > 0 ? upcomingReminders[0].callHistory[upcomingReminders[0].callHistory.length - 1].notes : 'No notes'}
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="no-reminders">No upcoming reminders</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;