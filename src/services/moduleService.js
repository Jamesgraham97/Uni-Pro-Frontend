import axios from 'axios';
import authService from './authService';

import API_URL from '../config/config.js';
const API_V1_URL = `${API_URL}/api/v1`;

const fetchModules = async () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/modules`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const createModule = async (moduleData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/modules`, moduleData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const updateModule = async (moduleId, moduleData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.put(`${API_V1_URL}/modules/${moduleId}`, moduleData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const deleteModule = async (moduleId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  await axios.delete(`${API_V1_URL}/modules/${moduleId}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
};

const moduleService = {
  fetchModules,
  createModule,
  updateModule,
  deleteModule,
};

export default moduleService;