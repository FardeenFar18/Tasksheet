import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';

function Profile() {
  const [profiles, setProfiles] = useState([]);
  const { userEmail } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const http_typ = process.env.REACT_APP_HTTP_TYP;
  const host_name_3001 = process.env.REACT_APP_HOST_NAME_3001;
  const navigate = useNavigate();


 
  useEffect(() => {
  
    const userLoggedIn = sessionStorage.getItem("authToken");
    if (userLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.post(`${http_typ}://${host_name_3001}/api/addUser1/${userEmail}`);
        setProfiles(response.data);
      } catch (error) {
        console.error('There was an error fetching the profiles!', error);
      }
    };

    if (userEmail) {
      fetchProfiles();
    }
  }, [userEmail, http_typ, host_name_3001]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.removeItem("userEmail"); 
    sessionStorage.removeItem("authToken");
    setUserEmail('');
    navigate("/");
    window.location.reload();
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isLoginPage = location.pathname === '/logins';

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Profiles
      </Typography>
      {profiles.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Organization</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map(profile => (
                <TableRow key={profile.email}>
                  <TableCell>{profile.username}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{formatDate(profile.joining_date)}</TableCell>
                  <TableCell>{profile.phone}</TableCell>
                  <TableCell>{profile.org_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>
      )}

      {/* Logout Button */}
      { isLoggedIn && !isLoginPage && (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
    
      <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }} onClick={handleLogout}>
  Logout
</Button>

      </div>
      )}
    </Container>
  );
}

export default Profile;
