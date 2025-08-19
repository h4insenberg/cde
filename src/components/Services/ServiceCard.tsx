import React from 'react';
import { Wrench, Edit2, Trash2 } from 'lucide-react';
import { Service } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <Wrench className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{service.name}</h3>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            onClick={() => onEdit(service)}
            className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {service.description && (
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Preço do Serviço</span>
          <span className="text-sm sm:text-lg font-bold text-purple-700 dark:text-purple-300">
            {formatCurrency(service.price)}
          </span>
        </div>
      </div>
    </div>
  );
}