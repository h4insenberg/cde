import React from 'react';
import { Home, Menu, Settings, TrendingUp, TrendingDown, Package, Wrench, ShoppingCart, HandCoins, ClipboardList } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onMenuClick }: BottomNavigationProps) {
  const allMenuItems = [
    { id: 'dashboard', label: 'Início', icon: Home, color: 'text-blue-500' },
    { id: 'entries', label: 'Entradas', icon: TrendingUp, color: 'text-green-500' },
    { id: 'exits', label: 'Saídas', icon: TrendingDown, color: 'text-red-500' },
    { id: 'products', label: 'Produtos', icon: Package, color: 'text-blue-500' },
    { id: 'services', label: 'Serviços', icon: Wrench, color: 'text-purple-500' },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart, color: 'text-orange-500' },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins, color: 'text-yellow-500' },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList, color: 'text-indigo-500' },
    { id: 'settings', label: 'Config', icon: Settings, color: 'text-gray-500' },
  ];

  const mobileMenuItems = [
    { id: 'dashboard', label: 'Início', icon: Home, color: 'text-blue-500' },
    { id: 'settings', label: 'Config', icon: Settings, color: 'text-gray-500' },
  ];

  const otherMenuItems = allMenuItems.filter(item => 
    !['dashboard', 'settings'].includes(item.id)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#131416]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-3 z-40 safe-area-pb">
      {/* Mobile Navigation (3 items) */}
      <div className="flex justify-around items-center max-w-md mx-auto md:hidden">
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
            otherMenuItems.some(item => item.id === activeTab)
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

      {/* Desktop Navigation (all items) */}
      <div className="hidden md:flex justify-center items-center space-x-2 max-w-4xl mx-auto overflow-x-auto">
        {allMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-200 min-w-0 ${
                activeTab === item.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 scale-105 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 hover:scale-105'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-semibold truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}