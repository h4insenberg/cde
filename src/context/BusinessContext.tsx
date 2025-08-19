import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, Service, Sale, StockMovement, DashboardStats, Notification } from '../types';
import { generateId } from '../utils/helpers';

interface BusinessState {
  products: Product[];
  services: Service[];
  sales: Sale[];
  stockMovements: StockMovement[];
  notifications: Notification[];
  dashboardStats: DashboardStats;
  darkMode: boolean;
}

type BusinessAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_STOCK_MOVEMENT'; payload: StockMovement }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_STATS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_DATA'; payload: BusinessState };

const initialState: BusinessState = {
  products: [],
  services: [],
  sales: [],
  stockMovements: [],
  notifications: [],
  dashboardStats: {
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    profitMargin: 0,
    lowStockAlerts: 0,
  },
  darkMode: false,
};

// Sample data for testing
const sampleProducts: Product[] = [
  {
    id: generateId(),
    name: 'Açúcar Cristal',
    description: 'Açúcar cristal refinado especial, pacote de 1kg',
    unit: 'kg',
    quantity: 25,
    costPrice: 3.50,
    salePrice: 5.20,
    minQuantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Arroz Branco',
    description: 'Arroz branco tipo 1, pacote de 5kg',
    unit: 'kg',
    quantity: 15,
    costPrice: 12.00,
    salePrice: 18.50,
    minQuantity: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Feijão Carioca',
    description: 'Feijão carioca tipo 1, pacote de 1kg',
    unit: 'kg',
    quantity: 8,
    costPrice: 6.80,
    salePrice: 9.90,
    minQuantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Óleo de Soja',
    description: 'Óleo de soja refinado, garrafa de 900ml',
    unit: 'liters',
    quantity: 20,
    costPrice: 4.20,
    salePrice: 6.50,
    minQuantity: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Macarrão Espaguete',
    description: 'Macarrão espaguete nº 8, pacote de 500g',
    unit: 'units',
    quantity: 30,
    costPrice: 2.80,
    salePrice: 4.20,
    minQuantity: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Leite Integral',
    description: 'Leite integral UHT, caixa de 1 litro',
    unit: 'liters',
    quantity: 12,
    costPrice: 3.80,
    salePrice: 5.50,
    minQuantity: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Café em Pó',
    description: 'Café torrado e moído tradicional, pacote de 500g',
    unit: 'kg',
    quantity: 18,
    costPrice: 8.50,
    salePrice: 12.90,
    minQuantity: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Sabão em Pó',
    description: 'Sabão em pó concentrado, caixa de 1kg',
    unit: 'kg',
    quantity: 3,
    costPrice: 7.20,
    salePrice: 11.50,
    minQuantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Papel Higiênico',
    description: 'Papel higiênico folha dupla, pacote com 4 rolos',
    unit: 'units',
    quantity: 25,
    costPrice: 6.80,
    salePrice: 9.90,
    minQuantity: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Refrigerante Cola',
    description: 'Refrigerante sabor cola, garrafa de 2 litros',
    unit: 'liters',
    quantity: 2,
    costPrice: 4.50,
    salePrice: 7.20,
    minQuantity: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleServices: Service[] = [
  {
    id: generateId(),
    name: 'Corte de Cabelo Masculino',
    description: 'Corte de cabelo masculino tradicional com acabamento',
    price: 25.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Corte de Cabelo Feminino',
    description: 'Corte de cabelo feminino com lavagem e escovação',
    price: 45.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Barba e Bigode',
    description: 'Aparar barba e bigode com acabamento profissional',
    price: 15.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Manicure',
    description: 'Serviço completo de manicure com esmaltação',
    price: 20.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Pedicure',
    description: 'Serviço completo de pedicure com esmaltação',
    price: 25.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Escova Progressiva',
    description: 'Tratamento de escova progressiva para alisamento',
    price: 120.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Coloração de Cabelo',
    description: 'Coloração completa do cabelo com produtos profissionais',
    price: 80.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Limpeza de Pele',
    description: 'Limpeza facial profunda com extração e hidratação',
    price: 60.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Massagem Relaxante',
    description: 'Massagem corporal relaxante de 60 minutos',
    price: 90.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Depilação com Cera',
    description: 'Depilação completa das pernas com cera quente',
    price: 35.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const BusinessContext = createContext<{
  state: BusinessState;
  dispatch: React.Dispatch<BusinessAction>;
} | null>(null);

function businessReducer(state: BusinessState, action: BusinessAction): BusinessState {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(s => s.id === action.payload.id ? action.payload : s)
      };
    
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(s => s.id !== action.payload)
      };
    
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    
    case 'ADD_STOCK_MOVEMENT':
      return { ...state, stockMovements: [...state.stockMovements, action.payload] };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
    
    case 'UPDATE_STATS':
      const revenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
      const expenses = state.sales.reduce((sum, sale) => sum + (sale.total - sale.profit), 0);
      const netProfit = revenue - expenses;
      const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
      const lowStockAlerts = state.products.filter(p => p.quantity <= p.minQuantity).length;
      
      return {
        ...state,
        dashboardStats: {
          revenue,
          expenses,
          netProfit,
          profitMargin,
          lowStockAlerts,
        }
      };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    case 'LOAD_DATA':
      return action.payload;
    
    default:
      return state;
  }
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(businessReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('businessData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure we have the darkMode property
        const dataWithDefaults = {
          ...initialState,
          ...parsedData,
          darkMode: parsedData.darkMode ?? false,
        };
        dispatch({ type: 'LOAD_DATA', payload: dataWithDefaults });
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Load sample data if parsing fails
        const initialDataWithSamples = {
          ...initialState,
          products: sampleProducts,
          services: sampleServices,
        };
        dispatch({ type: 'LOAD_DATA', payload: initialDataWithSamples });
      }
    } else {
      // Load sample data (will be replaced with real data in the future)
      const initialDataWithSamples = {
        ...initialState,
        products: sampleProducts,
        services: sampleServices,
      };
      dispatch({ type: 'LOAD_DATA', payload: initialDataWithSamples });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('businessData', JSON.stringify(state));
    dispatch({ type: 'UPDATE_STATS' });
  }, [state.products, state.services, state.sales, state.stockMovements, state.notifications, state.darkMode]);

  return (
    <BusinessContext.Provider value={{ state, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}