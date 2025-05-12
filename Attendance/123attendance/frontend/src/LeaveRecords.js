// LeaveRecords.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LeaveRecords.css';

const LeaveRecords = () => {
    const [users, setUsers] = useState([]);
    const http_typ = process.env.REACT_APP_HTTP_TYP;
                const host_name_3005 = process.env.REACT_APP_HOST_NAME_3005;
    // const history = useHistory();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response =  await axios.get(`${http_typ}://${host_name_3005}/users2`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // useEffect(() => {
    //     const unlisten = history.listen(() => {
    //         history.push('/admin');
    //     });

    //     return () => {
    //         unlisten();
    //     };
    // }, [history]);

    const handleViewUserByEmail = async (email) => {
        try {
            const response = await axios.get(`${http_typ}://${host_name_3005}/fetchDetailsByEmail/${email}`);
            const userDetails = response.data;
            console.log('User details by email:', userDetails);
            // Handle displaying user details (e.g., open a modal)
        } catch (error) {
            console.error('Error fetching user details by email:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format date as per locale
    };

    return (
        <div className='leave'>
        <div align='center'>
            <h2>Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Joining Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{formatDate(user.joining_date)}</td>
                            <td>
                                <Link to={`/user/${user.email}`} onClick={() => handleViewUserByEmail(user.email)}><button>View</button></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default LeaveRecords;