import React, { useState, useEffect } from 'react';
import axios from 'axios';
import districtsData from './District.json';

const TaskAssignmentForm = () => {
  const [task, setTask] = useState('');
  const [location, setLocation] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [email, setEmail] = useState('');
  const [id,setOrgNames]=useState([]);
  const [city, setCity] = useState(""); // Add city state
  const [district, setDistrict] = useState(""); // Add district state
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;

    
  useEffect(() => {
      const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
      setOrgNames(adminFromStorage);
    }, []);
  

  useEffect(() => {
    const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
    console.log(adminFromStorage);
  }, []);

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleLocationChange = (e) => {
    const selectedPlace = e.target.value;
    const selectedEntry = districtsData.find(entry => entry.place === selectedPlace);
    if (selectedEntry) {
      const formattedValue = `${selectedEntry.place}, ${selectedEntry.district}`;
      setCity(formattedValue.split(', ')[0]);
      setDistrict(formattedValue.split(', ')[1]);
    }
  };

  const handleLastDateChange = (e) => {
    setLastDate(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${http_typ}://${host_name_3001}/assign-task`, {
        task,
        location:city,
        district:district,
        lastDate,
        email,
        id,
      });
      console.log(response.data);
      setTask('');
      setLocation('');
      setLastDate('');
      setEmail('');
      alert("Task Added Successfully");
      window.location.reload();
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
        <div className='Addtask'>
            <h2>Add Task</h2>

<div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder='Email'
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
<br/>
     

      <div>
      <div className='addtask-city'>
      <label className="location-label">City:</label>        
          <select
          className="prefix-input"
          name="place"
          value={city.split(', ')[0]}
          onChange={handleLocationChange}
        >
          <option value="">- Select location -</option>
          {districtsData.map((entry, index) => (
            <option key={index} value={entry.place}>
              {entry.place}
            </option>
          ))}
        </select>
        </div>
        
        <br/>
        <br/>

        <label className="location-label">District:</label>
        <input
          type="text9"
          value={district}
          readOnly
          className="district-input"
        />
        

      </div>
      <br/>
      <div>
        <label htmlFor="lastDate">Task EOD:</label>
        <input
          type="date"
          id="lastDate"
          value={lastDate}
          onChange={handleLastDateChange}
          required
        />
      </div>
      <br/>
      <div>
        <label htmlFor="task">Task Description:</label>
        <textarea
          id="task"
          placeholder='Description'
          value={task}
          onChange={handleTaskChange}
          required
        ></textarea>
      </div>
      
      
      <button type="submit">Assign Task</button>
      </div>
    </form>
  );
};

export default TaskAssignmentForm;
