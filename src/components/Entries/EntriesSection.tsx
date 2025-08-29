import React, { useState } from 'react';
import { Plus, TrendingUp, Calendar, DollarSign, Tag, Search } from 'lucide-react';
import { ConfirmModal } from '../Common/ConfirmModal';
import { FinancialEntry } from '../../types';
import { EntryForm } from './EntryForm';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';
import { useConfirm } from '../../hooks/useConfirm';

export function EntriesSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const { confirm, confirmState, closeConfirm } = useConfirm();

  // Filter entries based on search term
  const filteredEntries = state.financialEntries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEntries = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  const handleSaveEntry = (entry: FinancialEntry) => {
    if (editingEntry) {
      dispatch({ type: 'UPDATE_FINANCIAL_ENTRY', payload: entry });
    } else {
      dispatch({ type: 'ADD_FINANCIAL_ENTRY', payload: entry });
    }
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  const handleEditEntry = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    const entry = state.financialEntries.find(e => e.id === id);
    if (!entry) return;

    const confirmed = await confirm({
      title: 'Excluir Entrada',
      message: `Tem certeza que deseja excluir "${entry.name}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    
    if (confirmed) {
      dispatch({ type: 'DELETE_FINANCIAL_ENTRY', payload: id });
    }
  };

  const handleCancelForm = () => {
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Entradas</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {filteredEntries.length} entrada{filteredEntries.length !== 1 ? 's' : ''} • {state.showValues ? formatCurrency(totalEntries) : '••••'} total
          </p>
        </div>
        
        <button
          onClick={() => setShowEntryForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg transition-colors flex items-center space-x-1 sm:space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Nova Entrada</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar entradas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {filteredEntries.length} entrada{filteredEntries.length !== 1 ? 's' : ''} encontrada{filteredEntries.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Entries List */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 flex-1">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{entry.name}</h3>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                    +{state.showValues ? formatCurrency(entry.amount) : '••••'}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(new Date(entry.date))}</span>
                  </div>
                </div>
              </div>

              {entry.description && (
                <div className="mb-3">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {entry.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-green-300 dark:border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
                  >
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
                  >
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma entrada encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tente buscar com outros termos ou limpe o filtro
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpar Busca
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma entrada registrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Registre entradas de dinheiro extras como rendimentos, vendas de ativos, etc.
            </p>
            <button
              onClick={() => setShowEntryForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Primeira Entrada</span>
            </button>
          </div>
        </div>
      )}

      {/* Entry Form Modal */}
      {showEntryForm && (
        <EntryForm
          entry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={handleCancelForm}
        />
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
      />
    </div>
  );
}