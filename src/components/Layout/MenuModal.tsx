import React from 'react';
import { X, Package, Wrench, TrendingUp, TrendingDown, ShoppingCart, HandCoins, ClipboardList, BarChart3 } from 'lucide-react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MenuModal({ isOpen, onClose, activeTab, onTabChange }: MenuModalProps) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'entries', label: 'Entradas', icon: TrendingUp, description: 'Registrar receitas extras' },
    { id: 'exits', label: 'Saídas', icon: TrendingDown, description: 'Registrar despesas' },
    { id: 'products', label: 'Produtos', icon: Package, description: 'Gerenciar estoque' },
    { id: 'services', label: 'Serviços', icon: Wrench, description: 'Cadastrar serviços' },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart, description: 'Histórico de vendas' },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins, description: 'Controlar empréstimos' },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList, description: 'Comandas digitais' },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, description: 'Análises e relatórios' },
  ];

  const handleItemClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 md:hidden">
      <div className="bg-white dark:bg-[#18191c] rounded-t-3xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-3 rounded-xl ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}