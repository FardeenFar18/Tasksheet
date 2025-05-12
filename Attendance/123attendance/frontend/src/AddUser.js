import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
// import './AddUser.css';
import './stylepage.css';
const AddUser = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); 
    const [phone, setPhone] = useState('');
    const [joining_date, setJoiningDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();
    const http_typ = process.env.REACT_APP_HTTP_TYP;
    const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

    const handleAddUser = async () => {
        try {
            const response = await axios.post(`${http_typ}://${host_name_3005}/addUser`, { email, username, phone, joining_date }); 
            console.log('User added:', response.data);

            // Show success alert
            window.alert('User added successfully!');
            history.push('/admin');
            // Reset form fields and error message
            setEmail('');
            setUsername('');
            setPhone('');
            setJoiningDate('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error adding user:', error);

            if (error.response && error.response.status === 500) {
                setErrorMessage('Email already exists in the database.');
            } else {
                setErrorMessage('An error occurred while adding the user.');
            }
        }
    };

    return (

        <div className="Main-container">
  
            <h2>Admin Page</h2>
            <div className='adminadd'> 
            <label>Username:</label>
            <input
                type="text1"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className='adminadd'> 
            <label>Email :</label>
            <input
                type="text1"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div className='adminadd'> 
            <label>Phone Number:</label>
            <input
                type="text1"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            </div>
            <div className='adminadd'> 
            
            <label>Joining Date :</label>
            <input
                type="date"
                value={joining_date}
                onChange={(e) => setJoiningDate(e.target.value)}
            /></div>
            <div className='submit-button'>
            <button onClick={handleAddUser}>Submit</button>
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <br/>
            
        </div>
        
    );
};

export default AddUser;