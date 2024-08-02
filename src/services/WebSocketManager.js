import io from 'socket.io-client';

class WebSocketManager {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    if (!this.socket || !this.socket.connected) {
      this.socket = io('http://ec2-44-204-147-65.compute-1.amazonaws.com:8080', {
        query: { userId },
        transports: ['websocket', 'polling'], // Ensure both transports are allowed
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket server:', reason);
        // Reconnect logic can be added here if needed
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;
