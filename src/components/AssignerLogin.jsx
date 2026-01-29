import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import logo from './logo.jpeg';

const AssignerLogin = ({ onLoginSuccess }) => {
    const [step, setStep] = useState(1); // 1: Identifier, 2: OTP
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!identifier) {
            setError('Please enter your email address.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.post(`${API_URL.replace('/leads', '/users')}/send-otp`, { identifier });
            setStep(2);
            setMessage('OTP sent successfully. Please check your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL.replace('/leads', '/users')}/verify-otp`, { identifier, otp });
            if (response.data.user && response.data.user.role.toLowerCase() === 'assigner') {
                onLoginSuccess(response.data.user);
            } else {
                setError('Login failed. You do not have the required role.');
                setStep(1); // Go back to the first step
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Logo" className="h-20 w-auto" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Assigner Login</h1>

                {message && <div className="bg-blue-100 text-blue-700 p-3 mb-4 rounded-md text-sm">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm">{error}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400">
                            {loading ? 'Verifying...' : 'Login'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-blue-600 hover:underline">Use a different email</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AssignerLogin;