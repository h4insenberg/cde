import React from 'react';
import { Bell, Eye, EyeOff, Sun, Moon, RotateCcw, Search, Package } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useBusiness } from '../../context/BusinessContext';

interface DesktopHeaderProps {
  title: string;
  onNotificationsClick?: () => void;
}

export function DesktopHeader({ title, onNotificationsClick }: DesktopHeaderProps) {
  const { unreadCount } = useNotifications();
  const { state, dispatch } = useBusiness();

  return (
    <header className="hidden lg:block lg:ml-80 bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-slate-400" />
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
            <span>Connect</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Keyword Search"
              className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHOW_VALUES' })}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            title={state.showValues ? 'Ocultar valores' : 'Mostrar valores'}
          >
            {state.showValues ? (
              <Eye className="h-5 w-5 text-slate-400" />
            ) : (
              <EyeOff className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            title={state.darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {state.darkMode ? (
              <Sun className="h-5 w-5 text-slate-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <RotateCcw className="h-5 w-5 text-slate-400" />
          </button>
          
          <button
            onClick={onNotificationsClick}
            className="relative p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-400" />
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