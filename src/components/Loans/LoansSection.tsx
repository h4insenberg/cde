import React, { useState } from 'react';
import { Plus, HandCoins, Calendar, DollarSign, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Loan } from '../../types';
import { formatCurrency, formatDateOnly } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

export function LoansSection() {
  const { state } = useBusiness();
  const [filter, setFilter] = useState<'all' | 'active' | 'paid' | 'overdue'>('all');

  const getFilteredLoans = () => {
    return state.loans.filter(loan => {
      if (filter === 'active') return loan.status === 'ACTIVE';
      if (filter === 'paid') return loan.status === 'PAID';
      if (filter === 'overdue') return loan.status === 'OVERDUE';
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredLoans = getFilteredLoans();
  const activeLoans = state.loans.filter(l => l.status === 'ACTIVE');
  const totalActiveAmount = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'PAID':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'OVERDUE':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Clock className="h-4 w-4" />;
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <HandCoins className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: Loan['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'PAID':
        return 'Pago';
      case 'OVERDUE':
        return 'Vencido';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Empréstimos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {activeLoans.length} empréstimo{activeLoans.length !== 1 ? 's' : ''} ativo{activeLoans.length !== 1 ? 's' : ''} • {state.showValues ? formatCurrency(totalActiveAmount) : '••••'} em aberto
          </p>
        </div>
        
        <button
          onClick={() => {/* TODO: Implement add loan */}}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Empréstimo</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-md transition-colors text-sm whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Todos ({state.loans.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-2 rounded-md transition-colors text-sm whitespace-nowrap ${
              filter === 'active'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Ativos ({state.loans.filter(l => l.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-2 rounded-md transition-colors text-sm whitespace-nowrap ${
              filter === 'paid'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Pagos ({state.loans.filter(l => l.status === 'PAID').length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-2 rounded-md transition-colors text-sm whitespace-nowrap ${
              filter === 'overdue'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Vencidos ({state.loans.filter(l => l.status === 'OVERDUE').length})
          </button>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length > 0 ? (
        <div className="space-y-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <HandCoins className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{loan.customerName}</span>
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Vencimento: {formatDateOnly(new Date(loan.dueDate))}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {state.showValues ? formatCurrency(loan.amount) : '••••'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      <span>{getStatusLabel(loan.status)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {loan.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    {loan.description}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Criado em:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDateOnly(new Date(loan.createdAt))}
                    </span>
                  </div>
                </div>
                
                {loan.status === 'ACTIVE' && (
                  <button
                    onClick={() => {/* TODO: Implement mark as paid */}}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Marcar como Pago
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <HandCoins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'Nenhum empréstimo registrado' : 
               filter === 'active' ? 'Nenhum empréstimo ativo' : 
               filter === 'paid' ? 'Nenhum empréstimo pago' : 'Nenhum empréstimo vencido'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'Comece registrando empréstimos para seus clientes' :
               filter === 'active' ? 'Todos os empréstimos foram pagos ou venceram' :
               filter === 'paid' ? 'Nenhum empréstimo foi pago ainda' : 'Nenhum empréstimo está vencido'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => {/* TODO: Implement add loan */}}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Registrar Primeiro Empréstimo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}