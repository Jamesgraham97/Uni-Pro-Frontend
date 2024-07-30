import { createConsumer } from '@rails/actioncable';

let consumer = null;
const user = JSON.parse(localStorage.getItem('user'));
const token = user ? user.jwt : null;

if (token) {
  const cableUrl = `ws://localhost:3000/cable?token=${token}`;
  consumer = createConsumer(cableUrl);
} else {
  console.warn("No JWT token found, not initializing WebSocket connection.");
}

export default consumer;
