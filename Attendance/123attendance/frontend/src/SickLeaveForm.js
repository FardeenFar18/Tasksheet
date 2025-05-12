import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation, useHistory } from 'react-router-dom';
// import './SickLeaveForm.css';
import './stylepage2.css';

const SickLeaveForm = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userEmail = queryParams.get('email');
    const selectedOption = queryParams.get('option');
    const history = useHistory();
    const http_typ = process.env.REACT_APP_HTTP_TYP;
    const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

    useEffect(() => {
        const unlisten = history.listen(() => {
            history.push('/next');
        });

        return () => {
            unlisten();
        };
    }, [history]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const formatDate = (date) => {
        const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        return utcDate.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
        const data = {
            email: userEmail,
            option: selectedOption,
            date: formatDate(selectedDate),
            description,
        };

        try {
            const response =  await axios.post(`${http_typ}://${host_name_3005}/storeSickLeave`, data);
            console.log('Sick leave data stored successfully:', response.data);
            window.alert("Form submitted successfully!");
            history.push(`/next`)
        } catch (error) {
            console.error('Error storing sick leave data:', error);
        }
    };

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // If yesterday is Sunday, set it to the previous Saturday
    if (yesterday.getDay() === 0) {
        yesterday.setDate(yesterday.getDate() - 1);
    }

    // Calculate today's date
    const today = new Date();

    // Function to disable Sundays
    const tileDisabled = ({ date, view }) => view === 'month' && date.getDay() === 0;

    return (
        
        <div className='sick-container'>
            <h1 style={{textAlign: 'center'}}>Sick Leave Form</h1>

            <div>
                <label >Date:</label>
                

                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={yesterday} // Minimum date is yesterday
                    maxDate={today} // Maximum date is today
                    tileDisabled={tileDisabled} // Disable Sundays
                />
            </div>
<br/>
<div className='privilegetextarea'>
                
                <label>Description:</label>
                <textarea value={description} onChange={handleDescriptionChange} />
            </div>
            
<br/>
<div className='button-privilege-container'>
                <button className='sick-button'onClick={handleSubmit}>
                    Submit Sick Leave
                </button>
            </div>
            </div>
        
    );
};

export default SickLeaveForm;