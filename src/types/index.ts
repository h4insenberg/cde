export interface Product {
  id: string;
  name: string;
  description: string;
  unit: 'kg' | 'liters' | 'meters' | 'units';
  quantity: number;
  costPrice: number;
  salePrice: number;
  minQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  profit: number;
  paymentMethod: 'PIX' | 'CARD' | 'CREDIT';
  cardFeeRate?: number;
  cardFeeAmount?: number;
  netAmount: number;
  createdAt: Date;
}

export interface SaleItem {
  id: string;
  type: 'product' | 'service';
  productId?: string;
  serviceId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  profit: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  createdAt: Date;
}

export interface DashboardStats {
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
  lowStockAlerts: number;
}

export type PaymentMethod = 'PIX' | 'CARD' | 'CREDIT';

export interface Notification {
  id: string;
  type: 'LOW_STOCK' | 'SUCCESS' | 'ERROR';
  message: string;
  createdAt: Date;
  read: boolean;
}