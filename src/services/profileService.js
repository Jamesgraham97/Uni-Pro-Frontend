import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000';
const API_V1_URL = `${API_URL}/api/v1`;

const getCurrentUserProfile = async () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const updateUserProfile = async (formData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.put(`${API_V1_URL}/profile`, formData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const profileService  = {
  getCurrentUserProfile,
  updateUserProfile,
};

export default profileService;