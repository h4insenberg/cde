import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}

export function Header({ title, onMenuClick, onNotificationsClick }: HeaderProps) {
  const { unreadCount } = useNotifications();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
        
        <button
          onClick={onNotificationsClick}
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}