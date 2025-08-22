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
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-green-500" />
          Alertas de Estoque
        </h3>
        <div className="text-center">
          <Package className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Estoque em Dia
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Todos os produtos estão com estoque adequado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        Alertas de Estoque Baixo
      </h3>
      
      <div className="space-y-3">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mínimo: {product.minQuantity} {product.unit}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {product.quantity} {product.unit}
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                Estoque baixo
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
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