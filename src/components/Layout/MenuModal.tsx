import React from 'react';
import { X, TrendingUp, TrendingDown, Package, Wrench, ShoppingCart, HandCoins, ClipboardList } from 'lucide-react';

interface MenuModalProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
}

export function MenuModal({ isOpen, activeTab, onTabChange, onClose }: MenuModalProps) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'entries', label: 'Entradas', icon: TrendingUp, color: 'text-green-500', description: 'Registrar entradas de dinheiro' },
    { id: 'exits', label: 'Saídas', icon: TrendingDown, color: 'text-red-500', description: 'Registrar saídas de dinheiro' },
    { id: 'products', label: 'Produtos', icon: Package, color: 'text-blue-500', description: 'Gerenciar produtos e estoque' },
    { id: 'services', label: 'Serviços', icon: Wrench, color: 'text-purple-500', description: 'Cadastrar serviços oferecidos' },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart, color: 'text-orange-500', description: 'Registrar vendas realizadas' },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins, color: 'text-yellow-500', description: 'Controlar empréstimos' },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList, color: 'text-indigo-500', description: 'Comandas digitais' },
  ];

  const handleMenuItemClick = (tabId: string) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-white dark:bg-[#18191c] rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Menu Principal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Escolha uma seção</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[0.98] active:scale-95'
                }`}
              >
                <div className={`p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-800/50 shadow-sm' 
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                }`}>
                  <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-base">{item.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Fechar Menu
          </button>
        </div>
      </div>
    </div>
  );
}