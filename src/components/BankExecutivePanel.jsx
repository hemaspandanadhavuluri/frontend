import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Chip, Button, AppBar, Toolbar, IconButton,
    Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { AccountCircle as AccountCircleIcon, Logout as LogoutIcon } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../constants';

const BankExecutivePanel = ({ onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [note, setNote] = useState('');

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
                    }
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

    const handleOpenNotesDialog = (lead) => setSelectedLead(lead);
    const handleCloseNotesDialog = () => {
        setSelectedLead(null);
        setNote('');
    };

    const handleSaveNote = async () => {
        if (!note.trim() || !selectedLead) return;

        try {
            const payload = {
                // The backend expects `newCallNote` but we'll use it for external notes
                // A dedicated endpoint would be better in the long run.
                externalCallNote: {
                    notes: note,
                    loggedByName: `${currentUser.fullName} (${currentUser.bank})`,
                    // We need a way to pass the user ID. For now, backend will use a placeholder.
                }
            };
            // This should be a dedicated endpoint like /api/leads/:id/external-note
            // For now, we use the general update endpoint.
            const response = await axios.put(`${API_URL}/${selectedLead._id}`, payload);
            
            // Update the lead in the local state
            setLeads(leads.map(l => l._id === selectedLead._id ? response.data : l));
            handleCloseNotesDialog();

        } catch (error) {
            console.error('Failed to save external note:', error);
            alert('Error saving note. Please try again.');
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

    return (
        <>
            <AppBar position="static" sx={{ mb: 4, background: 'linear-gradient(45deg, #004d40 30%, #00796b 90%)' }}>
                <Toolbar>
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

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
                    Assigned Leads
                </Typography>

                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#e0f2f1' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Lead ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Loan Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Assigned On</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
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
                                    <TableCell>
                                        <Button variant="contained" size="small" onClick={() => handleOpenNotesDialog(lead)}>
                                            View & Add Notes
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* Notes Dialog */}
            <Dialog open={!!selectedLead} onClose={handleCloseNotesDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#004d40', color: 'white' }}>
                    Notes for {selectedLead?.fullName} (Lead: {selectedLead?.leadID})
                </DialogTitle>
                <DialogContent dividers>
                    {selectedLead && (
                        <Box>
                            <Typography variant="h6" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Lead Information (Read-Only)</Typography>
                            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                                <Typography><b>Email:</b> {selectedLead.email}</Typography>
                                <Typography><b>Phone:</b> {selectedLead.mobileNumbers?.join(', ')}</Typography>
                                <Typography><b>Location:</b> {selectedLead.permanentLocation}</Typography>
                                <Typography><b>Loan Amount:</b> {selectedLead.fee || 'N/A'}</Typography>
                            </Paper>

                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>External Notes History</Typography>
                            <Box sx={{ maxHeight: 200, overflowY: 'auto', p: 1, border: '1px solid #ddd', borderRadius: 1, mb: 3 }}>
                                {selectedLead.externalCallHistory?.length > 0 ? (
                                    selectedLead.externalCallHistory.slice().reverse().map((log, index) => (
                                        <Box key={index} sx={{ mb: 1.5, borderLeft: '3px solid #00796b', pl: 1 }}>
                                            <Typography variant="caption" display="block">
                                                {moment(log.createdAt).format('DD MMM YYYY, h:mm A')} by <b>{log.loggedByName}</b>
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>"{log.notes}"</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography>No external notes yet.</Typography>
                                )}
                            </Box>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Add a new note..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNotesDialog}>Cancel</Button>
                    <Button onClick={handleSaveNote} variant="contained" color="primary" disabled={!note.trim()}>
                        Save Note
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BankExecutivePanel;