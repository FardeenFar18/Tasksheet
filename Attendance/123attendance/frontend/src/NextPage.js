import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './NextPage.css';

const NextPage = () => {
    const history = useHistory();
    const location = useLocation();
    const [selectedOption, setSelectedOption] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const emailFromURL = new URLSearchParams(location.search).get('email');
        if (emailFromURL) {
            sessionStorage.setItem('userEmail', emailFromURL);
            setUserEmail(emailFromURL);
        } else {
            setUserEmail(sessionStorage.getItem('userEmail'));
        }
    }, [location.search]);

    useEffect(() => {
        // Set up the timeout for automatic logout
        let logoutTimer;
        
        const resetTimer = () => {
            clearTimeout(logoutTimer);
            logoutTimer = setTimeout(() => {
                handleLogout();
            }, 600000); //600000 milliseconds = 10 minute
        };

        // Reset timer on user activity
        const resetTimerOnActivity = () => {
            resetTimer();
            document.addEventListener('click', resetTimer);
            document.addEventListener('mousemove', resetTimer);
            document.addEventListener('keypress', resetTimer);
        };

        resetTimerOnActivity();

        // Clean up event listeners on component unmount
        return () => {
            clearTimeout(logoutTimer);
            document.removeEventListener('click', resetTimer);
            document.removeEventListener('mousemove', resetTimer);
            document.removeEventListener('keypress', resetTimer);
        };
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        switch (option) {
            case 'working':
                history.push(`/working?email=${userEmail}&option=${option}`);
                break;
            case 'permission':
                history.push(`/permission?email=${userEmail}&option=${option}`);
                break;
            case 'priveledge':
                history.push(`/PrivilegeLeaveForm?email=${userEmail}&option=${option}`);
                break;
            case 'sick':
                history.push(`/sick?email=${userEmail}&option=${option}`);
                break;
            case 'details':
                history.push(`/dashboard/${userEmail}`);
                break;
            default:
                break;
        }
    };

    const handleLogout = () => {
        alert("You've been inactive for 10 minute. You will be logged out.");
        sessionStorage.removeItem('userEmail');
        history.push('/');
    };

    const handleLogout2 = () => {
        // alert("You've been inactive for 10 minute. You will be logged out.");
        // sessionStorage.removeItem('userEmail');
        history.push('/');
    };

    return (
        <>
       
        <div className='dashboard-container'>
            
            <h2 className='dashboard-title' align='center'>Welcome to User DashBoard!</h2>
            <div className='dashboard-buttons button '>
            <button onClick={() => handleOptionClick('working')}>Working</button> &nbsp;
            <button onClick={() => handleOptionClick('permission')}>Permission</button> &nbsp;
            <button onClick={() => handleOptionClick('priveledge')}>Privilege Leave</button> &nbsp;
            <button onClick={() => handleOptionClick('sick')}>Sick Leave</button> &nbsp;
            <button onClick={() => handleOptionClick('details')}>DashBoard</button> &nbsp;
            
            <button onClick={handleLogout2}>Logout</button>
            </div>
        </div>
        

        </>
    );
};

export default NextPage;