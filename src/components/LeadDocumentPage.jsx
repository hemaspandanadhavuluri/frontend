import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import DocumentCenter from './DocumentCenter';
import { API_URL } from '../constants';

const LeadDocumentPage = () => {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false); // New state for read-only mode

    const fetchLead = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            setLead(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch lead details. The lead may not exist or there was a network issue.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // Check user role from localStorage
        const storedUser = localStorage.getItem('employeeUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.role === 'BankExecutive') {
                    setIsReadOnly(true);
                }
            } catch (e) { console.error("Could not parse user from storage", e); }
        }
        fetchLead();
    }, [fetchLead]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading Document Center...</Typography>
            </Box>
        );
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {error && <Typography color="error.main" align="center" sx={{ mb: 2 }}>{error}</Typography>}
                {lead && (
                    <Paper elevation={3}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
                            <Typography variant="h5" gutterBottom>
                                Document Upload for: <strong>{lead.fullName}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Lead ID: {lead.leadID}</Typography>
                        </Box>
                        <DocumentCenter lead={lead} onUpdate={fetchLead} isReadOnly={isReadOnly} />
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default LeadDocumentPage;