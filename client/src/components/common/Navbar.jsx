import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">NutriTrack</Link>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/calculator">Calculator</Link>
              <Link to="/foods">Food Database</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <button 
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}