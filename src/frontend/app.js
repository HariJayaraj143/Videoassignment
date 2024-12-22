import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Import AuthContext for user authentication state management
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import VideoUpload from './VideoUpload';
import VideoPlayer from './VideoPlayer';
import NavBar from './NavBar'; // Import a NavBar component for navigation (optional)

import './App.css'; // Import global CSS styles

const App = () => {
  return (
    // AuthProvider provides authentication state context to the entire app
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* NavBar can be placed here to appear on all pages */}
          <NavBar />

          {/* Routes and Components */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
