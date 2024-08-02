import axios from 'axios';
import authService from './authService';

import API_URL from '../config/config.js';

const API_V1_URL = `${API_URL}/api/v1`;

const fetchAssignments = async (projectId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const url = projectId ? `${API_V1_URL}/projects/${projectId}/assignments` : `${API_V1_URL}/assignments`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const fetchAssignment = async (id) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/assignments/${id}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const createAssignment = async (moduleId, assignmentData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/modules/${moduleId}/assignments`, assignmentData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const updateAssignment = async (assignmentId, assignmentData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.put(`${API_V1_URL}/assignments/${assignmentId}`, assignmentData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const deleteAssignment = async (assignmentId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.delete(`${API_V1_URL}/assignments/${assignmentId}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const fetchKanbanAssignments = async () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/kanban`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const updateAssignmentStatus = async (assignmentId, newStatus) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const response = await axios.patch(`${API_V1_URL}/assignments/${assignmentId}/update_status`, {
    status: newStatus,
  }, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const createSubtask = async (assignmentId, subtaskData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/assignments/${assignmentId}/subtasks`, subtaskData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const claimAssignment = async (assignmentId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/assignments/${assignmentId}/claim`, {}, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};
const assignmentService = {
  fetchAssignments,
  fetchAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  fetchKanbanAssignments,
  updateAssignmentStatus,
  createSubtask,
  claimAssignment,
};

export default assignmentService;