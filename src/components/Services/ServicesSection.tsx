import React, { useState } from 'react';
import { Plus, Wrench, Search } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { ServiceForm } from './ServiceForm';
import { Service } from '../../types';
import { useBusiness } from '../../context/BusinessContext';
import { useNotifications } from '../../hooks/useNotifications';

export function ServicesSection() {
  const { state, dispatch } = useBusiness();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Filter services based on search term
  const filteredServices = state.services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const handleDeleteService = (id: string) => {
    const service = state.services.find(s => s.id === id);
    if (service && window.confirm(`Tem certeza que deseja excluir "${service.name}"?`)) {
      dispatch({ type: 'DELETE_SERVICE', payload: id });
      addNotification('SUCCESS', `Serviço "${service.name}" excluído com sucesso`);
    }
  };

  const handleCancelForm = () => {
    setShowServiceForm(false);
    setEditingService(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Serviços</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {state.services.length} serviço{state.services.length !== 1 ? 's' : ''} cadastrado{state.services.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => setShowServiceForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg transition-colors flex items-center space-x-1 sm:space-x-2"
        >
          <Plus className="h-4 w-4 sm:h-4 sm:w-4" />
          <span className="text-sm sm:text-base">Novo Serviço</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Services List */}
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

      {/* Service Form Modal */}
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