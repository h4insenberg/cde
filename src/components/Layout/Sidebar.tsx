import React from 'react';
import { Home, Package, Wrench, TrendingUp, TrendingDown, ShoppingCart, HandCoins, ClipboardList, BarChart3, Settings, Users, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins },
    { id: 'entries', label: 'Entradas', icon: TrendingUp },
    { id: 'exits', label: 'Saídas', icon: TrendingDown },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-[#243447] h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#3a4a5c]">
        <h2 className="text-white text-lg font-semibold">HOME</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-[#2c3e50] text-[#4ade80] border-l-4 border-[#4ade80]'
                      : 'text-gray-300 hover:bg-[#2c3e50] hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#4ade80]' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 border-t border-[#3a4a5c]">
        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
            activeTab === 'settings'
              ? 'bg-[#2c3e50] text-[#4ade80] border-l-4 border-[#4ade80]'
              : 'text-gray-300 hover:bg-[#2c3e50] hover:text-white'
          }`}
        >
          <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-[#4ade80]' : ''}`} />
          <span className="font-medium">Configurações</span>
        </button>
      </div>
    </div>
  );
}