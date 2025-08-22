import React, { useState } from 'react';
import { Plus, ClipboardList, Filter } from 'lucide-react';
import { ComandaForm } from './ComandaForm';
import { ComandaCard } from './ComandaCard';
import { AddItemsForm } from './AddItemsForm';
import { Comanda, Sale, SaleItem } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';
import { generateId, formatCurrency } from '../../utils/helpers';

export function ComandaSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [showComandaForm, setShowComandaForm] = useState(false);
  const [showAddItemsForm, setShowAddItemsForm] = useState(false);
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'paid'>('all');

  const filteredComandas = state.comandas.filter(comanda => {
    if (filter === 'open') return comanda.status === 'OPEN';
    if (filter === 'paid') return comanda.status === 'PAID';
    return true;
  }).sort((a, b) => {
    // Open comandas first, then by creation date (newest first)
    if (a.status === 'OPEN' && b.status === 'PAID') return -1;
    if (a.status === 'PAID' && b.status === 'OPEN') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleSaveComanda = (comanda: Comanda) => {
    dispatch({ type: 'ADD_COMANDA', payload: comanda });
    addNotification('SUCCESS', `Comanda de ${comanda.customerName} criada com sucesso!`);
    setShowComandaForm(false);
  };

  const handleAddItems = (comanda: Comanda) => {
    setSelectedComanda(comanda);
    setShowAddItemsForm(true);
  };

  const handleSaveAddedItems = (updatedComanda: Comanda) => {
    dispatch({ type: 'UPDATE_COMANDA', payload: updatedComanda });
    
    // Update product stock for new items
    const newItems = updatedComanda.items.filter(item => 
      !selectedComanda?.items.some(existingItem => existingItem.id === item.id)
    );

    newItems.forEach(item => {
      if (item.type === 'product' && item.productId) {
        const product = state.products.find(p => p.id === item.productId);
        if (product) {
          const updatedProduct = {
            ...product,
            quantity: product.quantity - item.quantity,
            updatedAt: new Date(),
          };
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
        }
      }
    });

    const addedItemsTotal = newItems.reduce((sum, item) => sum + item.total, 0);
    addNotification('SUCCESS', `Itens adicionados à comanda! Total: ${formatCurrency(addedItemsTotal)}`);
    setShowAddItemsForm(false);
    setSelectedComanda(null);
  };

  const handlePayComanda = (comanda: Comanda) => {
    if (window.confirm(`Confirmar pagamento da comanda de ${comanda.customerName}?`)) {
      // Update comanda status
      const paidComanda: Comanda = {
        ...comanda,
        status: 'PAID',
        paidAt: new Date(),
      };
      dispatch({ type: 'UPDATE_COMANDA', payload: paidComanda });

      // Create a sale record for the paid comanda
      const saleItems: SaleItem[] = comanda.items.map(item => ({
        id: generateId(),
        type: item.type,
        productId: item.productId,
        serviceId: item.serviceId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        profit: item.type === 'product' && item.productId 
          ? (() => {
              const product = state.products.find(p => p.id === item.productId);
              return product 
                ? (item.unitPrice - product.costPrice) * item.quantity
                : item.total; // Fallback if product not found
            })()
          : item.total, // For services, consider full amount as profit
      }));

      // Calculate total profit correctly
      const totalProfit = saleItems.reduce((sum, item) => sum + item.profit, 0);

      const sale: Sale = {
        id: generateId(),
        items: saleItems,
        total: comanda.total,
        profit: totalProfit,
        paymentMethod: 'PIX', // Default payment method for comandas
        netAmount: comanda.total,
        createdAt: new Date(),
      };

      dispatch({ type: 'ADD_SALE', payload: sale });
      addNotification('SUCCESS', `Comanda de ${comanda.customerName} paga! Total: ${formatCurrency(comanda.total)}`);
    }
  };

  const handleCancelForms = () => {
    setShowComandaForm(false);
    setShowAddItemsForm(false);
    setSelectedComanda(null);
  };

  const openComandas = state.comandas.filter(c => c.status === 'OPEN');
  const totalOpenValue = openComandas.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comandas</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {openComandas.length} comanda{openComandas.length !== 1 ? 's' : ''} aberta{openComandas.length !== 1 ? 's' : ''} • {state.showValues ? formatCurrency(totalOpenValue) : '••••'} em aberto
          </p>
        </div>
        
        <button
          onClick={() => setShowComandaForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Comanda</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-3 py-1 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Todas ({state.comandas.length})
            </button>
            <button
              onClick={() => setFilter('open')}
              className={`px-2 sm:px-3 py-1 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filter === 'open'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Abertas ({openComandas.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-2 sm:px-3 py-1 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filter === 'paid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Pagas ({state.comandas.filter(c => c.status === 'PAID').length})
            </button>
          </div>
        </div>
      </div>

      {/* Comandas List */}
      {filteredComandas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredComandas.map((comanda) => (
            <ComandaCard
              key={comanda.id}
              comanda={comanda}
              onAddItems={handleAddItems}
              onPayComanda={handlePayComanda}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'Nenhuma comanda registrada' : 
               filter === 'open' ? 'Nenhuma comanda aberta' : 'Nenhuma comanda paga'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'Comece criando sua primeira comanda digital' :
               filter === 'open' ? 'Todas as comandas foram pagas' : 'Nenhuma comanda foi paga ainda'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowComandaForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Criar Primeira Comanda</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Forms */}
      {showComandaForm && (
        <ComandaForm
          products={state.products}
          services={state.services}
          onSave={handleSaveComanda}
          onCancel={handleCancelForms}
        />
      )}

      {showAddItemsForm && selectedComanda && (
        <AddItemsForm
          comanda={selectedComanda}
          products={state.products}
          services={state.services}
          onSave={handleSaveAddedItems}
          onCancel={handleCancelForms}
        />
      )}
    </div>
  );
}