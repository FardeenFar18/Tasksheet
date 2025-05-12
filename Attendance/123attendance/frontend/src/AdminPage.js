import React from 'react';
import { Link } from 'react-router-dom';
// import './AdminPage.css';
import './stylepage.css';

const AdminPage = () => {
  return (
    <div className='centered-content'>
      <h1 >Welcome Admin!</h1>
      <div>
        <Link to="/adduser">
          <button className="btn-primary">Add User</button>
        </Link> &nbsp;
        <Link to="/details">
          <button className="btn-primary">User Details</button>
        </Link> &nbsp;
        <Link to="/leave">
          <button className="btn-primary">Leave Record</button>
        </Link> &nbsp;
        <Link to="/"> 
          <button className="btn-logout">Logout</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;