import React, { useState } from 'react';
import { X, Plus, Minus, Save } from 'lucide-react';
import { Product, Service, Comanda, ComandaItem } from '../../types';
import { generateId, formatCurrency } from '../../utils/helpers';

interface AddItemsFormProps {
  comanda: Comanda;
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

export function AddItemsForm({ comanda, products, services, onSave, onCancel }: AddItemsFormProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const calculateNewTotal = () => {
    const newItemsTotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    return comanda.total + newItemsTotal;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    const newItems: ComandaItem[] = cartItems.map(item => ({
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

    const updatedComanda: Comanda = {
      ...comanda,
      items: [...comanda.items, ...newItems],
      total: calculateNewTotal(),
    };

    onSave(updatedComanda);
  };

  const newItemsTotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#18191c] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Adicionar Itens</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comanda de {comanda.customerName}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Items Selection */}
            <div className="space-y-6">
              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Produtos</h3>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {products.filter(p => p.quantity > 0).map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProductToCart(product)}
                      className="text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Estoque: {product.quantity} {product.unit}
                          </p>
                        </div>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(product.salePrice)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Serviços</h3>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {services.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => addServiceToCart(service)}
                      className="text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                          {service.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-purple-600 dark:text-purple-400">
                          {formatCurrency(service.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Novos Itens ({cartItems.length})
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

              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total atual:</span>
                  <span className="font-medium">{formatCurrency(comanda.total)}</span>
                </div>
                
                {newItemsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Novos itens:</span>
                    <span className="font-medium text-blue-600">+{formatCurrency(newItemsTotal)}</span>
                  </div>
                )}
                
                <hr className="my-2 border-gray-300 dark:border-gray-600" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Novo total:</span>
                  <span className="text-blue-600 dark:text-blue-400">{formatCurrency(calculateNewTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cartItems.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Adicionar Itens</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}