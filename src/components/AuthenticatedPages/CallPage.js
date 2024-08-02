import React, { useEffect, useState, useCallback, useRef } from 'react';
import ApiService from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../context/WebSocketProvider';
import { useAuth } from '../../context/AuthContext';
import { FcVideoCall } from "react-icons/fc";
import 'bootstrap/dist/css/bootstrap.min.css';

const CallPage = () => {
  const { socket, isConnected } = useWebSocket();
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [calling, setCalling] = useState(false);
  const navigate = useNavigate();
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isConnected) {
      console.log('Socket is not initialized yet.');
      return;
    }

    console.log('Socket is initialized.');

    // Fetch friends from the API
    ApiService.getFriends(user.jwt)
      .then(response => setFriends(response))
      .catch(error => console.error('Error fetching friends:', error));

    const handleCallAccepted = ({ signal, from }) => {
      const peerConnection = peerConnectionRef.current;
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
      navigate(`/video-call/${from}`);
    };

    socket.on('call-accepted', handleCallAccepted);

    return () => {
      socket.off('call-accepted', handleCallAccepted);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [user, isConnected, socket, navigate]);

  const handleCall = useCallback(async (friendId) => {
    if (!isConnected) {
      console.log('Socket is not initialized yet.');
      return;
    }

    setCalling(true);

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    peerConnectionRef.current = peerConnection;

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('call-user', { 
      to: friendId, 
      from: user.user.id, 
      signal: peerConnection.localDescription,
      display_name: user.user.display_name || user.user.email // Add display_name or email
    });
    console.log(`Call emitted to friend with ID: ${friendId}`);

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', { to: friendId, from: user.user.id, candidate: event.candidate });
        console.log(`ICE candidate sent to ${friendId}`);
      }
    };

    peerConnection.ontrack = event => {
      console.log('Remote track received', event.streams[0]);
    };

    socket.on('ice-candidate', ({ candidate, from }) => {
      if (candidate && peerConnection.signalingState !== 'closed') {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(error => console.error('Error adding received ICE candidate', error));
        console.log(`ICE candidate received from ${from}`);
      }
    });
  }, [isConnected, socket, user]);

  return (
    <div className="container mt-5">
      <h1>Call Page</h1>
      <h2>Friend List</h2>
      {friends.length === 0 ? (
        <p>No current friends, add friends now.</p>
      ) : (
        <ul className="list-group">
          {friends.map(friend => (
            <li key={friend.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{friend.display_name || friend.name}</span>
              <button className="btn btn-primary" onClick={() => handleCall(friend.id)}>
                <FcVideoCall size={24} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {calling && <p className="mt-3">Calling...</p>}
    </div>
  );
};

export default CallPage;
