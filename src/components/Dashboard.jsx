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

// Mock User Role for Display
const MOCK_USER_ROLE_DISPLAY = 'FO';
const API_URL = 'http://localhost:5000/api/leads';

// --- Helper Function for Status Color ---
const getStatusColor = (status) => {
    switch (status) {
        case 'Connected': return 'success';
        case 'No Answer': return 'warning';
        case 'Rejected': return 'error';
        case 'Sanctioned': return 'primary';
        case 'Application Incomplete': return 'info';
        default: return 'default';
    }
};

const Dashboard = ({ onSelectLead, onLogout }) => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newLead, setNewLead] = useState({ fullName: '', email: '', mobileNumber: '' });

    useEffect(() => {
        // Get current user from localStorage
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        const fetchLeads = async () => {
            try {
                // The backend controller handles the user access filtering
                const response = await axios.get(API_URL);
                setLeads(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch leads:', error);
                setLoading(false);
                // Optionally set an error state here
            }
        };
        fetchLeads();
    }, []);

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

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading leads...</Typography>
        </Box>
    );

    // Sort leads by reminderCallDate (ascending, showing oldest first)
    const sortedLeads = [...leads].sort((a, b) => {
        // Handle null/empty dates by putting them last
        const dateA = a.reminderCallDate ? new Date(a.reminderCallDate) : new Date(8640000000000000); // Max future date
        const dateB = b.reminderCallDate ? new Date(b.reminderCallDate) : new Date(8640000000000000); // Max future date
        return dateA - dateB;
    });

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
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    Showing {leads.length} accessible leads. (Sorted by Next Call Date)
                </Typography>

                {/* Create New Lead Button */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateDialog(true)}
                        sx={{ fontWeight: 'bold' }}
                    >
                        Create New Lead
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={5}>
                    <Table sx={{ minWidth: 700 }} aria-label="lead dashboard table">
                        <TableHead sx={{ bgcolor: 'primary.dark' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lead ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loan Type</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Next Follow-up</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>FO / RH</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location (Z/R)</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '100px' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedLeads.map((lead) => (
                                <TableRow
                                    key={lead._id}
                                    hover
                                    onClick={() => onSelectLead(lead._id)}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                                        {lead.leadID}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2">{lead.fullName}</Typography>
                                    </TableCell>
                                    <TableCell>{lead.loanType || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={lead.leadStatus}
                                            color={getStatusColor(lead.leadStatus)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {lead.reminderCallDate
                                            ? moment(lead.reminderCallDate).format('DD MMM YYYY')
                                            : <Chip label="SET DATE" color="error" size="small" variant="filled" />
                                        }
                                    </TableCell>
                                    <TableCell>{lead.assignedFO || 'Unassigned'}</TableCell>
                                    <TableCell>{`${lead.zone || 'N/A'} / ${lead.region || 'N/A'}`}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents row click event
                                                onSelectLead(lead._id);
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
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
                    <Button
                        onClick={async () => {
                            try {
                                const createPayload = {
                                    fullName: newLead.fullName,
                                    email: newLead.email,
                                    mobileNumbers: [newLead.mobileNumber],
                                    // Pre-fill zone and region from current user
                                    zone: currentUser?.zone || '',
                                    region: currentUser?.region || '',
                                    // Required source field
                                    source: { source: 'Manual' },
                                    // Assign to logged-in FO
                                    assignedFOId: currentUser?._id || '',
                                    assignedFO: currentUser?.fullName || '',
                                    assignedFOPhone: currentUser?.phoneNumber || '',
                                    // Other defaults
                                    panStatus: "Not Interested",
                                    referralList: [{ name: "Referral 1", code: "", phoneNumber: "" }],
                                };
                                const response = await axios.post(API_URL, createPayload);
                                alert('Lead created successfully!');
                                setNewLead({ fullName: '', email: '', mobileNumber: '' });
                                setOpenCreateDialog(false);
                                // Refresh leads list
                                const fetchLeads = async () => {
                                    const res = await axios.get(API_URL);
                                    setLeads(res.data);
                                };
                                fetchLeads();
                            } catch (error) {
                                console.error('Failed to create lead:', error);
                                alert('Failed to create lead. Check console for details.');
                            }
                        }}
                        variant="contained"
                        color="primary"
                    >
                        Create Lead
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Dashboard;
