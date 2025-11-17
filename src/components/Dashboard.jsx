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
    TextField
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
        case 'Rejected': return 'error';
        default: return 'default';
    }
};

const Dashboard = ({ onSelectLead, onLogout, leads, setLeads }) => {
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

    // Handler for creating a new lead
    const handleCreateNewLead = () => {
        // Pass the initial data to the LeadForm
        onSelectLead({ ...newLead }); 
        setNewLead({ fullName: '', email: '', mobileNumber: '' }); // Reset the small dialog
        setOpenCreateDialog(false); // Close the simple dialog
    };

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
                    </Box>

                    {/* Create Button on the right */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                        sx={{ fontWeight: 'bold' }}
                    >
                        Create New Lead
                    </Button>
                </Box>

                {/* --- Unified Table Container --- */}
                <TableContainer component={Paper} elevation={5}>
                    <Table sx={{ minWidth: 700 }} aria-label="lead dashboard table">
                        {activeView !== 'newLeads' ? ( // 'all' and 'reminders' share a similar header
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
                        ) : (
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
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', backgroundColor: isMissed ? 'rgba(255, 0, 0, 0.08)' : 'inherit' }}
                                            onClick={() => onSelectLead(lead)}
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
                                                <Button variant="contained" size="small" onClick={(e) => { e.stopPropagation(); onSelectLead(lead); }}>View</Button>
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
                                            onClick={() => onSelectLead(lead)}
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{lead.leadID}</TableCell>
                                            <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{lead.fullName}</Typography></TableCell>
                                            <TableCell><Chip label={lead.leadStatus} color={getStatusColor(lead.leadStatus)} size="small" variant="outlined" /></TableCell>
                                            <TableCell>{lead.reminderCallDate ? moment(lead.reminderCallDate).format('DD MMM YYYY') : <Chip label="SET DATE" color="error" size="small" />}</TableCell>
                                            <TableCell>{lead.assignedFO || 'Unassigned'}</TableCell>
                                            <TableCell>{`${lead.zone || 'N/A'} / ${lead.region || 'N/A'}`}</TableCell>                                            <TableCell align="center">
                                                <Button variant="contained" size="small" onClick={(e) => { e.stopPropagation(); onSelectLead(lead); }}>View</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {reminderLeads.length === 0 && (
                                    <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary" sx={{ p: 3 }}>No reminders for today or any missed reminders.</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                        ) : (
                            <TableBody>
                                {newLeads.map((lead) => (
                                    <TableRow
                                        key={lead._id}
                                        hover
                                        onClick={() => onSelectLead(lead)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{lead.leadID}</TableCell>
                                        <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{lead.fullName}</Typography></TableCell>
                                        <TableCell>{lead.loanType || 'N/A'}</TableCell>
                                        <TableCell>{moment(lead.createdAt).format('DD MMM YYYY')}</TableCell>
                                        <TableCell>{lead.assignedFO || 'Unassigned'}</TableCell>
                                        <TableCell>{`${lead.zone || 'N/A'} / ${lead.region || 'N/A'}`}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" size="small" color="secondary" onClick={(e) => { e.stopPropagation(); onSelectLead(lead); }}>Open</Button>
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

            {/* Create New Lead Dialog */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Lead</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Full Name"
                        fullWidth
                        variant="outlined"
                        value={newLead.fullName}
                        onChange={(e) => setNewLead({ ...newLead, fullName: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Mobile Number"
                        fullWidth
                        variant="outlined"
                        value={newLead.mobileNumber}
                        onChange={(e) => setNewLead({ ...newLead, mobileNumber: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateNewLead} variant="contained" color="primary">
                        Create & Open Form
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Dashboard;
