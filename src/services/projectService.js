import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000';
const API_V1_URL = `${API_URL}/api/v1`;

const fetchProjects = async (teamId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/teams/${teamId}/projects`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const fetchProject = async (teamId, projectId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/teams/${teamId}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const createProject = async (teamId, projectData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/teams/${teamId}/projects`, projectData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const updateProject = async (teamId, projectId, projectData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.put(`${API_V1_URL}/teams/${teamId}/projects/${projectId}`, projectData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const deleteProject = async (teamId, projectId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.delete(`${API_V1_URL}/teams/${teamId}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const projectService = {
  fetchProjects,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
};

export default projectService;