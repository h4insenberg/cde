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
    <header className="hidden lg:block lg:ml-80 bg-[#1c2128] border-b border-[#30363d] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#4ade80] rounded flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
          <button className="bg-[#4ade80] hover:bg-[#22c55e] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span>Connect</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Keyword Search"
              className="bg-[#2a3441] border border-[#3a4553] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent w-64"
            />
          </div>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHOW_VALUES' })}
            className="p-2 rounded-lg hover:bg-[#2a3441] transition-colors"
            title={state.showValues ? 'Ocultar valores' : 'Mostrar valores'}
          >
            {state.showValues ? (
              <Eye className="h-5 w-5 text-[#8b949e]" />
            ) : (
              <EyeOff className="h-5 w-5 text-[#8b949e]" />
            )}
          </button>
          
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className="p-2 rounded-lg hover:bg-[#2a3441] transition-colors"
            title={state.darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {state.darkMode ? (
              <Sun className="h-5 w-5 text-[#8b949e]" />
            ) : (
              <Moon className="h-5 w-5 text-[#8b949e]" />
            )}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-[#2a3441] transition-colors">
            <RotateCcw className="h-5 w-5 text-[#8b949e]" />
          </button>
          
          <button
            onClick={onNotificationsClick}
            className="relative p-2 rounded-lg hover:bg-[#2a3441] transition-colors"
          >
            <Bell className="h-5 w-5 text-[#8b949e]" />
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