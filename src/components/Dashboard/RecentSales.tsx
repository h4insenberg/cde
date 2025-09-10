import React from 'react';
import { Calendar, CreditCard, Package, Wrench, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, ShoppingCart, ClipboardList, HandCoins } from 'lucide-react';
import { Sale, Comanda, StockMovement, Loan, FinancialEntry, FinancialExit } from '../../types';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface ExtratoProps {
  sales: Sale[];
  comandas: Comanda[];
  stockMovements: StockMovement[];
  loans: Loan[];
  financialEntries: FinancialEntry[];
  financialExits: FinancialExit[];
}

type MovementType = 'sale' | 'comanda' | 'service' | 'loan' | 'financial_entry' | 'financial_exit';
type MovementCategory = 'entry' | 'exit';

interface Movement {
  id: string;
  type: MovementType;
  category: MovementCategory;
  description: string;
  amount?: number;
  quantity?: number;
  unit?: string;
  createdAt: Date;
  paymentMethod?: string;
  profit?: number;
}

export function RecentSales({ sales, comandas, stockMovements, loans, financialEntries, financialExits }: ExtratoProps) {
  const { state } = useBusiness();
  const { showValues } = state;
  const movements: Movement[] = [];

  // Add sales
  sales.forEach(sale => {
    sale.items.forEach(item => {
      movements.push({
        id: `sale-${sale.id}-${item.id}`,
        type: item.type === 'product' ? 'sale' : 'service',
        category: 'entry',
        description: `${item.name} (${item.quantity}x)`,
        amount: item.total,
        createdAt: new Date(sale.createdAt),
        paymentMethod: sale.paymentMethod,
        profit: item.profit,
      });
    });
  });

  // Add paid comandas
  comandas.filter(c => c.status === 'PAID').forEach(comanda => {
    comanda.items.forEach(item => {
      movements.push({
        id: `comanda-${comanda.id}-${item.id}`,
        type: 'comanda',
        category: 'entry',
        description: `${item.name} (${item.quantity}x) - ${comanda.customerName}`,
        amount: item.total,
        createdAt: new Date(comanda.paidAt || comanda.createdAt),
        paymentMethod: 'PIX', // Default for comandas
      });
    });
  });

  // Add paid loans
  loans.filter(l => l.status === 'PAID').forEach(loan => {
    movements.push({
      id: `loan-${loan.id}`,
      type: 'loan',
      category: 'entry',
      description: `Empréstimo de ${loan.customerName}`,
      amount: loan.totalAmount,
      createdAt: new Date(loan.paidAt || loan.createdAt),
      paymentMethod: 'PIX', // Default for loans
      profit: loan.totalAmount - loan.amount, // Interest as profit
    });
  });

  // Add financial entries
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  financialEntries.filter(entry => new Date(entry.date) <= today).forEach(entry => {
    movements.push({
      id: `entry-${entry.id}`,
      type: 'financial_entry',
      category: 'entry',
      description: entry.name,
      amount: entry.amount,
      createdAt: new Date(entry.date),
    });
  });

  // Add financial exits
  financialExits.filter(exit => new Date(exit.date) <= today).forEach(exit => {
    movements.push({
      id: `exit-${exit.id}`,
      type: 'financial_exit',
      category: 'exit',
      description: exit.name,
      amount: exit.amount,
      createdAt: new Date(exit.date),
    });
  });

  const allMovements = movements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'service':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'comanda':
        return <ClipboardList className="h-4 w-4 text-green-500" />;
      case 'loan':
        return <HandCoins className="h-4 w-4 text-green-500" />;
      case 'financial_entry':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'financial_exit':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMovementColor = (type: MovementType) => {
    switch (type) {
      case 'sale':
      case 'service':
      case 'loan':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (allMovements.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Extrato
          </h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Nenhuma movimentação registrada ainda
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-500" />
          Extrato
        </h3>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {allMovements.map((movement) => {
          const isEntry = movement.category === 'entry';
          const bgColor = isEntry 
            ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
            : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30';
          
          return (
            <div key={movement.id} className={`p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-sm ${bgColor} border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}>
              {/* Unified Layout - Works for both mobile and desktop */}
              <div className="space-y-3">
                {/* Header Row - Icon, Description and Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      {getMovementIcon(movement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight break-words">
                        {movement.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    {movement.amount !== undefined ? (
                      <p className={`text-sm sm:text-base font-bold ${getMovementColor(movement.type)} leading-tight`}>
                        {isEntry ? '+' : '-'}{showValues ? formatCurrency(movement.amount) : '••••'}
                      </p>
                    ) : (
                      <p className={`text-sm sm:text-base font-bold ${getMovementColor(movement.type)} leading-tight`}>
                        {isEntry ? '+' : '-'}{movement.quantity} {movement.unit || 'un'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Details Row - Date, Payment Method, and Profit */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(movement.createdAt)}
                    </p>
                    {movement.paymentMethod && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                        {getPaymentMethodLabel(movement.paymentMethod)}
                      </span>
                    )}
                  </div>
                  
                  {movement.profit !== undefined && showValues && isEntry && (
                    <div className="text-right">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium whitespace-nowrap">
                        Lucro: {formatCurrency(movement.profit)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}