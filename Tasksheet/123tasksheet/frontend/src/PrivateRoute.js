import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('authToken'); // or any other logic for checking authentication

  return isAuthenticated ? children : <Navigate to="/logins" />;
};

export default PrivateRoute;