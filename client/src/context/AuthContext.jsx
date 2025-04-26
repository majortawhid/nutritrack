import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nutritrack_token');
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const profile = await getProfile(token);
      setUser(profile);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      localStorage.removeItem('nutritrack_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const { token, user } = await loginUser(credentials);
    localStorage.setItem('nutritrack_token', token);
    setUser(user);
    return user;
  };

  const register = async (credentials) => {
    const { token, user } = await registerUser(credentials);
    localStorage.setItem('nutritrack_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('nutritrack_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}