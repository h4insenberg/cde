import React from 'react';
import { Calendar, CreditCard, Package, Wrench, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Sale, Comanda, StockMovement, Loan } from '../../types';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface ExtratoProps {
  sales: Sale[];
  comandas: Comanda[];
  stockMovements: StockMovement[];
  loans: Loan[];
}

type MovementType = 'sale' | 'comanda' | 'stock_in' | 'stock_out' | 'service' | 'loan';
type MovementCategory = 'entry' | 'exit';

interface Movement {
  id: string;
  type: MovementType;
  category: MovementCategory;
  description: string;
  amount?: number;
  quantity?: number;
  unit?: string;
  createdAt: Date;
  paymentMethod?: string;
  profit?: number;
}

export function RecentSales({ sales, comandas, stockMovements, loans }: ExtratoProps) {
  const { state } = useBusiness();
  const { showValues } = state;
  const movements: Movement[] = [];

  // Add sales
  sales.forEach(sale => {
    sale.items.forEach(item => {
        <div className="space-y-2">
          {allMovements.map((movement) => (
            <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {getMovementIcon(movement.type)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {movement.description}
                  </span>
                  {movement.paymentMethod && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      {getPaymentMethodLabel(movement.paymentMethod)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(movement.createdAt)}
                </p>
              </div>
              
              <div className="text-right">
                {movement.amount !== undefined ? (
                  <div>
                    <p className={`text-sm font-semibold ${getMovementColor(movement.type)}`}>
                      {movement.category === 'entry' ? '+' : '-'}{showValues ? formatCurrency(movement.amount) : '••••'}
                    </p>
                    {movement.profit !== undefined && showValues && movement.category === 'entry' && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Lucro: {formatCurrency(movement.profit)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={`text-sm font-semibold ${getMovementColor(movement.type)}`}>
                    {movement.category === 'entry' ? '+' : '-'}{movement.quantity} {movement.unit || 'un'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          Extrato
        </h3>
      </div>
      
      <div className="space-y-6">
        {/* Entradas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Entradas ({entries.length})
            </h4>
          </div>
          
          {entries.length > 0 ? (
            <div className="space-y-2">
              {entries.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(movement.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {movement.description}
                      </span>
                      {movement.paymentMethod && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          {getPaymentMethodLabel(movement.paymentMethod)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(movement.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {movement.amount !== undefined ? (
                      <div>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          +{showValues ? formatCurrency(movement.amount) : '••••'}
                        </p>
                        {movement.profit !== undefined && showValues && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Lucro: {formatCurrency(movement.profit)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        +{movement.quantity} {movement.unit || 'un'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
              Nenhuma entrada registrada
            </p>
          )}
        </div>

        {/* Saídas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Saídas ({exits.length})
            </h4>
          </div>
          
          {exits.length > 0 ? (
            <div className="space-y-2">
              {exits.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(movement.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {movement.description}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(movement.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{movement.quantity} {movement.unit || 'un'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
              Nenhuma saída registrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}