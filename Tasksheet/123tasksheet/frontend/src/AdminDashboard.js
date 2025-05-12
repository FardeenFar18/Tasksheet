import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylepage2.css';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showLastFiveDays, setShowLastFiveDays] = useState(false);
  const [showLastTenDays, setShowLastTenDays] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
  const host_name_3002 = process.env.REACT_APP_HOST_NAME_3002;

  useEffect(() => {
    mergeTasks();
  }, []);

  const mergeTasks = async () => {
    try {
      const adminFromStorage = JSON.parse(sessionStorage.getItem('admin'));
      const postgresResult = await axios.post(`${http_typ}://${host_name_3001}/admin/all-tasks`, { "data": adminFromStorage });

      if (!postgresResult.data || !Array.isArray(postgresResult.data.addtasks)) {
        throw new Error("Invalid data structure received");
      }

      const mergedTasks = await Promise.all(
        postgresResult.data.addtasks.map(async (table) => {
          if (table.fileid) {
            const imageResult = await axios.get(`${http_typ}://${host_name_3002}/upload-file/${table.fileid}`);
            return {
              ...table,
              imagebase64: imageResult.data.fileData[0].files,
            };
          } else {
            return {
              ...table,
              imagebase64: null, // or any default value you want to set
            };
          }
        })
      );
      setTasks(mergedTasks);
    } catch (error) {
      console.error("Error merging tasks:", error);
    }
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
    return date.toLocaleDateString(); // Format date as per locale
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedTasks = tasks.slice().sort((a, b) => {
    if (sortColumn === 'date' || sortColumn === 'last_date') {
      const dateA = new Date(a[sortColumn]);
      const dateB = new Date(b[sortColumn]);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return sortOrder === 'asc' ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
      }
    }
  });

  const renderSortArrow = (column) => {
    if (sortColumn === column) {
      return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filterDetailsByMonth = (tasks) => {
    if (!selectedMonth) return true;
    const detailDate = new Date(tasks.last_date);
    const month = detailDate.getMonth() + 1;
    return month === parseInt(selectedMonth);
  };

  const filterLastFiveDays = (tasks) => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5); // Subtract 5 days

    const detailDate = new Date(tasks.last_date);
    return detailDate >= fiveDaysAgo && detailDate <= today;
  };

  const filterLastTenDays = (tasks) => {
    const today = new Date();
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // Subtract 10 days

    const detailDate = new Date(tasks.last_date);
    return detailDate >= tenDaysAgo && detailDate <= today;
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

  const handleEmailChange = (event) => {
    setSelectedEmail(event.target.value);
  };

  const filterByEmail = (tasks) => {
    if (!selectedEmail) return true;
    return tasks.email === selectedEmail;
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filterDetailsByDate = (tasks) => {
    if (!selectedDate) return true;
    const detailDate = new Date(tasks.last_date);
    const selectedDateObj = new Date(selectedDate);
    return detailDate.toDateString() === selectedDateObj.toDateString();
  };

  return (
    <div className='user3'>
      <label>Sort by Month:</label>
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

      <label>Sort by Days:</label>
      <select onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="lastFiveDays">Last 5 Days</option>
        <option value="lastTenDays">Last 10 Days</option>
      </select>&nbsp;

      <label>Sort by Email:</label>
      <select value={selectedEmail} onChange={handleEmailChange}>
        <option value="">All</option>
        {tasks.reduce((uniqueEmails, task) => {
          if (!uniqueEmails.includes(task.email)) {
            uniqueEmails.push(task.email);
          }
          return uniqueEmails;
        }, []).map((email) => (
          <option key={email} value={email}>
            {email}
          </option>
        ))}
      </select>&nbsp;

      <label>Sort by Date:</label>
      <input type="date" className="date-input" value={selectedDate} onChange={handleDateChange} />

      <h2>All Tasks</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>
              ID {renderSortArrow('id')}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {renderSortArrow('email')}
            </th>
            <th onClick={() => handleSort('task')}>
              Task {renderSortArrow('task')}
            </th>
            <th onClick={() => handleSort('location')}>
              Location {renderSortArrow('location')}
            </th>
            <th onClick={() => handleSort('district')}>
              District {renderSortArrow('district')}
            </th>
            <th onClick={() => handleSort('description')}>
              Description {renderSortArrow('description')}
            </th>
            <th onClick={() => handleSort('user_location')}>
              User Location {renderSortArrow('user_location')}
            </th>
            <th onClick={() => handleSort('user_district')}>
              User District {renderSortArrow('user_district')}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {renderSortArrow('status')}
            </th>
            <th onClick={() => handleSort('last_date')}>
              Last Date {renderSortArrow('last_date')}
            </th>
            <th>File Data</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks
            .filter(filterDetailsByMonth)
            .filter(tasks => !showLastFiveDays || filterLastFiveDays(tasks))
            .filter(tasks => !showLastTenDays || filterLastTenDays(tasks))
            .filter(filterByEmail)
            .filter(filterDetailsByDate)
            .map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.email}</td>
                <td>{task.task}</td>
                <td>{task.location}</td>
                <td>{task.district}</td>
                <td>{task.description}</td>
                <td>{task.user_location}</td>
                <td>{task.user_district}</td>
                <td>{task.status}</td>
                <td>{formatDate(task.last_date)}</td>
                <td>
                  <button 
                    className="download-button"
                    onClick={() => downloadFile(task.imagebase64)}>Download
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
