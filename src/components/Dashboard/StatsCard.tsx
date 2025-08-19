import React from 'react';
import { DivideIcon as LucideIcon, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isCurrency?: boolean;
  isPercentage?: boolean;
  subtitle?: string;
  description?: string;
  onInfoClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isCurrency = true, 
  isPercentage = false,
  subtitle,
  description,
  onInfoClick
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

  const formatValue = () => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    return isCurrency ? formatCurrency(value) : value;
  };

  return (
    <div className={`rounded-xl p-3 md:p-4 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-white/80 text-xs md:text-sm font-medium">{title}</p>
        <div className="flex items-center space-x-2">
          {onInfoClick && (
            <button
              onClick={onInfoClick}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Info className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          )}
          <div className={`p-2 md:p-3 rounded-lg ${iconBgClasses[color]}`}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg md:text-2xl font-bold mt-1">
            {formatValue()}
          </p>
          {subtitle && (
            <p className="text-white/70 text-xs mt-1 hidden md:block">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}