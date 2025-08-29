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

  const checkAndUpdateNotifications = useCallback(() => {
    // Limpa todas as notificações existentes
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });

    // Verifica produtos com estoque baixo
    state.products.forEach(product => {
      if (product.quantity <= product.minQuantity) {
        addNotification(
          'LOW_STOCK', 
          `Estoque baixo: ${product.name} (${product.quantity} ${product.unit})`
        );
      }
    });

    // Verifica empréstimos vencidos
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    state.loans.forEach(loan => {
      if (loan.status === 'ACTIVE') {
        const dueDate = new Date(loan.dueDate);
        dueDate.setHours(23, 59, 59, 999);
        
        if (dueDate < today) {
          // Atualiza status do empréstimo para vencido
          const overdueLoan = { ...loan, status: 'OVERDUE' as const };
          dispatch({ type: 'UPDATE_LOAN', payload: overdueLoan });
          
          // Adiciona notificação
          addNotification(
            'ERROR', 
            `Empréstimo vencido: ${loan.customerName} - R$ ${loan.totalAmount.toFixed(2).replace('.', ',')}`
          );
        }
      }
    });
  }, [state.products, state.loans, dispatch, addNotification]);

  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    checkAndUpdateNotifications,
  };
}