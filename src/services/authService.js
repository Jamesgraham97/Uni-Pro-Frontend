import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import io from 'socket.io-client';

const API_URL = 'http://localhost:3000';
const API_V1_URL = `${API_URL}/api/v1`;

let socket;


const register = async (email, password, displayName) => {
  const response = await axios.post(`${API_URL}/users`, {
    user: {
      email,
      password,
      password_confirmation: password,
      display_name: displayName,
    },
  });
  return response.data;
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/users/sign_in`, {
    user: { email, password },
  });

  const data = response.data;
  if (data.jwt) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user && user.jwt) {
      const decodedToken = jwtDecode(user.jwt);
      if (decodedToken.exp * 1000 > Date.now()) {
        return user;
      } else {
        localStorage.removeItem('user');
      }
    }
  }
  return null;
};
const fetchUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const response = await axios.get(`${API_V1_URL}/users`, {
      headers: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });
    return response.data;
  };

  const connectToWebSocket = (userId) => {
    socket = io.connect('http://localhost:8080', {
      query: { userId },
    });
  
    socket.on('call-user', ({ from, signal, display_name }) => {
      // Handle incoming call notification
      console.log('Received call from:', from);
      // Show a notification or redirect to the video call page
    });
  };
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  fetchUsers,
  connectToWebSocket
};

export default authService;
