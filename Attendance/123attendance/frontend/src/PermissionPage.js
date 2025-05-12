import React, { useState, useEffect } from 'react';
import Mycalender from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';
// import './PermissionPage.css';
import './stylepage2.css';

const PermissionPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [startAmPm, setStartAmPm] = useState('AM');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [endAmPm, setEndAmPm] = useState('AM');
  const [description, setDescription] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userEmail = queryParams.get('email');
  const selectedOption = queryParams.get('option');
  const history = useHistory();
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }, []);

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

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleRequestPermission = async () => {
    const startTime = `${startHour}:${startMinute} ${startAmPm}`;
    const endTime = `${endHour}:${endMinute} ${endAmPm}`;

    const data = {
      date: selectedDate.toLocaleDateString(),
      period: selectedPeriod,
      startTime,
      endTime,
      email: userEmail,
      option: selectedOption,
      description: description,
    };

    try {
      const response = await axios.post(`${http_typ}://${host_name_3005}/storePermission`, data);
      console.log('Permission data stored successfully:', response.data);
      window.alert("Form submitted successfully!");
      history.push(`/next`);
    } catch (error) {
      console.error('Error storing permission data:', error);
    }
  };

  const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
if (yesterday.getDay() === 0) {
    yesterday.setDate(yesterday.getDate() - 1);
}

const today = new Date();

const minDate = yesterday;
const maxDate = today;

const tileDisabled = ({ date, view }) => view === 'month' && date.getDay() === 0;

  return (
    <div className='permission-container'>
      <h1 style={{textAlign: 'center'}} >Permission Form</h1>

      
           <div className='calendar-container2' >
           <label>Date:</label>
        <Mycalender
          onChange={handleDateChange}
          value={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          tileDisabled={tileDisabled} // Pass the tileDisabled function here
        />
      </div>
      
      {selectedPeriod === '' && (
        <div className="period-buttons">
          <label>Period:</label>
          <button  className="button-morning"  onClick={() => handlePeriodChange('Morning')} >
            Morning
          </button> &nbsp;
          <button className="button-afternoon" onClick={() => handlePeriodChange('Afternoon')}>
            Afternoon
          </button>
        </div>
      )}

      {selectedPeriod === 'Morning' && (
        <h2>Morning</h2>
      )}

      {selectedPeriod === 'Afternoon' && (
        <h2 >Afternoon</h2>
      )}

      {(selectedPeriod === 'Morning' || selectedPeriod === 'Afternoon') && (
        <>
          <div className='permissiondate'>
            <label>Start Time:</label>
            <input type="number" min="1" max="12" value={startHour} onChange={(e) => setStartHour(e.target.value)} />
            <span>:</span>
            <input type="number" min="0" max="59" value={startMinute} onChange={(e) => setStartMinute(e.target.value)} />
            <select value={startAmPm} onChange={(e) => setStartAmPm(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
<br/>
<div className='permissiondate1'>
            <label>End Time:</label>
            <input type="number" min="1" max="12" value={endHour} onChange={(e) => setEndHour(e.target.value)} />
            <span>:</span>
            <input type="number" min="0" max="59" value={endMinute} onChange={(e) => setEndMinute(e.target.value)} />
            <select value={endAmPm} onChange={(e) => setEndAmPm(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
<br/>
<div className='privilegetextarea'>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
<br/>
<div className='button-privilege-container'>
            <button  className='button-submit 'onClick={handleRequestPermission}>
              Request Permission
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionPage;
