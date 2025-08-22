import React from 'react';
import { User, Clock, DollarSign, Plus, Check, Package, Wrench } from 'lucide-react';
import { Comanda } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface ComandaCardProps {
  comanda: Comanda;
  onAddItems: (comanda: Comanda) => void;
  onPayComanda: (comanda: Comanda) => void;
}

export function ComandaCard({ comanda, onAddItems, onPayComanda }: ComandaCardProps) {
  const { state } = useBusiness();
  const isOpen = comanda.status === 'OPEN';

  return (
    <div className={`group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border ${
      isOpen 
        ? 'border-orange-200 dark:border-orange-700 bg-gradient-to-br from-orange-50/30 to-white dark:from-orange-950/20 dark:to-gray-900' 
        : 'border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50/30 to-white dark:from-green-950/20 dark:to-gray-900'
    }`}>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          isOpen 
            ? 'bg-orange-500 text-white animate-pulse'
            : 'bg-green-500 text-white'
        }`}>
          {isOpen ? 'ABERTA' : 'PAGA'}
        </span>
      </div>

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-3 rounded-xl ${
              isOpen 
                ? 'bg-orange-100 dark:bg-orange-900/30' 
                : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              <User className={`h-6 w-6 ${
                isOpen ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                {comanda.customerName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(new Date(comanda.createdAt))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className={`p-4 rounded-xl border-2 border-dashed ${
          isOpen 
            ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/20' 
            : 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className={`h-5 w-5 ${
                isOpen ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
              }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total da Comanda
              </span>
            </div>
            <span className={`text-2xl font-bold ${
              isOpen ? 'text-orange-700 dark:text-orange-300' : 'text-green-700 dark:text-green-300'
            }`}>
              {state.showValues ? formatCurrency(comanda.total) : '••••'}
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Itens ({comanda.items.length})
          </h4>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {comanda.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  {item.type === 'product' ? (
                    <Package className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Wrench className="h-4 w-4 text-purple-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.quantity}x • {state.showValues ? formatCurrency(item.unitPrice) : '••••'}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {state.showValues ? formatCurrency(item.total) : '••••'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {isOpen && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onAddItems(comanda)}
              className="flex-1 px-4 py-3 border-2 border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar</span>
            </button>
            <button
              onClick={() => onPayComanda(comanda)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Check className="h-4 w-4" />
              <span>Pagar</span>
            </button>
          </div>
        )}

        {!isOpen && comanda.paidAt && (
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">
                Paga em {formatDate(new Date(comanda.paidAt))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}