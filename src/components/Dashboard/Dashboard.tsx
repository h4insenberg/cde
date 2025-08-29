import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle, Plus, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RecentSales } from './RecentSales';
import { LowStockAlerts } from './LowStockAlerts';
import { useBusiness } from '../../context/BusinessContext';

interface DashboardProps {
  onNewSale: () => void;
}

export function Dashboard({ onNewSale }: DashboardProps) {
  const { state } = useBusiness();
  const { dashboardStats, sales, products, comandas, stockMovements, userSettings } = state;

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header with greeting and quick action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
            Olá, {userSettings.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-base">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        
        <button
          onClick={onNewSale}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Venda</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatsCard
          title="Receitas"
          value={dashboardStats.revenue}
          icon={ArrowUp}
          color="green"
          isCurrency={true}
          showValue={state.showValues}
          subtitle={`${sales.length} transaç${sales.length !== 1 ? 'ões' : 'ão'}`}
        />
        
        <StatsCard
          title="Despesas"
          value={dashboardStats.expenses}
          icon={ArrowDown}
          color="red"
          isCurrency={true}
          showValue={state.showValues}
        />
        
        <StatsCard
          title="Lucro Líquido"
          value={dashboardStats.netProfit}
          icon={DollarSign}
          color="blue"
          showValue={state.showValues}
        />
        
        <StatsCard
          title="Margem de Lucro"
          value={dashboardStats.profitMargin}
          icon={TrendingUp}
          color="purple"
          isCurrency={false}
          showValue={state.showValues}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Mobile: Low Stock first, Desktop: Recent Sales first */}
        <div className="lg:order-1 order-2">
          <RecentSales 
            sales={sales} 
            comandas={comandas}
            stockMovements={stockMovements}
            loans={state.loans}
          />
        </div>
        <div className="lg:order-2 order-1">
          <LowStockAlerts products={products} />
        </div>
      </div>
    </div>
  );
}