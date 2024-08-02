import axios from 'axios';
import authService from './authService';

import API_URL from '../config/config.js';
const API_V1_URL = `${API_URL}/api/v1`;

const fetchNotifications = async () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
    credentials: 'include',
  });
  return response.data;
};

const markAsRead = async (id) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  await axios.post(`${API_V1_URL}/notifications/${id}/mark_as_read`, {}, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
};

const respondToFriendRequest = async (id, friendRequestId, response) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const res = await axios.post(`${API_V1_URL}/notifications/${id}/respond_to_friend_request`, {
    friend_request_id: friendRequestId,
    response,
  }, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
    credentials: 'include',
  });
  return res.data;
};

const triggerTestNotification = async () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  try {
    await axios.get(`${API_URL}/test_notification`, {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

const respondToTeamInvite = async (notificationId, response) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const result = await axios.post(`${API_V1_URL}/notifications/${notificationId}/respond_to_team_invite`, { response }, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return result.data;
};

const notificationService = {
  fetchNotifications,
  markAsRead,
  respondToFriendRequest,
  triggerTestNotification,
  respondToTeamInvite
};

export default notificationService;
