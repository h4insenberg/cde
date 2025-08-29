import React from 'react';
import { Bell, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useBusiness } from '../../context/BusinessContext';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}

export function Header({ title, onMenuClick, onNotificationsClick }: HeaderProps) {
  const { unreadCount } = useNotifications();
  const { state, dispatch } = useBusiness();

  return (
    <header className="bg-white/80 dark:bg-[#131416]/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 px-3 sm:px-6 py-2 sm:py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHOW_VALUES' })}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            title={state.showValues ? 'Ocultar valores' : 'Mostrar valores'}
          >
            {state.showValues ? (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            title={state.darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {state.darkMode ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          <button
            onClick={onNotificationsClick}
            className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}