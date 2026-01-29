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
    Card,
    CardContent,
    Grid,
    ThemeProvider,
    createTheme,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    Lock as LockIcon,
    Send as SendIcon,
    Login as LoginIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import axios from 'axios';
import logo from './logo.jpeg';

// Custom Theme for a modern, professional look
const theme = createTheme({
    palette: {
        primary: {
            main: '#ec4c23', // Orange
            light: '#ff7e50',
            dark: '#b02e00',
        },
        secondary: {
            main: '#4f2b68', // Purple
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
            },
        },
    },
});

const EmployeeLogin = ({ onLoginSuccess }) => {
    const [step, setStep] = useState('identifier'); // 'identifier' or 'otp'
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [userId, setUserId] = useState(null);

    const API_URL = 'http://localhost:5000/api/users';

    const showMessage = (text, type = 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            showMessage('Please enter your email or mobile number.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/send-otp`, { identifier: identifier.trim() });
            setUserId(response.data.userId);
            setStep('otp');
            showMessage('OTP sent successfully! Please check your email/SMS.', 'success');
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

            // Store user details and token in localStorage
            localStorage.setItem('employeeUser', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);

            showMessage('Login successful! Redirecting...', 'success');

            // Call the success callback to handle navigation
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
                    background: 'linear-gradient(135deg, #4f2b68  0%, #ec4c23 100%)',
                }}
            >
                <Paper
                    elevation={10}
                    sx={{
                        width: '100%',
                        maxWidth: 450,
                        p: 4,
                        borderRadius: 3,
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Box component="img" src={logo} alt="Logo" sx={{ height: 80, mb: 2, objectFit: 'contain' }} />
                        <Typography variant="h4" component="h1" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                            Employee Portal
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            {step === 'identifier' ? 'Enter your email or mobile number to receive OTP' : 'Enter the OTP sent to your device'}
                        </Typography>
                    </Box>

                    {message.text && (
                        <Alert
                            severity={message.type === 'success' ? 'success' : 'error'}
                            sx={{ mb: 3 }}
                            onClose={() => setMessage({ text: '', type: '' })}
                        >
                            {message.text}
                        </Alert>
                    )}

                    {step === 'identifier' ? (
                        <Box component="form" onSubmit={handleSendOTP}>
                            <TextField
                                fullWidth
                                label="Email or Mobile Number"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                variant="outlined"
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {identifier.includes('@') ? <EmailIcon /> : <PhoneIcon />}
                                        </InputAdornment>
                                    ),
                                }}
                                placeholder="Enter email or mobile number"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
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
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        onClick={handleBackToIdentifier}
                                        disabled={loading}
                                        sx={{ py: 1.5, borderRadius: 2 }}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                        sx={{ py: 1.5, borderRadius: 2 }}
                                    >
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

export default EmployeeLogin;
