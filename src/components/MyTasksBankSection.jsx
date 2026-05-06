import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Box, Chip, Divider, Button } from '@mui/material';
import { API_URL } from '../constants';
import moment from 'moment';

const MyTasksBankSection = ({ tasks, lead, leadId, onTaskUpdate, setLead }) => {
    const [loading, setLoading] = useState(false);

    const logTaskActionToLead = async (subject, action) => {
        const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
        if (!currentUser) return;

        const updatePayload = {
            externalCallNote: {
                notes: `[Task Update] Task "${subject}" marked as ${action}.`,
                loggedByName: `${currentUser.fullName} (${currentUser.bank})`,
                callStatus: 'Log',
                targetBank: currentUser.bank
            }
        };

        try {
            const response = await axios.put(`${API_URL}/${leadId}`, updatePayload, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            if (setLead) {
                setLead(response.data);
            }
        } catch (error) {
            console.error('Failed to log task action to lead history:', error);
        }
    };

    // The parent component (BankLeadForm) already filters by bank, so we just display what we receive

    const handleMarkDone = async (task) => {
        setLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('employeeUser'));
            const currentBank = currentUser?.bank;

            // Check if this task corresponds to an unread notification (like 'Wrong Update')
            const myAssignment = lead?.assignedBanks?.find(b => 
                b.bankName?.toLowerCase().trim() === currentBank?.toLowerCase().trim()
            );

            let matchingNotif = null;
            if (myAssignment?.notifications) {
                matchingNotif = myAssignment.notifications.find(n => {
                    const notifKey = `${n.type}: ${n.subType}`;
                    return !n.isRead && task.subject === notifKey;
                });
            }

            if (matchingNotif) {
                // Specialized API: Marks notification read, logs history, and completes task
                const response = await axios.put(`${API_URL}/${leadId}/notifications/${matchingNotif._id}/read`, {
                    bankName: currentBank,
                    fromName: currentUser.fullName
                });

                // Update the lead state in the parent with refreshed history notes
                if (response.data.lead && setLead) {
                    setLead(response.data.lead);
                }

                // Notify parent to remove the task from the active view
                if (onTaskUpdate) {
                    onTaskUpdate({ ...task, status: 'Done' });
                }
            } else {
                // Standard task completion logic
                const response = await axios.put(`${API_URL.replace('/leads', '/tasks')}/${task._id}`, { 
                    status: 'Done' 
                });
                
                await logTaskActionToLead(task.subject, 'Done');
                
                if (onTaskUpdate) {
                    onTaskUpdate(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to mark task as done.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkOpen = async (taskId) => {
        setLoading(true);
        try {
            const response = await axios.put(`${API_URL.replace('/leads', '/tasks')}/${taskId}`, { 
                status: 'Open' 
            });
            
            if (onTaskUpdate) {
                onTaskUpdate(response.data);
            }
        } catch (error) {
            console.error('Failed to update task:', error);
            alert('Failed to reopen task.');
        } finally {
            setLoading(false);
        }
    };

    if (!tasks || tasks.length === 0) {
        return (
            <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No tasks assigned for this bank.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                My Tasks
            </Typography>
            
            {tasks.map((task) => (
                <Paper 
                    key={task._id} 
                    elevation={task.status === 'Done' ? 1 : 3}
                    sx={{ 
                        p: 2, 
                        mb: 2, 
                        bgcolor: task.status === 'Done' ? '#f1f8e9' : '#fff3e0',
                        borderLeft: `4px solid ${task.status === 'Done' ? '#81c784' : '#ff9800'}`
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {task.subject}
                            </Typography>
                            {task.body && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {task.body}
                                </Typography>
                            )}
                            <Box sx={{ mt: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Chip 
                                    label={task.status === 'Open' ? 'Open' : 'Done'} 
                                    color={task.status === 'Open' ? 'warning' : 'success'} 
                                    size="small" 
                                />
                                {task.targetBank && (
                                    <Chip 
                                        label={`Bank: ${task.targetBank}`} 
                                        color="primary" 
                                        variant="outlined"
                                        size="small" 
                                    />
                                )}
                                <Typography variant="caption" color="text.secondary">
                                    Created by: {task.createdByName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {moment(task.createdAt).format('DD MMM YYYY, h:mm a')}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ ml: 2 }}>
                            {task.status === 'Open' ? (
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    size="small"
                                    onClick={() => handleMarkDone(task)}
                                    disabled={loading}
                                >
                                    Mark Done
                                </Button>
                            ) : (
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    size="small"
                                    onClick={() => handleMarkOpen(task._id)}
                                    disabled={loading}
                                >
                                    Reopen
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default MyTasksBankSection;
