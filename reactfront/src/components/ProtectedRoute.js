import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirige a la página de inicio de sesión si no hay token
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
