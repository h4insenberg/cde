import React, { useState } from 'react';
import { Plus, Package, Wrench, Search, Filter, Grid3X3, List } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Filter products and services based on search term
  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = state.services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
      addNotification('SUCCESS', `Produto "${product.name}" atualizado com sucesso`);
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      addNotification('SUCCESS', `Produto "${product.name}" adicionado com sucesso`);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSaveService = (service: Service) => {
    if (editingService) {
      dispatch({ type: 'UPDATE_SERVICE', payload: service });
      addNotification('SUCCESS', `Serviço "${service.name}" atualizado com sucesso`);
    } else {
      dispatch({ type: 'ADD_SERVICE', payload: service });
      addNotification('SUCCESS', `Serviço "${service.name}" adicionado com sucesso`);
    }
    setShowServiceForm(false);
    setEditingService(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    const product = state.products.find(p => p.id === id);
    if (product && window.confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      addNotification('SUCCESS', `Produto "${product.name}" excluído com sucesso`);
    }
  };

  const handleDeleteService = (id: string) => {
    const service = state.services.find(s => s.id === id);
    if (service && window.confirm(`Tem certeza que deseja excluir "${service.name}"?`)) {
      dispatch({ type: 'DELETE_SERVICE', payload: id });
      addNotification('SUCCESS', `Serviço "${service.name}" excluído com sucesso`);
    }
  };

  const handleCancelForm = () => {
    setShowProductForm(false);
    setShowServiceForm(false);
    setEditingProduct(null);
    setEditingService(null);
  };

  const currentItems = activeTab === 'products' ? filteredProducts : filteredServices;
  const totalItems = activeTab === 'products' ? state.products.length : state.services.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Estoque & Serviços
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Gerencie seus produtos e serviços de forma inteligente
              </p>
            </div>
            
            <button
              onClick={() => activeTab === 'products' ? setShowProductForm(true) : setShowServiceForm(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Plus className="h-5 w-5" />
                <span className="font-semibold">
                  {activeTab === 'products' ? 'Novo Produto' : 'Novo Serviço'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package className="h-5 w-5" />
            <span className="font-semibold">Produtos</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              activeTab === 'products'
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              {state.products.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="h-5 w-5" />
            <span className="font-semibold">Serviços</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              activeTab === 'services'
                ? 'bg-white/20 text-white'
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              {state.services.length}
            </span>
          </button>
        </div>
      </div>

      {/* Modern Search & Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'products' ? 'produtos' : 'serviços'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-lg placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="h-4 w-4" />
            <span>
              {currentItems.length} de {totalItems} {activeTab === 'products' ? 'produtos' : 'serviços'} encontrados
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {currentItems.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {activeTab === 'products' 
              ? filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))
              : filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                  />
                ))
            }
          </div>
        ) : searchTerm ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Não encontramos {activeTab === 'products' ? 'produtos' : 'serviços'} que correspondam à sua busca por "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Limpar Busca
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'products' ? (
                  <Package className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Wrench className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {activeTab === 'products' ? 'Nenhum produto cadastrado' : 'Nenhum serviço cadastrado'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {activeTab === 'products' 
                  ? 'Comece adicionando seus produtos para controlar o estoque de forma eficiente'
                  : 'Adicione os serviços que você oferece para organizar melhor seu negócio'
                }
              </p>
              <button
                onClick={() => activeTab === 'products' ? setShowProductForm(true) : setShowServiceForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>
                  {activeTab === 'products' ? 'Adicionar Primeiro Produto' : 'Adicionar Primeiro Serviço'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={handleCancelForm}
        />
      )}

      {showServiceForm && (
        <ServiceForm
          service={editingService}
          onSave={handleSaveService}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}