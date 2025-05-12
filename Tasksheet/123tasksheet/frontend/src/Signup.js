import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import districtsData from './District.json';
import './stylepage.css';

const AdminSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [orgName, setOrgName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [city, setCity] = useState(""); // Add city state
  const [district, setDistrict] = useState(""); // Add district state
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;

  const handleLocationChange = (e) => {
    const selectedPlace = e.target.value;
    const selectedEntry = districtsData.find(entry => entry.place === selectedPlace);
    if (selectedEntry) {
      const formattedValue = `${selectedEntry.place}, ${selectedEntry.district}`;
      setCity(formattedValue.split(', ')[0]);
      setDistrict(formattedValue.split(', ')[1]);
    }
  };

  const handleSignup = async () => {


 



    try {
      const response = await axios.post(`${http_typ}://${host_name_3001}/admin-signup`, {
        username,
        email,
        password,
        location:city,
        district:district,
        address,
        orgName,
      });

      if (response.status === 200) {
        console.log('Admin signup successful');
        alert("Account Created Successfully");
        navigate('/admin-login');
      }
      
    } catch (error) {
      console.error('Admin signup failed:', error);
      setErrorMessage('An error occurred while signing up');
    }
  };

  return (
    <div className="Admin-container1">
      <div align='center'>
        <h2>Admin Signup</h2>
        <label htmlFor="username">Username:</label><br/>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br/>

        <label1 htmlFor="email">Email:</label1><br/>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br/>

        <label2 htmlFor="password">Password:</label2><br/>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br/>

        <label3 htmlFor="city">City:</label3>        
          <select
          className="prefix-input"
          name="place"
          value={city.split(', ')[0]}
          onChange={handleLocationChange}
        >
          <option value="">- Select location -</option>
          {districtsData.map((entry, index) => (
            <option key={index} value={entry.place}>
              {entry.place}
            </option>
          ))}
        </select>
        
        <br/>
        <br/>

        <label8 htmlFor="district">District:</label8>
        <input
          type="text10"
          value={district}
          readOnly
          className="district-input"
        />
        <br/>
        <br/>

        <label4 htmlFor="address">Address:</label4><br/>
        <textarea
          id="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        /><br /><br/>
    
        <label5 htmlFor="orgName">Organization:</label5><br/>
        <select
          id="orgName"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        >
          <option value="">Select Organization</option>
          <option value="Associate-A">Associate-A</option>
          <option value="Associate-B">Associate-B</option>
    
        
        </select><br /><br/>

        <button onClick={handleSignup} className='signup-button'>Signup</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p>Already have an account? <Link to="admin-login">Login</Link></p>
      </div>
    </div>
  );
};

export default AdminSignup;
