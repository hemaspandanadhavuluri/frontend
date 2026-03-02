import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Chip, Button, AppBar, Toolbar, IconButton,
    Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Grid,
    Badge, Popover, List, ListItem, ListItemText, ListItemAvatar, Avatar, Tabs, Tab
} from '@mui/material';
import { 
    AccountCircle as AccountCircleIcon, Logout as LogoutIcon, Person as PersonIcon, Phone as PhoneIcon, Schedule as ScheduleIcon, Notifications as NotificationsIcon, ErrorOutline as ErrorIcon, Info as InfoIcon 
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';
import logo from './logo.jpeg';
import BankExecutiveProfile from './BankExecutiveProfile';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ec4c23', // Orange
        },
        secondary: {
            main: '#4f2b68', // Purple
        },
    },
});

const BankExecutivePanel = ({ onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    // --- NEW: State for Document Access OTP ---
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [otpLead, setOtpLead] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [otpMessage, setOtpMessage] = useState({ text: '', type: 'info' });
    const [bankExecutiveData, setBankExecutiveData] = useState(null);

    // --- NEW: State for Last Call / Next Call ---
    const [lastCallDialogOpen, setLastCallDialogOpen] = useState(false);
    const [nextCallDialogOpen, setNextCallDialogOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [newReminderDate, setNewReminderDate] = useState('');
    const [newNote, setNewNote] = useState('');

    // --- NEW: Notification State ---
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationsIconRef = React.useRef(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [allLeadsCount, setAllLeadsCount] = useState(0);
    const [remindersCount, setRemindersCount] = useState(0);
    const [newLeadsCount, setNewLeadsCount] = useState(0);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('employeeUser'));
        setCurrentUser(storedUser);

        // Fetch bank executive details from Bank model
        const fetchBankExecutiveDetails = async () => {
            if (storedUser?.role === 'BankExecutive' && storedUser?.bank) {
                try {
                    const response = await axios.get('https://justtapcapital.com/api/banks');
                    const banks = response.data;

                    // Find the bank and then find the relationship manager by email
                    for (const bank of banks) {
                        const rm = bank.relationshipManagers.find(
                            r => r.email === storedUser.email
                        );
                        if (rm) {
                            setBankExecutiveData({
                                ...storedUser,
                                state: rm.region,
                                branch: rm.branch,
                                employeeId: rm.empId,
                                phoneNumber: rm.phoneNumber
                            });
                            break;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching bank executive details:', error);
                }
            }
        };

        fetchBankExecutiveDetails();

        const fetchLeads = async () => {
            if (!storedUser?.bank) {
                setLoading(false);
                return;
            }
            try {
                // Fetch leads specifically for this bank executive's bank
                const response = await axios.get(API_URL, {
                    params: {
                        role: storedUser.role,
                        bank: storedUser.bank
                    },
                    headers: { Authorization: `Bearer ${storedUser.token}` }
                });

                setLeads(response.data);
                setFilteredLeads(response.data);

                // --- NEW: Process Notifications ---
                const allNotifications = [];
                response.data.forEach(lead => {
                    const myAssignment = lead.assignedBanks?.find(b => 
                        b.bankName?.toLowerCase().trim() === storedUser.bank?.toLowerCase().trim()
                    );
                    
                    if (myAssignment && myAssignment.notifications) {
                        myAssignment.notifications.forEach(notif => {
                            if (!notif.isRead) {
                                allNotifications.push({
                                    ...notif,
                                    leadId: lead._id,
                                    leadName: lead.fullName,
                                    leadID: lead.leadID
                                });
                            }
                        });
                    }
                });
                // Sort by date desc
                allNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setNotifications(allNotifications);
            } catch (error) {
                console.error('Failed to fetch leads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    // auto-open when notifications arrive
    useEffect(() => {
        if (notifications.length > 0 && !notificationsOpen) {
            // if we have a ref to the icon, open anchored to it
            if (notificationsIconRef.current) {
                setNotificationsAnchorEl(notificationsIconRef.current);
            }
            setNotificationsOpen(true);
        }
    }, [notifications]);
    useEffect(() => {
        const filterAndCountLeads = () => {
            const today = moment().startOf('day');
            let filtered = [...leads];

            // 1. Filter by search term first
            if (searchTerm) {
                filtered = filtered.filter(lead => {
                    const term = searchTerm.toLowerCase();
                    return (
                        lead.fullName.toLowerCase().includes(term) ||
                        lead.mobileNumbers.some(num => num.includes(term)) ||
                        (lead.email && lead.email.toLowerCase().includes(term)) ||
                        (lead.source?.source && lead.source.source.toLowerCase().includes(term))
                    );
                });
            }

            // 2. Calculate counts based on the search-filtered list
            const reminderLeads = filtered.filter(lead => {
                const nextCallDate = getNextCallDate(lead);
                return nextCallDate && moment(nextCallDate).isSame(today, 'day');
            });

            const newLeads = filtered.filter(lead => {
                const assignment = lead.assignedBanks?.find(b => b.bankName === currentUser?.bank);
                return assignment && (!lead.externalCallHistory || lead.externalCallHistory.length === 0);
            });

            setAllLeadsCount(filtered.length);
            setRemindersCount(reminderLeads.length);
            setNewLeadsCount(newLeads.length);

            // 3. Set the final list for display based on the current tab
            if (currentTab === 1) { // Reminders
                // Sort reminderLeads: "On Priority" first, then by assignedAt date
                reminderLeads.sort((a, b) => {
                    const statusA = getBankStatus(a);
                    const statusB = getBankStatus(b);

                    if (statusA === 'On Priority' && statusB !== 'On Priority') {
                        return -1;
                    }
                    if (statusA !== 'On Priority' && statusB === 'On Priority') {
                        return 1;
                    }

                    // Fallback to assignedAt date for "first come, first served"
                    const assignedAtA = new Date(a.assignedBanks?.find(b => b.bankName === currentUser.bank)?.assignedAt || 0);
                    const assignedAtB = new Date(b.assignedBanks?.find(b => b.bankName === currentUser.bank)?.assignedAt || 0);

                    return assignedAtA - assignedAtB;
                });
                setFilteredLeads(reminderLeads);
            } else if (currentTab === 2) { // New Leads
                setFilteredLeads(newLeads);
            } else { // All Leads
                setFilteredLeads(filtered);
            }
        };

        if (currentUser) {
            filterAndCountLeads();
        }
    }, [currentTab, leads, currentUser, searchTerm]);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleProfileClick = () => {
        handleMenuClose();
        setShowProfile(true);
    };
    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };

    // --- NEW: Notification Handlers ---
    const handleNotificationsOpen = (event) => {
        setNotificationsAnchorEl(event.currentTarget);
        setNotificationsOpen(true);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
        setNotificationsOpen(false);
    };

    const handleNotificationDone = async (notification, e) => {
        e.stopPropagation();
        // Mark as read in backend
        try {
            await axios.put(`${API_URL}/${notification.leadId}/notifications/${notification._id}/read`, {
                bankName: currentUser.bank
            });
            
            // Remove from local state
            setNotifications(prev => {
                const nxt = prev.filter(n => n._id !== notification._id);
                if (nxt.length === 0) {
                    // close popover when cleared
                    handleNotificationsClose();
                }
                return nxt;
            });
        } catch (error) {
            console.error("Failed to mark notification as done", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Just open the lead - done button will be used to dismiss
        window.open(`/leads/${notification.leadId}/view`, '_blank');
        // keep popover open so user can mark done
    };

    // --- NEW: Handlers for Document Access OTP Flow ---
    const handleOpenOtpDialog = async (lead) => {
        setOtpLead(lead);
        setOtpMessage({ text: 'Sending OTP to student...', type: 'info' });
        setOtpDialogOpen(true);
        try {
            // Request OTP from backend
            await axios.post(`${API_URL}/${lead._id}/send-document-otp`);
            setOtpMessage({ text: `OTP sent to ${lead.email}. Please ask the student for the code.`, type: 'success' });
        } catch (error) {
            console.error('Failed to send OTP:', error);
            setOtpMessage({ text: error.response?.data?.message || 'Failed to send OTP.', type: 'error' });
        }
    };

    const handleCloseOtpDialog = () => {
        setOtpDialogOpen(false);
        setOtpLead(null);
        setOtpInput('');
        setOtpMessage({ text: '', type: 'info' });
    };

    const handleVerifyOtp = async () => {
        if (!otpInput.trim()) {
            setOtpMessage({ text: 'Please enter the OTP.', type: 'error' });
            return;
        }
        setOtpMessage({ text: 'Verifying...', type: 'info' });
        try {
            const response = await axios.post(`${API_URL}/${otpLead._id}/verify-document-otp`, {
                otp: otpInput
            });

            // On success, open the document page in a new tab
            if (response.data.success) {
                setOtpMessage({ text: 'Verification successful! Opening documents...', type: 'success' });
                window.open(`/leads/${otpLead._id}/documents`, '_blank');
                handleCloseOtpDialog();
            }
        } catch (error) {
            console.error('OTP verification failed:', error);
            setOtpMessage({ text: error.response?.data?.message || 'Invalid OTP.', type: 'error' });
        }
    };

    // --- NEW: Handlers for Last Call / Next Call ---
    const handleOpenLastCallDialog = (lead) => {
        setSelectedLead(lead);
        setLastCallDialogOpen(true);
    };

    const handleCloseLastCallDialog = () => {
        setLastCallDialogOpen(false);
        setSelectedLead(null);
    };

    const handleOpenNextCallDialog = (lead) => {
        setSelectedLead(lead);
        setNewReminderDate(lead.reminderCallDate ? new Date(lead.reminderCallDate).toISOString().slice(0, 16) : '');
        setNewNote('');
        setNextCallDialogOpen(true);
    };

    const handleCloseNextCallDialog = () => {
        setNextCallDialogOpen(false);
        setSelectedLead(null);
        setNewReminderDate('');
        setNewNote('');
    };

    const handleSaveNextCall = async () => {
        if (!selectedLead) return;

        try {
            const storedUser = JSON.parse(localStorage.getItem('employeeUser'));

            // Find the assignment for this bank
            const updatedAssignedBanks = selectedLead.assignedBanks.map(assignment => {
                if (assignment.bankName === storedUser.bank) {
                    const newReminder = {
                        date: new Date(newReminderDate).toISOString(),
                        done: false,
                        createdAt: new Date().toISOString(),
                        status: assignment.bankLeadStatus || 'In Progress'
                    };

                    return {
                        ...assignment,
                        bankNextCallDate: newReminderDate ? new Date(newReminderDate).toISOString() : null,
                        bankLastCallDate: new Date().toISOString(),
                        bankReminders: [...(assignment.bankReminders || []), newReminder]
                    };
                }
                return assignment;
            });

            // Add note to externalCallHistory instead of main callHistory
            const newExternalNote = {
                notes: newNote || 'Reminder set for next call',
                callStatus: 'Connected',
                loggedByName: storedUser?.fullName || 'Bank Executive',
                createdAt: new Date().toISOString()
            };

            const payload = {
                assignedBanks: updatedAssignedBanks,
                externalCallHistory: [...(selectedLead.externalCallHistory || []), newExternalNote]
            };

            await axios.put(`${API_URL}/${selectedLead._id}`, payload, {
                headers: { Authorization: `Bearer ${storedUser?.token}` }
            });

            // Refresh leads
            const response = await axios.get(API_URL, {
                params: {
                    role: storedUser.role,
                    bank: storedUser.bank
                },
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            setLeads(response.data);

            handleCloseNextCallDialog();
        } catch (error) {
            console.error('Failed to save next call:', error);
        }
    };

    const getNextCallDate = (lead) => {
        // Look for the assignment for the current user's bank
        const assignment = lead.assignedBanks?.find(b => b.bankName === currentUser?.bank);
        if (assignment) {
            if (assignment.bankNextCallDate) return assignment.bankNextCallDate;
            if (assignment.bankReminders && assignment.bankReminders.length > 0 && assignment.bankReminders.some(r => !r.done)) {
                const pending = assignment.bankReminders.filter(r => !r.done).sort((a, b) => new Date(a.date) - new Date(b.date));
                return pending[0]?.date;
            }
        }
        return null;
    };

    const getBankLastCallDate = (lead) => {
        const assignment = lead.assignedBanks?.find(b => b.bankName === currentUser?.bank);
        return assignment?.bankLastCallDate || null;
    };

    const getBankStatus = (lead) => {
        const assignment = lead.assignedBanks?.find(b => b.bankName === currentUser?.bank);
        return assignment?.bankLeadStatus || 'New';
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={60} /></Box>;

    return (
        <ThemeProvider theme={theme}>
            <style>{`
                @keyframes blink-notification {
                    0%, 100% { opacity: 1; filter: brightness(1); }
                    50% { opacity: 0.5; filter: brightness(1.5); }
                }
                @keyframes blink-item {
                    0%, 100% { background-color: #fff; }
                    50% { background-color: #fff3cd; }
                }
            `}</style>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
                <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #4f2b68  30%, #ec4c23 90%)' }}>
                    <Toolbar>
                        <Box component="img" src={logo} alt="Logo" sx={{ height: 40, mr: 2 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {currentUser?.bank || 'Bank'} Executive Portal
                        </Typography>
                        <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {currentUser?.fullName}</Typography>
                        {/* --- NEW: Notifications Icon --- */}
                        <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleNotificationsOpen}
                    sx={{ animation: notifications.length > 0 ? 'blink-notification 0.8s infinite' : 'none' }}
                    ref={notificationsIconRef}
                >
                    <Badge badgeContent={notifications.length} color="error" showZero={false}>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                        <IconButton size="large" edge="end" onClick={handleMenuOpen} color="inherit">
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleProfileClick}><PersonIcon sx={{ mr: 1 }} />Profile</MenuItem>
                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 1 }} />Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* --- NEW: Notifications Popover --- */}
                <Popover
                    open={notificationsOpen}
                    anchorEl={notificationsAnchorEl}
                    onClose={handleNotificationsClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
                >
                    <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    </Box>
                    <List sx={{ p: 0 }}>
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <ListItem 
                                    key={index} 
                                    button 
                                    onClick={() => handleNotificationClick(notif)}
                                    sx={{ 
                                        borderBottom: '1px solid #f0f0f0', 
                                        bgcolor: '#fff',
                                        animation: 'blink-item 0.8s infinite',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: notif.type === 'Wrong Update' ? '#ffebee' : '#e3f2fd' }}>
                                                {notif.type === 'Wrong Update' ? <ErrorIcon color="error" /> : <InfoIcon color="primary" />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                    {notif.type}: {notif.leadName}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" component="span" display="block" color="text.primary">
                                                        {notif.subType}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {notif.message}
                                                    </Typography>
                                                    <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#999' }}>
                                                        {moment(notif.createdAt).fromNow()} • By {notif.fromName}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </Box>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        color="success"
                                        onClick={(e) => handleNotificationDone(notif, e)}
                                        sx={{ ml: 1, flexShrink: 0 }}
                                    >
                                        Done
                                    </Button>
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">No new notifications</Typography>
                            </Box>
                        )}
                    </List>
                </Popover>

                <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4f2b68 ' }}>
                            Assigned Leads
                        </Typography>
                        <TextField
                            label="Search Leads"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: '300px' }}
                        />
                    </Box>

                    <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
                        <Tabs value={currentTab} onChange={handleTabChange} centered>
                            <Tab label={`All Leads (${allLeadsCount})`} />
                            <Tab label={`Reminders (${remindersCount})`} />
                            <Tab label={`New Leads (${newLeadsCount})`} />
                        </Tabs>
                    </Box>

                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#4f2b68 ', '& .MuiTableCell-root': { color: 'white' } }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Lead ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Loan Type</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Assigned On</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Last Call</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Next Call</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLeads.length > 0 ? (
                                    filteredLeads.map((lead) => (
                                        <TableRow key={lead._id} hover>
                                            <TableCell>{lead.leadID}</TableCell>
                                            <TableCell>{lead.fullName}</TableCell>
                                            <TableCell>{lead.loanType || 'N/A'}</TableCell>
                                            <TableCell>
                                                {moment(lead.assignedBanks.find(b => b.bankName === currentUser.bank)?.assignedAt).format('DD MMM YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getBankStatus(lead)}
                                                    size="small"
                                                    color={getBankStatus(lead) === 'Closed' || getBankStatus(lead) === 'Rejected' ? 'error' : getBankStatus(lead) === 'Sanctioned' ? 'success' : 'primary'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {getBankLastCallDate(lead) ? (
                                                    <Chip
                                                        icon={<PhoneIcon sx={{ fontSize: 16 }} />}
                                                        label={moment(getBankLastCallDate(lead)).format('DD MMM')}
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">No calls</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getNextCallDate(lead) ? (
                                                    <Chip
                                                        icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                                                        label={moment(getNextCallDate(lead)).format('DD MMM YYYY')}
                                                        size="small"
                                                        color={moment(getNextCallDate(lead)).isBefore(moment(), 'day') ? 'error' : 'primary'}
                                                        variant="filled"
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">Not set</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button variant="outlined" size="small" href={`/leads/${lead._id}/view`} target="_blank">
                                                    View
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    onClick={() => handleOpenOtpDialog(lead)}
                                                >
                                                    Access Documents
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="body2" color="text.secondary" sx={{ p: 4 }}>
                                                No leads to display for this tab.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>


                {/* --- NEW: OTP Dialog for Document Access --- */}
                <Dialog open={otpDialogOpen} onClose={handleCloseOtpDialog}>
                    <DialogTitle>Document Access Verification</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ mb: 2 }}>
                            An OTP has been sent to the student's email ({otpLead?.email}). Please enter it below to access the documents.
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="otp"
                            label="Enter OTP"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                        />
                        {otpMessage.text && <Typography color={otpMessage.type === 'error' ? 'error' : 'primary'} sx={{ mt: 2 }}>{otpMessage.text}</Typography>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseOtpDialog}>Cancel</Button>
                        <Button onClick={handleVerifyOtp} variant="contained">Verify & View</Button>
                    </DialogActions>
                </Dialog>

                {/* --- NEW: Last Call Dialog --- */}
                <Dialog open={lastCallDialogOpen} onClose={handleCloseLastCallDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ bgcolor: '#4f2b68', color: 'white' }}>
                        📞 Last Call Details
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {selectedLead && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Lead:</strong> {selectedLead.fullName} ({selectedLead.leadID})
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
                                        History & Notes
                                    </Typography>
                                    <Box sx={{ maxHeight: 200, overflowY: 'auto', mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                        {((selectedLead.callHistory || []).concat(selectedLead.externalCallHistory || [])).length > 0 ? (
                                            [...(selectedLead.callHistory || []), ...(selectedLead.externalCallHistory || [])]
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .slice(0, 10)
                                            .map((call, index) => (
                                                <Box key={index} sx={{ mb: 2, p: 1, borderLeft: '3px solid #4f2b68', bgcolor: 'white', borderRadius: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                        {moment(call.createdAt).format('DD MMM YYYY, h:mm A')}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Status:</strong> {call.callStatus || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>By:</strong> {call.loggedByName || 'Bank'}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                                        "{call.notes}"
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">No call history available.</Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLastCallDialog}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* --- NEW: Next Call Dialog --- */}
                <Dialog open={nextCallDialogOpen} onClose={handleCloseNextCallDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ bgcolor: '#4f2b68', color: 'white' }}>
                        📅 Set Next Call Reminder
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {selectedLead && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        <strong>Lead:</strong> {selectedLead.fullName} ({selectedLead.leadID})
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Next Call Date & Time"
                                        type="datetime-local"
                                        value={newReminderDate}
                                        onChange={(e) => setNewReminderDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Notes"
                                        multiline
                                        rows={3}
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add notes about this call..."
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>
                                {selectedLead.reminderCallDate && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Current Reminder:</strong> {moment(selectedLead.reminderCallDate).format('DD MMM YYYY, h:mm A')}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseNextCallDialog}>Cancel</Button>
                        <Button onClick={handleSaveNextCall} variant="contained" color="primary">
                            Save Reminder
                        </Button>
                    </DialogActions>
                </Dialog>

                {showProfile && (
                    <BankExecutiveProfile
                        currentUser={bankExecutiveData || currentUser}
                        onClose={() => setShowProfile(false)}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default BankExecutivePanel;
