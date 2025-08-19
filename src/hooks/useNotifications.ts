import { useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Notification } from '../types';
import { generateId } from '../utils/helpers';

export function useNotifications() {
  const { state, dispatch } = useBusiness();

  const addNotification = (type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: generateId(),
      type,
      message,
      createdAt: new Date(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  // Check for low stock alerts
  useEffect(() => {
    state.products.forEach(product => {
      if (product.quantity <= product.minQuantity) {
        const existingAlert = state.notifications.find(
          n => n.type === 'LOW_STOCK' && 
               n.message.includes(product.name) && 
               !n.read
        );
        
        if (!existingAlert) {
          addNotification(
            'LOW_STOCK', 
            `Estoque baixo: ${product.name} (${product.quantity} ${product.unit})`
          );
        }
      }
    });
  }, [state.products]);

  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
  };
}