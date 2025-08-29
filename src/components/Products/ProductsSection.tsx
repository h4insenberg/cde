import React, { useState } from 'react';
import { Plus, Package, Wrench, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ServiceCard } from '../Services/ServiceCard';
import { ProductForm } from './ProductForm';
import { ServiceForm } from '../Services/ServiceForm';
import { Product, Service } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';

interface ProductsSectionProps {
  activeView?: 'products' | 'services';
}

export function ProductsSection({ activeView }: ProductsSectionProps) {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'products' | 'services'>(activeView || 'products');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Update active tab when activeView prop changes
  React.useEffect(() => {
    if (activeView) {
      setActiveTab(activeView);
    }
  }, [activeView]);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'products' ? 'Produtos' : 'Serviços'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === 'products' 
              ? `${state.products.length} produto${state.products.length !== 1 ? 's' : ''} cadastrado${state.products.length !== 1 ? 's' : ''}`
              : `${state.services.length} serviço${state.services.length !== 1 ? 's' : ''} cadastrado${state.services.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <button
          onClick={() => activeTab === 'products' ? setShowProductForm(true) : setShowServiceForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{activeTab === 'products' ? 'Novo Produto' : 'Novo Serviço'}</span>
        </button>
      </div>

      {/* Header with Tabs */}
      {!activeView && (
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Package className="h-4 w-4 flex-shrink-0" />
                <span>Produtos</span>
                <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full text-xs flex-shrink-0">
                  {filteredProducts.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Wrench className="h-4 w-4 flex-shrink-0" />
                <span>Serviços</span>
                <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full text-xs flex-shrink-0">
                  {filteredServices.length}
                </span>
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'products' ? 'produtos' : 'serviços'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {activeTab === 'products' 
              ? `${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`
              : `${filteredServices.length} serviço${filteredServices.length !== 1 ? 's' : ''} encontrado${filteredServices.length !== 1 ? 's' : ''}`
            }
          </div>
        )}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
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
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
              ))}
            </div>
          ) : searchTerm ? (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 dark:bg-[#18191c] dark:border-gray-700">
              <div className="text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum serviço encontrado
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
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum serviço cadastrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Adicione os serviços que você oferece aos seus clientes
                </p>
                <button
                  onClick={() => setShowServiceForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Primeiro Serviço</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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