import React, { useState } from 'react';
import { Plus, ClipboardList, Filter, Users, DollarSign, Clock } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-3xl"></div>
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Sistema de Comandas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Gerencie pedidos e atendimentos de forma organizada
              </p>
            </div>
            
            <button
              onClick={() => setShowComandaForm(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Nova Comanda</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">Comandas Abertas</p>
              <p className="text-3xl font-bold mt-2">{openComandas.length}</p>
              <p className="text-orange-200 text-sm mt-1">Aguardando pagamento</p>
            </div>
            <div className="bg-orange-400/20 p-4 rounded-xl">
              <ClipboardList className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total em Aberto</p>
              <p className="text-3xl font-bold mt-2">
                {state.showValues ? formatCurrency(totalOpenValue) : '••••'}
              </p>
              <p className="text-blue-200 text-sm mt-1">Valor a receber</p>
            </div>
            <div className="bg-blue-400/20 p-4 rounded-xl">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Total de Comandas</p>
              <p className="text-3xl font-bold mt-2">{state.comandas.length}</p>
              <p className="text-green-200 text-sm mt-1">Histórico completo</p>
            </div>
            <div className="bg-green-400/20 p-4 rounded-xl">
              <Users className="h-8 w-8" />
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
              { key: 'all', label: `Todas (${state.comandas.length})`, color: 'blue' },
              { key: 'open', label: `Abertas (${openComandas.length})`, color: 'orange' },
              { key: 'paid', label: `Pagas (${state.comandas.filter(c => c.status === 'PAID').length})`, color: 'green' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  filter === filterOption.key
                    ? `bg-white dark:bg-gray-700 text-${filterOption.color}-600 dark:text-${filterOption.color}-400 shadow-sm`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comandas List */}
      {filteredComandas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {filter === 'all' ? 'Nenhuma comanda registrada' : 
               filter === 'open' ? 'Nenhuma comanda aberta' : 'Nenhuma comanda paga'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {filter === 'all' ? 'Comece criando sua primeira comanda digital para organizar os pedidos' :
               filter === 'open' ? 'Todas as comandas foram pagas ou não há comandas abertas' : 'Nenhuma comanda foi paga ainda'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowComandaForm(true)}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              >
                <Plus className="h-5 w-5" />
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