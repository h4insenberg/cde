import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Package, Wrench } from 'lucide-react';
import { Product, Service, Sale, SaleItem, PaymentMethod } from '../../types';
import { generateId, formatCurrency, calculateProfit, calculateCardFee, getPaymentMethodLabel } from '../../utils/helpers';

interface SaleFormProps {
  products: Product[];
  services: Service[];
  onSave: (sale: Sale) => void;
  onCancel: () => void;
}

interface CartItem {
  id: string;
  type: 'product' | 'service';
  productId?: string;
  serviceId?: string;
  name: string;
  unitPrice: number;
  costPrice?: number;
  quantity: number;
}

export function SaleForm({ products, services, onSave, onCancel }: SaleFormProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cardFeeRate, setCardFeeRate] = useState(3.5);
  const [cardFeePayer, setCardFeePayer] = useState<'seller' | 'customer'>('seller');
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
        costPrice: product.costPrice,
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
      if (item.type === 'product' && item.costPrice !== undefined) {
        return sum + calculateProfit(item.costPrice, item.unitPrice, item.quantity);
      } else {
        // For services, consider the full price as profit
        return sum + (item.unitPrice * item.quantity);
      }
    }, 0);
  };

  const validateSale = () => {
    const newErrors: Record<string, string> = {};

    if (cartItems.length === 0) {
      newErrors.items = 'Adicione pelo menos um item à venda';
    }

    // Check if products have enough stock
    cartItems.forEach(item => {
      if (item.type === 'product') {
        const product = products.find(p => p.id === item.productId);
        if (product && product.quantity < item.quantity) {
          newErrors.stock = `Estoque insuficiente para ${product.name} (disponível: ${product.quantity})`;
        }
      }
    });

    if (paymentMethod === 'CARD' && (cardFeeRate < 0 || cardFeeRate > 20)) {
      newErrors.cardFeeRate = 'Taxa deve estar entre 0% e 20%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSale()) {
      return;
    }

    const total = calculateTotal();
    const profit = calculateTotalProfit();
    const cardFeeAmount = paymentMethod === 'CARD' ? calculateCardFee(total, cardFeeRate) : 0;
    const netAmount = total - cardFeeAmount;

    const saleItems: SaleItem[] = cartItems.map(item => ({
      id: generateId(),
      type: item.type,
      productId: item.productId,
      serviceId: item.serviceId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.unitPrice * item.quantity,
      profit: item.type === 'product' && item.costPrice !== undefined
        ? calculateProfit(item.costPrice, item.unitPrice, item.quantity)
        : item.unitPrice * item.quantity,
    }));

    const sale: Sale = {
      id: generateId(),
      items: saleItems,
      total,
      profit,
      paymentMethod,
      cardFeeRate: paymentMethod === 'CARD' ? cardFeeRate : undefined,
      cardFeeAmount,
      netAmount,
      createdAt: new Date(),
    };

    onSave(sale);
  };

  const total = calculateTotal();
  const totalProfit = calculateTotalProfit();
  const cardFeeAmount = paymentMethod === 'CARD' ? calculateCardFee(total, cardFeeRate) : 0;
  const netAmount = paymentMethod === 'CARD' && cardFeePayer === 'customer' 
    ? total + cardFeeAmount 
    : total - cardFeeAmount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pb-24">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Nova Venda</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Method */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Forma de Pagamento</h3>
                
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-medium"
                >
                  <option value="CASH">Dinheiro (em espécie)</option>
                  <option value="PIX">PIX</option>
                  <option value="CARD">Cartão</option>
                  <option value="CREDIT">Fiado</option>
                </select>

                {paymentMethod === 'CARD' && (
                  <div className="mt-3 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Taxa da Maquininha (%)
                    </label>
                    <input
                      type="number"
                      value={cardFeeRate}
                      onChange={(e) => setCardFeeRate(parseFloat(e.target.value) || 0)}
                      min="0"
                      max="20"
                      step="0.1"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                        errors.cardFeeRate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="3.5"
                    />
                    {errors.cardFeeRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardFeeRate}</p>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quem paga a taxa?
                      </label>
                      <select
                        value={cardFeePayer}
                        onChange={(e) => setCardFeePayer(e.target.value as 'seller' | 'customer')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="seller">Vendedor (desconta do valor)</option>
                        <option value="customer">Cliente (adiciona ao valor)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Products and Services Selection */}
              {/* Tabs */}
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
              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'products' && (
                  <div>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {products.filter(p => p.quantity > 0).map(product => (
                        <button
                          key={product.id}
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
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {services.map(service => (
                        <button
                          key={service.id}
                          onClick={() => addServiceToCart(service)}
                          className="text-left p-2 sm:p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{service.name}</p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Serviço
                              </p>
                            </div>
                            <p className="font-semibold text-green-600 dark:text-green-400 text-sm sm:text-base flex-shrink-0">
                              {formatCurrency(service.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
                      
            {/* Cart */}
            <div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrinho ({cartItems.length})
                </h3>
                
                {errors.items && (
                  <p className="text-red-500 text-sm mb-3">{errors.items}</p>
                )}
                
                {errors.stock && (
                  <p className="text-red-500 text-sm mb-3">{errors.stock}</p>
                )}

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
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        
                        <button
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
                      Carrinho vazio
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              {cartItems.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  
                  {paymentMethod === 'CARD' && cardFeeAmount > 0 && cardFeePayer === 'seller' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Taxa do cartão ({cardFeeRate}%):</span>
                      <span className="font-medium text-red-600">-{formatCurrency(cardFeeAmount)}</span>
                    </div>
                  )}
                  
                  {paymentMethod === 'CARD' && cardFeeAmount > 0 && cardFeePayer === 'customer' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Taxa do cartão ({cardFeeRate}%):</span>
                      <span className="font-medium text-blue-600">+{formatCurrency(cardFeeAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Lucro estimado:</span>
                    <span className="font-medium text-green-600">+{formatCurrency(totalProfit)}</span>
                  </div>
                  
                  <hr className="my-2 border-gray-300 dark:border-gray-600" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>{paymentMethod === 'CARD' && cardFeePayer === 'customer' ? 'Total do cliente:' : 'Valor líquido:'}</span>
                    <span className="text-green-600 dark:text-green-400">{formatCurrency(netAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18191c] p-4 sm:p-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={cartItems.length === 0}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Finalizar Venda ({formatCurrency(paymentMethod === 'CARD' && cardFeePayer === 'customer' ? netAmount : total)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}