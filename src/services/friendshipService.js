import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:3000';
const API_V1_URL = `${API_URL}/api/v1`;

const searchUsers = async (query) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/users/search`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
    params: { query },
  });
  return response.data;
};

const sendFriendRequest = async (userId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.post(`${API_V1_URL}/friendships`, { friend_id: userId }, {
    headers: { Authorization: `Bearer ${user.jwt}` },
  });
  return response.data;
};

const getFriends = async () => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/friendships`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data;
};

const getFriendshipStatus = async (userId) => {
  const user = authService.getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const response = await axios.get(`${API_V1_URL}/friendships/${userId}/status`, {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  });
  return response.data.status;
};

const friendshipService = {
  searchUsers,
  sendFriendRequest,
  getFriends,
  getFriendshipStatus,
};

export default friendshipService;
