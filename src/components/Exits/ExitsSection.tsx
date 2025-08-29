import React, { useState } from 'react';
import { Plus, TrendingDown, Calendar, DollarSign, Tag, Search } from 'lucide-react';
import { FinancialExit } from '../../types';
import { ExitForm } from './ExitForm';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';

export function ExitsSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showExitForm, setShowExitForm] = useState(false);
  const [editingExit, setEditingExit] = useState<FinancialExit | null>(null);

  // Filter exits based on search term
  const filteredExits = state.financialExits.filter(exit =>
    exit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exit.description && exit.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalExits = filteredExits.reduce((sum, exit) => sum + exit.amount, 0);

  const handleSaveExit = (exit: FinancialExit) => {
    if (editingExit) {
      dispatch({ type: 'UPDATE_FINANCIAL_EXIT', payload: exit });
    } else {
      dispatch({ type: 'ADD_FINANCIAL_EXIT', payload: exit });
    }
    setShowExitForm(false);
    setEditingExit(null);
  };

  const handleEditExit = (exit: FinancialExit) => {
    setEditingExit(exit);
    setShowExitForm(true);
  };

  const handleDeleteExit = (id: string) => {
    const exit = state.financialExits.find(e => e.id === id);
    if (exit && window.confirm(`Tem certeza que deseja excluir "${exit.name}"?`)) {
      dispatch({ type: 'DELETE_FINANCIAL_EXIT', payload: id });
    }
  };

  const handleCancelForm = () => {
    setShowExitForm(false);
    setEditingExit(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Saídas</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {filteredExits.length} saída{filteredExits.length !== 1 ? 's' : ''} • {state.showValues ? formatCurrency(totalExits) : '••••'} total
          </p>
        </div>
        
        <button
          onClick={() => setShowExitForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg transition-colors flex items-center space-x-1 sm:space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Nova Saída</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar saídas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {filteredExits.length} saída{filteredExits.length !== 1 ? 's' : ''} encontrada{filteredExits.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Exits List */}
      {filteredExits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredExits.map((exit) => (
            <div key={exit.id} className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 flex-1">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{exit.name}</h3>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-lg font-bold text-red-600 dark:text-red-400">
                    -{state.showValues ? formatCurrency(exit.amount) : '••••'}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(new Date(exit.date))}</span>
                  </div>
                </div>
              </div>

              {exit.description && (
                <div className="mb-3">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {exit.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditExit(exit)}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
                  >
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteExit(exit.id)}
                    className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
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
              Nenhuma saída encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tente buscar com outros termos ou limpe o filtro
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpar Busca
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma saída registrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Registre saídas de dinheiro como despesas, investimentos, pagamentos, etc.
            </p>
            <button
              onClick={() => setShowExitForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Primeira Saída</span>
            </button>
          </div>
        </div>
      )}

      {/* Exit Form Modal */}
      {showExitForm && (
        <ExitForm
          exit={editingExit}
          onSave={handleSaveExit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}