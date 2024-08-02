import React, { useContext } from 'react';
import { NotificationContext } from '../AuthenticatedPages/NotificationContext';
import { Button, Modal } from 'react-bootstrap';
import './AuthenticatedCSS/NotificationList.css';
import API_URL from '../../config/config';


const NotificationList = ({ showModal, handleCloseModal }) => {
  const { notifications, markAsRead, respondToFriendRequest, respondToTeamInvite } = useContext(NotificationContext);

  // Filter notifications to show only unread ones
  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {unreadNotifications.map((notification) => (
          <div key={notification.id} className="notification-item d-flex align-items-center mb-3 p-2 border rounded">
            {notification.notification_type === 'friend_request' && notification.friend_request && notification.friend_request.user ? (
              <>
                <img
                  src={`${API_URL}${notification.friend_request.user.profile_picture_url}`}
                  alt="Profile"
                  className="img-fluid rounded-circle me-3"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <p className="mb-1">
                    <strong>{notification.friend_request.user.display_name}</strong> has sent you a friend request.
                  </p>
                  <div className="d-flex justify-content-start mt-2">
                    <Button variant="success" onClick={() => respondToFriendRequest(notification.id, notification.friend_request_id, 'accept')} className="me-2">
                      Accept
                    </Button>
                    <Button variant="danger" onClick={() => respondToFriendRequest(notification.id, notification.friend_request_id, 'decline')}>
                      Decline
                    </Button>
                  </div>
                </div>
              </>
            ) : notification.notification_type === 'team_invite' ? (
              <div className="w-100">
                <p>{notification.content}</p>
                <div className="d-flex justify-content-start mt-2">
                  <Button variant="success" onClick={() => respondToTeamInvite(notification.id, 'accept')} className="me-2">
                    Accept
                  </Button>
                  <Button variant="danger" onClick={() => respondToTeamInvite(notification.id, 'decline')}>
                    Decline
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-100">
                <p>{notification.content}</p>
                <Button variant="secondary" onClick={() => markAsRead(notification.id)}>
                  Mark as Read
                </Button>
              </div>
            )}
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationList;
