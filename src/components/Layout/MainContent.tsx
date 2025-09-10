import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface MainContentProps {
  title: string;
  children: React.ReactNode;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}

export function MainContent({ 
  title, 
  children, 
  showSearch = false, 
  searchPlaceholder = "Keyword Search",
  onSearch 
}: MainContentProps) {
  return (
    <div className="flex-1 bg-[#1a2332] overflow-hidden">
      {/* Content Header */}
      <div className="bg-[#2c3e50] border-b border-[#3a4a5c] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-white text-lg">📊</span>
              <h2 className="text-white text-lg font-semibold">{title}</h2>
            </div>
            <button className="p-2 rounded-lg hover:bg-[#34495e] transition-colors">
              <RotateCcw className="h-4 w-4 text-[#60a5fa]" />
            </button>
          </div>

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="bg-[#34495e] border border-[#4a5568] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent w-80"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}