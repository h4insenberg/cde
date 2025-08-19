import React, { useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Calendar } from 'lucide-react';
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
    
    filteredSales.forEach(sale => {
      const dateKey = formatDateOnly(new Date(sale.createdAt));
      const current = dailySales.get(dateKey) || { date: dateKey, sales: 0, revenue: 0 };
      dailySales.set(dateKey, {
        date: dateKey,
        sales: current.sales + 1,
        revenue: current.revenue + sale.total,
      });
    });

    return Array.from(dailySales.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
  };

  const topProducts = getTopProducts();
  const topServices = getTopServices();
  const dailySales = getDailySales();
  const totalRevenue = getTotalRevenue();
  const totalProfit = getTotalProfit();
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Relatórios
          </h3>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Vendas</p>
              <p className="text-2xl font-bold">{filteredSales.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Receita Total</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Margem de Lucro</p>
              <p className="text-2xl font-bold">{profitMargin}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
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
                      <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.quantity} serviços prestados
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-purple-600 dark:text-purple-400">
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

      {/* Daily Sales Chart */}
      {dailySales.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Vendas Diárias
          </h4>
          
          <div className="space-y-3">
            {dailySales.map((day) => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{day.date}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {day.sales} venda{day.sales !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(day.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}