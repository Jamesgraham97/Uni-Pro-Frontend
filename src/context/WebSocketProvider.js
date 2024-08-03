import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import WebSocketManager from '../services/WebSocketManager';
import Modal from 'react-modal';
import './WebSocketProvider.css';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.user.id) {
      try {
        WebSocketManager.connect(user.user.id);
        setIsConnected(true);
        console.log(`WebSocket connected with user ID: ${user.user.id}`);
      } catch (error) {
        console.error('Error connecting WebSocket:', error);
      }
    }

    return () => {
      try {
        WebSocketManager.disconnect();
        setIsConnected(false);
        console.log('WebSocket disconnected');
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }
    };
  }, [user]);

  const socket = WebSocketManager.getSocket();

  useEffect(() => {
    if (socket) {
      socket.on('call-user', (data) => {
        console.log('Incoming call from:', data.from);
        setIncomingCall(data);
      });
  
      socket.on('call-accepted', ({ signal, from }) => {
        console.log('Call accepted by:', from);
        navigate(`/video-call/${from}`);
      });
  
      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
  
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
  
      return () => {
        socket.off('call-user');
        socket.off('call-accepted');
        socket.off('connect_error');
        socket.off('error');
      };
    }
  }, [socket, navigate]);
  

  const acceptCall = () => {
    if (incomingCall) {
      try {
        socket.emit('accept-call', {
          to: incomingCall.from,
          from: user.user.id,
          signal: incomingCall.signal 
        });
        setIncomingCall(null); // clear the incoming call
        navigate(`/video-call/${incomingCall.from}`);
      } catch (error) {
        console.error('Error accepting call:', error);
      }
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      // Handle call rejection logic if needed
      setIncomingCall(null);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, incomingCall, acceptCall, rejectCall, isConnected }}>
      {children}
      <Modal
        isOpen={!!incomingCall}
        onRequestClose={rejectCall}
        contentLabel="Incoming Call"
        ariaHideApp={false}
        className="incoming-call-modal"
        overlayClassName="incoming-call-overlay"
      >
        {incomingCall && (
          <div className="incoming-call-content">
            <p>{incomingCall.display_name} is calling...</p>
            <div className="button-group">
              <button className="btn btn-success me-2" onClick={acceptCall}>Accept</button>
              <button className="btn btn-danger" onClick={rejectCall}>Reject</button>
            </div>
          </div>
        )}
      </Modal>
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
