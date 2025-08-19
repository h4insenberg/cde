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

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const { state, dispatch } = useBusiness();

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
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configurações
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Esta seção será implementada em versões futuras do sistema.
                </p>
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