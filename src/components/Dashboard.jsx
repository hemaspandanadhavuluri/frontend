// src/components/LeadsDashboard.js (UPDATED FOR TABLE VIEW AND STYLES)

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Chip, // For status visualization
    Button, // To make the row clickable
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    ButtonGroup,
    Badge,
    Tooltip
} from '@mui/material';
import {
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';

// --- Helper Function for Status Color ---
const getStatusColor = (status) => {
    switch (status) {
        case 'Sanctioned': return 'primary';
        case 'On Priority': return 'success';
        case 'In Progress': return 'warning';
        case 'New': return 'secondary';
        case 'Application Incomplete': return 'info';
        case 'Close': return 'error';
        default: return 'default';
    }
};

const Dashboard = ({ onLogout, leads, setLeads }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newLead, setNewLead] = useState({ fullName: '', email: '', mobileNumber: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTime, setSearchTime] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const [newLeads, setNewLeads] = useState([]);
    const [activeView, setActiveView] = useState('all'); // 'all', 'reminders', or 'newLeads'
    const [reminderLeads, setReminderLeads] = useState([]);
    const [tasks, setTasks] = useState([]);
    const fetchAllLeads = React.useCallback(async (user) => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(API_URL, {
                params: {
                    userId: user._id,
                    role: user.role,
                    zone: user.zone,
                    region: user.region,
                }
            });
            setLeads(response.data);
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    }, [setLeads]);

 useEffect(() => {
        // Get current user from localStorage
        const storedUser = localStorage.getItem('employeeUser');
        let user;
        if (storedUser) {
            try {
                user = JSON.parse(storedUser);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setLoading(false);
                return;
            }
        }
        
        fetchAllLeads(user);
    // Re-run if storedUser or user-related state changes, though once is usually enough.
    }, [fetchAllLeads]); // Dependency on setLeads to avoid lint warning

    // --- NEW: Fetch tasks assigned to the current user ---
    useEffect(() => {
        if (currentUser) {
            const fetchTasks = async () => {
                try {
                    const response = await axios.get(API_URL.replace('/leads', '/tasks'), {
                        params: { assignedToId: currentUser._id }
                    });
                    setTasks(response.data);
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                }
            };
            fetchTasks();
        }
    }, [currentUser]);
    // --- NEW: Effect to filter leads into New and Reminders ---
    useEffect(() => {
        const today = moment().startOf('day');

        // Filter for new leads (no call history)
        const filteredNewLeads = leads.filter(lead => !lead.callHistory || lead.callHistory.length === 0);

        // Filter for reminders (has a reminder date and has been contacted)
        const filteredReminderLeads = leads
            .filter(lead => 
                lead.reminderCallDate && 
                moment(lead.reminderCallDate).startOf('day').isSameOrBefore(today) &&
                lead.callHistory && lead.callHistory.length > 0
            )
            .sort((a, b) => new Date(a.reminderCallDate) - new Date(b.reminderCallDate)); // Sort by date

        setNewLeads(filteredNewLeads);
        setReminderLeads(filteredReminderLeads);

    }, [leads]); // This effect runs whenever the main 'leads' array changes

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };

    // --- NEW: Handler for search ---
    const handleSearch = async () => {
        if (!currentUser) return;

        setIsSearching(true);
        setSearchTime(null);
        const startTime = performance.now();

        try {
            const response = await axios.get(API_URL, {
                params: {
                    userId: currentUser._id,
                    role: currentUser.role,
                    zone: currentUser.zone,
                    region: currentUser.region,
                    searchTerm: searchTerm, // Pass the search term
                }
            });
            setLeads(response.data);
        } catch (error) {
            console.error('Failed to search leads:', error);
        } finally {
            const endTime = performance.now();
            setSearchTime((endTime - startTime).toFixed(2));
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchTime(null);
        fetchAllLeads(currentUser); // Re-fetch all leads for the current user
    };

    const openTasksCount = tasks.filter(task => task.status === 'Open').length;


    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading leads...</Typography>
        </Box>
    );

    return (
        <>
            {/* Top Navigation Bar */}
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Employee Portal - {currentUser?.role || 'Dashboard'}
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        Welcome, {currentUser?.fullName || 'Employee'}
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        color="inherit"
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {currentUser?.role || 'Employee'} Lead Dashboard
                </Typography>

                {/* --- NEW: Search Bar --- */}
                <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Search by Lead ID, Name, Email, Phone, or Source..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant="contained" onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                    </Button>
                    {searchTime && (
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            Found in {searchTime} ms
                        </Typography>
                    )}
                    <Button variant="text" onClick={handleClearSearch} size="small">
                        Clear
                    </Button>
                </Paper>


                {/* --- View Toggle and Create Buttons --- */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    {/* View Toggles on the left */}
                    <Box>
                        <Button
                            onClick={() => setActiveView('all')}
                            variant={activeView === 'all' ? 'contained' : 'outlined'}
                            sx={{ mr: 2 }}
                        >
                            All Leads ({leads.length})
                        </Button>
                        <Button
                            onClick={() => setActiveView('reminders')}
                            variant={activeView === 'reminders' ? 'contained' : 'outlined'}
                            sx={{ mr: 2 }}
                        >
                            Reminders ({reminderLeads.length})
                        </Button>
                        <Button
                            onClick={() => setActiveView('newLeads')}
                            variant={activeView === 'newLeads' ? 'contained' : 'outlined'}
                            color="secondary"
                        >
                            New Leads ({newLeads.length})
                        </Button>
                        <Badge badgeContent={openTasksCount} color="error" sx={{ ml: 2 }}>
                            <Button
                                onClick={() => setActiveView('tasks')}
                                variant={activeView === 'tasks' ? 'contained' : 'outlined'}
                                color="warning"
                            >
                                My Tasks ({openTasksCount})
                            </Button>
                        </Badge>
                    </Box>

                    {/* Create Button on the right */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        href="/leads/new"
                        sx={{ fontWeight: 'bold' }}
                    >
                        Create New Lead
                    </Button>
                </Box>

                {/* --- Unified Table Container --- */}
                <TableContainer component={Paper} elevation={5}>
                    <Table sx={{ minWidth: 700 }} aria-label="lead dashboard table">
                        {activeView === 'all' || activeView === 'reminders' ? (
                            <TableHead sx={{ bgcolor: 'primary.dark' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lead ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Next Follow-up</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>FO / RH</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location (Z/R)</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                        ) : activeView === 'tasks' ? (
                            <TableHead sx={{ bgcolor: 'warning.dark' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created By</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created On</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                        ) : ( // newLeads view
                            <TableHead sx={{ bgcolor: 'secondary.dark' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lead ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loan Type</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created On</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>FO / RH</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location (Z/R)</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                        )}
                        {activeView === 'all' ? (
                            <TableBody>
                                {leads.map((lead) => {
                                    const isMissed = lead.reminderCallDate && moment(lead.reminderCallDate).startOf('day').isBefore(moment().startOf('day'));
                                    return (
                                        <TableRow
                                            key={lead._id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', backgroundColor: isMissed ? 'rgba(255, 0, 0, 0.08)' : 'inherit' }}
                                            hover
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{lead.leadID}</TableCell>
                                            <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{lead.fullName}</Typography></TableCell>
                                            <TableCell>
                                                <Typography variant="caption" display="block">{lead.email || 'No Email'}</Typography>
                                                <Typography variant="caption" display="block">{lead.mobileNumbers?.[0] || 'No Mobile'}</Typography>
                                            </TableCell>
                                            <TableCell><Chip label={lead.leadStatus} color={getStatusColor(lead.leadStatus)} size="small" variant="outlined" /></TableCell>
                                            <TableCell>{lead.reminderCallDate ? moment(lead.reminderCallDate).format('DD MMM YYYY') : <Chip label="SET DATE" color="error" size="small" />}</TableCell>
                                            <TableCell>{lead.assignedFO || 'Unassigned'}</TableCell>
                                            <TableCell>{`${lead.zone || 'N/A'} / ${lead.region || 'N/A'}`}</TableCell>
                                            <TableCell align="center">
                                                <ButtonGroup variant="outlined" size="small" aria-label="lead actions button group">
                                                    <Button href={`/leads/${lead._id}`} target="_blank" onClick={(e) => e.stopPropagation()}>View</Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {leads.length === 0 && (
                                    <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ p: 3 }}>No leads found.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        ) : activeView === 'reminders' ? (
                            <TableBody>
                                {reminderLeads.map((lead) => {
                                    const isMissed = moment(lead.reminderCallDate).startOf('day').isBefore(moment().startOf('day'));
                                    return (
                                        <TableRow
                                            key={lead._id}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', backgroundColor: isMissed ? 'rgba(255, 0, 0, 0.08)' : 'inherit' }}                                            
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{lead.leadID}</TableCell>
                                            <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{lead.fullName}</Typography></TableCell>
                                            <TableCell><Chip label={lead.leadStatus} color={getStatusColor(lead.leadStatus)} size="small" variant="outlined" /></TableCell>
                                            <TableCell>{lead.reminderCallDate ? moment(lead.reminderCallDate).format('DD MMM YYYY') : <Chip label="SET DATE" color="error" size="small" />}</TableCell>
                                            <TableCell>{lead.assignedFO || 'Unassigned'}</TableCell>
                                            <TableCell>{`${lead.zone || 'N/A'} / ${lead.region || 'N/A'}`}</TableCell>                                            <TableCell align="center">
                                                <Button variant="contained" size="small" href={`/leads/${lead._id}`} target="_blank" onClick={(e) => e.stopPropagation()}>View</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {reminderLeads.length === 0 && (
                                    <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ p: 3 }}>No reminders for today or any missed reminders.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        ) : activeView === 'tasks' ? (
                            <TableBody>
                                {tasks.filter(task => task.status === 'Open').map((task) => (
                                    <TableRow key={task._id} hover sx={{ cursor: 'pointer' }}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{task.subject}</Typography>
                                            <Typography variant="caption" color="text.secondary">{task.body}</Typography>
                                        </TableCell>
                                        <TableCell>{task.createdByName}</TableCell>
                                        <TableCell>{moment(task.createdAt).format('DD MMM YYYY, h:mm a')}</TableCell>
                                        <TableCell><Chip label={task.status} color={task.status === 'Open' ? 'info' : 'success'} size="small" /></TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" size="small" color="warning" href={`/leads/${task.leadId}`} target="_blank" onClick={(e) => e.stopPropagation()}>Open Lead</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {openTasksCount === 0 && (
                                    <TableRow><TableCell colSpan={5} align="center"><Typography color="text.secondary" sx={{ p: 3 }}>You have no open tasks.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {newLeads.map((lead) => (
                                    <TableRow
                                        key={lead._id}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{lead.leadID}</TableCell>
                                        <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{lead.fullName}</Typography></TableCell>
                                        <TableCell>{lead.loanType || 'N/A'}</TableCell>
                                        <TableCell>{moment(lead.createdAt).format('DD MMM YYYY')}</TableCell>
                                        <TableCell>{lead.assignedFO || 'Unassigned'}</TableCell>
                                        <TableCell>{`${lead.zone || 'N/A'} / ${lead.region || 'N/A'}`}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" size="small" color="secondary" href={`/leads/${lead._id}`} target="_blank" onClick={(e) => e.stopPropagation()}>Open</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {newLeads.length === 0 && (
                                    <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ p: 3 }}>No new leads to display.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Container>

        </>
    );
};

export default Dashboard;
