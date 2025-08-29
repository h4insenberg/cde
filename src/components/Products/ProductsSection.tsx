import React, { useState } from 'react';
import { Plus, Package, Wrench, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ServiceCard } from '../Services/ServiceCard';
import { ProductForm } from './ProductForm';
import { ServiceForm } from '../Services/ServiceForm';
import { Product, Service } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';

export function ProductsSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products and services based on search term
  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };


  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };


  const handleDeleteProduct = (id: string) => {
    const product = state.products.find(p => p.id === id);
    if (product && window.confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    }
  };


  const handleCancelForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Produtos</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {state.products.length} produto{state.products.length !== 1 ? 's' : ''} cadastrado{state.products.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => setShowProductForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg transition-colors flex items-center space-x-1 sm:space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Novo Produto</span>
        </button>
      </div>


      {/* Search Bar */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Products List */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tente buscar com outros termos ou limpe o filtro
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpar Busca
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Comece adicionando seus produtos para controlar o estoque
            </p>
            <button
              onClick={() => setShowProductForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Primeiro Produto</span>
            </button>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}