import React from 'react';
import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle, Plus, ArrowUp, ArrowDown, Eye, EyeOff, Target } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header with greeting and quick action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Olá, {userSettings.name}! 👋
          </h2>
          <p className="text-gray-300">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Receitas"
          value={dashboardStats.revenue}
          icon={ArrowUp}
          color="blue"
          isCurrency={true}
          showValue={state.showValues}
          subtitle={`${sales.length} transaç${sales.length !== 1 ? 'ões' : 'ão'}`}
        />
        
        <StatsCard
          title="Despesas"
          value={dashboardStats.expenses}
          icon={ArrowDown}
          color="purple"
          isCurrency={true}
          showValue={state.showValues}
        />
        
        <StatsCard
          title="Lucro Líquido"
          value={dashboardStats.netProfit}
          icon={DollarSign}
          color="green"
          showValue={state.showValues}
        />
        
        <StatsCard
          title="Margem de Lucro"
          value={dashboardStats.profitMargin}
          icon={Target}
          color="yellow"
          isCurrency={false}
          showValue={state.showValues}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Mobile: Extrato first, Desktop: Recent Sales first */}
        <div className="xl:order-1 order-1">
          <RecentSales 
            sales={sales} 
            comandas={comandas}
            stockMovements={stockMovements}
            loans={state.loans}
            financialEntries={state.financialEntries}
            financialExits={state.financialExits}
          />
        </div>
        <div className="xl:order-2 order-2">
          <LowStockAlerts products={products} />
        </div>
      </div>
    </div>
  );
}