import React, { useState, useEffect } from 'react';
import { BusinessProvider } from './context/BusinessContext';
import { Header } from './components/Layout/Header';
import { BottomNavigation } from './components/Layout/BottomNavigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProductsSection } from './components/Products/ProductsSection';
import { SalesSection } from './components/Sales/SalesSection';
import { ReportsSection } from './components/Reports/ReportsSection';
import { NotificationModal } from './components/Notifications/NotificationModal';
import { SaleForm } from './components/Sales/SaleForm';
import { useBusiness } from './context/BusinessContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const { state, dispatch } = useBusiness();

  // Apply theme mode class to document
  useEffect(() => {
    const applyTheme = () => {
      const isDark = state.themeMode === 'dark' || 
        (state.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes when in system mode
    if (state.themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [state.themeMode]);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'products':
        return 'Produtos & Serviços';
      case 'sales':
        return 'Vendas';
      case 'reports':
        return 'Relatórios';
      case 'settings':
        return 'Configurações';
      default:
        return 'BizManager';
    }
  };

  const handleQuickSale = (sale: any) => {
    // Same logic as in SalesSection
    dispatch({ type: 'ADD_SALE', payload: sale });

    sale.items.forEach((item: any) => {
      if (item.type === 'product' && item.productId) {
        const product = state.products.find(p => p.id === item.productId);
        if (product) {
          const updatedProduct = {
            ...product,
            quantity: product.quantity - item.quantity,
            updatedAt: new Date(),
          };
          dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
        }
      }
    });

    setShowQuickSale(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNewSale={() => setShowQuickSale(true)} />;
      case 'products':
        return <ProductsSection />;
      case 'sales':
        return <SalesSection />;
      case 'reports':
        return <ReportsSection sales={state.sales} products={state.products} />;
      case 'settings':
        return (
          <div className="space-y-6 pb-20">
            <div className="bg-white dark:bg-[#18191c] rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Configurações
                </h3>
                
                {/* Theme Mode Selection */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Tema da Aplicação
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Escolha entre tema claro, escuro ou seguir o sistema
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {[
                      { value: 'system', label: 'Sistema', description: 'Segue a preferência do sistema' },
                      { value: 'light', label: 'Claro', description: 'Sempre tema claro' },
                      { value: 'dark', label: 'Escuro', description: 'Sempre tema escuro' }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <input
                          type="radio"
                          name="themeMode"
                          value={option.value}
                          checked={state.themeMode === option.value}
                          onChange={(e) => dispatch({ type: 'SET_THEME_MODE', payload: e.target.value as ThemeMode })}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Future Settings Placeholder */}
                <div className="text-center py-8 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400">
                    Mais configurações serão adicionadas em versões futuras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onNewSale={() => setShowQuickSale(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#131416]">
      <Header
        title={getPageTitle()}
        onNotificationsClick={() => setShowNotifications(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {showQuickSale && (
        <SaleForm
          products={state.products}
          services={state.services}
          onSave={handleQuickSale}
          onCancel={() => setShowQuickSale(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BusinessProvider>
      <AppContent />
    </BusinessProvider>
  );
}

export default App;