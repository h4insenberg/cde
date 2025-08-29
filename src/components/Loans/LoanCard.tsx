import React from 'react';
import { User, Calendar, DollarSign, Phone, Check, AlertTriangle, Clock } from 'lucide-react';
import { Loan } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface LoanCardProps {
  loan: Loan;
  onMarkAsPaid: (loan: Loan) => void;
  onEdit: (loan: Loan) => void;
}

export function LoanCard({ loan, onMarkAsPaid, onEdit }: LoanCardProps) {
  const { state } = useBusiness();
  const isOverdue = loan.status === 'ACTIVE' && new Date() > new Date(loan.dueDate);
  const isPaid = loan.status === 'PAID';
  
  const getStatusColor = () => {
    if (isPaid) return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    if (isOverdue) return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
  };

  const getStatusLabel = () => {
    if (isPaid) return 'Pago';
    if (isOverdue) return 'Vencido';
    return 'Ativo';
  };

  const getStatusIcon = () => {
    if (isPaid) return <Check className="h-4 w-4" />;
    if (isOverdue) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getBorderColor = () => {
    if (isPaid) return 'border-green-200 dark:border-green-700';
    if (isOverdue) return 'border-red-200 dark:border-red-700';
    return 'border-orange-200 dark:border-orange-700';
  };

  return (
    <div className={`bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${getBorderColor()}`}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <User className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{loan.customerName}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusLabel()}</span>
          </span>
        </div>
        
        <div className="text-right flex-shrink-0">
          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
            {state.showValues ? formatCurrency(loan.amount) : '••••'}
          </p>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>Vence: {formatDate(new Date(loan.dueDate)).split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {loan.description && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
          {loan.description}
        </p>
      )}

      {/* Customer Phone */}
      {loan.customerPhone && (
        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{loan.customerPhone}</span>
        </div>
      )}

      {/* Notes */}
      {loan.notes && (
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{loan.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(loan)}
          className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-xs sm:text-sm text-center"
        >
          Editar
        </button>
        
        {!isPaid && (
          <button
            onClick={() => onMarkAsPaid(loan)}
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm"
          >
            <Check className="h-4 w-4" />
            <span>Marcar como Pago</span>
          </button>
        )}
      </div>

      {isPaid && loan.paidAt && (
        <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          Pago em {formatDate(new Date(loan.paidAt))}
        </div>
      )}
    </div>
  );
}