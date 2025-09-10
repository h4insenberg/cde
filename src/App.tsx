import React, { useState } from 'react';
import { Database, Menu, X } from 'lucide-react';
import { BusinessProvider } from './context/BusinessContext';
import { Sidebar } from './components/Layout/Sidebar';
import { TopHeader } from './components/Layout/TopHeader';
import { MainContent } from './components/Layout/MainContent';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProductsSection } from './components/Products/ProductsSection';
import { ServicesSection } from './components/Services/ServicesSection';
import { EntriesSection } from './components/Entries/EntriesSection';
import { ExitsSection } from './components/Exits/ExitsSection';
import { SalesSection } from './components/Sales/SalesSection';
import { ComandaSection } from './components/Comanda/ComandaSection';
import { LoansSection } from './components/Loans/LoansSection';
import { ReportsSection } from './components/Reports/ReportsSection';
import { NotificationModal } from './components/Notifications/NotificationModal';
import { SaleForm } from './components/Sales/SaleForm';
import { MenuModal } from './components/Layout/MenuModal';
import { useBusiness } from './context/BusinessContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, dispatch } = useBusiness();

  // Apply dark mode to HTML element
  React.useEffect(() => {
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
      case 'reports':
        return 'Relatórios';
      case 'settings':
        return 'Configurações';
      default:
        return 'Dashboard';
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

  const handleNewSaleFromSalesPage = () => {
    setShowQuickSale(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MainContent title="Dashboard">
            <Dashboard onNewSale={() => setShowQuickSale(true)} />
          </MainContent>
        );
      case 'products':
        return (
          <MainContent title="Produtos" showSearch searchPlaceholder="Buscar produtos...">
            <ProductsSection />
          </MainContent>
        );
      case 'services':
        return (
          <MainContent title="Serviços" showSearch searchPlaceholder="Buscar serviços...">
            <ServicesSection />
          </MainContent>
        );
      case 'entries':
        return (
          <MainContent title="Entradas" showSearch searchPlaceholder="Buscar entradas...">
            <EntriesSection />
          </MainContent>
        );
      case 'exits':
        return (
          <MainContent title="Saídas" showSearch searchPlaceholder="Buscar saídas...">
            <ExitsSection />
          </MainContent>
        );
      case 'sales':
        return (
          <MainContent title="Vendas">
            <SalesSection onNewSale={handleNewSaleFromSalesPage} />
          </MainContent>
        );
      case 'comanda':
        return (
          <MainContent title="Comandas">
            <ComandaSection />
          </MainContent>
        );
      case 'loans':
        return (
          <MainContent title="Empréstimos">
            <LoansSection />
          </MainContent>
        );
      case 'reports':
        return (
          <MainContent title="Relatórios">
            <ReportsSection />
          </MainContent>
        );
      case 'settings':
        return (
          <MainContent title="Configurações">
            <div className="max-w-4xl space-y-6">
              {/* Dados do Negócio */}
              <div className="bg-[#2c3e50] rounded-xl p-6 shadow-sm border border-[#3a4a5c]">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-[#4ade80]" />
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome do Usuário
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={state.userSettings.name}
                        className="w-full px-3 py-2 border border-[#4a5568] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ade80] bg-[#34495e] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        defaultValue={state.userSettings.companyName}
                        className="w-full px-3 py-2 border border-[#4a5568] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ade80] bg-[#34495e] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CNPJ/CPF
                      </label>
                      <input
                        type="text"
                        name="document"
                        defaultValue={state.userSettings.document}
                        className="w-full px-3 py-2 border border-[#4a5568] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ade80] bg-[#34495e] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        defaultValue={state.userSettings.phone}
                        className="w-full px-3 py-2 border border-[#4a5568] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ade80] bg-[#34495e] text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={state.userSettings.email}
                        className="w-full px-3 py-2 border border-[#4a5568] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ade80] bg-[#34495e] text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="address"
                        defaultValue={state.userSettings.address}
                        className="w-full px-3 py-2 border border-[#4a5568] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ade80] bg-[#34495e] text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      type="submit"
                      className="bg-[#4ade80] hover:bg-[#22c55e] text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Salvar Dados
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </MainContent>
        );
      default:
        return (
          <MainContent title="Dashboard">
            <Dashboard onNewSale={() => setShowQuickSale(true)} />
          </MainContent>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1a2332] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:block`}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          title={getPageTitle()}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNotificationsClick={() => setShowNotifications(true)}
        />
        
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>

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