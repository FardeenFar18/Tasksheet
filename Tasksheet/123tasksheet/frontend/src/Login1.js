import React, { useState, useEffect,  useRef  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from './123 Legal Logo New Outline.png';
import './Login.css';

const Logins = ({ onLogin }) => {
    const navigate = useNavigate();
    const [selectedEmail, setSelectedEmail] = useState('');
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // Initial time left in seconds
    const [otpVerified, setOtpVerified] = useState(false);
    const [showPasswordPage, setShowPasswordPage] = useState(false);
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordFieldExists, setPasswordFieldExists] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const logoutTimerRef = useRef(null);
    const inactivityTimeout = 600000;
    const http_typ = process.env.REACT_APP_HTTP_TYP;
    const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;

    useEffect(() => {
        let timer;
        if (otpGenerated) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime === 0) {
                        clearInterval(timer);
                        alert('Time expired. Please enter your email and login again.');
                        // Reset element state to prompt user to enter email and login again
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
    
    useEffect(() => {
        const checkPasswordField = async () => {
            try {
                if (selectedEmail.trim() !== '') {
                    const response = await axios.post(`${http_typ}://${host_name_3001}/checkPasswordField`, {
                        username: selectedEmail,
                    });
                    setPasswordFieldExists(response.data.passwordFieldExists);
                }
            } catch (error) {
                console.error('Error checking password field:', error);
            }
        };

        checkPasswordField();
    }, [selectedEmail]);

    const handleEmailChange = (e) => {
        setSelectedEmail(e.target.value);
    };

    const handleLogin = async () => {
        try {
            if (passwordFieldExists) {
                if (!selectedEmail || !Password) {
                    alert('Please enter both email and password.');
                    return;
                }
                console.log('Attempting login with credentials:', selectedEmail, Password);
                // Submit password for login verification
                const response =  await axios.post(`${http_typ}://${host_name_3001}/loginWithPassword`, {
                    username: selectedEmail,
                    password: Password
                });
              
                console.log('Login response:', response.data);
                
                if (response.data.success) {
                    sessionStorage.setItem("authToken", selectedEmail)

                    sessionStorage.setItem("userEmail",selectedEmail)
                    navigate(`/Mydashboard/${selectedEmail}`);
                    window.location.reload();

                    // Password is correct, proceed with login
                    if (typeof onLogin === 'function') {
                        onLogin(); // Call the onLogin function passed as prop to indicate successful login
                    }
                } else {
                    // Password is incorrect
                    alert('Invalid credentials. Please try again.');
                }
            } else {
                // If password field does not exist, generate OTP
                const response = await axios.post(`${http_typ}://${host_name_3001}/login`, {
                    username: selectedEmail,
                });
    
                if (response.data.otpGenerated) {
                    setOtpGenerated(true);
                    setTimeLeft(60); // Reset the timer
                }
            }

           
            
        } catch (error) {
            console.error('Login failed:', error);
            // Handle specific error cases, if needed
            if (error.response && error.response.status === 401) {
                alert('Unauthorized: Please check your credentials.');
            } else {
                setErrorMessage('Account is not exists contact your associates');
            }
        }
    };
    
    

    const handleVerifyOtp = async () => {
        try {
            const response =  await axios.post(`${http_typ}://${host_name_3001}/verifyOtp`, {
                username: selectedEmail,
                otp,
            });

            if (response.data.verified) {
                // Display alert box on successful OTP verification
                alert('OTP verified');
                setOtpVerified(true);
                setShowPasswordPage(true);
            } else {
                console.log('OTP verification failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    const handleSubmitPassword = async () => {
        try {
            // Make a POST request to the setPassword endpoint with the password
            const response = await axios.post(`${http_typ}://${host_name_3001}/setPassword`, {
                username: selectedEmail,
                password: Password
            });

            // Handle response
            console.log(response.data); // Assuming response contains a message property
            navigate(`/?email=${selectedEmail}`);
        } catch (error) {
            console.error('Error submitting password:', error);
        }
    };

    useEffect(() => {
        const resetTimer = () => {
            clearInterval(logoutTimerRef.current);
            logoutTimerRef.current = setInterval(() => {
                // Logout the user after timeout
                alert('Automatic logout due to inactivity.');
                // Reset element state and redirect to login page
                setSelectedEmail('');
                setOtpGenerated(false);
                setOtp('');
                setTimeLeft(60);
                setOtpVerified(false);
                setShowPasswordPage(false);
                setPassword('');
                setConfirmPassword('');
                setPasswordMatch(true);
                setErrorMessage('');
                clearInterval(logoutTimerRef.current);
                navigate(''); // Redirect to login page
            }, inactivityTimeout);
        };

        // Start the timer
        resetTimer();

        // Clear the timer and reset when user interacts with the page
        const clearTimer = () => {
            clearInterval(logoutTimerRef.current);
            resetTimer();
        };

        // Event listeners for user interaction
        document.addEventListener('mousemove', clearTimer);
        document.addEventListener('keypress', clearTimer);

        // Cleanup function to remove event listeners and clear timer
        return () => {
            document.removeEventListener('mousemove', clearTimer);
            document.removeEventListener('keypress', clearTimer);
            clearInterval(logoutTimerRef.current);
        };
    }, [navigate, inactivityTimeout]);

    useEffect(() => {
        // Find the existing favicon link element
        const faviconLink = document.querySelector("link[rel='icon']") || document.createElement('link');
        
        // Set the rel and href attributes for the favicon
        faviconLink.rel = 'icon';
        faviconLink.href = Logo; // Set the href attribute to your Logo image
    
        // Append the favicon link element to the head of the document if it doesn't exist
        if (!document.querySelector("link[rel='icon']")) {
          document.head.appendChild(faviconLink);
        } else {
          // Update the existing favicon link element
          document.head.querySelector("link[rel='icon']").href = Logo;
        }
    
        // Set the document title
        document.title = "123legal"; // Change "Your New Tab Name" to your desired title
      }, []);

    return (
        <div className='login-container'>
            <h2>Login Page</h2>
            <input
                type="text"
                placeholder="Email"
                value={selectedEmail}
                onChange={handleEmailChange}
            />
            {passwordFieldExists && (
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br/>
                    <br/>
                    <button className='login-button' onClick={handleLogin}>Login</button>
                    
                </div>
            )}
            {!passwordFieldExists && (
                (!otpVerified && !otpGenerated) ? (
                    <div>
                    
                    <button onClick={handleLogin}>Generate OTP</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                    
                ) : (
                    otpGenerated && !otpVerified && (
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
                    )
                )
            )}
            {otpVerified && (
                <div>
                    <h2>Set Password</h2>
                    <input
                        type="password"
                        placeholder="Password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br/>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {!passwordMatch && <p>Passwords do not match</p>}
                    <br/>
                    <button onClick={handleSubmitPassword}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default Logins;
