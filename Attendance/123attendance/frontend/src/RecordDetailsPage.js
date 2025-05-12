import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecordDetailsPage = ({ match }) => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellationReason, setCancellationReason] = useState('');
    const [showDescriptionBox, setShowDescriptionBox] = useState(false);
    const http_typ = process.env.REACT_APP_HTTP_TYP;
    const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

    useEffect(() => {
        const fetchRecordDetails = async () => {
            const recordId = match.params.id;
            try {
                const response = await axios.get(`${http_typ}://${host_name_3005}/fetchRecord/${recordId}`);
                setRecord(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching record details');
                setLoading(false);
            }
        };
        fetchRecordDetails();
    }, [match.params.id]);

    const handleApprove = async () => {
        try {
            const response = await axios.put(`${http_typ}://${host_name_3005}/approveRecord/${record.id}`);
            setRecord(prevRecord => ({ ...prevRecord, status: response.data.status }));
            window.alert("Approved successfully!!!");
        } catch (error) {
            console.error('Error approving record:', error);
        }
    };

    const handleCancel = () => {
        setShowDescriptionBox(true);
    };

    const handleSubmit = async () => {
        try {
            const response =  await axios.put(`${http_typ}://${host_name_3005}/cancelRecord/${record.id}`, { cancellation_reason: cancellationReason });
            setRecord(prevRecord => ({ ...prevRecord, status: response.data.status }));
            setShowDescriptionBox(false);
            setCancellationReason('');
            window.alert("Cancelled successfully!!!");
            await sendCancellationEmail(cancellationReason); // Send cancellation email
        } catch (error) {
            console.error('Error cancelling record:', error);
        }
    };

    const sendCancellationEmail = async (reason, record) => {
        try {
            await axios.put(`${http_typ}://${host_name_3005}/sendCancellationEmail`, {
                recordId: record.id,
                cancellationReason: reason,
                email: record.email
            });
            console.log('Cancellation email sent successfully');
        } catch (error) {
            console.error('Error sending cancellation email:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!record) {
        return <div>Record not found</div>;
    }

    return (
        <div>
            <h2>Details</h2>
            <p><strong>Email:</strong> {record.email}</p>
            <p><strong>Description:</strong> {record.description}</p>
            <p><strong>Option:</strong> {record.option}</p>
            {record.type === 'workingHours' && (
                <div>
                    <p><strong>Date:</strong> {formatDate(record.date)}</p>
                    <p><strong>Start Time:</strong> {(record.start_time)}</p>
                    <p><strong>End Time:</strong> {(record.end_time)}</p>
                    <p><strong>Working Hours:</strong> {(record.working_hours)}</p>
                    <p><strong>Overtime:</strong>{(record.overtime)}</p>
                </div>
            )}
            {record.type === 'permissions' && (
                <div>
                    <p><strong>Date:</strong> {formatDate(record.date)}</p>
                    <p><strong>Start Time:</strong> {(record.start_time)}</p>
                    <p><strong>End Time:</strong> {(record.end_time)}</p>
                </div>
            )}
            {record.type === 'privilegeLeave' && (
                <div>
                    <p><strong>From Date:</strong> {formatDate(record.from_date)}</p>
                    <p><strong>To Date:</strong> {formatDate(record.to_date)}</p>
                </div>
            )}
            {record.type === 'sickLeave' && (
                <div>
                    <p><strong>Date:</strong> {formatDate(record.date)}</p>
                </div>
            )}
            <p><strong>Status:</strong> {record.status}</p>

            {showDescriptionBox && (
                <div>
                    <input type="text" value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} placeholder="Cancellation Reason" />
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}

            {(record.status !== 'Approved' && record.status !== 'Not Approved') && (
    <>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleCancel}>Cancel</button>
    </>
)}

            
        </div>
    );
};

export default RecordDetailsPage;
