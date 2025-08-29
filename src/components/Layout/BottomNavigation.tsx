import React from 'react';
import { Home, Menu, Settings, Package, Wrench, TrendingUp, TrendingDown, ShoppingCart, HandCoins, ClipboardList } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuClick: () => void;
}

export function BottomNavigation({ activeTab, onTabChange, onMenuClick }: BottomNavigationProps) {
  // Mobile navigation (3 items only)
  const mobileItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'menu', label: 'Menu', icon: Menu, onClick: onMenuClick },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  // Desktop navigation (all items)
  const desktopItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'entries', label: 'Entradas', icon: TrendingUp },
    { id: 'exits', label: 'Saídas', icon: TrendingDown },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#131416]/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-3 py-1.5 z-50 md:hidden">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={item.onClick || (() => onTabChange(item.id))}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive && item.id !== 'menu'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#131416] border-t border-gray-200 dark:border-gray-700 px-1 py-2 z-50 hidden md:block">
        <div className="flex justify-around max-w-4xl mx-auto overflow-x-auto">
          {desktopItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center px-1 sm:px-2 py-1 rounded-lg transition-colors min-w-0 flex-shrink-0 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span className="text-xs mt-1 font-medium truncate whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}