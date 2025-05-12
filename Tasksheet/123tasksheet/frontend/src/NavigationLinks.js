import React from "react";
import { Nav } from 'react-bootstrap';
import LogoutIcon from './logout.gif';


const NavigationLinks = ({ handleIconHover, handleIconHoverOut, handleHomeClick, handleTaskSheetClick, handleLogout, handleLogin, isLoggedIn, hoveredIcon, HomeIcon, TaskSheet, LoginIcon, admin }) => {
  return (
    <>
      <Nav.Link onClick={handleHomeClick} className="d-flex align-items-center">
        <img 
          src={HomeIcon} 
          alt="home" 
          className="mr-1" 
          onMouseOver={() => handleIconHover("Home")} 
          onMouseOut={handleIconHoverOut} 
        /><br/>
        Home
        {hoveredIcon === "Home" && <span className="hover-text">Home</span>}
      </Nav.Link>&nbsp;&nbsp;
      <Nav.Link onClick={handleTaskSheetClick} className="d-flex align-items-center">
        <img 
          src={TaskSheet} 
          alt="TaskSheet" 
          className="mr-1" 
          onMouseOver={() => handleIconHover("TaskSheet")} 
          onMouseOut={handleIconHoverOut} 
        /><br/>
        TaskSheet
        {hoveredIcon === "TaskSheet" && <span className="hover-text">TaskSheet</span>}
      </Nav.Link>
      <Nav.Link onClick={isLoggedIn ? handleLogout : handleLogin} className="d-flex align-items-center">
        <img 
          src={isLoggedIn ? LoginIcon : LogoutIcon} // Make sure to define or import LogoutIcon
          alt={isLoggedIn ? "Logout" : "Login"} 
          className="mr-1" 
          onMouseOver={() => handleIconHover(isLoggedIn ? "Logout" : "Login")} 
          onMouseOut={handleIconHoverOut} 
        /><br/>
        {isLoggedIn ? "Logout" : "Login"}
        {hoveredIcon === (isLoggedIn ? "Logout" : "Login") && <span className="hover-text">{isLoggedIn ? "Logout" : "Login"}</span>}
      </Nav.Link>
      <Nav.Link href="/admin-login" className="d-flex align-items-center">
        <img 
          src={admin} 
          alt="Org Login" 
          className="mr-1" 
          onMouseOver={() => handleIconHover("Org Login")} 
          onMouseOut={handleIconHoverOut} 
        /><br/>
        Org Login
        {hoveredIcon === "Org Login" && <span className="hover-text">Org Login</span>}
      </Nav.Link>
    </>
  );
}

export default NavigationLinks;


  