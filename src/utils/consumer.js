// C:\Users\James\Desktop\unipro-frontend-app\src\utils\consumer.js
import { createConsumer } from '@rails/actioncable';
import API_URL from '../config/config';

let consumer = null;
const user = JSON.parse(localStorage.getItem('user'));
const token = user ? user.jwt : null;

if (token) {
  const cableUrl = `${API_URL.replace('http', 'ws')}/cable?token=${token}`;
  consumer = createConsumer(cableUrl);
} else {
  console.warn("No JWT token found, not initializing WebSocket connection.");
}

export default consumer;
