import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';
import './Dashboard.css';
import Sidebar from './Sidebar';

const TasksView = ({ onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            fetchTasks(user);
        }
    }, []);

    const fetchTasks = async (user) => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        try {
            const response = await axios.get(API_URL.replace('/leads', '/tasks'), { params: { assignedToId: user._id } });
            setTasks(response.data);
        } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
        </Box>
    );

    return (
        <main className="main-content-fo">
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                    <h2 style={{ margin: '40px 0px 0px 0px', fontSize: '27px', fontWeight: 'bold', textAlign: 'center', color: 'white' }}>My Tasks</h2>

                    <div className="table-container-fo">
                        <table className="table-fo">
                            <thead className="thead-tasks-fo">
                                <tr>
                                    <th>Subject</th><th>Created By</th><th>Created On</th><th>Status</th><th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.filter(t => t.status === 'Open').map(task => (
                                    <tr key={task._id} className="row-hover-fo">
                                        <td><div><strong>{task.subject}</strong><br/><small>{task.body}</small></div></td>
                                        <td>{task.createdByName}</td>
                                        <td>{moment(task.createdAt).format('DD MMM YYYY')}</td>
                                        <td><span className="chip-fo status-info">{task.status}</span></td>
                                        <td><a href={`/leads/${task.leadId}`} target="_blank" className="btn-fo btn-warning-fo">Open Lead</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        
    );
};

export default TasksView;
