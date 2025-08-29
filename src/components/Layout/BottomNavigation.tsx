import React from 'react';
import { Home, Package, ShoppingCart, ClipboardList, Settings, HandCoins, Wrench } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'comanda', label: 'Comanda', icon: ClipboardList },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#131416] border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50">
      <div className="flex justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center px-2 sm:px-3 py-1 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span className="text-xs mt-1 font-medium truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}