// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import './Navbar.css'; // Create this file for styles

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          NutriTrack
        </Link>

        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/calculator" className="navbar-link">
                Calculator
              </Link>
              <Link to="/foods" className="navbar-link">
                Food Database
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="navbar-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
          
          <button
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;