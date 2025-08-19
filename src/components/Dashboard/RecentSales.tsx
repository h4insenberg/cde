import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';
import { Sale } from '../../types';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../../utils/helpers';

interface RecentSalesProps {
  sales: Sale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  const recentSales = sales
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recentSales.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Vendas Recentes
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhuma venda realizada ainda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        Vendas Recentes
      </h3>
      
      <div className="space-y-3">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                </span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                  {getPaymentMethodLabel(sale.paymentMethod)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(new Date(sale.createdAt))}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(sale.total)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                +{formatCurrency(sale.profit)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}