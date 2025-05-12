// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import AddUser from './AddUser';
// import Login from './Login';
// import NextPage from './NextPage';
// import WorkingPage from './Working';
// import PermissionPage from './PermissionPage';
// import PrivilegeLeaveForm from './PrevilegeLeaveForm';
// import SickLeaveForm from './SickLeaveForm';
// import DetailsPage from './DetailsPage';
// import RecordDetailsPage from './RecordDetailsPage';
// import LeaveRecords from './LeaveRecords';
// import UserDetail from './UserDetails';
// import Dashboard from './DashBoard';

// const App = () => {
//     return (
//         <Router>
//             <Switch>
//                 <Route path="/admin" component={AddUser} />
//                 <Route path="/login" component={Login} />
//                 <Route path="/next" component={NextPage} />
//                 <Route path="/Working" component={WorkingPage} />
//                 <Route path="/Permission" component={PermissionPage} />
//                 <Route path="/PrivilegeLeaveForm" component={PrivilegeLeaveForm } /> 
//                 <Route path="/sick" component={SickLeaveForm} />
//                 <Route path="/details" component={DetailsPage} />
//                 <Route path="/view/:id" component={RecordDetailsPage} />
//                 <Route path="/leave" component={LeaveRecords}/>
//                 <Route path="/user/:email" component={UserDetail} />
//                 <Route path="/dashboard/:email" component={Dashboard}/>
                
                
//             </Switch>
//         </Router>
//     );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './MainPage';
import AdminLogin from './AdminLogin';
import AdminPage from './AdminPage';
import AddUser from './AddUser';
import Login from './Login';
import NextPage from './NextPage';
import WorkingPage from './Working';
import PermissionPage from './PermissionPage';
import PrivilegeLeaveForm from './PrevilegeLeaveForm';
import SickLeaveForm from './SickLeaveForm';
import DetailsPage from './DetailsPage';
import RecordDetailsPage from './RecordDetailsPage';
import LeaveRecords from './LeaveRecords';
import UserDetails from './UserDetails';
import DashBoard from './DashBoard';




const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={MainPage} />
                <Route path="/login" component={Login} />
                <Route path="/admin-login" component={AdminLogin} />
                <Route path="/admin" component={AdminPage} />
                <Route path="/adduser" component={AddUser} />
                <Route path="/userlogin" component={Login} />
                <Route path="/next" component={NextPage} />
                <Route path="/Working" component={WorkingPage} />
                <Route path="/Permission" component={PermissionPage} />
                <Route path="/PrivilegeLeaveForm" component={PrivilegeLeaveForm} />
                <Route path="/sick" component={SickLeaveForm} />
                <Route path="/details" component={DetailsPage} />
                <Route path="/view/:id" component={RecordDetailsPage} />
                <Route path="/leave" component={LeaveRecords} />
                <Route path="/user/:email" component={UserDetails} />
                <Route path="/dashboard/:email" component={DashBoard} />
                
            </Switch>
        </Router>
    );
};

export default App;