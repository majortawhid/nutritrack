import api from './api';

export const loginUser = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const registerUser = async (credentials) => {
  const response = await api.post('/register', credentials);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('nutritrack_token');
};