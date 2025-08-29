import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Calendar, PieChart, Activity, Clock, Users, Target, Zap, Award } from 'lucide-react';
import { Sale, Product, Service, Comanda, Loan, FinancialEntry, FinancialExit } from '../../types';
import { formatCurrency, formatDateOnly, getPaymentMethodLabel } from '../../utils/helpers';
import { useBusiness } from '../../context/BusinessContext';

export function ReportsSection() {
  const { state } = useBusiness();
  const [period, setPeriod] = useState('30days');

  const getFilteredData = () => {
    const now = new Date();
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return {
      sales: state.sales.filter(sale => new Date(sale.createdAt) >= startDate),
      comandas: state.comandas.filter(comanda => 
        comanda.status === 'PAID' && comanda.paidAt && new Date(comanda.paidAt) >= startDate
      ),
      loans: state.loans.filter(loan => 
        loan.status === 'PAID' && loan.paidAt && new Date(loan.paidAt) >= startDate
      ),
      entries: state.financialEntries.filter(entry => new Date(entry.date) >= startDate),
      exits: state.financialExits.filter(exit => new Date(exit.date) >= startDate),
    };
  };

  const { sales, comandas, loans, entries, exits } = getFilteredData();

  // Métricas Gerais
  const getTotalRevenue = () => {
    const salesRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const comandasRevenue = comandas.reduce((sum, comanda) => sum + comanda.total, 0);
    const loansRevenue = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
    const entriesRevenue = entries.reduce((sum, entry) => sum + entry.amount, 0);
    return salesRevenue + comandasRevenue + loansRevenue + entriesRevenue;
  };

  const getTotalExpenses = () => {
    const salesExpenses = sales.reduce((sum, sale) => sum + (sale.total - sale.profit), 0);
    const exitsExpenses = exits.reduce((sum, exit) => sum + exit.amount, 0);
    return salesExpenses + exitsExpenses;
  };

  const getTotalProfit = () => {
    const salesProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const comandasProfit = comandas.reduce((sum, comanda) => {
      return sum + comanda.items.reduce((itemSum, item) => {
        if (item.type === 'product' && item.productId) {
          const product = state.products.find(p => p.id === item.productId);
          return itemSum + (product ? (item.unitPrice - product.costPrice) * item.quantity : item.total);
        }
        return itemSum + item.total;
      }, 0);
    }, 0);
    const loansProfit = loans.reduce((sum, loan) => sum + (loan.totalAmount - loan.amount), 0);
    const entriesProfit = entries.reduce((sum, entry) => sum + entry.amount, 0);
    return salesProfit + comandasProfit + loansProfit + entriesProfit;
  };

  // Produtos mais vendidos
  const getTopProducts = () => {
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    [...sales, ...comandas].forEach(transaction => {
      transaction.items.forEach(item => {
        if (item.type === 'product' && item.productId) {
          const current = productSales.get(item.productId) || { name: item.name, quantity: 0, revenue: 0 };
          productSales.set(item.productId, {
            name: item.name,
            quantity: current.quantity + item.quantity,
            revenue: current.revenue + item.total,
          });
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Serviços mais vendidos
  const getTopServices = () => {
    const serviceSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    [...sales, ...comandas].forEach(transaction => {
      transaction.items.forEach(item => {
        if (item.type === 'service' && item.serviceId) {
          const current = serviceSales.get(item.serviceId) || { name: item.name, quantity: 0, revenue: 0 };
          serviceSales.set(item.serviceId, {
            name: item.name,
            quantity: current.quantity + item.quantity,
            revenue: current.revenue + item.total,
          });
        }
      });
    });

    return Array.from(serviceSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Vendas por dia
  const getDailySales = () => {
    const dailySales = new Map<string, { date: string; sales: number; revenue: number }>();
    
    // Preenche os últimos 7 dias
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = formatDateOnly(date);
      last7Days.push(dateKey);
      dailySales.set(dateKey, { date: dateKey, sales: 0, revenue: 0 });
    }
    
    [...sales, ...comandas].forEach(transaction => {
      const dateKey = formatDateOnly(new Date('createdAt' in transaction ? transaction.createdAt : transaction.paidAt!));
      if (dailySales.has(dateKey)) {
        const current = dailySales.get(dateKey)!;
        dailySales.set(dateKey, {
          date: dateKey,
          sales: current.sales + 1,
          revenue: current.revenue + transaction.total,
        });
      }
    });

    return last7Days.map(date => dailySales.get(date)!);
  };

  // Estatísticas de formas de pagamento
  const getPaymentMethodStats = () => {
    const stats = new Map<string, { count: number; revenue: number }>();
    
    sales.forEach(sale => {
      const current = stats.get(sale.paymentMethod) || { count: 0, revenue: 0 };
      stats.set(sale.paymentMethod, {
        count: current.count + 1,
        revenue: current.revenue + sale.total,
      });
    });

    // Comandas sempre são PIX
    if (comandas.length > 0) {
      const current = stats.get('PIX') || { count: 0, revenue: 0 };
      stats.set('PIX', {
        count: current.count + comandas.length,
        revenue: current.revenue + comandas.reduce((sum, c) => sum + c.total, 0),
      });
    }

    const totalTransactions = sales.length + comandas.length;
    
    return Array.from(stats.entries()).map(([method, data]) => ({
      method,
      ...data,
      percentage: totalTransactions > 0 ? ((data.count / totalTransactions) * 100).toFixed(1) : '0',
    }));
  };

  // Horários de maior movimento
  const getHourlyStats = () => {
    const hourlyStats = new Map<number, number>();
    
    for (let i = 0; i < 24; i++) {
      hourlyStats.set(i, 0);
    }
    
    [...sales, ...comandas].forEach(transaction => {
      const hour = new Date('createdAt' in transaction ? transaction.createdAt : transaction.paidAt!).getHours();
      hourlyStats.set(hour, (hourlyStats.get(hour) || 0) + 1);
    });

    return Array.from(hourlyStats.entries())
      .map(([hour, sales]) => ({ hour, sales }))
      .filter(item => item.sales > 0)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6);
  };

  // Análise de estoque
  const getStockAnalysis = () => {
    const lowStock = state.products.filter(p => p.quantity <= p.minQuantity);
    const outOfStock = state.products.filter(p => p.quantity === 0);
    const totalValue = state.products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
    const totalSaleValue = state.products.reduce((sum, p) => sum + (p.quantity * p.salePrice), 0);
    
    return {
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      totalProducts: state.products.length,
      totalValue,
      totalSaleValue,
      potentialProfit: totalSaleValue - totalValue,
    };
  };

  // Análise de empréstimos
  const getLoansAnalysis = () => {
    const activeLoans = state.loans.filter(l => l.status === 'ACTIVE');
    const paidLoans = state.loans.filter(l => l.status === 'PAID');
    const overdueLoans = state.loans.filter(l => l.status === 'OVERDUE');
    
    const totalLent = state.loans.reduce((sum, l) => sum + l.amount, 0);
    const totalToReceive = activeLoans.reduce((sum, l) => sum + l.totalAmount, 0);
    const totalReceived = paidLoans.reduce((sum, l) => sum + l.totalAmount, 0);
    const totalOverdue = overdueLoans.reduce((sum, l) => sum + l.totalAmount, 0);
    
    return {
      active: activeLoans.length,
      paid: paidLoans.length,
      overdue: overdueLoans.length,
      totalLent,
      totalToReceive,
      totalReceived,
      totalOverdue,
    };
  };

  const topProducts = getTopProducts();
  const topServices = getTopServices();
  const dailySales = getDailySales();
  const paymentStats = getPaymentMethodStats();
  const hourlyStats = getHourlyStats();
  const stockAnalysis = getStockAnalysis();
  const loansAnalysis = getLoansAnalysis();
  
  const totalRevenue = getTotalRevenue();
  const totalExpenses = getTotalExpenses();
  const totalProfit = getTotalProfit();
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';
  const averageTicket = (sales.length + comandas.length) > 0 ? (totalRevenue / (sales.length + comandas.length)) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Análises detalhadas do seu negócio
          </p>
        </div>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="90days">Últimos 90 dias</option>
        </select>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs md:text-sm font-medium">Receita Total</p>
              <p className="text-lg md:text-2xl font-bold">{state.showValues ? formatCurrency(totalRevenue) : '••••'}</p>
            </div>
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-xs md:text-sm font-medium">Despesas</p>
              <p className="text-lg md:text-2xl font-bold">{state.showValues ? formatCurrency(totalExpenses) : '••••'}</p>
            </div>
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-red-200 rotate-180" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs md:text-sm font-medium">Lucro Líquido</p>
              <p className="text-lg md:text-2xl font-bold">{state.showValues ? formatCurrency(totalProfit) : '••••'}</p>
            </div>
            <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-3 md:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs md:text-sm font-medium">Margem de Lucro</p>
              <p className="text-lg md:text-2xl font-bold">{profitMargin}%</p>
            </div>
            <Target className="h-6 w-6 md:h-8 md:w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Métricas de Vendas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Total de Vendas</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{sales.length + comandas.length}</p>
            </div>
            <Calendar className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Ticket Médio</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {state.showValues ? formatCurrency(averageTicket) : '••••'}
              </p>
            </div>
            <Activity className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Comandas Abertas</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {state.comandas.filter(c => c.status === 'OPEN').length}
              </p>
            </div>
            <Users className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#18191c] rounded-xl p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">Empréstimos Ativos</p>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {state.loans.filter(l => l.status === 'ACTIVE').length}
              </p>
            </div>
            <Zap className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
          </div>
        </div>
      </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            Produtos Mais Vendidos
          </h4>
          
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600 dark:text-green-400 text-sm">
                    {state.showValues ? formatCurrency(product.revenue) : '••••'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhum produto vendido no período
            </p>
          )}
        </div>

        {/* Serviços Mais Vendidos */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-purple-500" />
            Serviços Mais Vendidos
          </h4>
          
          {topServices.length > 0 ? (
            <div className="space-y-3">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {service.quantity} serviços prestados
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm">
                    {state.showValues ? formatCurrency(service.revenue) : '••••'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhum serviço vendido no período
            </p>
          )}
        </div>
      </div>

      {/* Análises Específicas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Análise de Estoque */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-orange-500" />
            Análise de Estoque
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">Estoque Baixo</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{stockAnalysis.lowStock}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Sem Estoque</p>
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{stockAnalysis.outOfStock}</p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Valor Investido</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {state.showValues ? formatCurrency(stockAnalysis.totalValue) : '••••'}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Lucro Potencial</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                {state.showValues ? formatCurrency(stockAnalysis.potentialProfit) : '••••'}
              </p>
            </div>
          </div>
        </div>

        {/* Análise de Empréstimos */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            Análise de Empréstimos
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Ativos</p>
              <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{loansAnalysis.active}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                {state.showValues ? formatCurrency(loansAnalysis.totalToReceive) : '••••'}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Pagos</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{loansAnalysis.paid}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {state.showValues ? formatCurrency(loansAnalysis.totalReceived) : '••••'}
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">Vencidos</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{loansAnalysis.overdue}</p>
              <p className="text-xs text-red-600 dark:text-red-400">
                {state.showValues ? formatCurrency(loansAnalysis.totalOverdue) : '••••'}
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Emprestado</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {state.showValues ? formatCurrency(loansAnalysis.totalLent) : '••••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Entradas e Saídas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Entradas Financeiras
          </h4>
          
          {entries.length > 0 ? (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total de Entradas</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {state.showValues ? formatCurrency(entries.reduce((sum, e) => sum + e.amount, 0)) : '••••'}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {entries.length} entrada{entries.length !== 1 ? 's' : ''} registrada{entries.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {entries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-900 dark:text-white truncate">{entry.name}</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      +{state.showValues ? formatCurrency(entry.amount) : '••••'}
                    </span>
                  </div>
                ))}
                {entries.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{entries.length - 3} mais entrada{entries.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhuma entrada no período
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-500 rotate-180" />
            Saídas Financeiras
          </h4>
          
          {exits.length > 0 ? (
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">Total de Saídas</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-300">
                  {state.showValues ? formatCurrency(exits.reduce((sum, e) => sum + e.amount, 0)) : '••••'}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {exits.length} saída{exits.length !== 1 ? 's' : ''} registrada{exits.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {exits.slice(0, 3).map((exit) => (
                  <div key={exit.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-900 dark:text-white truncate">{exit.name}</span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      -{state.showValues ? formatCurrency(exit.amount) : '••••'}
                    </span>
                  </div>
                ))}
                {exits.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    +{exits.length - 3} mais saída{exits.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhuma saída no período
            </p>
          )}
        </div>
      </div>
    </div>
  );
}