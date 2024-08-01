import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebSocket } from '../../context/WebSocketProvider';
import { useAuth } from '../../context/AuthContext';
import { TbScreenShare } from 'react-icons/tb';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaComments, FaUserPlus } from 'react-icons/fa';
import { FcEndCall } from 'react-icons/fc';
import ApiService from '../../services/api';
import './AuthenticatedCSS/VideoCall.css';

const VideoCall = () => {
  const { friendId } = useParams();
  const { user } = useAuth();
  const { socket } = useWebSocket();
  const [remoteStream, setRemoteStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);

  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    socket.emit('end-call', { to: friendId });
    navigate('/dashboard'); // Redirect to the dashboard or any other page
  }, [friendId, navigate, socket]);

  useEffect(() => {
    const setupPeerConnection = async () => {
      if (peerConnectionRef.current) {
        console.log('Peer connection already exists');
        return;
      }

      try {
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        peerConnectionRef.current = peerConnection;

        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;

        localStream.getTracks().forEach(track => {
          if (peerConnection.signalingState !== 'closed') {
            peerConnection.addTrack(track, localStream);
          }
        });

        peerConnection.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', { to: friendId, from: user.user.id, candidate: event.candidate });
          }
        };

        socket.on('ice-candidate', ({ candidate }) => {
          if (candidate && peerConnection.signalingState !== 'closed') {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error('Error adding received ICE candidate', e));
          }
        });

        socket.on('call-user', async ({ from, signal }) => {
          if (from !== user.user.id && signal.type === 'offer') {
            try {
              if (peerConnection.signalingState !== 'closed') {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('accept-call', { to: from, from: user.user.id, signal: peerConnection.localDescription });
              }
            } catch (error) {
              console.error('Error handling call-user event', error);
            }
          }
        });

        socket.on('call-accepted', async ({ signal }) => {
          if (peerConnection.signalingState !== 'closed') {
            try {
              await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
            } catch (error) {
              console.error('Error setting remote description on call-accepted', error);
            }
          }
        });

        socket.on('end-call', () => {
          endCall();
        });

        if (user.user.id !== friendId) {
          try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('call-user', { to: friendId, from: user.user.id, signal: peerConnection.localDescription });
          } catch (error) {
            console.error('Error creating offer', error);
          }
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    setupPeerConnection();

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      socket.off('ice-candidate');
      socket.off('call-user');
      socket.off('call-accepted');
      socket.off('end-call');
    };
  }, [friendId, socket, user, endCall]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    ApiService.getFriends(user.jwt)
      .then(response => setFriends(response))
      .catch(error => console.error('Error fetching friends:', error));
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
  
      return () => {
        socket.off('receive-message');
      };
    }
  }, [socket]);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = stream.getTracks()[0];
      const localStream = localVideoRef.current.srcObject;
      const videoTrack = localStream.getVideoTracks()[0];

      peerConnectionRef.current.getSenders().forEach(sender => {
        if (sender.track === videoTrack) {
          sender.replaceTrack(screenTrack);
        }
      });

      screenTrack.onended = () => {
        peerConnectionRef.current.getSenders().forEach(sender => {
          if (sender.track === screenTrack) {
            sender.replaceTrack(videoTrack);
          }
        });
        localVideoRef.current.srcObject = localStream;
        setIsScreenSharing(false);
      };

      localVideoRef.current.srcObject = stream;
      setIsScreenSharing(true);
    } else {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const videoTrack = localStream.getVideoTracks()[0];

      peerConnectionRef.current.getSenders().forEach(sender => {
        if (sender.track.kind === 'video') {
          sender.replaceTrack(videoTrack);
        }
      });

      localVideoRef.current.srcObject = localStream;
      setIsScreenSharing(false);
    }
  };

  const toggleMute = () => {
    const localStream = localVideoRef.current.srcObject;
    localStream.getAudioTracks()[0].enabled = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    const localStream = localVideoRef.current.srcObject;
    localStream.getVideoTracks()[0].enabled = !isCameraOff;
    setIsCameraOff(!isCameraOff);
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    setIsInviteVisible(false); // Hide invite if chat is opened
  };

  const toggleInvite = () => {
    setIsInviteVisible(!isInviteVisible);
    setIsChatVisible(false); // Hide chat if invite is opened
  };

  const sendMessage = () => {
    const message = {
      to: friendId,
      from: user.user.id,
      text: newMessage,
      name: user.user.display_name || user.user.email // Ensure 'name' is included
    };
    socket.emit('send-message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  const inviteParticipant = (friendId) => {
    socket.emit('invite-participant', { to: friendId, from: user.user.id });
  };

  return (
    <div className={`video-call-container ${isChatVisible ? 'chat-visible' : ''} ${isInviteVisible ? 'invite-visible' : ''}`}>
      <div className="video-call-wrapper">
        <div className="toolbar">
          <button className="control-button" onClick={toggleScreenShare}>
            <TbScreenShare size={24} />
          </button>
          <button className="control-button" onClick={toggleMute}>
            {isMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
          </button>
          <button className="control-button" onClick={toggleCamera}>
            {isCameraOff ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
          </button>
          <button className="control-button" onClick={toggleChat}>
            <FaComments size={24} />
          </button>
          <button className="control-button" onClick={toggleInvite}>
            <FaUserPlus size={24} />
          </button>
          <button className="control-button end-call" onClick={endCall}>
            <FcEndCall size={24} />
          </button>
        </div>
        <div className="remote-video-container">
          <video ref={remoteVideoRef} autoPlay className="remote-video" />
          <video ref={localVideoRef} autoPlay muted className="local-video" />
        </div>
        {isChatVisible && (
          <div className="chat">
            <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.from === user.user.id ? 'my-message' : 'their-message'}`}>
                <strong>{message.name}:</strong> {message.text}
             </div>
            ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
        {isInviteVisible && (
          <div className="invite">
            <h4>Invite Participants</h4>
            <ul>
              {friends.map(friend => (
                <li key={friend.id} className="invite-item">
                  <span>{friend.display_name || friend.name}</span>
                  <button className="invite-button" onClick={() => inviteParticipant(friend.id)}>
                    Invite
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
