import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isCurrency?: boolean;
  subtitle?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isCurrency = true, 
  subtitle 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    green: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    red: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
  };

  const iconBgClasses = {
    blue: 'bg-blue-400/20',
    green: 'bg-green-400/20',
    red: 'bg-red-400/20',
    yellow: 'bg-yellow-400/20',
    purple: 'bg-purple-400/20',
  };

  return (
    <div className={`rounded-xl p-4 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {isCurrency ? formatCurrency(value) : value}
          </p>
          {subtitle && (
            <p className="text-white/70 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}