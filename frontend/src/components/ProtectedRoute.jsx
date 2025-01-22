import React from 'react';
import { Navigate } from 'react-router-dom';
import { token } from '../helpers/commonHelper';

function ProtectedRoute({ children }) {
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
