import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NutritionCalculator from './components/nutrition/Calculator';
import FoodDatabase from './components/food/FoodDatabase';
import NutrientInfo from './components/nutrition/NutrientInfo';
import UserProfile from './components/profile/UserProfile';
import Navbar from 'components/common/Navbar.jsx';
import './App.css';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/calculator" element={<NutritionCalculator />} />
                <Route path="/foods" element={<FoodDatabase />} />
                <Route path="/nutrients" element={<NutrientInfo />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <section className="section">
      <h2>Welcome to NutriTrack</h2>
      {!isAuthenticated && (
        <div className="auth-actions">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      )}
    </section>
  );
}

function Footer() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  
  return (
    <footer>
      <div className="container">
        <p>&copy; 2023 NutriTrack</p>
        <button onClick={toggleDarkMode} className="btn btn-mode">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </footer>
  );
}

export default App;