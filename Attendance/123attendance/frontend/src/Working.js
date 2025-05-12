import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
import Yourcalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NextPage from './NextPage';
// import './Working.css';
import './stylepage2.css';

const WorkingPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [description, setDescription] = useState('');
    const [workingHours, setWorkingHours] = useState(null);
    const [overtime, setOvertime] = useState(null);
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

    const handleStartTimeChange = (e) => {
        const { value } = e.target;
        setStartTime(value);
        
        // Calculate default end time
        const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${value}`);
        const defaultEndDateTime = new Date(startDateTime.getTime() + (8 * 60 * 60 * 1000)); // Adding 8 hours
        const defaultEndTime = `${defaultEndDateTime.getHours().toString().padStart(2, '0')}:${defaultEndDateTime.getMinutes().toString().padStart(2, '0')}`;
        setEndTime(defaultEndTime);
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const calculateWorkingHours = () => {
        if (startTime && endTime) {
            const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${startTime}`);
            const endDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${endTime}`);
            const timeDifference = endDateTime - startDateTime;
            const totalMilliseconds = timeDifference;
            const totalSeconds = totalMilliseconds / 1000;
            const totalMinutes = totalSeconds / 60;
            const totalHours = totalMinutes / 60;
            const hours = Math.floor(totalHours);
            const minutes = Math.floor(totalMinutes % 60);

            // Calculate overtime
            let overtimeHours = 0;
            if (hours > 8) {
                overtimeHours = hours - 8;
            }

            setWorkingHours(`${hours} hours ${minutes} minutes`);

            if (overtimeHours > 0) {
                setOvertime(`${overtimeHours} hours`);
            } else {
                setOvertime(null);
            }
        } else {
            setWorkingHours(null);
            setOvertime(null);
        }
    };

    const handleSubmit = async () => {
        const dateToStore = new Date(selectedDate);
        dateToStore.setDate(selectedDate.getDate() + 1);

        // Format the date for storage
        const formattedDate = dateToStore.toISOString().split('T')[0];

        const data = {
            email: userEmail,
            option: selectedOption,
            date: formattedDate,
            startTime,
            endTime,
            description,
            workingHours,
            overtime,
        };

        try {
            const response =  await axios.post(`${http_typ}://${host_name_3005}/storeWorkingHours`, data);
            console.log('Data stored successfully:', response.data);
            window.alert("Form submitted successfully!");
            history.push("/next");
        } catch (error) {
            console.error('Error storing data:', error);
        }
    };

    // Function to check if a given date is a Sunday
    const isSunday = (date) => {
        return date.getDay() === 0; // Sunday corresponds to day 0 in JavaScript Date objects
    };

    // Calculate one week before today
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return (
        <div className='working-container'>
            <h1 >Attendance Sheet</h1>

           
               
            <div className="calendar-container">
                <label>Date:</label>
                </div>
                <div className="calendar-container1">
                <Yourcalendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={oneWeekAgo}
                    maxDate={new Date()}
                    tileDisabled={({ date }) => isSunday(date)}
                />
            </div>

            <div className='permissiondate'>
                <label>Start Time:</label>
                <input type="time" value={startTime} onChange={handleStartTimeChange} />
            </div>
<br/>
<div className='permissiondate1'>
                <label>End Time:</label>
                <input type="time" value={endTime} onChange={handleEndTimeChange} />
            </div>
<br/>
            <div className='working-description-box'>
                <label className='description-sentence '>Description:</label>
                <textarea  className='descriptio-box' value={description} onChange={handleDescriptionChange} />
            </div>

            <div align='center'>
                
                <button onClick={calculateWorkingHours} disabled={!startTime || !endTime} className='buttons'>
                    Calculate Working Hours
                </button>
                
            </div> &nbsp;

            {workingHours && (
                <div align='center'>
                    <p>Working Hours: {workingHours}</p>
                    {overtime && <p>Overtime: {overtime}</p>}
                </div>
            )}

            <div align='center'>
                <button onClick={handleSubmit}className='buttons'>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default WorkingPage;