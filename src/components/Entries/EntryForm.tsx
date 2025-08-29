import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, FileText } from 'lucide-react';
import { FinancialEntry } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface EntryFormProps {
  entry?: FinancialEntry | null;
  onSave: (entry: FinancialEntry) => void;
  onCancel: () => void;
}

export function EntryForm({ entry, onSave, onCancel }: EntryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [displayAmount, setDisplayAmount] = useState('0,00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      setFormData({
        name: entry.name,
        amount: entry.amount,
        description: entry.description || '',
        date: new Date(entry.date).toISOString().split('T')[0],
      });
      setDisplayAmount(formatCurrencyInput(entry.amount));
    } else {
      setDisplayAmount('0,00');
    }
  }, [entry]);

  const formatCurrencyInput = (value: number): string => {
    if (value === 0) return '0,00';
    
    const cents = Math.round(value * 100);
    const reais = Math.floor(cents / 100);
    const centavos = cents % 100;
    
    const reaisFormatted = reais.toLocaleString('pt-BR');
    return `${reaisFormatted},${centavos.toString().padStart(2, '0')}`;
  };

  const handleCurrencyChange = (value: string) => {
    const currentNumeric = displayAmount.replace(/[^\d]/g, '');
    const inputNumeric = value.replace(/[^\d]/g, '');
    
    let finalNumeric = '';
    if (inputNumeric.length > currentNumeric.length) {
      const newDigit = inputNumeric[inputNumeric.length - 1];
      finalNumeric = currentNumeric + newDigit;
    } else if (inputNumeric.length < currentNumeric.length) {
      finalNumeric = currentNumeric.slice(0, -1);
    } else {
      finalNumeric = inputNumeric;
    }
    
    if (!finalNumeric) {
      setDisplayAmount('0,00');
      setFormData(prev => ({ ...prev, amount: 0 }));
      return;
    }
    
    const limitedValue = finalNumeric.slice(0, 10);
    const numericAmount = parseInt(limitedValue, 10) / 100;
    
    const formattedValue = formatCurrencyInput(numericAmount);
    setDisplayAmount(formattedValue);
    setFormData(prev => ({ ...prev, amount: numericAmount }));

    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleCurrencyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      setTimeout(() => {
        const target = e.target as HTMLInputElement;
        target.setSelectionRange(target.value.length, target.value.length);
      }, 0);
      return;
    }
    
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    const isNumber = /^[0-9]$/.test(e.key);
    
    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleCurrencyInput = (e: React.FormEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleCurrencyClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setTimeout(() => {
      const target = e.target as HTMLInputElement;
      target.setSelectionRange(target.value.length, target.value.length);
    }, 0);
  };

  const handleCurrencyFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.setSelectionRange(e.target.value.length, e.target.value.length);
    }, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da entrada é obrigatório';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const entryData: FinancialEntry = {
      id: entry?.id || generateId(),
      name: formData.name.trim(),
      amount: formData.amount,
      description: formData.description.trim() || undefined,
      date: new Date(formData.date),
      createdAt: entry?.createdAt || new Date(),
    };

    onSave(entryData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {entry ? 'Editar Entrada' : 'Nova Entrada'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome da Entrada *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Venda de equipamento antigo"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={displayAmount}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  onInput={handleCurrencyInput}
                  onKeyDown={handleCurrencyKeyDown}
                  onClick={handleCurrencyClick}
                  onFocus={handleCurrencyFocus}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                  inputMode="numeric"
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Descrição opcional da entrada"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                O valor só será contabilizado nas receitas a partir desta data
              </p>
            </div>
          </div>
        </div>
        
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
            className="flex-1 px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Save className="h-4 w-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
}