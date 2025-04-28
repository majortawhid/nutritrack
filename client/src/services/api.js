import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'; // 'https://ntrack-pl9b.onrender.com/api'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutritrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getFoods = () => api.get('/foods');
export const createFood = (foodData) => api.post('/foods', foodData);
export const updateFood = (id, foodData) => api.put(`/foods/${id}`, foodData);
export const deleteFood = (id) => api.delete(`/foods/${id}`);

export const calculateNutrition = () => api.get('/calculate');
export const getProfile = () => api.get('/profile');
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    console.log('Update Profile Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw error;
  }
};

export default api;