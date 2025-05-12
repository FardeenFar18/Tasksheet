import React, { useState, useEffect } from "react";
import Yourcalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
import './stylepage2.css';
import Logo from './123 Legal Logo New Outline.png';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import districtsData from './District.json';
import "./design1.css";


const TaskPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [filer, setFiler] = useState(null);
  const [description, setDescription] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [modalDescription, setModalDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalSelectedFiles, setModalSelectedFiles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const userEmail = queryParams.get("email");
  const usersEmail = queryParams.get("email");
  const [modalLocation, setModalLocation] = useState("");
  const [taskLocation, settaskLocation] = useState("");
  const [counterOption, setCounterOption] = useState("");
  const [otherLocation, setOtherLocation] = useState(sessionStorage.getItem("otherLocation") || "");
  const [otherLocation1, setOtherLocation1] = useState(sessionStorage.getItem("otherLocation1") || "");
  const [locationOptions, setLocationOptions] = useState(JSON.parse(sessionStorage.getItem("locationOptions")) || []);
  const [locationOptions1, setLocationOptions1] = useState(JSON.parse(sessionStorage.getItem("locationOptions1")) || []);
  const [locations, setLocations] = useState("");
  const [locations1, setLocations1] = useState("");
  const [counter, setCounter] = useState("");
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognition = new window.webkitSpeechRecognition();
  const [city, setCity] = useState(""); // Add city state
  const [district, setDistrict] = useState(""); // Add district state
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
  const host_name_3002 = process.env.REACT_APP_HOST_NAME_3002;
  const [userEmails, setUserEmail] = useState('');
  
   
  
  useEffect(() => {
  
    const userLoggedIn = sessionStorage.getItem("authToken");
    if (userLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    recognition.continuous = true;
  
    if (isListening) {
      recognition.start();
    }
  
    recognition.onresult = event => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setRecognizedText(prevText => prevText + ' ' + transcript);
    };
  
    recognition.onerror = event => {
      console.error("Recognition error:", event.error);
      if (event.error === 'no-speech') {
        setIsListening(false);
      }
    };
  
    return () => {
      recognition.stop();
    };
  }, [isListening, recognition]);
  
  const handleOKButtonClick = () => {
    if (otherLocation.trim() !== "") {
      const updatedOptions = [...locationOptions];
      updatedOptions.push({ value: otherLocation, label: otherLocation });
      setLocationOptions(updatedOptions);
      setModalLocation(otherLocation);
      sessionStorage.setItem("locationOptions", JSON.stringify(updatedOptions));
      // window.location.reload();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("userEmail"); 
    sessionStorage.removeItem("authToken");
    setUserEmail('');
    navigate("/");
    window.location.reload();
  };
  

  const handleOKButtonClick1 = () => {
    console.log(otherLocation1,"96");
    if (otherLocation1.trim() !== "") {

      const updatedOptions = [...locationOptions];
      updatedOptions.push({ value: otherLocation1, label: otherLocation1 });
      setLocationOptions1(updatedOptions);
      settaskLocation(otherLocation1);
      sessionStorage.setItem("locationOptions1", JSON.stringify(updatedOptions));

    }
    // window.location.reload();
  };

  const handleCancelButtonClick = () => {
    setOtherLocation("");
  };

  const handleCancelButtonClick1 = () => {
    setOtherLocation1("");
  };

  const handleCounterChange = (event) => {
    const selectedCounter = event.target.value;
    setCounter(selectedCounter);
  };

  const handleDateChange = (date) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setSelectedDate(utcDate);
  };

  const handleModalDateChange = (date) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setModalDate(utcDate);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFollowButtonClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
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




  
  

  const handleLocationChange1 = (event) => {
    const selectedLocation = event.target.value;
    settaskLocation(selectedLocation);
    setLocations1(selectedLocation);
    if (selectedLocation !== "Others1") {
      setOtherLocation1("");
    }
  };

  const handleOtherLocationChange = (event) => {
    const location = event.target.value;
    setOtherLocation(location);
    sessionStorage.setItem("otherLocation", location);
  };

  const handleOtherLocationChange1 = (event) => {
    const location = event.target.value;
    setOtherLocation1(location);
    sessionStorage.setItem("otherLocation1", location);
  };

  let fileId;

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(filer);
      const fileDataResponse =  await axios.post(`${http_typ}://${host_name_3002}/modal-file`,
        {
          files: filer,
          maxContentLength: 50 * 1024 * 1024,
          maxBodyLength: 50 * 1024 * 1024,
        }
      );

      if (fileDataResponse.status === 200) {
        console.log(fileDataResponse.data.fileId, "fieldId");
        fileId = fileDataResponse.data.fileId;
        console.log(fileId);
        console.log("File data submitted successfully.");
      } else {
        console.error("File data submission failed");
      }
      const textData = {
        email: usersEmail,
        modalDescription:modalDescription+recognizedText,
        modalDate,
        fileId,
        locations:city,
        district:district,
        counter,
      };
      console.log(textData);
      const textDataResponse = await axios.post(`${http_typ}://${host_name_3001}/modals`,
        textData
      );

      if (textDataResponse.status === 200) {
        console.log(
          "Text data submitted successfully. ID:",
          textDataResponse.data.id
        );
        alert("Add Follow form submitted successfully");
      } else {
        console.error("Text data submission failed");
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isSunday = (date) => {
    return date.getDay() === 0;
  };

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fileDataResponse = await axios.post(`${http_typ}://${host_name_3002}/tasks-file`,
        {
          files: file,
          maxContentLength: 50 * 1024 * 1024,
          maxBodyLength: 50 * 1024 * 1024,
        }
      );

      if (fileDataResponse.status === 200) {
        console.log(fileDataResponse.data.fileId);
        const fileId = fileDataResponse.data.fileId;

        const textData = {
    
          email: userEmail,
          description: description + recognizedText,
          selectedDate,
          fileId,
          locations1:city,
          district:district,
        };
        console.log("262",textData);

        const textDataResponse =  await axios.post(`${http_typ}://${host_name_3001}/tasks`,
          textData
        );

        if (textDataResponse.status === 200) {
          console.log(
            "Text data submitted successfully. ID:",
            textDataResponse.data.id
          );
          alert("Task form submitted successfully");
        } else {
          console.error("Text data submission failed");
        }
      } else {
        console.error("File data submission failed");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = async (e) => {
    const files = await convertToBase64(e.target.files[0]);
    setFile(files);
  };

  const handleModalFileChange = async (e) => {
    const files = await convertToBase64(e.target.files[0]);
    setFiler(files);
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
  };

  const isLoginPage = location.pathname === '/logins';
  return (
    <>
      <div className="working-container">
 
          <div onClick={handleLogout}> 
            <button className="btn-logout2">Logout</button>
          </div>
     
        <h1>Task Sheet</h1>
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

        <div className="description-follow-container">
          <button className="description1" onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}
            </button>
          <div className="working-description-box">
            <label className="description-sentence">Description:</label>
            <textarea
  className="descriptio-box"
  value={description + recognizedText}
  onChange={(e) => {
    const fullText = e.target.value;
    const separatorIndex = fullText.indexOf(description) + description.length;
    const newDescription = fullText.slice(0, separatorIndex);
    const newRecognizedText = fullText.slice(separatorIndex);
    handleDescriptionChange({ target: { value: newDescription } });
    setRecognizedText(newRecognizedText);
  }}
/>




          </div>
          <button className="follow-button" onClick={handleFollowButtonClick}>
            Add Follow up
          </button>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModalClose}
          contentLabel="Second Calendar Modal"
        >
          <h2>Date :</h2>
          <Yourcalendar onChange={handleModalDateChange} value={modalDate} />
          <br />
          <div className="description-follow-container">
          <button className ="description1"onClick={() => setIsListening(prevState => !prevState)}>
            {isListening ? <FontAwesomeIcon icon={faMicrophoneSlash} /> : <FontAwesomeIcon icon={faMicrophone} />}
            </button>
          <label className="description-sentence">Description:</label>
          <br />
          <textarea
            className="modal-descriptio-box"
            value={description + recognizedText}
  onChange={(e) => {
    const fullText = e.target.value;
    const separatorIndex = fullText.indexOf(description) + description.length;
    const newDescription = fullText.slice(0, separatorIndex);
    const newRecognizedText = fullText.slice(separatorIndex);
    handleDescriptionChange({ target: { value: newDescription } });
    setRecognizedText(newRecognizedText);
  }}
/>
</div>
          <br />
          <br />

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
        <br/>
        <br/>

          
          <br />

          <label>Counter:</label>

          <label>
            <input
              type="radio"
              value="Yes"
              checked={counter === "Yes"}
              onChange={handleCounterChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              value="No"
              checked={counter === "No"}
              onChange={handleCounterChange}
            />
            No
          </label>
          <br />

          <br />

          <input
            type="file"
            accept=".jpg,.jpeg,.pdf"
            onChange={handleModalFileChange}
          />
          <br />
          <br/>



          <button className="task-button" onClick={handleModalSubmit}>Submit</button>
          <button className="task-button1" onClick={handleModalClose}>Close</button>
        </Modal>

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
        <br/>
        <br/>

        <input
          type="file"
          accept=".jpg,.jpeg,.pdf"
          onChange={handleFileChange}
          multiple
        />

        <div align="center">
          <button onClick={handleSubmit} className="working-buttons">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskPage;
