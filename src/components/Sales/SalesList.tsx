import React from 'react';
import { Calendar, CreditCard, TrendingUp, Package, Wrench, Receipt } from 'lucide-react';
import { Sale } from '../../types';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface SalesListProps {
  sales: Sale[];
}

export function SalesList({ sales }: SalesListProps) {
  const { state } = useBusiness();
  const sortedSales = sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sortedSales.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
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
    <div className="space-y-6">
      {sortedSales.map((sale) => (
        <div key={sale.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-green-200 dark:hover:border-green-700 overflow-hidden">
          
          {/* Sale Header */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <Receipt className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Venda #{sale.id.slice(-6)}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(new Date(sale.createdAt))}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sale.paymentMethod === 'PIX' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      sale.paymentMethod === 'CARD' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    }`}>
                      {getPaymentMethodLabel(sale.paymentMethod)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {state.showValues ? formatCurrency(sale.total) : '••••'}
                </p>
                {sale.cardFeeAmount && sale.cardFeeAmount > 0 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    Taxa: {state.showValues ? formatCurrency(sale.cardFeeAmount) : '••••'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sale Items */}
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Itens da Venda ({sale.items.length})
            </h4>
            
            <div className="grid gap-3">
              {sale.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'product' 
                        ? 'bg-blue-100 dark:bg-blue-900/30' 
                        : 'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {item.type === 'product' ? (
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Wrench className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity}x • {state.showValues ? formatCurrency(item.unitPrice) : '••••'} cada
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {state.showValues ? formatCurrency(item.total) : '••••'}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      +{state.showValues ? formatCurrency(item.profit) : '••••'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sale Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-t border-gray-200/50 dark:border-gray-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lucro Total</p>
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {state.showValues ? formatCurrency(sale.profit) : '••••'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor Líquido</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {state.showValues ? formatCurrency(sale.netAmount) : '••••'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Margem de Lucro</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {sale.total > 0 ? ((sale.profit / sale.total) * 100).toFixed(1) : '0'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}