import React, { useState, useEffect } from "react";
import { Navbar, Nav, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from "react-router-dom";
import Logo from './123 Legal Logo New Outline.png';
import LoginIcon from './login.gif';
import TaskSheet from './task.gif';
import admin from './admin.gif';
import dashboard from './board.gif';
import news from './news.gif';
import axios from 'axios';
import './stylepage.css';
import MyDashboards from './piechart.gif';
import MyProfile from './Profile.gif';

const Header1 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(false);
  const [notificationCount, setNotificationCount] = useState(); // Set this state based on the count of new notifications
  const [taskcount, setTaskcount] = useState(false);
  const [orgLoginClicked, setOrgLoginClicked] = useState(sessionStorage.getItem("orgLoginClicked") === "true");
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userLoggedIn = sessionStorage.getItem("authToken");
    if (userLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem("adminlogin");
    if (adminLoggedIn) {
      setOrgLoginClicked(true);
    } else {
      setOrgLoginClicked(false);
    }
  }, []);


  useEffect(() => {
    const userMail = sessionStorage.getItem("userEmail");
    console.log("38", userMail);
    setUserEmail(userMail);
  }, []);
  console.log("43", userEmail);

  useEffect(() => {
    const userActivity = () => {
      setSessionTimeout(false);
    };

    const timeout = setTimeout(() => {
      handleLogout();
    }, 600000);

    document.addEventListener("mousemove", userActivity);
    document.addEventListener("keydown", userActivity);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousemove", userActivity);
      document.removeEventListener("keydown", userActivity);
    };
  }, []);

  const handleIconHover = (altName) => {
    setHoveredIcon(altName);
  };

  const handleIconHoverOut = () => {
    setHoveredIcon(null);
  };

  const handleTaskSheetClick = () => {
    if (isLoggedIn) {
      navigate(`/tasksheet?email=${userEmail}`);
      console.log("66", userEmail);
    }
  };

  const handleDashBoardClick = () => {
    if (isLoggedIn) {
      navigate(`/user1/${userEmail}`);
    }
  };

  const handleMyDashBoardClick = () => {
    if (isLoggedIn) {
      navigate(`/Mydashboard/${userEmail}`);
    }
  };

  const handleMyProfileClick = () => {
    if (isLoggedIn) {
      navigate(`/Myprofile/${userEmail}`);
    }
  };

  const handleAudioClick = async () => {
    if (isLoggedIn) {
      try {
        navigate(`/audio/${userEmail}`);
        const response = await axios.put(`${http_typ}://${host_name_3001}/updateUnreadStatus/${userEmail}`);
        if (response.status === 200) {
          console.log('Unread count:', response.data.unreadFalseCount);
        } else {
          console.error('Failed to retrieve unread count');
        }
      } catch (error) {
        console.error('Error retrieving unread count:', error);
      }
    }
  };

  const fetchUnreadCount = async (userEmails) => {
    try {
      const response = await axios.post(`${http_typ}://${host_name_3001}/countUnread/userEmail`, { "email": userEmails });
      if (response.status === 200) {
        console.log('Unread count:', response.data.count);
        setNotificationCount(response.data.count);
      } else {
        console.error('Failed to retrieve unread count');
      }
    } catch (error) {
      console.error('Error retrieving unread count:', error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/logins");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  useEffect(() => {
    const emailFromURL = sessionStorage.getItem("userEmail")
    console.log("144", emailFromURL);
    if (emailFromURL) {
      setUserEmail(emailFromURL);
      fetchUnreadCount(emailFromURL);
      fetchUnreadCountTask(emailFromURL);
    } // No else condition to clear userEmail
  }, [location.search]);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']") || document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.href = Logo;

    if (!document.querySelector("link[rel='icon']")) {
      document.head.appendChild(faviconLink);
    } else {
      document.head.querySelector("link[rel='icon']").href = Logo;
    }

    document.title = "123legal";
  }, []);

  if (sessionTimeout) {
    return <div>Session Timeout</div>;
  }
  console.log("214", orgLoginClicked);

  const isLoginPage = location.pathname === '/logins' || location.pathname === '/admin-logins';

  return (
    <div className="header">
      <Navbar bg="white" variant="light" expand="lg" className="header1">
        <Row className="logo-wid ">
          <Col xs={4} sm={3}>
            <Navbar.Brand href="/">
              <img
                src={Logo}
                alt="logo"
                className="logo p-3"
                onMouseOver={() => handleIconHover("Logo")}
                onMouseOut={handleIconHoverOut}
              />
              {hoveredIcon === "Logo" && <span className="hover-text">Logo</span>}
            </Navbar.Brand>
          </Col>
          <h1>TASKSHEET</h1>
          <br />
          <Col xs={8} sm={9}>
            <Nav className="ml-auto">
              <Link to={`/tasksheet?email=${userEmail}`} className="nav-link" onClick={handleTaskSheetClick}>
                <img 
                  src={TaskSheet} 
                  alt="TaskSheet" 
                  className="mr-1" 
                  onMouseOver={() => handleIconHover("TaskSheet")} 
                  onMouseOut={handleIconHoverOut} 
                /><br/>
                TaskSheet
                {hoveredIcon === "TaskSheet" && <span className="hover-text">TaskSheet</span>}
              </Link>
              <Link to={`/user1/${userEmail}`} className="nav-link" onClick={handleDashBoardClick}>
                <img 
                  src={dashboard} 
                  alt="Dashboard" 
                  className="mr-1" 
                  onMouseOver={() => handleIconHover("Dashboard")} 
                  onMouseOut={handleIconHoverOut} 
                /><br/>
                DashBoard
                {hoveredIcon === "Dashboard" && <span className="hover-text">Dashboard</span>}
              </Link>
              <Link to={`/Mydashboard/${userEmail}`} className="nav-link" onClick={handleMyDashBoardClick}>
                <img 
                  src={MyDashboards} 
                  alt="My Dashboard" 
                  className="mr-1" 
                  onMouseOver={() => handleIconHover("My Dashboard")} 
                  onMouseOut={handleIconHoverOut} 
                /><br/>
                My DashBoard
                {hoveredIcon === "My Dashboard" && <span className="hover-text">My Dashboard</span>}
              </Link>
              <Link to={`/audio/${userEmail}`} className="nav-link" onClick={handleAudioClick}>
                <img 
                  src={news} 
                  alt="News" 
                  className="mr-1" 
                  onMouseOver={() => handleIconHover("News")} 
                  onMouseOut={handleIconHoverOut} 
                /><br/>
                News
                {hoveredIcon === "News" && <span className="hover-text">News</span>}
                {notificationCount > 0 && <span className="notification-dot"></span>}
              </Link>
             


              {!isLoggedIn && (
                <>
                  <Nav.Link onClick={handleLogin} className="d-flex align-items-center">
                    <img 
                      src={LoginIcon} 
                      alt="Login" 
                      className="mr-1" 
                      onMouseOver={() => handleIconHover("Login")} 
                      onMouseOut={handleIconHoverOut} 
                    />
                    <br/>
                    Login
                    {hoveredIcon === "Login" && <span className="hover-text">Login</span>}
                  </Nav.Link>
                  <Nav.Link href="/admin-logins" className="d-flex align-items-center">
                    <img 
                      src={admin} 
                      alt="Org Login" 
                      className="mr-1" 
                      onMouseOver={() => handleIconHover("Org Login")} 
                      onMouseOut={handleIconHoverOut} 
                    />
                    <br/>
                    Org Login
                    {hoveredIcon === "Org Login" && <span className="hover-text">Org Login</span>}
                  </Nav.Link>
                </>
              )}
              {isLoggedIn && !isLoginPage && (
                <>
                 <Link to={`/Myprofile/${userEmail}`} className="nav-link" onClick={handleMyProfileClick}>
                 <img 
                   src={MyProfile} 
                   alt="Profile" 
                   className="mr-1" 
                   onMouseOver={() => handleIconHover("Profile")} 
                   onMouseOut={handleIconHoverOut} 
                 /><br/>
                 {isLoggedIn ? userEmail : "Profile"}
                 {hoveredIcon === "Profile" && <span className="hover-text">Profile</span>}
               </Link>
                <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
                  <img 
                    src={LoginIcon} 
                    alt="Logout" 
                    className="mr-1" 
                    onMouseOver={() => handleIconHover("Logout")} 
                    onMouseOut={handleIconHoverOut} 
                  /><br/>
                  Logout
                  {hoveredIcon === "Logout" && <span className="hover-text">Logout</span>}
                </Nav.Link>
                </>
              )}
              
            </Nav>
          </Col>
        
        </Row>
      </Navbar>
    </div>
  );
};

export default Header1;
