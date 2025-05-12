import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './123 Legal Logo New Outline.png';
import adminSrc from './adminsrc.jpg';
import './MainPage.css'; // Import your CSS file
import './design2.css';

const AdminPages = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if associate is logged in
    const associateLoggedIn = sessionStorage.getItem('associateLoggedIn'); // Assuming you set this upon associate login

    // If associate is logged in, redirect to associate page
    if (associateLoggedIn) {
     navigate('/addusers'); // Redirect to the associate page
     
    }
  }, [navigate]);

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
    <div className='centered-content'>
  
      <div className="main-container"> {/* Added class */}
        <img src={adminSrc} alt="Description of the image" />
        {/* Use the imported image variable as the src */}
        {/* Add a descriptive alt attribute for accessibility */}
        {/* <img src={image} alt=""/> */}
      </div>
    </div>
  );
};

export default AdminPages;
