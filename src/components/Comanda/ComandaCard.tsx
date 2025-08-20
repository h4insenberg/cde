import React from 'react';
import { User, Clock, DollarSign, Plus, Check } from 'lucide-react';
import { Comanda } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface ComandaCardProps {
  comanda: Comanda;
  onAddItems: (comanda: Comanda) => void;
  onPayComanda: (comanda: Comanda) => void;
}

export function ComandaCard({ comanda, onAddItems, onPayComanda }: ComandaCardProps) {
  const isOpen = comanda.status === 'OPEN';

  return (
    <div className={`bg-white dark:bg-[#18191c] rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
      isOpen 
        ? 'border-orange-200 dark:border-orange-700 bg-orange-50/30 dark:bg-orange-950/20' 
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <User className={`h-5 w-5 ${isOpen ? 'text-orange-500' : 'text-green-500'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-white">{comanda.customerName}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOpen 
              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          }`}>
            {isOpen ? 'Aberta' : 'Paga'}
          </span>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(comanda.total)}
          </p>
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{formatDate(new Date(comanda.createdAt))}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Itens ({comanda.items.length}):
        </h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {comanda.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span className="text-gray-900 dark:text-white">
                {item.name} x{item.quantity}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {isOpen && (
        <div className="flex space-x-2">
          <button
            onClick={() => onAddItems(comanda)}
            className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center space-x-1 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar</span>
          </button>
          <button
            onClick={() => onPayComanda(comanda)}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-sm"
          >
            <Check className="h-4 w-4" />
            <span>Pagar</span>
          </button>
        </div>
      )}

      {!isOpen && comanda.paidAt && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Paga em {formatDate(new Date(comanda.paidAt))}
        </div>
      )}
    </div>
  );
}