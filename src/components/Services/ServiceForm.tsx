import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Service } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface ServiceFormProps {
  service?: Service | null;
  onSave: (service: Service) => void;
  onCancel: () => void;
}

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
  });

  const [displayPrice, setDisplayPrice] = useState('0,00');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
      });
      setDisplayPrice(formatCurrencyInput(service.price));
    } else {
      setDisplayPrice('0,00');
    }
  }, [service]);

  const formatCurrencyInput = (value: number): string => {
    if (value === 0) return '0,00';
    
    const cents = Math.round(value * 100);
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;
    
    const reaisFormatted = reais.toLocaleString('pt-BR');
    return `${reaisFormatted},${centavos.toString().padStart(2, '0')}`;
  };

  const handleCurrencyChange = (value: string) => {
    // Pega o valor atual sem formatação
    const currentNumeric = displayPrice.replace(/[^\d]/g, '');
    
    // Remove tudo que não é dígito do novo valor
    const inputNumeric = value.replace(/[^\d]/g, '');
    
    // Se o input tem mais dígitos que o atual, adiciona no final
    // Se tem menos, remove do final
    let finalNumeric = '';
    if (inputNumeric.length > currentNumeric.length) {
      // Adiciona apenas o último dígito digitado
      const newDigit = inputNumeric[inputNumeric.length - 1];
      finalNumeric = currentNumeric + newDigit;
    } else if (inputNumeric.length < currentNumeric.length) {
      // Remove do final
      finalNumeric = currentNumeric.slice(0, -1);
    } else {
      finalNumeric = inputNumeric;
    }
    
    // Se vazio, define como 0
    if (!finalNumeric) {
      setDisplayPrice('0,00');
      setFormData(prev => ({ ...prev, price: 0 }));
      return;
    }
    
    // Limita a 10 dígitos (máximo R$ 99.999.999,99)
    const limitedValue = finalNumeric.slice(0, 10);
    const numericPrice = parseInt(limitedValue, 10) / 100;
    
    // Formata o valor
    const formattedValue = formatCurrencyInput(numericPrice);
    
    // Atualiza o display
    setDisplayPrice(formattedValue);
    
    // Atualiza o valor numérico no formData
    setFormData(prev => ({
      ...prev,
      price: numericPrice
    }));

    // Clear error when user starts typing
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
  };

  const handleCurrencyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Para teclas de navegação, força o cursor para o final
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      setTimeout(() => {
        const target = e.target as HTMLInputElement;
        target.setSelectionRange(target.value.length, target.value.length);
      }, 0);
      return;
    }
    
    // Permite apenas números, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    const isNumber = /^[0-9]$/.test(e.key);
    
    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleCurrencyInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre que houver input
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleCurrencyClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre que clicar
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleCurrencyFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre
    setTimeout(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }, 0);
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const serviceData: Service = {
      id: service?.id || generateId(),
      ...formData,
      createdAt: service?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(serviceData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              }
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Descrição opcional do serviço"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preço do Serviço *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium pointer-events-none">
                R$
              </div>
              <input
                type="text"
                value={displayPrice}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                onInput={handleCurrencyInput}
                onKeyDown={handleCurrencyKeyDown}
                onClick={handleCurrencyClick}
                onFocus={handleCurrencyFocus}
                className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0,00"
                inputMode="numeric"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
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
}