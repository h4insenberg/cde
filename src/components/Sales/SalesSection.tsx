import React, { useState } from 'react';
import { Plus, ShoppingCart, TrendingUp, Calendar, Filter, BarChart3 } from 'lucide-react';
import { SaleForm } from './SaleForm';
import { SalesList } from './SalesList';
import { Sale, StockMovement } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';
import { generateId, formatCurrency } from '../../utils/helpers';

export function SalesSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');

  const handleSaveSale = (sale: Sale) => {
    // Add the sale
    dispatch({ type: 'ADD_SALE', payload: sale });

    // Update product stock and add stock movements
    sale.items.forEach((item) => {
      if (item.type === 'product' && item.productId) {
        const product = state.products.find(p => p.id === item.productId);
        if (product) {
          const updatedProduct = {
            ...product,
            quantity: product.quantity - item.quantity,
            updatedAt: new Date(),
          };
          
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });

          // Add stock movement
          const stockMovement: StockMovement = {
            id: generateId(),
            productId: product.id,
            productName: product.name,
            type: 'OUT',
            quantity: item.quantity,
            reason: `Venda #${sale.id.slice(-6)}`,
            createdAt: new Date(),
          };
          
          dispatch({ type: 'ADD_STOCK_MOVEMENT', payload: stockMovement });
        }
      }
    });

    addNotification('SUCCESS', `Venda realizada com sucesso! Total: ${formatCurrency(sale.total)}`);
    setShowSaleForm(false);
  };

  const handleCancelSale = () => {
    setShowSaleForm(false);
  };

  // Filter sales by period
  const getFilteredSales = () => {
    if (filterPeriod === 'all') return state.sales;
    
    const now = new Date();
    const days = filterPeriod === 'today' ? 1 : filterPeriod === 'week' ? 7 : 30;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return state.sales.filter(sale => new Date(sale.createdAt) >= startDate);
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-3xl"></div>
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gestão de Vendas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Controle completo das suas transações comerciais
              </p>
            </div>
            
            <button
              onClick={() => setShowSaleForm(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Nova Venda</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total de Vendas</p>
              <p className="text-3xl font-bold mt-2">{filteredSales.length}</p>
              <p className="text-green-200 text-sm mt-1">
                {filterPeriod === 'all' ? 'Todas' : 
                 filterPeriod === 'today' ? 'Hoje' :
                 filterPeriod === 'week' ? 'Esta semana' : 'Este mês'}
              </p>
            </div>
            <div className="bg-green-400/20 p-4 rounded-xl">
              <ShoppingCart className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Receita Total</p>
              <p className="text-3xl font-bold mt-2">
                {state.showValues ? formatCurrency(totalRevenue) : '••••'}
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Valor bruto das vendas
              </p>
            </div>
            <div className="bg-blue-400/20 p-4 rounded-xl">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Lucro Total</p>
              <p className="text-3xl font-bold mt-2">
                {state.showValues ? formatCurrency(totalProfit) : '••••'}
              </p>
              <p className="text-purple-200 text-sm mt-1">
                Margem de lucro
              </p>
            </div>
            <div className="bg-purple-400/20 p-4 rounded-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'today', label: 'Hoje' },
              { key: 'week', label: '7 dias' },
              { key: 'month', label: '30 dias' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterPeriod(filter.key)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  filterPeriod === filter.key
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sales List */}
      {filteredSales.length > 0 ? (
        <SalesList sales={filteredSales} />
      ) : state.sales.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Nenhuma venda registrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Comece registrando suas vendas para acompanhar o desempenho do seu negócio
            </p>
            <button
              onClick={() => setShowSaleForm(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Registrar Primeira Venda</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Nenhuma venda no período
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Não há vendas registradas para o filtro selecionado
            </p>
            <button
              onClick={() => setFilterPeriod('all')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Ver Todas as Vendas
            </button>
          </div>
        </div>
      )}

      {/* Sale Form Modal */}
      {showSaleForm && (
        <SaleForm
          products={state.products}
          services={state.services}
          onSave={handleSaveSale}
          onCancel={handleCancelSale}
        />
      )}
    </div>
  );
}