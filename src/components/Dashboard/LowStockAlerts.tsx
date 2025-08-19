import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Product } from '../../types';

interface LowStockAlertsProps {
  products: Product[];
}

export function LowStockAlerts({ products }: LowStockAlertsProps) {
  const lowStockProducts = products.filter(p => p.quantity <= p.minQuantity);

  if (lowStockProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-green-600" />
          Estoque
        </h3>
        <div className="flex items-center justify-center py-8 text-green-600">
          <Package className="h-8 w-8 mr-2" />
          <span className="font-medium">Todos os produtos em estoque adequado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-red-100 dark:border-red-700">
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Alertas de Estoque Baixo
      </h3>
      
      <div className="space-y-3">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                {product.name}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Estoque mínimo: {product.minQuantity} {product.unit}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                {product.quantity} {product.unit}
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                Repor estoque
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}