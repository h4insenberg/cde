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
  const { dashboardStats, sales, products, comandas, stockMovements } = state;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
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
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extrato - sempre primeira coluna no desktop */}
        <div className={`${
          products.filter(p => p.quantity <= p.minQuantity).length > 0 ? 'order-2' : 'order-1'
        } lg:order-1`}>
          <RecentSales 
            sales={sales} 
            comandas={comandas}
            stockMovements={stockMovements}
          />
        </div>
        
        {/* Alertas de estoque - sempre segunda coluna no desktop */}
        <div className={`${
          products.filter(p => p.quantity <= p.minQuantity).length > 0 ? 'order-1' : 'hidden'
        } lg:order-2 lg:block`}>
          <LowStockAlerts products={products} />
        </div>
      </div>
    </div>
  );
}