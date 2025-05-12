import React, { useState, useEffect } from "react";
import axios from "axios";
import './DetailsPage1.css';

import { useNavigate, Link } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import Logo from './123 Legal Logo New Outline.png';
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";


const DetailsPage1 = () => {
  const [details, setDetails] = useState([]);
  const [modal, setmodals] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [detail, setDetail] = useState([]);
  const [detailsick, setSick] = useState([]);
  const [detailper, setPermission] = useState([]);
  const [orgName, setOrgNames] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  const [sortOrder, setSortOrder] = useState({ column: null, ascending: true });
  const [modalSortOrder, setModalSortOrder] = useState({ column: null, ascending: true });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showLastFiveDays, setShowLastFiveDays] = useState(false);
  const [showLastTenDays, setShowLastTenDays] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  const http_typ = process.env.REACT_APP_HTTP_TYP;
                const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
                const host_name_3002 = process.env.REACT_APP_HOST_NAME_3002;
  

  useEffect(() => {
    const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
    setOrgNames(adminFromStorage);
  }, []);

  useEffect(() => {
    merge();
    merge2();
  }, []);

  const merge = async () => {
    try {
      const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
      const postgres_result = await axios.post(`${http_typ}://${host_name_3001}/fetchDetails1`, { "data": adminFromStorage }
      );
      const merged = await Promise.all(
        postgres_result.data.tasks.map(async (table) => {
          const image =  await fetch (`${http_typ}://${host_name_3002}/tasks-file/${table.fileid}`
          );
          const data = await image.json();
          return {
            ...table,
            imagebase64: data.fileData[0].files,
          };
        })
      );
      setDetails(merged);
    } catch (error) {
      console.error("Error merging data:", error);
    }
  };

  const merge2 = async () => {
    try {
      const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
      const postgres_result = await axios.post(`${http_typ}://${host_name_3001}/fetchDetails1`, { "data": adminFromStorage }
      );
      const merged = await Promise.all(
        postgres_result.data.modals.map(async (table) => {
          const image =  await fetch (`${http_typ}://${host_name_3002}/modal-file/${table.fileid}`
          );
          const data = await image.json();
          return {
            ...table,
            imagebase64: data.fileData[0].files,
          };
        })
      );
      setmodals(merged);
      setDetail(postgres_result.data.privilegeLeave);
      setSick(postgres_result.data.sickLeave)
      setPermission(postgres_result.data.permissions)
    } catch (error) {
      console.error("Error merging data:", error);
    }
  };

  const handleDeleteByEmail = async (table, email, id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${http_typ}://${host_name_3001}deleteRecordByEmail/${table}/${email}/${id}`
      );
      window.alert("Data deleted successfully");
      fetchData(); // Refresh data after deletion

    } catch (error) {
      if (error.response) {
        console.error("Error deleting record:", error.response.data);
      } else {
        console.error("Error deleting record:", error.message);
      }
    }
    window.location.reload();
  };


 

  const downloadFile = (fileData) => {
    const isPDF = fileData.startsWith('JVBERi0xLj');
    const fileType = isPDF ? 'pdf' : 'jpg';

    const blob = b64toBlob(fileData, fileType);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `file.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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

  const handleSort = (column) => {
    if (sortOrder.column === column) {
      setSortOrder({ column, ascending: !sortOrder.ascending });
    } else {
      setSortOrder({ column, ascending: true });
    }
  };

  const sortedDetails = [...details].sort((a, b) => {
    if (sortOrder.column === 'name' || sortOrder.column === 'email' || sortOrder.column === 'description' || sortOrder.column === 'location') {
      if (a[sortOrder.column] < b[sortOrder.column]) return sortOrder.ascending ? -1 : 1;
      if (a[sortOrder.column] > b[sortOrder.column]) return sortOrder.ascending ? 1 : -1;
      return 0;
    } else if (sortOrder.column === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder.ascending ? dateA - dateB : dateB - dateA;
    } else {
      return 0;
    }
  });

  const renderSortArrow = (column, sortColumn, sortOrder) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const renderSortArrow1 = (column, sortColumn, modalSortOrder) => {
    if (sortColumn === column) {
      return modalSortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };


  const handleSort1 = (column, isModal = false) => {
    if (isModal) {
      if (modalSortOrder.column === column) {
        setModalSortOrder({ column, ascending: !modalSortOrder.ascending });
      } else {
        setModalSortOrder({ column, ascending: true });
      }
    } else {
      if (sortOrder.column === column) {
        setModalSortOrder({ column, ascending: !sortOrder.ascending });
      } else {
        setModalSortOrder({ column, ascending: true });
      }
    }
  };

  const sortedModal = [...modal].sort((a, b) => {
    if (modalSortOrder.column === 'id' || modalSortOrder.column === 'name' || modalSortOrder.column === 'email' || modalSortOrder.column === 'description' || modalSortOrder.column === 'location' || modalSortOrder.column === 'counter') {
      if (a[modalSortOrder.column] < b[modalSortOrder.column]) return modalSortOrder.ascending ? -1 : 1;
      if (a[modalSortOrder.column] > b[modalSortOrder.column]) return modalSortOrder.ascending ? 1 : -1;
      return 0;
    } else if (modalSortOrder.column === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return modalSortOrder.ascending ? dateA - dateB : dateB - dateA;
    } else {
      return 0;
    }
  });

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filterDetailsByMonth = (detail) => {
    if (!selectedMonth) return true;
    const detailDate = new Date(detail.date);
    const month = detailDate.getMonth() + 1;
    return month === parseInt(selectedMonth);
  };

  const filterLastFiveDays = (detail) => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() -5); // Subtract 5 days
  
    const detailDate = new Date(detail.date);
    return detailDate >= fiveDaysAgo && detailDate <= today;
  };
  
  // Event handler for changing the filter option
  const handleLastFiveDaysFilterChange = (event) => {
    const value = event.target.value;
    setShowLastFiveDays(value === "lastFiveDays");
  };
  
  
  const filterLastTenDays = (detail) => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // Subtract 10 days
  
    const detailDate = new Date(detail.date);
    return detailDate >= tenDaysAgo && detailDate <= today;
};

const handleLastTenDaysFilterChange = (event) => {
  const value = event.target.value;
  setShowLastTenDays(value === "lastTenDays");
};

const handleFilterChange = (event) => {
  const value = event.target.value;
  if (value === "lastFiveDays") {
    setShowLastFiveDays(true);
    setShowLastTenDays(false); // Ensure only one of these flags is true at a time
  } else if (value === "lastTenDays") {
    setShowLastTenDays(true);
    setShowLastFiveDays(false); // Ensure only one of these flags is true at a time
  } else {
    setShowLastFiveDays(false); // Reset both flags to false if "All" option is selected
    setShowLastTenDays(false);
  }
};

const handleUsernameChange = (event) => {
  setSelectedUsername(event.target.value);
};

const filterByUsername = (detail) => {
  if (!selectedUsername) return true;
  return detail.username === selectedUsername;
};

const handleDateChange = (event) => {
  setSelectedDate(event.target.value);
};

const filterDetailsByDate = (detail) => {
  if (!selectedDate) return true;
  // Assuming detail.date is in ISO string format, adjust this according to your date format
  const detailDate = new Date(detail.date);
  const selectedDateObj = new Date(selectedDate);
  return detailDate.toDateString() === selectedDateObj.toDateString();
};


  return (
    <div>
      <h1>User Details</h1>

      <Link to="/">
        <button className="btn-logout1">Logout</button>
      </Link>

      <label>Sort by:</label>

<select onChange={handleMonthChange}>
<option value="">All Months</option>
<option value="1">January</option>
<option value="2">February</option>
<option value="3">March</option>
<option value="4">April</option>
<option value="5">May</option>
<option value="6">June</option>
<option value="7">July</option>
<option value="8">August</option>
<option value="9">September</option>
<option value="10">October</option>
<option value="11">November</option>
<option value="12">December</option>

</select>&nbsp;

<label>Sort by:</label>
<select onChange={handleFilterChange}>
<option value="">All</option>
<option value="lastFiveDays">Last 5 Days</option>
<option value="lastTenDays">Last 10 Days</option>
</select> &nbsp;


<label>Sort by name:</label>
<select value={selectedUsername} onChange={handleUsernameChange}>
<option value="">All</option>
{details.reduce((uniqueUsernames, detail) => {
if (!uniqueUsernames.includes(detail.username)) {
uniqueUsernames.push(detail.username);
}
return uniqueUsernames;
}, []).map((username) => (
<option key={username} value={username}>
{username}
</option>
))}
</select>&nbsp;

<label>Sort date:</label>
<input type="date" className="date-input" value={selectedDate} onChange={handleDateChange} />



      <h2>Task Sheet</h2>
      <table className="details-table">
      <thead>
        <tr>
            <th onClick={() => handleSort('id')}>
              ID {renderSortArrow('id', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th onClick={() => handleSort('name')}>
              Name {renderSortArrow('name', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {renderSortArrow('email', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th onClick={() => handleSort('date')}>
              Date {renderSortArrow('date', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th onClick={() => handleSort('description')}>
              Description {renderSortArrow('description', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th onClick={() => handleSort('location')}>
              Location {renderSortArrow('location', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th onClick={() => handleSort('district')}>
              District {renderSortArrow('district', sortOrder.column, sortOrder.ascending ? 'asc' : 'desc')}
            </th>
            <th>File Data</th>
          </tr>
        </thead>
        <tbody>
        {sortedDetails.filter(filterDetailsByMonth)
  .filter(detail => !showLastFiveDays || filterLastFiveDays(detail))
.filter(detail => !showLastTenDays || filterLastTenDays(detail))
.filter(filterByUsername)
.filter(filterDetailsByDate).map((task) => (
  <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.username}</td>
              <td>{task.email}</td>
              <td>{formatDate(task.date)}</td>
              <td>{task.description}</td>
              <td>{task.location}</td>
              <td>{task.district}</td>
              <td>

                <button
                  className="download-button"
                  onClick={() => downloadFile(task.imagebase64)}>Download</button>

                <button
                  className="button-button-danger"
                  onClick={() => handleDeleteByEmail('tasks', task.email, task.id)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add Follow Up</h2>
      <table className="details-table">
      <thead>
        <tr>
  <th onClick={() => handleSort1('id')}>
    ID {renderSortArrow1('id', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>
  <th onClick={() => handleSort1('name')}>
    Name {renderSortArrow1('name', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>
  <th onClick={() => handleSort1('email')}>
    Email {renderSortArrow1('email', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>
  <th onClick={() => handleSort1('date')}>
    Date {renderSortArrow1('date', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>
  <th onClick={() => handleSort1('description')}>
    Description {renderSortArrow1('description', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>
  <th onClick={() => handleSort1('location')}>
    Location {renderSortArrow1('location', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>

  <th onClick={() => handleSort1('district')}>
    District {renderSortArrow1('district', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>

  <th onClick={() => handleSort1('counter')}>
    Counter {renderSortArrow1('counter', modalSortOrder.column, modalSortOrder.ascending ? 'asc' : 'desc')}
  </th>
  <th>File Data</th>
</tr>

        </thead>
        <tbody>
        {sortedModal.filter(filterDetailsByMonth)
  .filter(modal => !showLastFiveDays || filterLastFiveDays(modal))
  .filter(modal => !showLastTenDays || filterLastTenDays(modal))
  .filter(filterByUsername)
  .filter(filterDetailsByDate).map((modal) => (
    <tr key={modal.id}>
              <td>{modal.id}</td>
              <td>{modal.username}</td>
              <td>{modal.email}</td>
              <td>{formatDate(modal.date)}</td>
              <td>{modal.description}</td>
              <td>{modal.location}</td>
              <td>{modal.district}</td>
              <td>{modal.counter_option}</td>


              <td>

                <button
                  className="download-button"
                  onClick={() => downloadFile(modal.imagebase64)}>Download</button>

                <button
                  className="button-button-danger"
                  onClick={() => handleDeleteByEmail('modals', modal.email, modal.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>

  );
};
export default DetailsPage1;
