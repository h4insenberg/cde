import React from 'react';
import { Bell, Menu, Eye, EyeOff, Sun, Moon, Store } from 'lucide-react';
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
    <header className="bg-white dark:bg-[#131416] border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Meu Negócio</h1>
            </div>
          </div>
          
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors md:hidden ml-2"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHOW_VALUES' })}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            title={state.showValues ? 'Ocultar valores' : 'Mostrar valores'}
          >
            {state.showValues ? (
              <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            title={state.darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {state.darkMode ? (
              <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          <button
            onClick={onNotificationsClick}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}