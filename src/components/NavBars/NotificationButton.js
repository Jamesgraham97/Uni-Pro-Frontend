import React, { useState, useContext } from 'react';
import { NotificationContext } from '../AuthenticatedPages/NotificationContext';
import NotificationList from '../AuthenticatedPages/NotificationList';

const NotificationButton = () => {
  const { notifications, respondToFriendRequest } = useContext(NotificationContext);
  const [showModal, setShowModal] = useState(false);

  const handleNotificationClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleResponse = async (notification, response) => {
    await respondToFriendRequest(notification.id, notification.friend_request_id, response);
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <>
      <li className="nav-item">
        <button onClick={handleNotificationClick} className="nav-link py-3 px-2 link-light" title="Notification" data-bs-toggle="tooltip" data-bs-placement="right">
          <i className={`bi ${unreadNotifications.length > 0 ? 'bi-bell-fill' : 'bi-bell'} fs-1`}></i>
        </button>
      </li>
      <NotificationList
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleResponse={handleResponse}
        notifications={notifications}
      />
    </>
  );
};

export default NotificationButton;
