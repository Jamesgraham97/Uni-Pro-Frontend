import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000';
const API_V1_URL = `${API_URL}/api/v1`;

const fetchProjectAssignments = async (teamId, projectId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const url = `${API_V1_URL}/teams/${teamId}/projects/${projectId}/project_assignments`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const createProjectAssignment = async (teamId, projectId, projectAssignmentData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/teams/${teamId}/projects/${projectId}/project_assignments`, projectAssignmentData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const claimProjectAssignment = async (teamId, projectId, projectAssignmentId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const response = await axios.patch(`${API_V1_URL}/teams/${teamId}/projects/${projectId}/project_assignments/${projectAssignmentId}/claim`, {}, {
    headers: {
      Authorization: `Bearer ${user.jwt}`, // Ensure to send the token for authenticated requests
    },
  });

  return response.data;
};

const updateProjectAssignmentStatus = async (teamId, projectId, projectAssignmentId, newStatus) => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
  
    const response = await axios.patch(`${API_V1_URL}/teams/${teamId}/projects/${projectId}/project_assignments/${projectAssignmentId}/update_status`, { status: newStatus }, {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });
  
    return response.data;
  };

const updateProjectAssignment = async (teamId, projectId, projectAssignmentId, projectAssignmentData) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.put(`${API_V1_URL}/teams/${teamId}/projects/${projectId}/project_assignments/${projectAssignmentId}`, projectAssignmentData, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const deleteProjectAssignment = async (teamId, projectId, projectAssignmentId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.delete(`${API_V1_URL}/teams/${teamId}/projects/${projectId}/project_assignments/${projectAssignmentId}`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const projectAssignmentService = {
  fetchProjectAssignments,
  createProjectAssignment,
  claimProjectAssignment,
  updateProjectAssignmentStatus,
  updateProjectAssignment,
  deleteProjectAssignment,
};

export default projectAssignmentService;
