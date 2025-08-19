import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle, Plus } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RecentSales } from './RecentSales';
import { LowStockAlerts } from './LowStockAlerts';
import { useBusiness } from '../../context/BusinessContext';

interface DashboardProps {
  onNewSale: () => void;
}

export function Dashboard({ onNewSale }: DashboardProps) {
  const { state } = useBusiness();
  const { dashboardStats, sales, products } = state;

  return (
    <div className="space-y-6 pb-20">
      {/* Quick Action */}
      <div className="flex justify-end">
        <button
          onClick={onNewSale}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Venda</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Receita Total"
          value={dashboardStats.totalRevenue}
          icon={DollarSign}
          color="blue"
        />
        
        <StatsCard
          title="Lucro Líquido"
          value={dashboardStats.netProfit}
          icon={TrendingUp}
          color="green"
        />
        
        <StatsCard
          title="Total de Vendas"
          value={dashboardStats.totalSales}
          icon={ShoppingCart}
          color="purple"
          isCurrency={false}
          subtitle={`${dashboardStats.totalSales} transaç${dashboardStats.totalSales !== 1 ? 'ões' : 'ão'}`}
        />
        
        <StatsCard
          title="Alertas de Estoque"
          value={dashboardStats.lowStockAlerts}
          icon={AlertTriangle}
          color={dashboardStats.lowStockAlerts > 0 ? "red" : "green"}
          isCurrency={false}
          subtitle={dashboardStats.lowStockAlerts > 0 ? "Produtos em falta" : "Estoque adequado"}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales sales={sales} />
        <LowStockAlerts products={products} />
      </div>
    </div>
  );
}