import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import './stylepage2.css';
import districtsData from './District.json';

const UserDashboards = () => {
  const { userEmail } = useParams();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [descriptionTaskId, setDescriptionTaskId] = useState(null);
  const [tempDescription, setTempDescription] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognition = new window.webkitSpeechRecognition();
  const [city, setCity] = useState(""); // Add city state
  const [district, setDistrict] = useState(""); // Add district state
  // const [filee, setMongoFileId] = useState(null); // State to hold MongoDB file ID
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
  const host_name_3002 = process.env.REACT_APP_HOST_NAME_3002;

  useEffect(() => {
    recognition.continuous = true;

    if (isListening) {
      recognition.start();
    }

    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setRecognizedText(prevText => prevText + ' ' + transcript);
    };

    recognition.onerror = event => {
      console.error("Recognition error:", event.error);
      if (event.error === 'no-speech') {
        // Automatically stop listening when there's no speech input
        setIsListening(false);
      }
    };

    return () => {
      recognition.stop();
    };
  }, [isListening, recognition]);

  const toggleListening = () => {
    setIsListening(prevState => !prevState);
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  const clearText = () => {
    setRecognizedText('');
  };

  const handleTyping = event => {
    setRecognizedText(event.target.textContent);
  };

  const handleBackspace = () => {
    setRecognizedText(prevText => prevText.slice(0, -1));
  };

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response =  await axios.get(`${http_typ}://${host_name_3001}/admin/task-activity/${userEmail}`);
        setAssignedTasks(response.data);
        console.log("73",response.data);
      } catch (error) {
        console.error('Error fetching assigned tasks:', error);
      }
    };
    

    fetchAssignedTasks();
  }, [userEmail]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    console.log(taskId);
    try {
      if (newStatus === 'inprogress') {
        showDescriptionBox(taskId);
      } else {
        const endpoint = newStatus === 'completed' ? `/taskcompleted/${taskId}` : `/inprogress/${taskId}`;
        axios.put(`${http_typ}://${host_name_3001}${endpoint}`);
        setAssignedTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error(`Error updating task status to ${newStatus}:`, error);
    }
  };

  let fileId;
  const submitDescription = async () => {
    
    try {
      
      if (descriptionTaskId !== null) {
        // Upload file to MongoDB
        // const formData = new FormData();
        // formData.append('file', file);
        console.log(file,"53")
        const fileDataResponse = await axios.post(`${http_typ}://${host_name_3002}/upload-file`,
          {
            file: file,
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
            maxContentLength: 50 * 1024 * 1024, // 50MB
            maxBodyLength: 50 * 1024 * 1024, // 50MB
            
          }

          
        );
        console.log(file,"68");
       
  
        if (fileDataResponse.status === 200) {
          console.log(fileDataResponse.data.fileId, "72");
          fileId= fileDataResponse.data.fileId;
          
          console.log(fileId,"77");
          console.log("File data submitted successfully.");
          //   showCustomModal(`Form submitted successfully\nYOUR TICKET ID: ${ticketId}`);
          //   showCustomModal(`Form submitted successfully\nYOUR TICKET ID: ${ticketId}`)
          //     setTicketIdState(true);
        } else {
          console.error("File data submission failed");
        }

        // Update task in PostgreSQL with MongoDB file ID
        axios.put(`${http_typ}://${host_name_3001}/inprogress/${descriptionTaskId}`, {
          description: tempDescription + recognizedText,
          location: city,
          district: district,
          fileId: fileId, // Store MongoDB file ID in PostgreSQL
        });
        setAssignedTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === descriptionTaskId ? { ...task, description: tempDescription, status: 'inprogress' } : task
          )
        );
        closeDescriptionBox();
        setTempDescription(''); 
      } else {
        console.error('Task ID is null or undefined.');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error updating description or task status:', error);
    }
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
  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    setTempDescription(value);
  };

  // const handleLocationChange = (event) => {
  //   const { value } = event.target;
  //   setLocation(value);
  // };

  const handleFileChange = async (e) => {
    const files = await convertToBase64(e.target.files[0]);
    setFile(files);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result.split(",")[1]);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }


  const closeDescriptionBox = () => {
    setDescriptionTaskId(null);
    setTempDescription(''); // Reset description state
    setLocation('');
    setFile(null);
   
  };
  

  const showDescriptionBox = (taskId) => {
    setDescriptionTaskId(taskId);
    const task = assignedTasks.find(task => task.id === taskId);
    setTempDescription(task.description || ''); // Set tempDescription to task description
    setLocation(task.location || '');
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format date as per locale
  };

  return (
    <div className='user2'>
      <h2>Assigned Tasks</h2>
      <table>
  <thead>
    <tr>
      <th>Id</th>
      <th>Task</th>
      <th>Location</th>
      <th>District</th>
      <th>Status</th>
      <th>Last Date</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {assignedTasks.map(task => (
      <tr key={task.id}>
        <td>{task.id}</td>
        <td>{task.task}</td>
        <td>{task.location}</td>
        <td>{task.district}</td>
        <td>{task.status}</td>
        <td>{formatDate(task.last_date)}</td>
        <td>
          {task.status !== 'completed' && (
            <button onClick={() => handleTaskStatusChange(task.id, 'completed')}>
              Mark as Complete
            </button>
          )}
          {!descriptionTaskId && (
            <button onClick={() => handleTaskStatusChange(task.id, 'inprogress')}>
              Mark as In Progress
            </button>
          )}
          {/* <Link to="/speech">
          <button>Speech</button>
          </Link> */}
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {descriptionTaskId !== null && (
        <div className="modal1">
          <div className="modal1-content">
            <span className="close1" onClick={closeDescriptionBox}>&times;</span>
           
            <strong>Description:</strong>
            <button onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}
            </button>
            <textarea
              value={tempDescription + recognizedText}
              onChange={(e) => {
    const fullText = e.target.value;
    const separatorIndex = fullText.indexOf(tempDescription) + tempDescription.length;
    const newDescription = fullText.slice(0, separatorIndex);
    const newRecognizedText = fullText.slice(separatorIndex);
    handleDescriptionChange({ target: { value: newDescription } });
    setRecognizedText(newRecognizedText);
  }}
            />
            <br/>
            <div>
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
        
        <br/>
        <br/>

        <label className="location-label">District:</label>
        <input
          type="text8"
          value={district}
          readOnly
          className="district-input"
        />
        

            </div>
            <br/>
            <div>
              <strong>Upload File:</strong>
              <input
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <button onClick={submitDescription}>Mark as In Progress</button>
              {/* <button onClick={closeDescriptionBox}>Close</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboards;
