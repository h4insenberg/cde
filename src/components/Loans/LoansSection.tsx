import React, { useState } from 'react';
import { Plus, HandCoins, Filter } from 'lucide-react';
import { LoanCard } from './LoanCard';
import { LoanForm } from './LoanForm';
import { Loan } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatCurrency } from '../../utils/helpers';

export function LoansSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paid' | 'overdue'>('all');

  const filteredLoans = state.loans?.filter(loan => {
    const isOverdue = loan.status === 'ACTIVE' && new Date() > new Date(loan.dueDate);
    
    if (filter === 'active') return loan.status === 'ACTIVE' && !isOverdue;
    if (filter === 'paid') return loan.status === 'PAID';
    if (filter === 'overdue') return isOverdue;
    return true;
  }).sort((a, b) => {
    // Active loans first, then by due date
    if (a.status === 'ACTIVE' && b.status === 'PAID') return -1;
    if (a.status === 'PAID' && b.status === 'ACTIVE') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  }) || [];

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
      addNotification('SUCCESS', `Empréstimo de ${loan.customerName} marcado como pago!`);
    }
  };

  const handleCancelForm = () => {
    setShowLoanForm(false);
    setEditingLoan(null);
  };

  const activeLoans = state.loans?.filter(l => l.status === 'ACTIVE') || [];
  const overdueLoans = state.loans?.filter(l => l.status === 'ACTIVE' && new Date() > new Date(l.dueDate)) || [];
  const totalActiveAmount = activeLoans.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Empréstimos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {activeLoans.length} ativo{activeLoans.length !== 1 ? 's' : ''} • {state.showValues ? formatCurrency(totalActiveAmount) : '••••'} em aberto
            {overdueLoans.length > 0 && (
              <span className="text-red-600 dark:text-red-400 ml-2">
                • {overdueLoans.length} vencido{overdueLoans.length !== 1 ? 's' : ''}
              </span>
            )}
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
              Todos ({state.loans?.length || 0})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-2 sm:px-3 py-1 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filter === 'active'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Ativos ({activeLoans.length})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-2 sm:px-3 py-1 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filter === 'overdue'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Vencidos ({overdueLoans.length})
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-2 sm:px-3 py-1 rounded-md transition-colors text-xs sm:text-sm whitespace-nowrap ${
                filter === 'paid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Pagos ({state.loans?.filter(l => l.status === 'PAID').length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onMarkAsPaid={handleMarkAsPaid}
              onEdit={handleEditLoan}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <HandCoins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'Nenhum empréstimo registrado' : 
               filter === 'active' ? 'Nenhum empréstimo ativo' : 
               filter === 'overdue' ? 'Nenhum empréstimo vencido' : 'Nenhum empréstimo pago'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'Comece registrando empréstimos para seus clientes' :
               filter === 'active' ? 'Todos os empréstimos foram pagos ou venceram' :
               filter === 'overdue' ? 'Nenhum empréstimo está vencido' : 'Nenhum empréstimo foi pago ainda'}
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

      {/* Loan Form */}
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