import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import './AdminLogin.css';
import './stylepage.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const http_typ = process.env.REACT_APP_HTTP_TYP;
                const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response =await axios.post(`${http_typ}://${host_name_3005}/admin-login`, {
        email,
        password,
      });

      if (response.status === 200) {
        console.log('Admin login successful');
        history.push('/admin')
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      setErrorMessage('An error occurred while logging in');
    }
  };




const toggleShowPassword = () => {
  setShowPassword(!showPassword);
};


  return (
   
    <div className="Admin-container">
       <div align='center'>
  <h2>Admin Login</h2>
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  /><br />
  <br/>
 
  <div className="password-input">
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
</div>
</div>

  );
};

export default AdminLogin;