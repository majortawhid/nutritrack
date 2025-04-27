// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('nutritrack_token');
    if (token) {
      verifyToken(token).then(userData => {
        setUser(userData);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('nutritrack_token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user } = await authenticateUser(credentials);
      localStorage.setItem('nutritrack_token', token);
      setUser(user);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('nutritrack_token');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = (profileData) => {
    setUser(prev => ({ ...prev, profile: profileData }));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Replace mock API functions with real API calls
async function authenticateUser(credentials) {
  return await loginUser(credentials);
}

async function verifyToken(token) {
  // Implement token verification logic with backend
  const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return await response.json();
}

// Add explicit export for AuthContext
export { AuthContext };