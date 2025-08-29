import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Product } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: 'units' as Product['unit'],
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    minQuantity: 5,
  });

  const [displayCostPrice, setDisplayCostPrice] = useState('0,00');
  const [displaySalePrice, setDisplaySalePrice] = useState('0,00');
  const [displayQuantity, setDisplayQuantity] = useState('0,00');
  const [displayMinQuantity, setDisplayMinQuantity] = useState('5,00');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        unit: product.unit,
        quantity: product.quantity,
        costPrice: product.costPrice,
        salePrice: product.salePrice,
        minQuantity: product.minQuantity,
      });
      setDisplayCostPrice(formatCurrencyInput(product.costPrice));
      setDisplaySalePrice(formatCurrencyInput(product.salePrice));
      // Format based on unit type
      if (product.unit === 'units') {
        setDisplayQuantity(Math.floor(product.quantity).toString());
        setDisplayMinQuantity(Math.floor(product.minQuantity).toString());
      } else {
        setDisplayQuantity(formatFloatInput(product.quantity));
        setDisplayMinQuantity(formatFloatInput(product.minQuantity));
      }
    } else {
      setDisplayCostPrice('0,00');
      setDisplaySalePrice('0,00');
      setDisplayQuantity('0');
      setDisplayMinQuantity('5');
    }
  }, [product]);

  const formatCurrencyInput = (value: number): string => {
    if (value === 0) return '0,00';
    
    const cents = Math.round(value * 100);
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;
    
    const reaisFormatted = reais.toLocaleString('pt-BR');
    return `${reaisFormatted},${centavos.toString().padStart(2, '0')}`;
  };

  const parseCurrencyInput = (value: string): number => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return 0;
    return parseInt(numericValue) / 100;
  };

  const formatFloatInput = (value: number): string => {
    if (value === 0) return '0,00';
    
    // For units, format as integer
    if (formData.unit === 'units') {
      return Math.floor(value).toString();
    }
    
    const cents = Math.round(value * 100);
    const integerPart = Math.floor(cents / 100);
    const decimalPart = cents % 100;
    
    const integerFormatted = integerPart.toLocaleString('pt-BR');
    return `${integerFormatted},${decimalPart.toString().padStart(2, '0')}`;
  };

  const parseFloatInput = (value: string): number => {
    // For units, parse as integer
    if (formData.unit === 'units') {
      const numericValue = value.replace(/[^\d]/g, '');
      return parseInt(numericValue) || 0;
    }
    
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return 0;
    return parseInt(numericValue) / 100;
  };

  const handleFloatChange = (value: string, field: 'quantity' | 'minQuantity') => {
    // For units, handle as integer
    if (formData.unit === 'units') {
      const numericValue = value.replace(/[^\d]/g, '');
      const intValue = parseInt(numericValue) || 0;
      
      if (field === 'quantity') {
        setDisplayQuantity(intValue.toString());
        setFormData(prev => ({ ...prev, quantity: intValue }));
      } else {
        setDisplayMinQuantity(intValue.toString());
        setFormData(prev => ({ ...prev, minQuantity: intValue }));
      }
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
      return;
    }
    
    // Pega o valor atual sem formatação
    const currentValue = field === 'quantity' ? displayQuantity : displayMinQuantity;
    const currentNumeric = currentValue.replace(/[^\d]/g, '');
    
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
      if (field === 'quantity') {
        setDisplayQuantity('0,00');
        setFormData(prev => ({ ...prev, quantity: 0 }));
      } else {
        setDisplayMinQuantity('0,00');
        setFormData(prev => ({ ...prev, minQuantity: 0 }));
      }
      return;
    }
    
    // Limita a 10 dígitos (máximo 99.999.999,99)
    const limitedValue = finalNumeric.slice(0, 10);
    const numericValue = parseInt(limitedValue, 10) / 100;
    
    // Formata o valor
    const formattedValue = formatFloatInput(numericValue);
    
    // Atualiza o display
    if (field === 'quantity') {
      setDisplayQuantity(formattedValue);
      setFormData(prev => ({ ...prev, quantity: numericValue }));
    } else {
      setDisplayMinQuantity(formattedValue);
      setFormData(prev => ({ ...prev, minQuantity: numericValue }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Update display format when unit changes
  useEffect(() => {
    if (formData.unit === 'units') {
      // Convert to integer format
      setDisplayQuantity(Math.floor(formData.quantity).toString());
      setDisplayMinQuantity(Math.floor(formData.minQuantity).toString());
      setFormData(prev => ({
        ...prev,
        quantity: Math.floor(prev.quantity),
        minQuantity: Math.floor(prev.minQuantity)
      }));
    } else {
      // Convert to float format
      setDisplayQuantity(formatFloatInput(formData.quantity));
      setDisplayMinQuantity(formatFloatInput(formData.minQuantity));
    }
  }, [formData.unit]);

  const handleFloatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Para teclas de navegação, força o cursor para o final
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      setTimeout(() => {
        const target = e.target as HTMLInputElement;
        target.setSelectionRange(target.value.length, target.value.length);
      }, 0);
      return;
    }
    
    // Permite apenas números, vírgula, backspace, delete, tab, escape, enter
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    const isNumber = /^[0-9]$/.test(e.key);
    
    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleFloatInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre que houver input
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleFloatClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre que clicar
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleFloatFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre
    setTimeout(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }, 0);
  };

  const handleCurrencyChange = (value: string, field: 'costPrice' | 'salePrice') => {
    // Pega o valor atual sem formatação
    const currentValue = field === 'costPrice' ? displayCostPrice : displaySalePrice;
    const currentNumeric = currentValue.replace(/[^\d]/g, '');
    
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
      if (field === 'costPrice') {
        setDisplayCostPrice('0,00');
      } else {
        setDisplaySalePrice('0,00');
      }
      setFormData(prev => ({ ...prev, [field]: 0 }));
      return;
    }
    
    // Limita a 10 dígitos (máximo R$ 99.999.999,99)
    const limitedValue = finalNumeric.slice(0, 10);
    const numericPrice = parseInt(limitedValue, 10) / 100;
    
    // Formata o valor
    const formattedValue = formatCurrencyInput(numericPrice);
    
    // Atualiza o display
    if (field === 'costPrice') {
      setDisplayCostPrice(formattedValue);
    } else {
      setDisplaySalePrice(formattedValue);
    }
    
    // Atualiza o valor numérico no formData
    setFormData(prev => ({
      ...prev,
      [field]: numericPrice
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCurrencyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'costPrice' | 'salePrice') => {
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

  const handleCurrencyInput = (e: React.FormEvent<HTMLInputElement>, field: 'costPrice' | 'salePrice') => {
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

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantidade deve ser positiva';
    }

    if (formData.costPrice < 0) {
      newErrors.costPrice = 'Preço de custo deve ser positivo';
    }

    if (formData.salePrice < 0) {
      newErrors.salePrice = 'Preço de venda deve ser positivo';
    }

    if (formData.salePrice <= formData.costPrice) {
      newErrors.salePrice = 'Preço de venda deve ser maior que o custo';
    }

    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'Estoque mínimo deve ser positivo';
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
      ...formData,
      createdAt: product?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(productData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') || name.includes('quantity') || name.includes('Quantity') 
        ? parseFloat(value) || 0 
        : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getUnitAbbreviation = (unit: Product['unit']): string => {
    const abbreviations = {
      kg: 'kg',
      liters: 'L',
      meters: 'm',
      units: 'un',
    };
    return abbreviations[unit] || unit;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-4xl max-h-[98vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Açúcar cristal"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Descrição opcional do produto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unidade de Medida *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="units">Unidades</option>
                <option value="kg">Quilogramas</option>
                <option value="liters">Litros</option>
                <option value="meters">Metros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantidade Atual *
              </label>
              <input
                type="text"
                value={displayQuantity}
                onChange={(e) => handleFloatChange(e.target.value, 'quantity')}
                onInput={handleFloatInput}
                onKeyDown={handleFloatKeyDown}
                onClick={handleFloatClick}
                onFocus={handleFloatFocus}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0,00"
                inputMode="decimal"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço de Custo *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium pointer-events-none">
                  R$
                </div>
                <input
                  type="text"
                  value={displayCostPrice}
                  onChange={(e) => handleCurrencyChange(e.target.value, 'costPrice')}
                  onInput={(e) => handleCurrencyInput(e, 'costPrice')}
                  onKeyDown={(e) => handleCurrencyKeyDown(e, 'costPrice')}
                  onClick={handleCurrencyClick}
                  onFocus={handleCurrencyFocus}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.costPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                  inputMode="numeric"
                />
              </div>
              {errors.costPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço de Venda *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium pointer-events-none">
                  R$
                </div>
                <input
                  type="text"
                  value={displaySalePrice}
                  onChange={(e) => handleCurrencyChange(e.target.value, 'salePrice')}
                  onInput={(e) => handleCurrencyInput(e, 'salePrice')}
                  onKeyDown={(e) => handleCurrencyKeyDown(e, 'salePrice')}
                  onClick={handleCurrencyClick}
                  onFocus={handleCurrencyFocus}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.salePrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                  inputMode="numeric"
                />
              </div>
              {errors.salePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estoque Mínimo *
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayMinQuantity}
                onChange={(e) => handleFloatChange(e.target.value, 'minQuantity')}
                onInput={handleFloatInput}
                onKeyDown={handleFloatKeyDown}
                onClick={handleFloatClick}
                onFocus={(e) => {
                  handleFloatFocus(e);
                  const isUnits = formData.unit === 'units';
                  if ((isUnits && e.target.value === '0') || (!isUnits && e.target.value === '0,00')) {
                    setDisplayMinQuantity('');
                    setFormData(prev => ({ ...prev, minQuantity: 0 }));
                  }
                }}
                className={`w-full pr-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.minQuantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.unit === 'units' ? '0' : '0,00'}
                inputMode="decimal"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium pointer-events-none">
                {getUnitAbbreviation(formData.unit)}
              </div>
            </div>
            {errors.minQuantity && (
              <p className="text-red-500 text-sm mt-1">{errors.minQuantity}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Você será notificado quando o estoque atingir este nível
            </p>
          </div>

          </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18191c] flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Save className="h-4 w-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}