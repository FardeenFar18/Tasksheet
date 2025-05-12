import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DetailsPage.css';

import { useHistory } from 'react-router-dom';

const DetailsPage = () => {
    const [details, setDetails] = useState({ workingHours: [], privilegeLeave: [], sickLeave: [], permissions: [] });
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);
    const history = useHistory();
    const [sortOrder, setSortOrder] = useState({
        column: null,
        ascending: true
    });
    const [searchQuery, setSearchQuery] = useState('');
    const http_typ = process.env.REACT_APP_HTTP_TYP;
                const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${http_typ}://${host_name_3005}/fetchDetails`);
            console.log('Fetched data:', response.data);
            setDetails(response.data);
        } catch (error) {
            console.error('Error fetching details:', error);
            // Show error message to user or handle error state
        }
    };

    const handleSort = (column, table) => {
    const sortedTable = [...details[table]].sort((a, b) => {
        const ascending = sortOrder.column === column ? !sortOrder.ascending : true;
        if (ascending) {
            return a[column] < b[column] ? -1 : 1;
        } else {
            return a[column] < b[column] ? 1 : -1;
        }
    });
    setDetails(prevState => ({
        ...prevState,
        [table]: sortedTable
    }));
    setSortOrder(prevState => ({
        column: column,
        ascending: !prevState.ascending
    }));
};

    



    const handleDeleteByEmail = async (table, email, id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${http_typ}://${host_name_3005}/deleteRecordByEmail/${table}/${email}/${id}`);
            window.alert("Data deleted successfully");
            fetchData(); // Refresh data after deletion
        } catch (error) {
            console.error('Error deleting record:', error.response.data);
            // Show error message to user or handle error state
        }
    };

    const handleApprove = async (id, email, option) => {
        const confirmApprove = window.confirm('Are you sure you want to approve this record?');
        if (!confirmApprove) return;

        try {
            const response = await axios.put(`${http_typ}://${host_name_3005}/approveRecord/${id}`, {
                email: email,
                option: option
            });
            const updatedDetails = details.map(detail => {
                if (detail.id === id && detail.email === email && detail.option === option) {
                    return { ...detail, status: response.data.status };
                }
                return detail;
            });
            setDetails(updatedDetails);
            window.alert("Approved successfully!!!");
        } catch (error) {
            console.error('Error approving record:', error);
            // Show error message to user or handle error state
        }
        window.location.reload(); // You may want to remove this line if you're using React Router
    };


    const handleCancel = (record) => {
        const confirmCancel = window.confirm('Are you sure you want to cancel this record?');
        if (confirmCancel) {
            setSelectedRecord(record);
        }
    };

    const handleSubmit = async () => {
        if (!selectedRecord) return;

        try {
            const response = await axios.put(`${http_typ}://${host_name_3005}/cancelRecord/${selectedRecord.id}`, {
                email: selectedRecord.email,
                option: selectedRecord.option,
                cancellation_reason: cancellationReason
            });
            if (response.data.status) {
                alert("Cancelled successfully!!!");
                await axios.post(`${http_typ}://${host_name_3005}/sendCancellationEmail`, {
                    email: selectedRecord.email,
                    reason: cancellationReason,
                    message: `Your request has been cancelled with the following reason: ${cancellationReason}`
                });
    
                // Clear the cancellation reason and selected record
                setCancellationReason('');
                setSelectedRecord(null);
    
                // You may want to refresh the data after cancellation
                fetchData(); // Assuming fetchData function fetches the updated data from the backend
    
                // Disable the submit button after successful cancellation and email sending
                setSubmitClicked(true);
                
                // Hide the description box after submitting
                setSelectedRecord(null);
            }
        } catch (error) {
            console.error('Error cancelling record:', error);
            // Show error message to user or handle error state
        }
        window.location.reload();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format date as per locale
    };

  const filterData = (data) => {
    return data.filter(item => {
        const formattedDate = formatDate(item.date); // Assuming 'date' is the property to format
        // Check if any of the fields include the search query
        return (
            // item.id.toString().toLowerCase().String(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formattedDate.includes(searchQuery.toLowerCase()) || // Include formatted date in search
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });
};


    return (
        <div>
            <h1>User Details</h1>

            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Working table */}
            {/* <h2>Working </h2> */}
            
            <h2>Working table</h2>
            <table className="details-table">
                <thead>
                    <tr>
                  <th onClick={() => handleSort('id', 'workingHours')}>
    ID {sortOrder.column === 'id' && (sortOrder.ascending ? '▲' : '▼')}
</th>
                        <th onClick={() => handleSort('email', 'workingHours')}>Email {sortOrder.column === 'email' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th>Option</th>
                        <th onClick={() => handleSort('date', 'workingHours')}>Date {sortOrder.column === 'date' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('description', 'workingHours')}>Description{sortOrder.column === 'description' && (sortOrder.ascending ? '▲' : '▼')}</th>
                         <th onClick={() => handleSort('start_time', 'workingHours')}>Start Time{sortOrder.column === 'start_time' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('end_time', 'workingHours')}>End Time{sortOrder.column === 'end_time' && (sortOrder.ascending ? '▲' : '▼')}</th>
                      <th onClick={() => handleSort('working', 'workingHours')}>
    Working {sortOrder.column === 'working' && (sortOrder.ascending ? '▲' : '▼')}
</th>
                        <th onClick={() => handleSort('overtime', 'workingHours')}>Overtime{sortOrder.column === 'overtime' && (sortOrder.ascending ? '▲' : '▼')}</th>
                       <th onClick={() => handleSort('cancel_reason', 'workingHours')}>Cancel Reason{sortOrder.column === 'cancel_reason' && (sortOrder.ascending ? '▲' : '▼')}</th>
                         <th onClick={() => handleSort('status', 'workingHours')}>Status{sortOrder.column === 'status' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {filterData(details.workingHours).map(workingHour => (
                        <tr key={workingHour.id}>
                            <td>{workingHour.id}</td>
                            <td>{workingHour.email}</td>
                            <td>{workingHour.option}</td>
                            <td>{formatDate(workingHour.date)}</td>
                            <td>{workingHour.description}</td>
                            <td>{workingHour.start_time}</td>
                            <td>{workingHour.end_time}</td>
                            <td>{workingHour.working_hours}</td>
                            <td>{workingHour.overtime}</td>
                            <td>{workingHour.status === 'Approved' ? ' ' : workingHour.cancellation_reason}</td>

                            <td>{workingHour.status}</td>
                            <td>
                                <>
                                    <button
                                    className="button-button-primary"
                                        onClick={() => handleApprove(workingHour.id, workingHour.email, workingHour.option, 'working_hours')}
                                        disabled={workingHour.status === 'Approved'} // Disable if status is 'Approved'
                                    >
                                        Approve
                                    </button>
                                    &nbsp;


                                    <button
                                        className="button-button-secondary"
                                        onClick={() => handleCancel(workingHour)}
                                        disabled={workingHour.status === 'Not Approved'} // Disable cancel button only for "not approved" status
                                    >
                                        Cancel
                                    </button> &nbsp;


                                </>
                                <button
                                    className="button-button-danger"
                                    onClick={() => handleDeleteByEmail('working_hours', workingHour.email, workingHour.id)}
                                >
                                    Delete
                                </button>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Privilege Leave table */}
            <h2>Privilege Leave</h2>
            <table className="details-table">
                <thead>
                    <tr>
                       <th onClick={() => handleSort('id1', 'privilegeLeave')}>
    ID {sortOrder.column === 'id1' && (sortOrder.ascending ? '▲' : '▼')}
</th>
<th onClick={() => handleSort('email1', 'privilegeLeave')}>
    Email {sortOrder.column === 'email1' && (sortOrder.ascending ? '▲' : '▼')}
</th>
                        <th>Option</th>
                        <th onClick={() => handleSort('from_date', 'privilegeLeave')}>
    From Date {sortOrder.column === 'from_date' && (sortOrder.ascending ? '▲' : '▼')}
</th>
<th onClick={() => handleSort('to_date', 'privilegeLeave')}>
    To Date {sortOrder.column === 'to_date' && (sortOrder.ascending ? '▲' : '▼')}
</th>
<th onClick={() => handleSort('description1', 'privilegeLeave')}>Description{sortOrder.column === 'description1' && (sortOrder.ascending ? '▲' : '▼')}</th>
<th onClick={() => handleSort('cancel_reason1', 'privilegeLeave')}>Cancel Reason{sortOrder.column === 'cancel_reason1' && (sortOrder.ascending ? '▲' : '▼')}</th>
                         <th onClick={() => handleSort('status1', 'privilegeLeave')}>Status{sortOrder.column === 'status1' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {filterData(details.privilegeLeave).map(leave => (
                        <tr key={leave.id}>
                            <td>{leave.id}</td>
                            <td>{leave.email}</td>
                            <td>{leave.option}</td>
                            <td>{formatDate(leave.from_date)}</td>
                            <td>{formatDate(leave.to_date)}</td>
                            <td>{leave.description}</td>
                            <td>{leave.status === 'Approved' ? ' ' : leave.cancellation_reason}</td>
                            <td>{leave.status}</td>
                            <td>
                                <>
                                    <button
                                    className="button-button-primary"
                                        onClick={() => handleApprove(leave.id, leave.email, leave.option, 'privilege_leave')}
                                        disabled={leave.status === 'Approved'} // Disable if status is 'Approved'
                                    >
                                        Approve
                                    </button> &nbsp;
                                    <button
                                    className="button-button-secondary"
                                        onClick={() => handleCancel(leave)}
                                        disabled={leave.status === 'Not Approved'} // Disable cancel button only for "not approved" status
                                    >
                                        Cancel
                                    </button> &nbsp;


                                </>
                                <button
                                    className="button-button-danger"
                                    onClick={() => handleDeleteByEmail('privilege_leave', leave.email, leave.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Sick Leave table */}
            <h2>Sick Leave</h2>
            <table className="details-table">
                <thead>
                    <tr>
                    <th onClick={() => handleSort('id2', 'sickLeave')}>
    ID {sortOrder.column === 'id2' && (sortOrder.ascending ? '▲' : '▼')}
</th>
<th onClick={() => handleSort('email2', 'sickLeave')}>
    Email {sortOrder.column === 'email2' && (sortOrder.ascending ? '▲' : '▼')}
</th>
                        <th>Option</th>
                        <th onClick={() => handleSort('date2', 'sickLeave')}>Date {sortOrder.column === 'date2' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('description2', 'sickLeave')}>Description{sortOrder.column === 'description2' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('cancel_reason2', 'sickLeave')}>Cancel Reason{sortOrder.column === 'cancel_reason2' && (sortOrder.ascending ? '▲' : '▼')}</th>
                         <th onClick={() => handleSort('status2', 'sickLeave')}>Status{sortOrder.column === 'status2' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {filterData(details.sickLeave).map(sick => (
                        <tr key={sick.id}>
                            <td>{sick.id}</td>
                            <td>{sick.email}</td>
                            <td>{sick.option}</td>
                            <td>{formatDate(sick.date)}</td>
                            <td>{sick.description}</td>
                            <td>{sick.status === 'Approved' ? ' ' : sick.cancellation_reason}</td>
                            <td>{sick.status}</td>
                            <td>
                                <>
                                    <button
                                    className="button-button-primary"
                                        onClick={() => handleApprove(sick.id, sick.email, sick.option, 'sick_leave')}
                                        disabled={sick.status === 'Approved'} // Disable if status is 'Approved'
                                    >
                                        Approve
                                    </button> &nbsp;
                                    <button
                                    className="button-button-secondary"
                                        onClick={() => handleCancel(sick)}
                                        disabled={sick.status === 'Not Approved'} // Disable cancel button only for "not approved" status
                                    >
                                        Cancel
                                    </button> &nbsp;

                                </>
                                <button
                                    className="button-button-danger"
                                    onClick={() => handleDeleteByEmail('sick_leave', sick.email, sick.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Permission table */}
            <h2>Permission</h2>
            <table className="details-table">
                <thead>
                    <tr>
                    <th onClick={() => handleSort('id3', 'permissions')}>
    ID {sortOrder.column === 'id3' && (sortOrder.ascending ? '▲' : '▼')}</th>
    <th onClick={() => handleSort('email3', 'permissions')}>Email{sortOrder.column === 'email3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th>Option</th>
                        <th onClick={() => handleSort('date3', 'permissions')}>Date {sortOrder.column === 'date3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('period3', 'permissions')}>Period{sortOrder.column === 'period3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('start_time3', 'permissions')}>Start Time{sortOrder.column === 'start_time3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('end_time3', 'permissions')}>End Time{sortOrder.column === 'end_time3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('description3', 'permissions')}>Description{sortOrder.column === 'description3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th onClick={() => handleSort('cancel_reason3', 'permissions')}>Cancel Reason{sortOrder.column === 'cancel_reason3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                         <th onClick={() => handleSort('status3', 'permissions')}>Status{sortOrder.column === 'status3' && (sortOrder.ascending ? '▲' : '▼')}</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {filterData(details.permissions).map(permission => (
                        <tr key={permission.id}>
                            <td>{permission.id}</td>
                            <td>{permission.email}</td>
                            <td>{permission.option}</td>
                            <td>{formatDate(permission.date)}</td>
                            <td>{permission.period}</td>
                            <td>{permission.start_time}</td>
                            <td>{permission.end_time}</td>
                            <td>{permission.description}</td>
                            <td>{permission.status === 'Approved' ? ' ' : permission.cancellation_reason}</td>
                            <td>{permission.status}</td>
                            <td>
                                <>
                                    <button
                                    className="button-button-primary"
                                        onClick={() => handleApprove(permission.id, permission.email, permission.option, 'permissions')}
                                        disabled={permission.status === 'Approved'} // Disable if status is 'Approved'
                                    >
                                        Approve
                                    </button> &nbsp;
                                    <button
                                    className="button-button-secondary"
                                        onClick={() => handleCancel(permission)}
                                        disabled={permission.status === 'Not Approved'} // Disable cancel button only for "not approved" status
                                    >
                                        Cancel
                                    </button> &nbsp;

                                </>
                                <button
                                    className="button-button-danger"
                                    onClick={() => handleDeleteByEmail('permissions', permission.email, permission.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Description Box */}
            {selectedRecord && (
                <div className="description-overlay">
                    <div className="description-box">
                        <h2>Description Box</h2>
                        <textarea
                            rows="4"
                            cols="50"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Enter cancellation reason..."
                        />
                        <button onClick={handleSubmit}>Submit</button>
                        {/* Disable cancel button if submit button is clicked or status is "not approved" */}
                        <button disabled={submitClicked || selectedRecord.status === 'Not Approved'} onClick={() => setSelectedRecord(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsPage;