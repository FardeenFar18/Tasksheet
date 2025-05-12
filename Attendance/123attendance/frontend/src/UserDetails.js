import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserDetails.css'; // Import CSS file

const UserDetails = () => {
    const { email } = useParams(); // Assuming the parameter in the URL is the email
    const [workingHours, setWorkingHours] = useState([]);
    const [privilegeLeave, setPrivilegeLeave] = useState([]);
    const [sickLeave, setSickLeave] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approvedWorkingHoursCount, setApprovedWorkingHoursCount] = useState(0);
    const [approvedPrivilegeLeaveCount, setApprovedPrivilegeLeaveCount] = useState(0);
    const [approvedSickLeaveCount, setApprovedSickLeaveCount] = useState(0);
    const [approvedPermissionsCount, setApprovedPermissionsCount] = useState(0);
    const [joiningDate, setJoiningDate] = useState(null);
    const [utilizedPrivilegeLeaveCount, setUtilizedPrivilegeLeaveCount] = useState(0);
    const [remainingPrivilegeLeaveCount, setRemainingPrivilegeLeaveCount] = useState(0);
    const [utilizedSickLeaveCount, setUtilizedSickLeaveCount] = useState(0);
    const [remainingSickLeaveCount, setRemainingSickLeaveCount] = useState(0);
    const [extraPrivilegeLeaveCount, setExtraPrivilegeLeaveCount] = useState(0);
    const [extraSickLeaveCount, setExtraSickLeaveCount] = useState(0);
    const http_typ = process.env.REACT_APP_HTTP_TYP;
    const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const [
                    workingHoursResponse,
                    privilegeLeaveResponse,
                    sickLeaveResponse,
                    permissionsResponse,
                    joiningDateResponse
                ] = await Promise.all([
                    await axios.get(`${http_typ}://${host_name_3005}/fetchWorkingHoursByEmail/${email}`),
                    await axios.get(`${http_typ}://${host_name_3005}/fetchPrivilegeLeaveByEmail/${email}`),
                    await axios.get(`${http_typ}://${host_name_3005}/fetchSickLeaveByEmail/${email}`),
                    await axios.get(`${http_typ}://${host_name_3005}/fetchPermissionsByEmail/${email}`),
                     await axios.get(`${http_typ}://${host_name_3005}/users2`)
                ]);

                setWorkingHours(workingHoursResponse.data);
                setPrivilegeLeave(privilegeLeaveResponse.data);
                setSickLeave(sickLeaveResponse.data);
                setPermissions(permissionsResponse.data);
                setJoiningDate(joiningDateResponse.data.joining_date);
                setLoading(false);
            } catch (error) {
                setError('Error fetching user details');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [email]);

    useEffect(() => {
        if (!joiningDate) return;

        // Calculate the duration since joining in days
        const today = new Date();
        const joinDate = new Date(joiningDate);
        const diffTime = Math.abs(today - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log('Days since joining:', diffDays);
    }, [joiningDate]);

    useEffect(() => {
        // Counting approved records for each type
        setApprovedWorkingHoursCount(workingHours.filter(item => item.status === 'Approved').length);
        setApprovedSickLeaveCount(sickLeave.filter(item => item.status === 'Approved').length);

        // Counting approved privilege leave and calculating the total number of days excluding Sundays
        const approvedPrivilegeLeaves = privilegeLeave.filter(item => item.status === 'Approved');
        let totalDays = 0;

        approvedPrivilegeLeaves.forEach(leave => {
            const fromDate = new Date(leave.from_date);
            const toDate = new Date(leave.to_date);

            let currentDate = new Date(fromDate);

            while (currentDate <= toDate) {
                // Exclude Sundays
                if (currentDate.getDay() !== 0) {
                    totalDays++;
                }
                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            }
        });

        setApprovedPrivilegeLeaveCount(totalDays);

        // Calculate utilized privilege leave
        const today = new Date();
        const utilizedPrivilegeLeaves = approvedPrivilegeLeaves.filter(leave => new Date(leave.to_date) < today);
        let utilizedPrivilegeDays = 0;

        utilizedPrivilegeLeaves.forEach(leave => {
            const fromDate = new Date(leave.from_date);
            const toDate = new Date(leave.to_date);

            const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
            utilizedPrivilegeDays += daysDiff;
        });

        setUtilizedPrivilegeLeaveCount(utilizedPrivilegeDays);

        // Calculate remaining privilege leave
        const remainingPrivilegeLeave = Math.max(12 - approvedPrivilegeLeaveCount, 0);
        setRemainingPrivilegeLeaveCount(remainingPrivilegeLeave);

        // Counting approved permissions
        const approvedPermissions = permissions.filter(item => item.status === 'Approved');
        let permissionDays = 0;

        const countForOneDay = Math.floor(approvedPermissions.length / 3); // Count for 1 day
        const countForHalfDay = Math.floor((approvedPermissions.length % 3) / 2); // Count for 0.5 day

        permissionDays = countForOneDay + countForHalfDay * 0.5;

        setApprovedPermissionsCount(permissionDays);

        // Calculate utilized sick leave
        const utilizedSickLeaves = sickLeave.filter(leave => new Date(leave.date) < today);
        let utilizedSickDays = 0;

        utilizedSickLeaves.forEach(leave => {
            utilizedSickDays++;
        });

        setUtilizedSickLeaveCount(utilizedSickDays);

        // Calculate remaining sick leave
        const remainingSickLeave = Math.max(12 - utilizedSickDays, 0);
        setRemainingSickLeaveCount(remainingSickLeave);

        // Calculate extra privilege leave
        const extraPrivilegeLeave = Math.max(approvedPrivilegeLeaveCount - 12, 0);
        setExtraPrivilegeLeaveCount(extraPrivilegeLeave);

        // Calculate extra sick leave
        const extraSickLeave = Math.max(utilizedSickLeaveCount - 12, 0);
        setExtraSickLeaveCount(extraSickLeave);

    }, [workingHours, privilegeLeave, sickLeave, permissions]);

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format date as per locale
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='user-details-container'>
            <h2>User Details</h2>
           <b><p>Email:{email}</p></b>
            {/* Working Hours */}
            <h3>Working Hours</h3>
            <table className="user-details-table"> {/* Apply CSS class */}
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {workingHours.map(workingHour => (
                        <tr key={workingHour.id}>
                            <td>{formatDate(workingHour.date)}</td>
                            <td>{workingHour.description}</td>
                            <td>{workingHour.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Privilege Leave */}
            <h3>Privilege Leave</h3>
            <table className="user-details-table"> {/* Apply CSS class */}
                <thead>
                    <tr>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {privilegeLeave.map(leave => (
                        <tr key={leave.id}>
                            <td>{formatDate(leave.from_date)}</td>
                            <td>{formatDate(leave.to_date)}</td>
                            <td>{leave.description}</td>
                            <td>{leave.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Sick Leave */}
            <h3>Sick Leave</h3>
            <table className="user-details-table"> {/* Apply CSS class */}
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sickLeave.map(leave => (
                        <tr key={leave.id}>
                            <td>{formatDate(leave.date)}</td>
                            <td>{leave.description}</td>
                            <td>{leave.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Permissions */}
            <h3>Permissions</h3>
            <table className="user-details-table"> {/* Apply CSS class */}
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map(permission => (
                        <tr key={permission.id}>
                            <td>{formatDate(permission.date)}</td>
                            <td>{permission.description}</td>
                            <td>{permission.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className='h3-table'>
            <h3>Approved Records Count</h3>
            <table>
                <thead>
                <tr>
            <th>Approved Working Hours</th>  
            <th>Approved Privilege Leave</th> 
            <th>Approved Sick Leave</th>
            <th>Approved Permissions</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                <td>{approvedWorkingHoursCount}</td>
                <td>{approvedPrivilegeLeaveCount}</td>
                <td>   {approvedSickLeaveCount}</td>
                <td>  {approvedPermissionsCount}</td>
                </tr>
            </tbody>
            </table>

            {/* <h3>Utilized Leave</h3>
            <p>Utilized Privilege Leave: {approvedPrivilegeLeaveCount}</p>
            <p>Utilized Sick Leave: {utilizedSickLeaveCount}</p> */}

            <h3>Remaining Leave</h3>
            <table>
                <thead>
                <tr>
            <th>Remaining Privilege Leave</th>
            <th>Remaining Sick Leave</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                <td>{remainingPrivilegeLeaveCount}</td>
                <td>{remainingSickLeaveCount}</td>
                </tr>
            </tbody>
            </table>



            <h3>Loss of Pay</h3>
            <table>
                <thead>
                <tr>
            <th>Extra Privilege Leave</th>
            <th>Extra Sick Leave</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                <td>{extraPrivilegeLeaveCount}</td>
                <td>{extraSickLeaveCount}</td>
                </tr>
                </tbody>
            </table>
        </div>
        </div>

    );
};

export default UserDetails;
