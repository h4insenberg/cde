import React, { useState } from 'react';
import { AlertTriangle, Package, Archive, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, Activity } from 'lucide-react';
import { Product, StockMovement } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface LowStockAlertsProps {
  products: Product[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const { state } = useBusiness();
  const [activeTab, setActiveTab] = useState<'movements' | 'alerts'>('alerts');
  
  const lowStockProducts = products.filter(p => p.quantity <= p.minQuantity);
  const recentMovements = state.stockMovements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const getMovementIcon = (type: 'IN' | 'OUT') => {
    return type === 'IN' 
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getMovementColor = (type: 'IN' | 'OUT') => {
    return type === 'IN' 
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  const getMovementBg = (type: 'IN' | 'OUT') => {
    return type === 'IN' 
      ? 'bg-green-50 dark:bg-green-900/20'
      : 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Archive className="h-5 w-5 mr-2 text-blue-500" />
          Estoque
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm font-medium ${
            activeTab === 'alerts'
              ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Alertas</span>
          {lowStockProducts.length > 0 && (
            <span className="bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-200 px-2 py-1 rounded-full text-xs">
              {lowStockProducts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm font-medium ${
            activeTab === 'movements'
              ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Movimentações</span>
          <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
            {recentMovements.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'alerts' && (
          <div>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-slate-700 rounded-lg hover:bg-red-100 dark:hover:bg-slate-600 transition-colors border border-red-200 dark:border-red-800">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Mínimo: {product.minQuantity} {product.unit}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {product.quantity} {product.unit}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400">
                        Estoque baixo
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Estoque em Dia
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Todos os produtos estão com estoque adequado
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'movements' && (
          <div>
            {recentMovements.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentMovements.map((movement) => {
                  const isEntry = movement.type === 'IN';
                  const bgColor = isEntry 
                    ? 'bg-green-50 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-slate-600' 
                    : 'bg-red-50 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-slate-600';
                  
                  return (
                    <div key={movement.id} className={`p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-sm ${bgColor} border border-transparent hover:border-gray-200 dark:hover:border-slate-600`}>
                      {/* Layout unificado - funciona para mobile e desktop */}
                      <div className="space-y-3">
                        {/* Header Row - Ícone, Descrição e Quantidade */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-2 flex-1 min-w-0">
                            <div className="flex-shrink-0 mt-0.5">
                              {getMovementIcon(movement.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight break-words">
                                {movement.productName}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <p className={`text-sm sm:text-base font-bold ${getMovementColor(movement.type)} leading-tight`}>
                              {isEntry ? '+' : '-'}{movement.quantity} un
                            </p>
                          </div>
                        </div>
                        
                        {/* Details Row - Data e Motivo */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {formatDate(movement.createdAt)}
                            </p>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                              {movement.reason}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma movimentação
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  As movimentações de estoque aparecerão aqui
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}