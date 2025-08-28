import React from 'react';
import { Calendar, CreditCard, Package, Wrench, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Sale, Comanda, StockMovement } from '../../types';
import { formatCurrency, formatDate, getPaymentMethodLabel } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

interface ExtratoProps {
  sales: Sale[];
  comandas: Comanda[];
  stockMovements: StockMovement[];
}

type MovementType = 'sale' | 'comanda' | 'stock_in' | 'stock_out' | 'service';
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

export function RecentSales({ sales, comandas, stockMovements }: ExtratoProps) {
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
        type: item.type === 'product' ? 'sale' : 'service',
        category: 'entry',
        description: `${item.name} (${item.quantity}x) - ${comanda.customerName}`,
        amount: item.total,
        createdAt: new Date(comanda.paidAt || comanda.createdAt),
        paymentMethod: 'PIX', // Default for comandas
      });
    });
  });

  // Add stock movements
  stockMovements.forEach(movement => {
    movements.push({
      id: `stock-${movement.id}`,
      type: movement.type === 'IN' ? 'stock_in' : 'stock_out',
      category: movement.type === 'IN' ? 'entry' : 'exit',
      description: `${movement.productName} (${movement.quantity}x)`,
      quantity: movement.quantity,
      createdAt: new Date(movement.createdAt),
    });
  });

  const allMovements = movements
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  const entries = allMovements.filter(m => m.category === 'entry').slice(0, 6);
  const exits = allMovements.filter(m => m.category === 'exit').slice(0, 6);

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case 'sale':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'service':
        return <Wrench className="h-4 w-4 text-purple-500" />;
      case 'stock_in':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'stock_out':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMovementColor = (type: MovementType) => {
    switch (type) {
      case 'sale':
      case 'service':
        return 'text-green-600 dark:text-green-400';
      case 'stock_in':
        return 'text-blue-600 dark:text-blue-400';
      case 'stock_out':
        return 'text-red-600 dark:text-red-400';
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Entradas ({entries.length})
            </h4>
          </div>
          
          {entries.length > 0 ? (
            <div className="space-y-2">
              {entries.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(movement.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {movement.description}
                      </span>
                      {movement.paymentMethod && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          {getPaymentMethodLabel(movement.paymentMethod)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(movement.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {movement.amount !== undefined ? (
                      <div>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          +{showValues ? formatCurrency(movement.amount) : '••••'}
                        </p>
                        {movement.profit !== undefined && showValues && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Lucro: {formatCurrency(movement.profit)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        +{movement.quantity} {movement.unit || 'un'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
              Nenhuma entrada registrada
            </p>
          )}
        </div>

        {/* Saídas */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Saídas ({exits.length})
            </h4>
          </div>
          
          {exits.length > 0 ? (
            <div className="space-y-2">
              {exits.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(movement.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {movement.description}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(movement.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{movement.quantity} {movement.unit || 'un'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
              Nenhuma saída registrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}