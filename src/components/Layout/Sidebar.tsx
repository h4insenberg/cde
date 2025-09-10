import React from 'react';
import { Home, Package, Wrench, TrendingUp, TrendingDown, ShoppingCart, HandCoins, ClipboardList, BarChart3, Settings, Eye, Clock } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'services', label: 'Serviços', icon: Wrench },
    { id: 'entries', label: 'Entradas', icon: TrendingUp },
    { id: 'exits', label: 'Saídas', icon: TrendingDown },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'loans', label: 'Empréstimos', icon: HandCoins },
    { id: 'comanda', label: 'Comandas', icon: ClipboardList },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-80 lg:fixed lg:inset-y-0 lg:bg-[#2a3441] lg:border-r lg:border-[#3a4553]">
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-[#3a4553]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#4ade80] rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-[#8b949e] uppercase tracking-wider">HOME</h3>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4ade80] text-white'
                  : 'text-[#c9d1d9] hover:text-white hover:bg-[#3a4553]'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}