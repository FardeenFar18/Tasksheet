import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation, useHistory } from 'react-router-dom';
// import './PrivilegeLeaveForm.css';
import './stylepage2.css';

const PrivilegeLeaveForm = () => {
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [submittedDates, setSubmittedDates] = useState([]);
    const [showFromDateCalendar, setShowFromDateCalendar] = useState(false);
    const [showToDateCalendar, setShowToDateCalendar] = useState(false);
    const location = useLocation();
    const history = useHistory();
    const queryParams = new URLSearchParams(location.search);
    const userEmail = queryParams.get('email');
    const selectedOption = queryParams.get('option');
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const http_typ = process.env.REACT_APP_HTTP_TYP;
    const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

    useEffect(() => {
        const fromParam = queryParams.get('from');
        const toParam = queryParams.get('to');
        if (fromParam && toParam) {
            const fromDate = new Date(fromParam);
            const toDate = new Date(toParam);
            setFromDate(fromDate);
            setToDate(toDate);
        }
    }, [queryParams]);

    useEffect(() => {
        const unlisten = history.listen(() => {
            history.push('/next');
        });

        return () => {
            unlisten();
        };
    }, [history]);

    useEffect(() => {
        // Retrieve submitted dates from localStorage on component mount
        const storedDates = JSON.parse(localStorage.getItem('submittedDates')) || [];
        setSubmittedDates(storedDates);
    }, []);

    const handleFromDateChange = (date) => {
        setFromDate(date);
        setShowFromDateCalendar(false);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
        setShowToDateCalendar(false);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async () => {
        const fromDateLocal = new Date(fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000));
        const toDateLocal = new Date(toDate.getTime() - (toDate.getTimezoneOffset() * 60000));
    
        const data = {
            email: userEmail,
            option: selectedOption,
            fromDate: fromDateLocal.toISOString().split('T')[0],
            toDate: toDateLocal.toISOString().split('T')[0],
            description,
        };

        try {
            const response = await axios.post(`${http_typ}://${host_name_3005}/storePrivilegeLeave`, data);
            console.log('Privilege leave data stored successfully:', response.data);
            window.alert("Form submitted successfully!");
            history.push(`/next`);
            setError(null);

            const updatedDates = [...submittedDates, fromDateLocal.toISOString().split('T')[0]];
            localStorage.setItem('submittedDates', JSON.stringify(updatedDates));
            setSubmittedDates(updatedDates);
        } catch (error) {
            console.error('Error storing privilege leave data:', error);
            setError(error.message);
            if (error.response) {
                console.log('Server responded with:', error.response.data);
                window.alert("You have already submitted in this date");
            }
        }
    };

    const isSunday = (date) => {
        return date.getDay() === 0;
    };

    const toggleFromDateCalendar = () => {
        setShowFromDateCalendar(!showFromDateCalendar);
    };

    const toggleToDateCalendar = () => {
        setShowToDateCalendar(!showToDateCalendar);
    };

    return (
        <div className='privilege-container'>
            <h1 style={{textAlign: 'center'}}>Privilege Leave Form</h1>

            <div className='privilegeinput'>
                <label>From Date:</label>
                <input
                    type="text"
                    value={fromDate.toLocaleDateString()}
                    onFocus={toggleFromDateCalendar}
                    ref={fromDateRef}
                />
                {showFromDateCalendar && (
                    <Calendar
                        onChange={handleFromDateChange}
                        value={fromDate}
                        minDate={new Date()}
                        tileDisabled={({ date }) => isSunday(date)}
                        onClickDay={() => fromDateRef.current.blur()}
                    />
                )}
            </div>
<br/>
<div className='privilegeinput'>
                <label className='date'>To Date:</label>
                <input
                    type="text"
                    value={toDate.toLocaleDateString()}
                    onFocus={toggleToDateCalendar}
                    ref={toDateRef}
                />
                {showToDateCalendar && (
                    <Calendar
                        onChange={handleToDateChange}
                        value={toDate}
                        minDate={fromDate}
                        tileDisabled={({ date }) => isSunday(date)}
                        onClickDay={() => toDateRef.current.blur()}
                    />
                )}
            </div>

            <div className='privilegetextarea'>
                <label>Description:</label>
                <textarea value={description} onChange={handleDescriptionChange} />
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <div className='button-privilege-container'>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default PrivilegeLeaveForm;
