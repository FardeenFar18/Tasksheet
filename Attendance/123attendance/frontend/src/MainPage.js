import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa'; // Import the user and shield icons
import './MainPage.css'; // Import your CSS file
import './stylepage.css';

const MainPage = () => {
  return (
    <>
    
  
   
    
    <div className="main-container"> {/* Added class */}
    
      
      <h1 align='center'>Attendance</h1> {/* Added class */}
      <div className="button-container"> {/* Added class */}
        <Link to="/admin-login">
          <button className="login-button">
            <FaUserShield className="icon" /> {/* Admin icon */}
            Admin Login
          </button>
        </Link> &nbsp;
        <Link to="/login">
          <button className="login-button"> {/* Added class */}
            <FaUser className="icon" /> {/* User icon */}
            User Login
          </button>
        </Link>
      </div>
      </div>
      
      </>
    
  );
};

export default MainPage;