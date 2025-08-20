import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Calendar, PieChart, Activity } from 'lucide-react';
import { Sale, Product } from '../../types';
import { formatCurrency, formatDateOnly } from '../../utils/helpers';

interface ReportsSectionProps {
  sales: Sale[];
  products: Product[];
}

export function ReportsSection({ sales, products }: ReportsSectionProps) {
  const [period, setPeriod] = useState('7days');

  const getFilteredSales = () => {
    const now = new Date();
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return sales.filter(sale => new Date(sale.createdAt) >= startDate);
  };

  const filteredSales = getFilteredSales();

  const getTotalRevenue = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTotalProfit = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
  };

  const getTopProducts = () => {
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
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

  const getTopServices = () => {
    const serviceSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
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

  const getDailySales = () => {
    const dailySales = new Map<string, { date: string; sales: number; revenue: number }>();
    
    // Preenche os últimos 7 dias mesmo sem vendas
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = formatDateOnly(date);
      last7Days.push(dateKey);
      dailySales.set(dateKey, { date: dateKey, sales: 0, revenue: 0 });
    }
    
    filteredSales.forEach(sale => {
      const dateKey = formatDateOnly(new Date(sale.createdAt));
      if (dailySales.has(dateKey)) {
        const current = dailySales.get(dateKey)!;
        dailySales.set(dateKey, {
          date: dateKey,
          sales: current.sales + 1,
          revenue: current.revenue + sale.total,
        });
      }
    });

    return last7Days.map(date => dailySales.get(date)!);
  };

  const getPaymentMethodStats = () => {
    const stats = new Map<string, { count: number; revenue: number }>();
    
    filteredSales.forEach(sale => {
      const current = stats.get(sale.paymentMethod) || { count: 0, revenue: 0 };
      stats.set(sale.paymentMethod, {
        count: current.count + 1,
        revenue: current.revenue + sale.total,
      });
    });

    return Array.from(stats.entries()).map(([method, data]) => ({
      method,
      ...data,
      percentage: filteredSales.length > 0 ? ((data.count / filteredSales.length) * 100).toFixed(1) : '0',
    }));
  };

  const getHourlyStats = () => {
    const hourlyStats = new Map<number, number>();
    
    // Inicializa todas as horas
    for (let i = 0; i < 24; i++) {
      hourlyStats.set(i, 0);
    }
    
    filteredSales.forEach(sale => {
      const hour = new Date(sale.createdAt).getHours();
      hourlyStats.set(hour, (hourlyStats.get(hour) || 0) + 1);
    });

    return Array.from(hourlyStats.entries())
      .map(([hour, sales]) => ({ hour, sales }))
      .filter(item => item.sales > 0)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6);
  };

  const topProducts = getTopProducts();
  const topServices = getTopServices();
  const dailySales = getDailySales();
  const paymentStats = getPaymentMethodStats();
  const hourlyStats = getHourlyStats();
  const totalRevenue = getTotalRevenue();
  const totalProfit = getTotalProfit();
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';
  const averageTicket = filteredSales.length > 0 ? (totalRevenue / filteredSales.length) : 0;

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="bg-white dark:bg-[#18191c] rounded-xl p-4 shadow-sm border-2 border-blue-200 dark:border-blue-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Relatórios
          </h3>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border-2 border-blue-200 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Vendas</p>
              <p className="text-xl md:text-2xl font-bold">{filteredSales.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Receita Total</p>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Ticket Médio</p>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(averageTicket)}</p>
            </div>
            <Activity className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Lucro Total</p>
              <p className="text-xl md:text-2xl font-bold">{formatCurrency(totalProfit)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-600">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Vendas dos Últimos 7 Dias
          </h4>
          
          <div className="space-y-3">
            {dailySales.map((day, index) => {
              const maxRevenue = Math.max(...dailySales.map(d => d.revenue));
              const widthPercentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={day.date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{day.date}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {day.sales} venda{day.sales !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${widthPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(day.revenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-600">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-green-500" />
            Formas de Pagamento
          </h4>
          
          {paymentStats.length > 0 ? (
            <div className="space-y-4">
              {paymentStats.map((stat) => (
                <div key={stat.method} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stat.method === 'PIX' ? 'PIX' : stat.method === 'CARD' ? 'Cartão' : 'Fiado'}
                    </span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {stat.percentage}%
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(stat.revenue)}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        stat.method === 'PIX' ? 'bg-green-500' : 
                        stat.method === 'CARD' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhuma venda no período
            </p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-600">
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
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(product.revenue)}
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

        {/* Top Services */}
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-600">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Serviços Mais Vendidos
          </h4>
          
          {topServices.length > 0 ? (
            <div className="space-y-3">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.quantity} serviços prestados
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(service.revenue)}
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

      {/* Hourly Stats */}
      {hourlyStats.length > 0 && (
        <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-600">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-orange-500" />
            Horários de Maior Movimento
          </h4>
          
          <div className="space-y-3">
            {hourlyStats.map((stat) => (
              <div key={stat.hour} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stat.hour.toString().padStart(2, '0')}:00 - {(stat.hour + 1).toString().padStart(2, '0')}:00
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.sales} venda{stat.sales !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-full max-w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mx-4">
                  <div 
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(stat.sales / Math.max(...hourlyStats.map(h => h.sales))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}