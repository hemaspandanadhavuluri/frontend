import React, { useState } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Grid,
    ThemeProvider,
    createTheme,
    InputAdornment
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    Send as SendIcon,
    Login as LoginIcon,
    AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import axios from 'axios';

// Custom Theme for the Bank Portal
const theme = createTheme({
    palette: {
        primary: {
            main: '#00695c', // Teal
            light: '#4db6ac',
            dark: '#004d40',
        },
        secondary: {
            main: '#f9a825', // Amber
        },
        background: {
            default: '#eceff1', // Blue Grey
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: { borderRadius: 16 },
            },
        },
    },
});

const BankLogin = ({ onLoginSuccess }) => {
    const [step, setStep] = useState('identifier'); // 'identifier' or 'otp'
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const API_URL = 'http://localhost:5000/api/users';

    const showMessage = (text, type = 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            showMessage('Please enter your registered email.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/send-otp`, { identifier: identifier.trim() });
            setStep('otp');
            showMessage('OTP sent successfully! Please check your email.', 'success');
        } catch (error) {
            console.error('Send OTP error:', error);
            showMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            showMessage('Please enter the OTP.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/verify-otp`, {
                identifier: identifier.trim(),
                otp: otp.trim()
            });

            // Ensure the user is a BankExecutive
            if (response.data.user.role !== 'BankExecutive') {
                showMessage('Access Denied. This portal is for Bank Executives only.');
                setLoading(false);
                return;
            }

            localStorage.setItem('employeeUser', JSON.stringify(response.data.user));
            showMessage('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                onLoginSuccess(response.data.user);
            }, 1500);
        } catch (error) {
            console.error('Verify OTP error:', error);
            showMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToIdentifier = () => {
        setStep('identifier');
        setOtp('');
        setMessage({ text: '', type: '' });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container
                maxWidth={false}
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    py: 4,
                    background: 'linear-gradient(135deg, #007991 0%, #78ffd6 100%)',
                }}
            >
                <Paper elevation={10} sx={{ width: '100%', maxWidth: 450, p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Box sx={{ mb: 4 }}>
                        <AccountBalanceIcon sx={{ color: 'primary.main', mb: 2, fontSize: 60 }} />
                        <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                            Bank Partner Portal
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            {step === 'identifier' ? 'Enter your registered email to receive an OTP' : 'Enter the OTP sent to your email'}
                        </Typography>
                    </Box>

                    {message.text && (
                        <Alert severity={message.type === 'success' ? 'success' : 'error'} sx={{ mb: 3 }} onClose={() => setMessage({ text: '', type: '' })}>
                            {message.text}
                        </Alert>
                    )}

                    {step === 'identifier' ? (
                        <Box component="form" onSubmit={handleSendOTP}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                variant="outlined"
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Enter your registered email"
                            />
                            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />} sx={{ py: 1.5, borderRadius: 2 }}>
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleVerifyOTP}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                OTP sent to: {identifier}
                            </Typography>
                            <TextField
                                fullWidth
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                variant="outlined"
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ maxLength: 6 }}
                                placeholder="123456"
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Button variant="outlined" fullWidth onClick={handleBackToIdentifier} disabled={loading} sx={{ py: 1.5, borderRadius: 2 }}>
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type="submit" variant="contained" fullWidth disabled={loading} startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />} sx={{ py: 1.5, borderRadius: 2 }}>
                                        {loading ? 'Verifying...' : 'Login'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default BankLogin;