import React, { useState } from 'react';
import { X, Plus, Minus, Save, Package, Wrench } from 'lucide-react';
import { Product, Service, Comanda, ComandaItem } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface ComandaFormProps {
  products: Product[];
  services: Service[];
  onSave: (comanda: Comanda) => void;
  onCancel: () => void;
}

interface CartItem {
  id: string;
  type: 'product' | 'service';
  productId?: string;
  serviceId?: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export function ComandaForm({ products, services, onSave, onCancel }: ComandaFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addProductToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const cartItem: CartItem = {
        id: generateId(),
        type: 'product',
        productId: product.id,
        name: product.name,
        unitPrice: product.salePrice,
        quantity: 1,
      };
      setCartItems(prev => [...prev, cartItem]);
    }
  };

  const addServiceToCart = (service: Service) => {
    const cartItem: CartItem = {
      id: generateId(),
      type: 'service',
      serviceId: service.id,
      name: service.name,
      unitPrice: service.price,
      quantity: 1,
    };
    setCartItems(prev => [...prev, cartItem]);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prev => prev.map(item =>
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const calculateTotalProfit = () => {
    return cartItems.reduce((sum, item) => {
      if (item.type === 'product' && item.productId) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          return sum + ((item.unitPrice - product.costPrice) * item.quantity);
        }
      } else {
        // For services, consider the full price as profit
        return sum + (item.unitPrice * item.quantity);
      }
      return sum;
    }, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Nome do cliente é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const comandaItems: ComandaItem[] = cartItems.map(item => ({
      id: generateId(),
      type: item.type,
      productId: item.productId,
      serviceId: item.serviceId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.unitPrice * item.quantity,
      addedAt: new Date(),
    }));

    const comanda: Comanda = {
      id: generateId(),
      customerName: customerName.trim(),
      status: 'OPEN',
      items: comandaItems,
      total: calculateTotal(),
      createdAt: new Date(),
    };

    onSave(comanda);
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-24">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nova Comanda</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Info and Items Selection */}
            <div className="space-y-6">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) {
                      setErrors(prev => ({ ...prev, customerName: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome do cliente"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* Tabs */}
              <div>
                <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className={`flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm font-medium ${
                        activeTab === 'products'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      <span>Produtos</span>
                      <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        {products.filter(p => p.quantity > 0).length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('services')}
                      className={`flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm font-medium ${
                        activeTab === 'services'
                          ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <Wrench className="h-4 w-4" />
                      <span>Serviços</span>
                      <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        {services.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'products' && (
                  <div>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {products.filter(p => p.quantity > 0).map(product => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => addProductToCart(product)}
                          className="text-left p-2 sm:p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{product.name}</p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Estoque: {product.quantity} {product.unit}
                              </p>
                            </div>
                            <p className="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base flex-shrink-0">
                              {formatCurrency(product.salePrice)}
                            </p>
                          </div>
                        </button>
                      ))}
                      
                      {products.filter(p => p.quantity > 0).length === 0 && (
                        <div className="text-center py-6 sm:py-8">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4">
                            Nenhum produto disponível em estoque
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {services.map(service => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => addServiceToCart(service)}
                          className="text-left p-2 sm:p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{service.name}</p>
                              {service.description && (
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                  {service.description}
                                </p>
                              )}
                            </div>
                            <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm sm:text-base flex-shrink-0">
                              {formatCurrency(service.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                      
                      {services.length === 0 && (
                        <div className="text-center py-6 sm:py-8">
                          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4">
                            Nenhum serviço cadastrado
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Itens da Comanda ({cartItems.length})
                </h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.unitPrice)} x {item.quantity} = {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {cartItems.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      Nenhum item adicionado
                    </p>
                  )}
                </div>
              </div>

              {/* Total */}
              {total > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Lucro estimado:</span>
                      <span className="font-medium text-green-600">+{formatCurrency(calculateTotalProfit())}</span>
                    </div>
                    
                    <hr className="my-2 border-gray-300 dark:border-gray-600" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Valor líquido:</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          </form>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18191c]">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Criar Comanda</span>
          </button>
        </div>
      </div>
    </div>
  );
}