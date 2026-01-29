import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Chip, Button, AppBar, Toolbar, IconButton,
    Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { AccountCircle as AccountCircleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';
import logo from './logo.jpeg';

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
    const [currentUser, setCurrentUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    // --- NEW: State for Document Access OTP ---
    const [otpDialogOpen, setOtpDialogOpen] = useState(false);
    const [otpLead, setOtpLead] = useState(null);
    const [otpInput, setOtpInput] = useState('');
    const [otpMessage, setOtpMessage] = useState({ text: '', type: 'info' });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('employeeUser'));
        setCurrentUser(storedUser);

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
            } catch (error) {
                console.error('Failed to fetch leads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleMenuClose();
        onLogout();
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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress size={60} /></Box>;

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#f4f6f8' }}>
            <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #4f2b68  30%, #ec4c23 90%)' }}>
                <Toolbar>
                    <Box component="img" src={logo} alt="Logo" sx={{ height: 40, mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {currentUser?.bank || 'Bank'} Executive Portal
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>Welcome, {currentUser?.fullName}</Typography>
                    <IconButton size="large" edge="end" onClick={handleMenuOpen} color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 1 }} />Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#4f2b68 ' }}>
                    Assigned Leads
                </Typography>

                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#4f2b68 ', '& .MuiTableCell-root': { color: 'white' } }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Lead ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Loan Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Assigned On</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.map((lead) => (
                                <TableRow key={lead._id} hover>
                                    <TableCell>{lead.leadID}</TableCell>
                                    <TableCell>{lead.fullName}</TableCell>
                                    <TableCell>{lead.loanType || 'N/A'}</TableCell>
                                    <TableCell>
                                        {moment(lead.assignedBanks.find(b => b.bankName === currentUser.bank)?.assignedAt).format('DD MMM YYYY')}
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
                            ))}
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
        </Box>
        </ThemeProvider>
    );
};

export default BankExecutivePanel;