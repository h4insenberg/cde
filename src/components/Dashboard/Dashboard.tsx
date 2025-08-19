import React, { useState } from 'react';
import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle, Plus, TrendingDown, Percent } from 'lucide-react';
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
  const [showDescription, setShowDescription] = useState<string | null>(null);

  const handleInfoClick = (cardType: string) => {
    setShowDescription(showDescription === cardType ? null : cardType);
  };

  const getDescription = (cardType: string) => {
    const descriptions = {
      receitas: 'Total de dinheiro que entrou no seu negócio através das vendas realizadas.',
      despesas: 'Soma de todos os custos dos produtos que foram vendidos.',
      lucroLiquido: 'Resultado final: Receitas menos Despesas. É o lucro real do seu negócio.',
      margemLucro: 'Percentual de lucro sobre as vendas. Mostra a rentabilidade do negócio.'
    };
    return descriptions[cardType as keyof typeof descriptions] || '';
  };

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
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatsCard
          title="Receitas"
          value={dashboardStats.grossRevenue}
          icon={TrendingUp}
          color="green"
          isCurrency={true}
          subtitle={`${sales.length} transaç${sales.length !== 1 ? 'ões' : 'ão'}`}
          description={getDescription('receitas')}
          onInfoClick={() => handleInfoClick('receitas')}
        />
        
        <StatsCard
          title="Despesas"
          value={dashboardStats.totalCosts}
          icon={TrendingDown}
          color="red"
          isCurrency={true}
          description={getDescription('despesas')}
          onInfoClick={() => handleInfoClick('despesas')}
        />
        
        <StatsCard
          title="Lucro Líquido"
          value={dashboardStats.netProfit}
          icon={DollarSign}
          color="blue"
          isCurrency={true}
          description={getDescription('lucroLiquido')}
          onInfoClick={() => handleInfoClick('lucroLiquido')}
        />
        
        <StatsCard
          title="Margem de Lucro"
          value={dashboardStats.profitMargin}
          icon={Percent}
          color="purple"
          isCurrency={false}
          isPercentage={true}
          description={getDescription('margemLucro')}
          onInfoClick={() => handleInfoClick('margemLucro')}
        />
      </div>

      {/* Description Modal */}
      {showDescription && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {showDescription === 'receitas' && 'Receitas'}
                {showDescription === 'despesas' && 'Despesas'}
                {showDescription === 'lucroLiquido' && 'Lucro Líquido'}
                {showDescription === 'margemLucro' && 'Margem de Lucro'}
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {getDescription(showDescription)}
              </p>
            </div>
            <button
              onClick={() => setShowDescription(null)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSales sales={sales} />
        <LowStockAlerts products={products} />
      </div>
    </div>
  );
}