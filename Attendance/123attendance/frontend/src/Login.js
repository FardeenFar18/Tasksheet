import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const history = useHistory();
    const [selectedEmail, setSelectedEmail] = useState('');
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // Initial time left in seconds
    const http_typ = process.env.REACT_APP_HTTP_TYP;
                const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;
    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get(`${http_typ}://${host_name_3005}/getEmails`);
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails:', error);
            }
        };

        fetchEmails();
    }, []);

    useEffect(() => {
        let timer;
        if (otpGenerated) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime === 0) {
                        clearInterval(timer);
                        alert('Time expired. Please enter your email and login again.');
                        // Reset component state to prompt user to enter email and login again
                        setSelectedEmail('');
                        setOtpGenerated(false);
                        setOtp('');
                        setTimeLeft(60);
                    }
                    return Math.max(0, prevTime - 1);
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [otpGenerated]);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${http_typ}://${host_name_3005}/login`, {
                username: selectedEmail,
            });

            if (response.data.otpGenerated) {
                setOtpGenerated(true);
                setTimeLeft(60); // Reset the timer
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post(`${http_typ}://${host_name_3005}/verifyOtp`, {
                username: selectedEmail,
                otp,
            });

            if (response.data.verified) {
                // Display alert box on successful OTP verification
                alert('OTP verified');

                // Navigate to the next page with radio buttons and pass user email as a query parameter
                history.push(`/next?email=${selectedEmail}`);
            } else {
                console.log('OTP verification failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    

    return (
        <div className='login-container'>
            <h2>Login Page</h2>
            <input
                type="text"
                placeholder="Email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
            />
            <button onClick={handleLogin}>Generate OTP</button>
            {otpGenerated && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleVerifyOtp}>Verify OTP</button>
                    
                    <p>Time left: {timeLeft} seconds</p>
                </div>
            )}
        </div>
    );
};

export default Login;
