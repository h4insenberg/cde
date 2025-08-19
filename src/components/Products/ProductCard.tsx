import React from 'react';
import { Package, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, getUnitLabel } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const isLowStock = product.quantity <= product.minQuantity;
  const profitMargin = ((product.salePrice - product.costPrice) / product.salePrice * 100).toFixed(1);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
      isLowStock 
        ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' 
        : 'border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <Package className={`h-5 w-5 ${isLowStock ? 'text-red-500' : 'text-blue-600'}`} />
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
          {isLowStock && (
            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="space-y-2">
        <div className={`flex items-center justify-between p-2 rounded-lg ${
          isLowStock ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-gray-700'
        }`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estoque:</span>
          <span className={`text-sm font-bold ${
            isLowStock 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {product.quantity} {product.unit}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Custo</p>
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              {formatCurrency(product.costPrice)}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Venda</p>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              {formatCurrency(product.salePrice)}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Margem de Lucro</span>
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
              {profitMargin}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}