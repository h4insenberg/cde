import React from 'react';
import { Home, Package, ShoppingCart, HandCoins, ClipboardList, Settings, Wrench, TrendingUp, TrendingDown } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#131416]/90 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 px-2 py-1 z-50 safe-area-inset-bottom">
      <div className="flex justify-around max-w-6xl mx-auto overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center px-1 py-2 rounded-xl transition-all duration-200 min-w-0 flex-shrink-0 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30 scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              <span className="text-xs font-medium truncate whitespace-nowrap max-w-[60px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}