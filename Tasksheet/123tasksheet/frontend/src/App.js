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
//                 <Route path="/admin" element={AddUser} />
//                 <Route path="/login" element={Login} />
//                 <Route path="/next" element={NextPage} />
//                 <Route path="/Working" element={WorkingPage} />
//                 <Route path="/Permission" element={PermissionPage} />
//                 <Route path="/PrivilegeLeaveForm" element={PrivilegeLeaveForm } /> 
//                 <Route path="/sick" element={SickLeaveForm} />
//                 <Route path="/details" element={DetailsPage} />
//                 <Route path="/view/:id" element={RecordDetailsPage} />
//                 <Route path="/leave" element={LeaveRecords}/>
//                 <Route path="/user/:email" element={UserDetail} />
//                 <Route path="/dashboard/:email" element={Dashboard}/>
                
                
//             </Switch>
//         </Router>
//     );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import Logins from './Login1';
import MainPages from './MainPage2';

import Adminlogins from './Adminlogins';
import AdminPages from './AdminPage2';
import TaskPage from './Tasksheet';
import DetailsPage1 from './DetailsPage1';
import TaskAssignmentForm from './Addtask';
import AddUsers from './AddtheUser';
import AdminDashboard from './AdminDashboard';
import UserDashboards from './UserBoard1';
import AdminSignup from './Signup';
import News from './News';
import AudioPlayer from './fetchaudio';
import MyDashboard from './MyDashboard';
import Profile from './Profile';
import PrivateRoute from './PrivateRoute';


const App = () => {
    return (
     
            <Routes>
                <Route path="/" element={<MainPages/>}/>
              
                <Route path="/add" element={<TaskAssignmentForm/>} />
             
                <Route path="/tasksheet" element={<PrivateRoute><TaskPage/></PrivateRoute>} />
            
                <Route path="/details1" element={<DetailsPage1/>} />
               
                <Route path="/logins" element={<Logins/>}/>
                <Route path="/admin-logins"  element={<Adminlogins/>}/>
                <Route path="/admin2" element={<AdminPages/>}/>
                <Route path="/addusers" element={<AddUsers/>}/>
                <Route path="/adminDashboard"element={<AdminDashboard/>}/>
                <Route path="/Mydashboard/:userEmail" element={<MyDashboard/>}/>
                <Route path="/Myprofile/:userEmail" element={<Profile/>}/>
                <Route path="/user1/:userEmail" element={<UserDashboards/>} />
                <Route path="/signup" element={<AdminSignup/>} />
                <Route path="/news"element={<News/>}/>
                <Route path="/audio/:userEmail"element={<PrivateRoute><AudioPlayer/></PrivateRoute>}/>
                
            </Routes>
       
    );
};

export default App;