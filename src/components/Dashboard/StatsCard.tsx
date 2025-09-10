import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isCurrency?: boolean;
  showValue?: boolean;
  subtitle?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isCurrency = true, 
  showValue = true,
  subtitle 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700',
    green: 'bg-gradient-to-br from-green-500 to-green-600 text-white dark:from-green-600 dark:to-green-700',
    red: 'bg-gradient-to-br from-red-500 to-red-600 text-white dark:from-red-600 dark:to-red-700',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white dark:from-yellow-600 dark:to-yellow-700',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white dark:from-purple-600 dark:to-purple-700',
  };

  const iconBgClasses = {
    blue: 'bg-blue-400/20',
    green: 'bg-green-400/20',
    red: 'bg-red-400/20',
    yellow: 'bg-yellow-400/20',
    purple: 'bg-purple-400/20',
  };

  const displayValue = showValue 
    ? (isCurrency ? formatCurrency(value) : `${value.toFixed(1)}%`)
    : '••••';
  return (
    <div className={`rounded-xl p-3 md:p-4 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-xs md:text-sm font-medium">{title}</p>
          <p className="text-lg md:text-2xl font-bold mt-1">
            {displayValue}
          </p>
        </div>
        <div className={`p-2 md:p-3 rounded-lg ${iconBgClasses[color]} flex-shrink-0`}>
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
      </div>
    </div>
  );
}