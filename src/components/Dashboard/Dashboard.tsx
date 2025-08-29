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
    <div className="space-y-4 sm:space-y-6 pb-24">
      {/* Header with greeting and quick action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Olá, {userSettings.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        
        <button
          onClick={onNewSale}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl shadow-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105 hover:shadow-xl w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Nova Venda</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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