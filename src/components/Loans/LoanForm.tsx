import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, User, DollarSign } from 'lucide-react';
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
    amount: 0,
    interestRate: 0,
    dueDate: '',
    description: '',
  });

  const [displayAmount, setDisplayAmount] = useState('0,00');
  const [displayInterestRate, setDisplayInterestRate] = useState('0,00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (loan) {
      setFormData({
        customerName: loan.customerName,
        amount: loan.amount,
        interestRate: loan.interestRate,
        dueDate: new Date(loan.dueDate).toISOString().split('T')[0],
        description: loan.description || '',
      });
      setDisplayAmount(formatCurrencyInput(loan.amount));
      setDisplayInterestRate(formatPercentageInput(loan.interestRate));
    } else {
      // Set default due date to 30 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
      setDisplayAmount('0,00');
      setDisplayInterestRate('0,00');
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

  const formatPercentageInput = (value: number): string => {
    if (value === 0) return '0,00';
    
    const cents = Math.round(value * 100);
    const integerPart = Math.floor(cents / 100);
    const decimalPart = cents % 100;
    
    const integerFormatted = integerPart.toLocaleString('pt-BR');
    return `${integerFormatted},${decimalPart.toString().padStart(2, '0')}`;
  };

  const calculateTotalAmount = () => {
    return formData.amount * (1 + formData.interestRate / 100);
  };

  const calculateInterestAmount = () => {
    return formData.amount * (formData.interestRate / 100);
  };

  const handleCurrencyChange = (value: string) => {
    // Pega o valor atual sem formatação
    const currentNumeric = displayAmount.replace(/[^\d]/g, '');
    
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
      setDisplayAmount('0,00');
      setFormData(prev => ({ ...prev, amount: 0 }));
      return;
    }
    
    // Limita a 10 dígitos (máximo R$ 99.999.999,99)
    const limitedValue = finalNumeric.slice(0, 10);
    const numericAmount = parseInt(limitedValue, 10) / 100;
    
    // Formata o valor
    const formattedValue = formatCurrencyInput(numericAmount);
    
    // Atualiza o display
    setDisplayAmount(formattedValue);
    
    // Atualiza o valor numérico no formData
    setFormData(prev => ({
      ...prev,
      amount: numericAmount
    }));

    // Clear error when user starts typing
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handlePercentageChange = (value: string) => {
    // Pega o valor atual sem formatação
    const currentNumeric = displayInterestRate.replace(/[^\d]/g, '');
    
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
      setDisplayInterestRate('0,00');
      setFormData(prev => ({ ...prev, interestRate: 0 }));
      return;
    }
    
    // Limita a 6 dígitos (máximo 9999,99%)
    const limitedValue = finalNumeric.slice(0, 6);
    const numericRate = parseInt(limitedValue, 10) / 100;
    
    // Formata o valor
    const formattedValue = formatPercentageInput(numericRate);
    
    // Atualiza o display
    setDisplayInterestRate(formattedValue);
    
    // Atualiza o valor numérico no formData
    setFormData(prev => ({
      ...prev,
      interestRate: numericRate
    }));

    // Clear error when user starts typing
    if (errors.interestRate) {
      setErrors(prev => ({ ...prev, interestRate: '' }));
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

  const handlePercentageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handlePercentageInput = (e: React.FormEvent<HTMLInputElement>) => {
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

  const handlePercentageClick = (e: React.MouseEvent<HTMLInputElement>) => {
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

  const handlePercentageFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Move o cursor para o final sempre
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

    if (formData.interestRate < 0) {
      newErrors.interestRate = 'Taxa de juros deve ser positiva';
    }

    if (formData.interestRate > 100) {
      newErrors.interestRate = 'Taxa de juros não pode ser maior que 100%';
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
      amount: formData.amount,
      interestRate: formData.interestRate,
      totalAmount: calculateTotalAmount(),
      status: 'ACTIVE',
      dueDate: new Date(formData.dueDate),
      description: formData.description.trim() || undefined,
      createdAt: loan?.createdAt || new Date(),
    };

    onSave(loanData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-4xl max-h-[98vh] overflow-hidden flex flex-col">
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

        <div className="p-3 sm:p-6 overflow-y-auto flex-1 min-h-0">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do Cliente *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome do cliente"
                />
              </div>
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do Empréstimo *
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
                Taxa de Juros (%) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={displayInterestRate}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  onInput={handlePercentageInput}
                  onKeyDown={handlePercentageKeyDown}
                  onClick={handlePercentageClick}
                  onFocus={handlePercentageFocus}
                  className={`w-full pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.interestRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0,00"
                  inputMode="numeric"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 font-medium pointer-events-none">
                  %
                </div>
              </div>
              {errors.interestRate && (
                <p className="text-red-500 text-sm mt-1">{errors.interestRate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Vencimento *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.dueDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Observações sobre o empréstimo (opcional)"
              />
            </div>

            {/* Calculation Summary */}
            {formData.amount > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  Resumo do Empréstimo
                </h4>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Valor emprestado:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(formData.amount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Taxa de juros ({formData.interestRate}%):</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      +{formatCurrency(calculateInterestAmount())}
                    </span>
                  </div>
                  
                  <hr className="my-2 border-blue-200 dark:border-blue-700" />
                  
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">Valor total a receber:</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">
                      {formatCurrency(calculateTotalAmount())}
                    </span>
                  </div>
                </div>
              </div>
            )}
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