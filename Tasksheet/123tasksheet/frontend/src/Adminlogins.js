import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from './123 Legal Logo New Outline.png';
import './design1.css';

const Adminlogins = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;

  // Timeout duration in milliseconds
  const INACTIVE_TIMEOUT = 600000; // 5 minutes

  useEffect(() => {
    let timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, INACTIVE_TIMEOUT);
    };

    const logout = () => {
      // Clear sessionStorage and redirect to login page
      sessionStorage.removeItem("admin");
      window.alert("Inactive timeout reached. You have been logged out.");
      navigate('');
    };

    // Start the timeout initially
    resetTimeout();

    // Add event listeners to reset the timeout
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    // Clear the timeout and remove event listeners on element unmount
    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${http_typ}://${host_name_3001}/admin-login1`, {
        email,
        password,
      });

      if (response.status === 200) {
        sessionStorage.setItem("adminlogin", email)
        console.log('Admin login successful', response);
        const data = response.data.data;
        const jsonData = JSON.stringify(data);
        sessionStorage.setItem("admin", jsonData);

        navigate('/admin2');
        window.location.reload();
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Incorrect email or password');
        } else if (error.response.status === 404) {
          setErrorMessage('Admin account does not exist');
        } else {
          setErrorMessage('An error occurred while logging in');
        }
      } else {
        setErrorMessage('An error occurred while logging in');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
    <div className="Admin-container">
      <div align='center'>
        <h2>Admin Login</h2>
        <label1>Email:</label1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <div className="password-input">
          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className='buttonpass' onClick={toggleShowPassword}>
            {showPassword ? (
              <span role="img" aria-label="Hide Password">
                <FaEyeSlash />
              </span>
            ) : (
              <span role="img" aria-label="Show Password">
                <FaEye />
              </span>
            )}
          </span>
        </div>

        <br />
        <button onClick={handleLogin} className='login-button1'>Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>Create an Account <Link to="signup">Signup</Link></p>
      </div>
    </div>
  );
};

export default Adminlogins;
