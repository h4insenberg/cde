import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Product } from '../../types';
import { generateId } from '../../utils/helpers';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'unidades',
    quantity: '',
    costPrice: '',
    salePrice: '',
    minQuantity: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        unit: product.unit,
        quantity: product.quantity.toString(),
        costPrice: product.costPrice.toFixed(2).replace('.', ','),
        salePrice: product.salePrice.toFixed(2).replace('.', ','),
        minQuantity: product.minQuantity.toString(),
      });
    }
  }, [product]);

  const formatCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    if (!numbers) return '';
    
    // Converte para número e divide por 100 para ter os centavos
    const amount = parseInt(numbers) / 100;
    
    // Formata como moeda brasileira
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatQuantity = (value: string, unit: string): string => {
    if (unit === 'unidades') {
      // Para unidades, apenas números inteiros
      return value.replace(/\D/g, '');
    } else {
      // Para outras unidades, permite decimais
      const numbers = value.replace(/[^\d,]/g, '');
      const parts = numbers.split(',');
      if (parts.length > 2) {
        return parts[0] + ',' + parts[1];
      }
      return numbers;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'costPrice' || field === 'salePrice') {
      formattedValue = formatCurrency(value);
    } else if (field === 'quantity' || field === 'minQuantity') {
      formattedValue = formatQuantity(value, formData.unit);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const parseNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(',', '.'));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantidade é obrigatória';
    } else if (parseNumber(formData.quantity) < 0) {
      newErrors.quantity = 'Quantidade deve ser positiva';
    }

    if (!formData.costPrice) {
      newErrors.costPrice = 'Preço de custo é obrigatório';
    } else if (parseNumber(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Preço de custo deve ser maior que zero';
    }

    if (!formData.salePrice) {
      newErrors.salePrice = 'Preço de venda é obrigatório';
    } else if (parseNumber(formData.salePrice) <= 0) {
      newErrors.salePrice = 'Preço de venda deve ser maior que zero';
    }

    if (!formData.minQuantity) {
      newErrors.minQuantity = 'Estoque mínimo é obrigatório';
    } else if (parseNumber(formData.minQuantity) < 0) {
      newErrors.minQuantity = 'Estoque mínimo deve ser positivo';
    }

    // Validar se preço de venda é maior que preço de custo
    const costPrice = parseNumber(formData.costPrice);
    const salePrice = parseNumber(formData.salePrice);
    
    if (costPrice > 0 && salePrice > 0 && salePrice <= costPrice) {
      newErrors.salePrice = 'Preço de venda deve ser maior que o preço de custo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData: Product = {
      id: product?.id || generateId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      unit: formData.unit,
      quantity: parseNumber(formData.quantity),
      costPrice: parseNumber(formData.costPrice),
      salePrice: parseNumber(formData.salePrice),
      minQuantity: parseNumber(formData.minQuantity),
      createdAt: product?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(productData);
  };

  const unitOptions = [
    { value: 'unidades', label: 'Unidades' },
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'litros', label: 'Litros' },
    { value: 'metros', label: 'Metros' },
    { value: 'pacotes', label: 'Pacotes' },
    { value: 'caixas', label: 'Caixas' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                errors.name 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Digite o nome do produto"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              placeholder="Descrição opcional do produto"
            />
          </div>

          {/* Unidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unidade de Medida *
            </label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            >
              {unitOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quantidade Atual *
            </label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                errors.quantity 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder={formData.unit === 'unidades' ? '0' : '0,00'}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
            )}
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço de Custo *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  R$
                </span>
                <input
                  type="text"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                    errors.costPrice 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0,00"
                />
              </div>
              {errors.costPrice && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.costPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço de Venda *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  R$
                </span>
                <input
                  type="text"
                  value={formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                    errors.salePrice 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0,00"
                />
              </div>
              {errors.salePrice && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salePrice}</p>
              )}
            </div>
          </div>

          {/* Estoque Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estoque Mínimo * ({formData.unit})
            </label>
            <input
              type="text"
              value={formData.minQuantity}
              onChange={(e) => handleInputChange('minQuantity', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base ${
                errors.minQuantity 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder={formData.unit === 'unidades' ? '0' : '0,00'}
            />
            {errors.minQuantity && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.minQuantity}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}