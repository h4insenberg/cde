import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, Service, Sale, StockMovement, DashboardStats, Notification } from '../types';

interface BusinessState {
  products: Product[];
  services: Service[];
  sales: Sale[];
  stockMovements: StockMovement[];
  notifications: Notification[];
  dashboardStats: DashboardStats;
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
  | { type: 'LOAD_DATA'; payload: BusinessState };

const initialState: BusinessState = {
  products: [],
  services: [],
  sales: [],
  stockMovements: [],
  notifications: [],
  dashboardStats: {
    totalRevenue: 0,
    totalCosts: 0,
    grossProfit: 0,
    netProfit: 0,
    totalSales: 0,
    lowStockAlerts: 0,
  },
};

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
      const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalCosts = state.sales.reduce((sum, sale) => sum + (sale.total - sale.profit), 0);
      const grossProfit = state.sales.reduce((sum, sale) => sum + sale.profit, 0);
      const netProfit = state.sales.reduce((sum, sale) => sum + (sale.netAmount - (sale.total - sale.profit)), 0);
      const lowStockAlerts = state.products.filter(p => p.quantity <= p.minQuantity).length;
      
      return {
        ...state,
        dashboardStats: {
          totalRevenue,
          totalCosts,
          grossProfit,
          netProfit,
          totalSales: state.sales.length,
          lowStockAlerts,
        }
      };
    
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
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('businessData', JSON.stringify(state));
    dispatch({ type: 'UPDATE_STATS' });
  }, [state.products, state.services, state.sales, state.stockMovements, state.notifications]);

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