import React, { useState, useRef, useEffect } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const { dashboardStats, sales, products, comandas, stockMovements, userSettings } = state;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header with greeting and quick action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Olá, {userSettings.name}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ações Rápidas</span>
            <svg 
              className={`h-4 w-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#18191c] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Navigate to entries section
                      window.dispatchEvent(new CustomEvent('navigate', { detail: 'entries' }));
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center space-x-3"
                  >
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">+ Entrada</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      window.dispatchEvent(new CustomEvent('navigate', { detail: 'exits' }));
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-3"
                  >
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                      <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">+ Saída</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onNewSale();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-3"
                  >
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">+ Venda</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      window.dispatchEvent(new CustomEvent('navigate', { detail: 'loans' }));
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors flex items-center space-x-3"
                  >
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                      <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">+ Empréstimo</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      window.dispatchEvent(new CustomEvent('navigate', { detail: 'comanda' }));
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center space-x-3"
                  >
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">+ Comanda</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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
          icon={Target}
          color="purple"
          isCurrency={false}
          showValue={state.showValues}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mobile: Extrato first, Desktop: Recent Sales first */}
        <div className="lg:order-1 order-1">
          <RecentSales 
            sales={sales} 
            comandas={comandas}
            stockMovements={stockMovements}
            loans={state.loans}
            financialEntries={state.financialEntries}
            financialExits={state.financialExits}
          />
        </div>
        <div className="lg:order-2 order-2">
          <LowStockAlerts products={products} />
        </div>
      </div>
    </div>
  );
}