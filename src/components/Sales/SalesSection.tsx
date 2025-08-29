import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { SalesList } from './SalesList';
import { Sale, StockMovement } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';
import { generateId } from '../../utils/helpers';

interface SalesSectionProps {
  onNewSale: () => void;
}

export function SalesSection({ onNewSale }: SalesSectionProps) {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Vendas</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {state.sales.length} venda{state.sales.length !== 1 ? 's' : ''} registrada{state.sales.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={onNewSale}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg transition-colors flex items-center space-x-1 sm:space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Nova Venda</span>
        </button>
      </div>

      {/* Sales List */}
      {state.sales.length > 0 ? (
        <SalesList sales={state.sales} />
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma venda registrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Comece registrando suas vendas para acompanhar o desempenho do seu negócio
            </p>
            <button
              onClick={onNewSale}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Primeira Venda</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}