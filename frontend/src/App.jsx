import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';


import Home from './components/Home';
import SignUp from './Auth/Signup';
import SignIn from './Auth/Signin';
import Middle from './components/Middle';
import NotFound from './components/NotFound';
import ProtectedRoute from './Auth/ProtectedRoute';
import UserProfile from './components/UserProfile';
import ForwardNote from './additional-features/ForwardNote';


const App = () => {
  const navigate = useNavigate();


  const handleLoginSuccess = () => {
    toast.success('Successfully logged in!');
    navigate('/user_dashboard');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onGetStarted={() => navigate('/signup')} 
              onSignIn={() => navigate('/signin')} 
            />
          } 
        />

        <Route 
          path="/signup" 
          element={<SignUp onSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/signin" 
          element={<SignIn onSuccess={handleLoginSuccess} />} 
        />

         
          <Route element={<ProtectedRoute />}>
        <Route 
          path="/user_dashboard" 
          element={<Middle onLogout={handleLogout} />} 
        />
        
         <Route path='/user-profile' element={<UserProfile />} />
        <Route path='forward-note' element={<ForwardNote />} />
        </Route>
      <Route 
          path="*" 
          element={<NotFound />} 
        />
      
      </Routes>
    </>
  );
};

export default App;