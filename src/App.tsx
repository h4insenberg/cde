import React, { useState } from 'react';
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
import React, { useState, useEffect } from 'react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const { state, dispatch } = useBusiness();

  // Apply dark mode class to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

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
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Modo Escuro
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Alterna entre tema claro e escuro
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      state.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        state.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
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