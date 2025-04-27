// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './pages/Register';
import Calculator from './pages/Calculator';
import FoodDatabase from './pages/FoodDatabase';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DarkModeProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/foods" element={<FoodDatabase />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="app-footer">
              <p>&copy; {new Date().getFullYear()} NutriTrack</p>
            </footer>
          </div>
        </DarkModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;