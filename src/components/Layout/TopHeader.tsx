import React from 'react';
import { Menu, Bell, Eye, EyeOff, Sun, Moon, Search, Globe, RotateCcw } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useBusiness } from '../../context/BusinessContext';

interface TopHeaderProps {
  title: string;
  onMenuToggle?: () => void;
  onNotificationsClick?: () => void;
}

export function TopHeader({ title, onMenuToggle, onNotificationsClick }: TopHeaderProps) {
  const { unreadCount } = useNotifications();
  const { state, dispatch } = useBusiness();

  return (
    <header className="bg-[#1a2332] border-b border-[#3a4a5c] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-[#243447] transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-300" />
            </button>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="bg-[#4ade80] p-2 rounded-lg">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#4ade80] font-bold text-sm">🍃</span>
              </div>
            </div>
            <h1 className="text-white text-xl font-semibold">{title}</h1>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHOW_VALUES' })}
            className="p-2 rounded-lg hover:bg-[#243447] transition-colors"
            title={state.showValues ? 'Ocultar valores' : 'Mostrar valores'}
          >
            {state.showValues ? (
              <Eye className="h-5 w-5 text-[#60a5fa]" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-[#243447] transition-colors">
            <Globe className="h-5 w-5 text-[#60a5fa]" />
          </button>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 rounded-lg hover:bg-[#243447] transition-colors"
            title={state.darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {state.darkMode ? (
              <Sun className="h-5 w-5 text-[#60a5fa]" />
            ) : (
              <Moon className="h-5 w-5 text-[#60a5fa]" />
            )}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-[#243447] transition-colors">
            <RotateCcw className="h-5 w-5 text-[#60a5fa]" />
          </button>
          
          <button
            onClick={onNotificationsClick}
            className="relative p-2 rounded-lg hover:bg-[#243447] transition-colors"
          >
            <Bell className="h-5 w-5 text-[#60a5fa]" />
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