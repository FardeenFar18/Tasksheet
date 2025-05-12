import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import './design1.css';
import Logo from './123 Legal Logo New Outline.png';
import './stylepage.css';

const AddUsers = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); 
    const [phone, setPhone] = useState('');
    const [joining_date, setJoiningDate] = useState('');
    const [org_name, setOrgName] = useState('');
    const [userType, setUserType] = useState(''); // New state for user type
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [id,setOrgNames]=useState([]);
    const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;

    
    useEffect(() => {
        const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
        setOrgNames(adminFromStorage);
      }, []);
    
    const handleAddUser = async () => {
        
   

        try {
            const response = await axios.post(`${http_typ}://${host_name_3001}/addUser1`, { 
                email, 
                username, 
                phone, 
                joining_date,
                id
                
                
            }); 
            console.log('User added:', response.data);

            // Show success alert
            window.alert('User added successfully!');
            navigate('/admin2');
            // Reset form fields and error message
            setEmail('');
            setUsername('');
            setPhone('');
            setJoiningDate('');
            // setUserType('');
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
        <div className="Main-container">
            <h2>Admin Page</h2>
            <div className='adminadd'> 
                <label>Username:</label>
                <input
                    type="text4"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className='adminadd'> 
                <label>Email :</label>
                <input
                    type="text4"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='adminadd'> 
                <label>Phone Number:</label>
                <input
                    type="text4"
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
                />
            </div>
            {/* <div className='adminadd'> 
                <label>User Type:</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="">Select User Type</option>
                    <option value="associate-A">Associate-A</option>
                    <option value="associate-B">Associate-B</option>
                </select>
            </div> */}
          
                <button className='submit-button' onClick={handleAddUser}>Submit</button>
          
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <br/>
        </div>
    );
};

export default AddUsers;
