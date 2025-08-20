import React from 'react';
import { Calendar, CreditCard, TrendingUp, Package } from 'lucide-react';
import { Sale } from '../../types';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../../utils/helpers';

interface SalesListProps {
  sales: Sale[];
}

export function SalesList({ sales }: SalesListProps) {
  const sortedSales = sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sortedSales.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-8 shadow-sm border-2 border-blue-200 dark:border-blue-600">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Nenhuma venda registrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            As vendas aparecerão aqui quando forem realizadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedSales.map((sale) => (
        <div key={sale.id} className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-600 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Venda #{sale.id.slice(-6)}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(new Date(sale.createdAt))}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(sale.total)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  {getPaymentMethodLabel(sale.paymentMethod)}
                </span>
                {sale.cardFeeAmount && sale.cardFeeAmount > 0 && (
                  <span className="text-xs text-red-600 dark:text-red-400">
                    -Taxa: {formatCurrency(sale.cardFeeAmount)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Itens vendidos:</h4>
            <div className="space-y-1">
              {sale.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {item.type === 'product' ? (
                      <Package className="h-4 w-4 text-blue-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                    )}
                    <span className="text-gray-900 dark:text-white">
                      {item.name} x{item.quantity}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.total)}
                    </span>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      +{formatCurrency(item.profit)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">Lucro:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(sale.profit)}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Valor líquido</p>
              <p className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(sale.netAmount)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}