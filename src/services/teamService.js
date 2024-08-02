import axios from 'axios';
import authService from './authService';
import API_URL from '../config/config.js';
const API_V1_URL = `${API_URL}/api/v1`;

const fetchTeams = async () => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const response = await axios.get(`${API_V1_URL}/teams`, {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });
    console.log('Teams Data:', response.data); // Log the response data
    return response.data;
  };

const createTeam = async (teamData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/teams`, teamData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const updateTeam = async (teamId, teamData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.put(`${API_V1_URL}/teams/${teamId}`, teamData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const deleteTeam = async (teamId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.delete(`${API_V1_URL}/teams/${teamId}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const teamService = {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
};

export default teamService;