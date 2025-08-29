import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { BusinessProvider } from './context/BusinessContext';
import { Header } from './components/Layout/Header';
import { BottomNavigation } from './components/Layout/BottomNavigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProductsSection } from './components/Products/ProductsSection';
import { ServicesSection } from './components/Services/ServicesSection';
import { EntriesSection } from './components/Entries/EntriesSection';
import { ExitsSection } from './components/Exits/ExitsSection';
import { SalesSection } from './components/Sales/SalesSection';
import { ComandaSection } from './components/Comanda/ComandaSection';
import { LoansSection } from './components/Loans/LoansSection';
import { NotificationModal } from './components/Notifications/NotificationModal';
import { SaleForm } from './components/Sales/SaleForm';
import { MenuModal } from './components/Layout/MenuModal';
import { useBusiness } from './context/BusinessContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const { state, dispatch } = useBusiness();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'products':
        return 'Produtos';
      case 'services':
        return 'Serviços';
      case 'entries':
        return 'Entradas';
      case 'exits':
        return 'Saídas';
      case 'sales':
        return 'Vendas';
      case 'comanda':
        return 'Comandas';
      case 'loans':
        return 'Empréstimos';
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
      case 'services':
        return <ServicesSection />;
      case 'entries':
        return <EntriesSection />;
      case 'exits':
        return <ExitsSection />;
      case 'sales':
        return <SalesSection />;
      case 'comanda':
        return <ComandaSection />;
      case 'loans':
        return <LoansSection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return (
          <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Gerencie as informações do seu negócio
                </p>
              </div>
            </div>

            {/* Dados do Negócio */}
            <div className="bg-white dark:bg-[#18191c] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                Dados do Negócio
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedSettings = {
                  name: formData.get('name') as string,
                  companyName: formData.get('companyName') as string,
                  document: formData.get('document') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  address: formData.get('address') as string,
                };
                dispatch({ type: 'UPDATE_USER_SETTINGS', payload: updatedSettings });
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Usuário
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={state.userSettings.name}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      defaultValue={state.userSettings.companyName}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CNPJ/CPF
                    </label>
                    <input
                      type="text"
                      name="document"
                      defaultValue={state.userSettings.document}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={state.userSettings.phone}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={state.userSettings.email}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="address"
                      defaultValue={state.userSettings.address}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Salvar Dados
                  </button>
                </div>
              </form>
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {renderContent()}
      </main>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuClick={() => setShowMenuModal(true)}
      />

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <MenuModal
        isOpen={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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