// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

// Mock API functions - replace with real API calls
async function authenticateUser(credentials) {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: credentials.email,
          profile: {
            name: 'Test User'
          }
        }
      });
    }, 500);
  });
}

async function verifyToken(token) {
  // Verify token with backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user-123',
        email: 'test@example.com',
        profile: {
          name: 'Test User'
        }
      });
    }, 500);
  });
}