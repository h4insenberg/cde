import React from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Bell } from 'lucide-react';
import { Notification } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { notifications, markAsRead } = useNotifications();

  if (!isOpen) return null;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'LOW_STOCK':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'LOW_STOCK':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'SUCCESS':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'ERROR':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const sortedNotifications = notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-24">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-md max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notificações
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {sortedNotifications.length > 0 ? (
            <div className="p-4 space-y-3">
              {sortedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getNotificationBgColor(notification.type)} ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDate(new Date(notification.createdAt))}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Nenhuma notificação</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}