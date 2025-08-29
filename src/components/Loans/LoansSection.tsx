import React, { useState } from 'react';
import { Plus, HandCoins, Calendar, DollarSign, User, AlertTriangle, CheckCircle, Clock, Edit2 } from 'lucide-react';
import { Loan } from '../../types';
import { LoanForm } from './LoanForm';
import { formatCurrency, formatDateOnly } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';

export function LoansSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'active' | 'paid' | 'overdue'>('all');
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);

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
  const totalToReceive = activeLoans.reduce((sum, loan) => sum + loan.totalAmount, 0);

  const handleSaveLoan = (loan: Loan) => {
    if (editingLoan) {
      dispatch({ type: 'UPDATE_LOAN', payload: loan });
      addNotification('SUCCESS', `Empréstimo de ${loan.customerName} atualizado com sucesso`);
    } else {
      dispatch({ type: 'ADD_LOAN', payload: loan });
      addNotification('SUCCESS', `Empréstimo de ${loan.customerName} registrado com sucesso`);
    }
    setShowLoanForm(false);
    setEditingLoan(null);
  };

  const handleEditLoan = (loan: Loan) => {
    setEditingLoan(loan);
    setShowLoanForm(true);
  };

  const handleMarkAsPaid = (loan: Loan) => {
    if (window.confirm(`Confirmar pagamento do empréstimo de ${loan.customerName}?`)) {
      const paidLoan: Loan = {
        ...loan,
        status: 'PAID',
        paidAt: new Date(),
      };
      dispatch({ type: 'UPDATE_LOAN', payload: paidLoan });
      addNotification('SUCCESS', `Empréstimo de ${loan.customerName} marcado como pago`);
    }
  };

  const handleCancelForm = () => {
    setShowLoanForm(false);
    setEditingLoan(null);
  };

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
            {activeLoans.length} empréstimo{activeLoans.length !== 1 ? 's' : ''} ativo{activeLoans.length !== 1 ? 's' : ''} • {state.showValues ? formatCurrency(totalToReceive) : '••••'} a receber
          </p>
        </div>
        
        <button
          onClick={() => setShowLoanForm(true)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className={`bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
              loan.status === 'OVERDUE' 
                ? 'border-red-200 dark:border-red-700 bg-red-50/30 dark:bg-red-950/20' 
                : loan.status === 'ACTIVE'
                ? 'border-yellow-200 dark:border-yellow-700 bg-yellow-50/30 dark:bg-yellow-950/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center space-x-2 flex-1">
                  <HandCoins className={`h-5 w-5 ${
                    loan.status === 'OVERDUE' ? 'text-red-500' : 
                    loan.status === 'ACTIVE' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{loan.customerName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(loan.status)}`}>
                    {getStatusIcon(loan.status)}
                    <span>{getStatusLabel(loan.status)}</span>
                  </span>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                    {state.showValues ? formatCurrency(loan.totalAmount) : '••••'}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDateOnly(new Date(loan.dueDate))}</span>
                  </div>
                </div>
              </div>

              {loan.description && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                  {loan.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 sm:p-2 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Emprestado</p>
                    <p className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {state.showValues ? formatCurrency(loan.amount) : '••••'}
                    </p>
                  </div>
                  
                  {loan.interestRate > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-1.5 sm:p-2 rounded-lg">
                      <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Juros ({loan.interestRate}%)</p>
                      <p className="text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-300">
                        +{state.showValues ? formatCurrency(loan.totalAmount - loan.amount) : '••••'}
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Actions */}
              {loan.status === 'ACTIVE' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditLoan(loan)}
                      className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleMarkAsPaid(loan)}
                      className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Pagar</span>
                    </button>
                  </div>
                </div>
              )}

              {loan.status === 'PAID' && loan.paidAt && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Pago em {formatDateOnly(new Date(loan.paidAt))}
                </div>
              )}

              {loan.status === 'OVERDUE' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-1 text-xs sm:text-sm text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Empréstimo vencido</span>
                  </div>
                </div>
                )}
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
                onClick={() => setShowLoanForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Registrar Primeiro Empréstimo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loan Form Modal */}
      {showLoanForm && (
        <LoanForm
          loan={editingLoan}
          onSave={handleSaveLoan}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}