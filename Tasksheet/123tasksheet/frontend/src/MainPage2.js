import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa'; // Import the user and shield icons
import imageSrc from './image1.png'; // Import your image file

import Header from './Header';
import Footer from './Footer';
import './MainPage.css'; // Import your CSS file
import './design2.css';

const MainPages = () => {
  return (
    <>
    
      <div className="main-container"> {/* Added class */}
        <img src={imageSrc} alt="Description of the image" />
        {/* Use the imported image variable as the src */}
        {/* Add a descriptive alt attribute for accessibility */}
        {/* <img src={image} alt=""/> */}
      </div>
     
 
    </>
  );
};

export default MainPages;
