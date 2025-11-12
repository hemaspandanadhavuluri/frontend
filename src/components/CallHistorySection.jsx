import React from 'react';
import {
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Card,
    CardContent,
    Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';

const CallHistorySection = ({ lead, newNote, handleNoteChange, handleSaveNote, MOCK_USER_FULLNAME }) => {
    return (
        <Card variant="outlined" sx={{ mb: 4, borderColor: 'primary.main', borderWidth: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    📞 Call History & Notes
                </Typography>

                <Grid container spacing={4}>
                    {/* Internal Notes */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Internal Notes ({lead.callHistory?.length || 0})</Typography>
                        <Box sx={{ maxHeight: 250, overflowY: 'auto', p: 2, bgcolor: '#f3e5f5', borderRadius: 1, border: '1px solid #e1bee7' }}>
                            {lead.callHistory && lead.callHistory.length > 0 ? (
                                lead.callHistory.slice().reverse().map((log, index) => (
                                    <Box key={index} sx={{ mb: 1.5, p: 1, borderLeft: '3px solid #8e24aa', pl: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', color: 'text.secondary' }}>
                                            {moment(log.createdAt).format('DD MMM YYYY, h:mm A')} | By: <strong>{log.loggedByName || 'System'}</strong>
                                            <Chip label={log.callStatus || 'Log'} size="small" color={log.callStatus === 'Connected' ? 'success' : 'default'} sx={{ ml: 1, height: 20 }} />
                                        </Typography>
                                        <Typography variant="body2" component="p" sx={{ mt: 0.5, color: '#555' }}>"{log.notes}"</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">No internal notes recorded.</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* External Notes */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>External Notes ({lead.externalCallHistory?.length || 0})</Typography>
                        <Box sx={{ maxHeight: 250, overflowY: 'auto', p: 2, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px solid #c8e6c9' }}>
                            {lead.externalCallHistory && lead.externalCallHistory.length > 0 ? (
                                lead.externalCallHistory.slice().reverse().map((log, index) => (
                                    <Box key={index} sx={{ mb: 1.5, p: 1, borderLeft: '3px solid #388e3c', pl: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', color: 'text.secondary' }}>
                                            {moment(log.createdAt).format('DD MMM YYYY, h:mm A')} | By: <strong>{log.loggedByName || 'Bank'}</strong>
                                        </Typography>
                                        <Typography variant="body2" component="p" sx={{ mt: 0.5, color: '#555' }}>"{log.notes}"</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">No external notes from banks.</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Add New Note */}
                <Typography variant="h6" sx={{ mb: 2 }}>➕ Add New Note (Logged by: **{MOCK_USER_FULLNAME}**)</Typography>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            name="notes"
                            label="Notes / Conversation Summary"
                            placeholder="Enter detailed notes from the conversation..."
                            value={newNote.notes}
                            onChange={handleNoteChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Call Status *</InputLabel>
                            <Select name="callStatus" label="Call Status *" value={newNote.callStatus} onChange={handleNoteChange}>
                                <MenuItem value="Connected">Connected</MenuItem>
                                <MenuItem value="No Answer">No Answer</MenuItem>
                                <MenuItem value="Busy">Busy</MenuItem>
                                <MenuItem value="Invalid Number">Invalid Number</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button variant="contained" color="primary" onClick={handleSaveNote} fullWidth startIcon={<AddIcon />} size="medium">
                            Save Note
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default CallHistorySection;