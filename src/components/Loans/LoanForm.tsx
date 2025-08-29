import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, User, Phone, FileText } from 'lucide-react';
import { Loan } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface LoanFormProps {
  loan?: Loan | null;
  onSave: (loan: Loan) => void;
  onCancel: () => void;
}

export function LoanForm({ loan, onSave, onCancel }: LoanFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    amount: 0,
    description: '',
    dueDate: '',
    notes: '',
  });

  const [displayAmount, setDisplayAmount] = useState('0,00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loan) {
      setFormData({
        customerName: loan.customerName,
        customerPhone: loan.customerPhone || '',
        amount: loan.amount,
        description: loan.description,
        dueDate: new Date(loan.dueDate).toISOString().split('T')[0],
        notes: loan.notes || '',
      });
      setDisplayAmount(formatCurrencyInput(loan.amount));
    } else {
      // Set default due date to 30 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
      setDisplayAmount('0,00');
    }
  }, [loan]);

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

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Nome do cliente é obrigatório';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Data de vencimento deve ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const loanData: Loan = {
      id: loan?.id || generateId(),
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim() || undefined,
      amount: formData.amount,
      description: formData.description.trim(),
      status: loan?.status || 'ACTIVE',
      dueDate: new Date(formData.dueDate),
      createdAt: loan?.createdAt || new Date(),
      paidAt: loan?.paidAt,
      notes: formData.notes.trim() || undefined,
    };

    onSave(loanData);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-24">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-lg max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {loan ? 'Editar Empréstimo' : 'Novo Empréstimo'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nome do Cliente *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nome completo do cliente"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Telefone (opcional)
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Empréstimo *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium pointer-events-none">
                  R$
                </div>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  onInput={handleCurrencyInput}
                  onKeyDown={handleCurrencyKeyDown}
                  onClick={handleCurrencyClick}
                  onFocus={handleCurrencyFocus}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
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
                <FileText className="h-4 w-4 inline mr-1" />
                Descrição *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Empréstimo para compra de material"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Data de Vencimento *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações (opcional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Observações adicionais sobre o empréstimo"
              />
            </div>
          </form>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18191c]">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loan ? 'Atualizar' : 'Registrar'} Empréstimo</span>
          </button>
        </div>
      </div>
    </div>
  );
}