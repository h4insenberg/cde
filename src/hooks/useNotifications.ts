import { useCallback } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Notification } from '../types';
import { generateId } from '../utils/helpers';

export function useNotifications() {
  const { state, dispatch } = useBusiness();

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: generateId(),
      type,
      message,
      createdAt: new Date(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, [dispatch]);

  const markAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, [dispatch]);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  }, [dispatch]);


  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}