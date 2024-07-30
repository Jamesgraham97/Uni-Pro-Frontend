import React, { createContext, useState, useEffect, useCallback } from 'react';
import ApiService from '../../services/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await ApiService.fetchNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await ApiService.markAsRead(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id)); // Remove the notification from the list
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const respondToFriendRequest = async (id, friendRequestId, response) => {
    try {
      await ApiService.respondToFriendRequest(id, friendRequestId, response);
      setNotifications(prev => prev.filter(notification => notification.id !== id)); // Remove the notification from the list
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
    }
  };

  const respondToTeamInvite = async (id, response) => {
    try {
      await ApiService.respondToTeamInvite(id, response);
      setNotifications(prev => prev.filter(notification => notification.id !== id)); // Remove the notification from the list
    } catch (error) {
      console.error('Failed to respond to team invite:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications, markAsRead, respondToFriendRequest, respondToTeamInvite }}>
      {children}
    </NotificationContext.Provider>
  );
};
