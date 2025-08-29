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

  // Check for low stock alerts and overdue loans
  useEffect(() => {
    // Check for low stock products
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

    // Check for overdue loans
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    state.loans.forEach(loan => {
      if (loan.status === 'ACTIVE') {
        const dueDate = new Date(loan.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        // Check if loan is overdue (due date has passed)
        if (dueDate < today) {
          // Update loan status to OVERDUE
          const overdueLoan = { ...loan, status: 'OVERDUE' as const };
          dispatch({ type: 'UPDATE_LOAN', payload: overdueLoan });
          
          // Check if we already have an overdue notification for this loan
          const existingAlert = state.notifications.find(
            n => n.type === 'ERROR' && 
                 n.message.includes(loan.customerName) && 
                 n.message.includes('vencido') &&
                 !n.read
          );
          
          if (!existingAlert) {
            addNotification(
              'ERROR', 
              `Empréstimo vencido: ${loan.customerName} - ${loan.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            );
          }
        }
      }
    });
  }, [state.products, state.loans]);

  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    addNotification,
    markAsRead,
  };
}