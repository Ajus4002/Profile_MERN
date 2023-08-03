import React from 'react';
import {BrowserRouter as Router, Route, Navigate, Routes} from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AuthProvider from './components/AuthProvider';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import UpdateProfile from './components/UpdateProfile';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <NavigationBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<PrivateRoute element={<UserProfile />} />} />
            <Route path="/update-profile" element={<PrivateRoute element={<UpdateProfile />} />} />
            <Route path="/*" element={<PrivateRoute element={<UserProfile />} />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;