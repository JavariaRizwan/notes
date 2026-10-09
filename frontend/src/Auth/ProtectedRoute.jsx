import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const hasChecked = useRef(false); 

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const verifyUserSession = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify`, {
          withCredentials: true
        });

        if (response.data?.valid || response.data?.user || response.data?.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session verification failed:', error.response?.data || error.message);
        setIsAuthenticated(false);
      }
    };

    verifyUserSession();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-teal-400 font-medium">
        Verifying session...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;