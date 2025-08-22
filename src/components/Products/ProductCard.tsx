import React from 'react';
import { Package, Edit2, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';
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
    <div className={`group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border ${
      isLowStock 
        ? 'border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/50 to-white dark:from-red-950/20 dark:to-gray-900' 
        : 'border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-700'
    }`}>
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Low Stock Alert */}
      {isLowStock && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white p-2 rounded-full shadow-lg animate-pulse">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      )}

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-3 rounded-xl ${
              isLowStock 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <Package className={`h-6 w-6 ${
                isLowStock ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {product.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stock Status */}
        <div className={`p-4 rounded-xl border-2 border-dashed ${
          isLowStock 
            ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20' 
            : 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Estoque Atual
            </span>
            <div className="text-right">
              <span className={`text-xl font-bold ${
                isLowStock 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {product.quantity}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                {product.unit}
              </span>
            </div>
          </div>
          {isLowStock && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
              ⚠️ Estoque baixo! Mínimo: {product.minQuantity} {product.unit}
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                Custo
              </span>
            </div>
            <p className="text-lg font-bold text-orange-800 dark:text-orange-200">
              {formatCurrency(product.costPrice)}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                Venda
              </span>
            </div>
            <p className="text-lg font-bold text-green-800 dark:text-green-200">
              {formatCurrency(product.salePrice)}
            </p>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Margem de Lucro
              </span>
            </div>
            <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
              {profitMargin}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}