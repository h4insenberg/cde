import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { SaleForm } from './SaleForm';
import { SalesList } from './SalesList';
import { Sale, StockMovement } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';
import { generateId } from '../../utils/helpers';

export function SalesSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [showSaleForm, setShowSaleForm] = useState(false);

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

    addNotification('SUCCESS', `Venda realizada com sucesso! Total: ${sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    setShowSaleForm(false);
  };

  const handleCancelSale = () => {
    setShowSaleForm(false);
  };

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
          onClick={() => setShowSaleForm(true)}
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
              onClick={() => setShowSaleForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Primeira Venda</span>
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