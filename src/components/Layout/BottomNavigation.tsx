import React, { useState } from 'react';
import { Home, Menu, Settings, X, TrendingUp, TrendingDown, Package, Wrench, ShoppingCart, HandCoins, ClipboardList } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onMenuClick }: BottomNavigationProps) {

  const menuItems = [
    { id: 'entries', label: 'Entradas', icon: TrendingUp, color: 'text-green-500' },
    { id: 'exits', label: 'Saídas', icon: TrendingDown, color: 'text-red-500' },
    { id: 'products', label: 'Produtos', icon: Package, color: 'text-blue-500' },
    { id: 'services', label: 'Serviços', icon: Wrench, color: 'text-purple-500' },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart, color: 'text-orange-500' },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins, color: 'text-yellow-500' },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList, color: 'text-indigo-500' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#131416]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-3 z-40 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* Início */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center px-6 py-2 rounded-2xl transition-all duration-200 ${
            activeTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 scale-105 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:scale-105'
          }`}
        >
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs font-semibold">Início</span>
        </button>

        {/* Menu */}
        <button
          onClick={onMenuClick}
          className={`flex flex-col items-center px-6 py-2 rounded-2xl transition-all duration-200 ${
            menuItems.some(item => item.id === activeTab)
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 scale-105 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:scale-105'
          }`}
        >
          <Menu className="h-6 w-6 mb-1" />
          <span className="text-xs font-semibold">Menu</span>
        </button>

        {/* Config */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center px-6 py-2 rounded-2xl transition-all duration-200 ${
            activeTab === 'settings'
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 scale-105 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:scale-105'
          }`}
        >
          <Settings className="h-6 w-6 mb-1" />
          <span className="text-xs font-semibold">Config</span>
        </button>
      </div>
    </nav>
  );
}