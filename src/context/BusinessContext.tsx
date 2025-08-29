import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, Service, Sale, StockMovement, DashboardStats, Notification, Comanda, Loan, UserSettings, FinancialEntry, FinancialExit } from '../types';
import { generateId } from '../utils/helpers';

interface BusinessState {
  products: Product[];
  services: Service[];
  sales: Sale[];
  comandas: Comanda[];
  loans: Loan[];
  financialEntries: FinancialEntry[];
  financialExits: FinancialExit[];
  stockMovements: StockMovement[];
  notifications: Notification[];
  dashboardStats: DashboardStats;
  showValues: boolean;
  darkMode: boolean;
  userSettings: UserSettings;
}

type BusinessAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_COMANDA'; payload: Comanda }
  | { type: 'UPDATE_COMANDA'; payload: Comanda }
  | { type: 'DELETE_COMANDA'; payload: string }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: Loan }
  | { type: 'DELETE_LOAN'; payload: string }
  | { type: 'ADD_FINANCIAL_ENTRY'; payload: FinancialEntry }
  | { type: 'UPDATE_FINANCIAL_ENTRY'; payload: FinancialEntry }
  | { type: 'DELETE_FINANCIAL_ENTRY'; payload: string }
  | { type: 'ADD_FINANCIAL_EXIT'; payload: FinancialExit }
  | { type: 'UPDATE_FINANCIAL_EXIT'; payload: FinancialExit }
  | { type: 'DELETE_FINANCIAL_EXIT'; payload: string }
  | { type: 'ADD_STOCK_MOVEMENT'; payload: StockMovement }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_STATS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SHOW_VALUES' }
  | { type: 'UPDATE_USER_SETTINGS'; payload: UserSettings }
  | { type: 'LOAD_STATE'; payload: BusinessState };

// Função para criar dados de teste
function createSampleData(): BusinessState {
  // Produtos de teste
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
      quantity: 2,
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
      quantity: 1,
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
      quantity: 3,
      costPrice: 4.50,
      salePrice: 7.20,
      minQuantity: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Serviços de teste
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

  // Empréstimos de teste
  const sampleLoans: Loan[] = [
    {
      id: generateId(),
      customerName: 'João Silva',
      amount: 500.00,
      interestRate: 10.0,
      totalAmount: 550.00,
      status: 'ACTIVE',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para compra de material de construção',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Maria Santos',
      amount: 1200.00,
      interestRate: 8.5,
      totalAmount: 1302.00,
      status: 'PAID',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para emergência médica',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Carlos Oliveira',
      amount: 800.00,
      interestRate: 12.0,
      totalAmount: 896.00,
      status: 'OVERDUE',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para pagamento de contas',
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Ana Costa',
      amount: 300.00,
      interestRate: 5.0,
      totalAmount: 315.00,
      status: 'ACTIVE',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para compra de eletrodoméstico',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Pedro Ferreira',
      amount: 2000.00,
      interestRate: 15.0,
      totalAmount: 2300.00,
      status: 'ACTIVE',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para investimento no negócio',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Lucia Mendes',
      amount: 1500.00,
      interestRate: 7.0,
      totalAmount: 1605.00,
      status: 'ACTIVE',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para reforma da casa',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Roberto Santos',
      amount: 600.00,
      interestRate: 9.0,
      totalAmount: 654.00,
      status: 'PAID',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para compra de moto',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Sandra Lima',
      amount: 400.00,
      interestRate: 6.0,
      totalAmount: 424.00,
      status: 'OVERDUE',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para pagamento de escola',
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Marcos Oliveira',
      amount: 1000.00,
      interestRate: 11.0,
      totalAmount: 1110.00,
      status: 'ACTIVE',
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para capital de giro',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Carla Rodrigues',
      amount: 250.00,
      interestRate: 4.0,
      totalAmount: 260.00,
      status: 'PAID',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      description: 'Empréstimo para compra de remédios',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ];

  // Vendas de teste
  const sampleSales: Sale[] = [
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[0].id,
          name: 'Açúcar Cristal',
          quantity: 2,
          unitPrice: 5.20,
          total: 10.40,
          profit: 3.40,
        },
      ],
      total: 10.40,
      profit: 3.40,
      paymentMethod: 'PIX',
      netAmount: 10.40,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[0].id,
          name: 'Corte de Cabelo Masculino',
          quantity: 1,
          unitPrice: 25.00,
          total: 25.00,
          profit: 25.00,
        },
      ],
      total: 25.00,
      profit: 25.00,
      paymentMethod: 'CARD',
      cardFeeRate: 3.5,
      cardFeeAmount: 0.88,
      netAmount: 24.12,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[1].id,
          name: 'Arroz Branco',
          quantity: 1,
          unitPrice: 18.50,
          total: 18.50,
          profit: 6.50,
        },
      ],
      total: 18.50,
      profit: 6.50,
      paymentMethod: 'PIX',
      netAmount: 18.50,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[1].id,
          name: 'Corte de Cabelo Feminino',
          quantity: 1,
          unitPrice: 45.00,
          total: 45.00,
          profit: 45.00,
        },
      ],
      total: 45.00,
      profit: 45.00,
      paymentMethod: 'CARD',
      cardFeeRate: 2.8,
      cardFeeAmount: 1.26,
      netAmount: 43.74,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[4].id,
          name: 'Macarrão Espaguete',
          quantity: 3,
          unitPrice: 4.20,
          total: 12.60,
          profit: 4.20,
        },
      ],
      total: 12.60,
      profit: 4.20,
      paymentMethod: 'CREDIT',
      netAmount: 12.60,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[5].id,
          name: 'Leite Integral',
          quantity: 2,
          unitPrice: 5.50,
          total: 11.00,
          profit: 3.40,
        },
      ],
      total: 11.00,
      profit: 3.40,
      paymentMethod: 'PIX',
      netAmount: 11.00,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[5].id,
          name: 'Escova Progressiva',
          quantity: 1,
          unitPrice: 120.00,
          total: 120.00,
          profit: 120.00,
        },
      ],
      total: 120.00,
      profit: 120.00,
      paymentMethod: 'CARD',
      cardFeeRate: 3.2,
      cardFeeAmount: 3.84,
      netAmount: 116.16,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[8].id,
          name: 'Papel Higiênico',
          quantity: 1,
          unitPrice: 9.90,
          total: 9.90,
          profit: 3.10,
        },
      ],
      total: 9.90,
      profit: 3.10,
      paymentMethod: 'PIX',
      netAmount: 9.90,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[7].id,
          name: 'Limpeza de Pele',
          quantity: 1,
          unitPrice: 60.00,
          total: 60.00,
          profit: 60.00,
        },
      ],
      total: 60.00,
      profit: 60.00,
      paymentMethod: 'CARD',
      cardFeeRate: 2.9,
      cardFeeAmount: 1.74,
      netAmount: 58.26,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[9].id,
          name: 'Refrigerante Cola',
          quantity: 2,
          unitPrice: 7.20,
          total: 14.40,
          profit: 5.40,
        },
      ],
      total: 14.40,
      profit: 5.40,
      paymentMethod: 'PIX',
      netAmount: 14.40,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  // Comandas de teste
  const sampleComandas: Comanda[] = [
    {
      id: generateId(),
      customerName: 'Roberto Lima',
      status: 'OPEN',
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[4].id,
          name: 'Macarrão Espaguete',
          quantity: 2,
          unitPrice: 4.20,
          total: 8.40,
          addedAt: new Date(),
        },
      ],
      total: 8.40,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Fernanda Alves',
      status: 'PAID',
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[1].id,
          name: 'Corte de Cabelo Feminino',
          quantity: 1,
          unitPrice: 45.00,
          total: 45.00,
          addedAt: new Date(),
        },
      ],
      total: 45.00,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Carlos Mendes',
      status: 'OPEN',
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[5].id,
          name: 'Leite Integral',
          quantity: 1,
          unitPrice: 5.50,
          total: 5.50,
          addedAt: new Date(),
        },
      ],
      total: 5.50,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Ana Paula',
      status: 'PAID',
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[6].id,
          name: 'Coloração de Cabelo',
          quantity: 1,
          unitPrice: 80.00,
          total: 80.00,
          addedAt: new Date(),
        },
      ],
      total: 80.00,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'José Santos',
      status: 'OPEN',
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[6].id,
          name: 'Café em Pó',
          quantity: 1,
          unitPrice: 12.90,
          total: 12.90,
          addedAt: new Date(),
        },
      ],
      total: 12.90,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Patrícia Lima',
      status: 'PAID',
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[8].id,
          name: 'Massagem Relaxante',
          quantity: 1,
          unitPrice: 90.00,
          total: 90.00,
          addedAt: new Date(),
        },
      ],
      total: 90.00,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Ricardo Alves',
      status: 'OPEN',
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[7].id,
          name: 'Sabão em Pó',
          quantity: 1,
          unitPrice: 11.50,
          total: 11.50,
          addedAt: new Date(),
        },
      ],
      total: 11.50,
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Silvia Costa',
      status: 'PAID',
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[9].id,
          name: 'Depilação com Cera',
          quantity: 1,
          unitPrice: 35.00,
          total: 35.00,
          addedAt: new Date(),
        },
      ],
      total: 35.00,
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Marcos Silva',
      status: 'OPEN',
      items: [
        {
          id: generateId(),
          type: 'product',
          productId: sampleProducts[8].id,
          name: 'Papel Higiênico',
          quantity: 1,
          unitPrice: 9.90,
          total: 9.90,
          addedAt: new Date(),
        },
      ],
      total: 9.90,
      createdAt: new Date(Date.now() - 20 * 60 * 1000),
    },
    {
      id: generateId(),
      customerName: 'Helena Rodrigues',
      status: 'PAID',
      items: [
        {
          id: generateId(),
          type: 'service',
          serviceId: sampleServices[3].id,
          name: 'Manicure',
          quantity: 1,
          unitPrice: 20.00,
          total: 20.00,
          addedAt: new Date(),
        },
      ],
      total: 20.00,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ];

  return {
    products: sampleProducts,
    services: sampleServices,
    sales: sampleSales,
    comandas: sampleComandas,
    loans: sampleLoans,
    financialEntries: [],
    financialExits: [],
    stockMovements: [],
    notifications: [],
    dashboardStats: {
      revenue: 0,
      expenses: 0,
      netProfit: 0,
      profitMargin: 0,
      lowStockAlerts: 0,
    },
    showValues: true,
    darkMode: false,
    userSettings: {
      name: 'Maria Silva',
      companyName: 'Mercadinho da Maria',
      document: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      email: 'maria@mercadinho.com',
      address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
    },
  };
}

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
    
    case 'ADD_COMANDA':
      return { ...state, comandas: [...state.comandas, action.payload] };
    
    case 'UPDATE_COMANDA':
      return {
        ...state,
        comandas: state.comandas.map(c => c.id === action.payload.id ? action.payload : c)
      };
    
    case 'DELETE_COMANDA':
      return {
        ...state,
        comandas: state.comandas.filter(c => c.id !== action.payload)
      };
    
    case 'ADD_LOAN':
      return { ...state, loans: [...state.loans, action.payload] };
    
    case 'UPDATE_LOAN':
      return {
        ...state,
        loans: state.loans.map(l => l.id === action.payload.id ? action.payload : l)
      };
    
    case 'DELETE_LOAN':
      return {
        ...state,
        loans: state.loans.filter(l => l.id !== action.payload)
      };
    
    case 'ADD_FINANCIAL_ENTRY':
      return { ...state, financialEntries: [...state.financialEntries, action.payload] };
    
    case 'UPDATE_FINANCIAL_ENTRY':
      return {
        ...state,
        financialEntries: state.financialEntries.map(e => e.id === action.payload.id ? action.payload : e)
      };
    
    case 'DELETE_FINANCIAL_ENTRY':
      return {
        ...state,
        financialEntries: state.financialEntries.filter(e => e.id !== action.payload)
      };
    
    case 'ADD_FINANCIAL_EXIT':
      return { ...state, financialExits: [...state.financialExits, action.payload] };
    
    case 'UPDATE_FINANCIAL_EXIT':
      return {
        ...state,
        financialExits: state.financialExits.map(e => e.id === action.payload.id ? action.payload : e)
      };
    
    case 'DELETE_FINANCIAL_EXIT':
      return {
        ...state,
        financialExits: state.financialExits.filter(e => e.id !== action.payload)
      };
    
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
      // Calculate revenue from all sources
      const salesRevenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
      const comandasRevenue = state.comandas
        .filter(c => c.status === 'PAID')
        .reduce((sum, comanda) => sum + comanda.total, 0);
      const loansRevenue = state.loans
        .filter(l => l.status === 'PAID')
        .reduce((sum, loan) => sum + loan.totalAmount, 0);
      
      // Only count entries that have reached their date
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      const entriesRevenue = state.financialEntries
        .filter(entry => new Date(entry.date) <= today)
        .reduce((sum, entry) => sum + entry.amount, 0);
      
      const revenue = salesRevenue + comandasRevenue + loansRevenue + entriesRevenue;
      
      // Calculate expenses (only financial exits and costs from sales)
      const salesCosts = state.sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
          if (item.type === 'product' && item.productId) {
            const product = state.products.find(p => p.id === item.productId);
            return itemSum + (product ? product.costPrice * item.quantity : 0);
          }
          return itemSum; // Services have no cost
        }, 0);
      }, 0);
      
      const comandasCosts = state.comandas
        .filter(c => c.status === 'PAID')
        .reduce((sum, comanda) => {
          return sum + comanda.items.reduce((itemSum, item) => {
            if (item.type === 'product' && item.productId) {
              const product = state.products.find(p => p.id === item.productId);
              return itemSum + (product ? product.costPrice * item.quantity : 0);
            }
            return itemSum; // Services have no cost
          }, 0);
        }, 0);
      
      const loansCosts = state.loans
        .filter(l => l.status === 'PAID')
        .reduce((sum, loan) => sum + loan.amount, 0); // Original loan amount is the cost
      
      // Only count exits that have reached their date
      const financialExits = state.financialExits
        .filter(exit => new Date(exit.date) <= today)
        .reduce((sum, exit) => sum + exit.amount, 0);
      
      const totalCosts = salesCosts + comandasCosts + loansCosts;
      const totalExpenses = financialExits;
      
      // Calculate gross profit (revenue - costs)
      const grossProfit = revenue - totalCosts;
      
      // Calculate net profit (gross profit - expenses)
      const netProfit = grossProfit - totalExpenses;
      
      // Calculate profit margin based on revenue
      const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
      
      const lowStockAlerts = state.products.filter(p => p.quantity <= p.minQuantity).length;
      
      return {
        ...state,
        dashboardStats: {
          revenue,
          expenses: totalExpenses,
          netProfit,
          profitMargin,
          lowStockAlerts,
        }
      };
      const salesProfit = state.sales.reduce((sum, sale) => sum + sale.profit, 0);
      const comandasProfit = state.comandas
        .filter(c => c.status === 'PAID')
        .reduce((sum, comanda) => {
          return sum + comanda.items.reduce((itemSum, item) => {
            if (item.type === 'product' && item.productId) {
              const product = state.products.find(p => p.id === item.productId);
              return itemSum + (product ? (item.unitPrice - product.costPrice) * item.quantity : item.total);
            }
            return itemSum + item.total;
          }, 0);
        }, 0);
      const loansProfit = state.loans
        .filter(l => l.status === 'PAID')
        .reduce((sum, loan) => sum + (loan.totalAmount - loan.amount), 0);
      const entriesProfit = entriesRevenue; // Entries are pure profit
      
      // Only count exits that have reached their date
      const financialExits = state.financialExits
        .filter(exit => new Date(exit.date) <= today)
        .reduce((sum, exit) => sum + exit.amount, 0);
      
      const totalProfit = salesProfit + comandasProfit + loansProfit + entriesProfit;
      const expenses = financialExits;
      const netProfit = totalProfit - expenses;
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
    
    case 'TOGGLE_SHOW_VALUES':
      return { ...state, showValues: !state.showValues };
    
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    
    case 'UPDATE_USER_SETTINGS':
      return { ...state, userSettings: action.payload };
    
    case 'LOAD_STATE':
      return action.payload;
    
    default:
      return state;
  }
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(businessReducer, createSampleData());

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('bizManagerData');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          // Converter strings de data de volta para objetos Date
          const restoredState: BusinessState = {
            ...parsedData,
            products: parsedData.products?.map((p: any) => ({
              ...p,
              createdAt: new Date(p.createdAt),
              updatedAt: new Date(p.updatedAt),
            })) || [],
            services: parsedData.services?.map((s: any) => ({
              ...s,
              createdAt: new Date(s.createdAt),
              updatedAt: new Date(s.updatedAt),
            })) || [],
            sales: parsedData.sales?.map((s: any) => ({
              ...s,
              createdAt: new Date(s.createdAt),
            })) || [],
            comandas: parsedData.comandas?.map((c: any) => ({
              ...c,
              createdAt: new Date(c.createdAt),
              paidAt: c.paidAt ? new Date(c.paidAt) : undefined,
              items: c.items?.map((item: any) => ({
                ...item,
                addedAt: new Date(item.addedAt),
              })) || [],
            })) || [],
            loans: parsedData.loans?.map((l: any) => ({
              ...l,
              createdAt: new Date(l.createdAt),
              dueDate: new Date(l.dueDate),
              paidAt: l.paidAt ? new Date(l.paidAt) : undefined,
            })) || [],
            financialEntries: parsedData.financialEntries?.map((e: any) => ({
              ...e,
              date: new Date(e.date),
              createdAt: new Date(e.createdAt),
            })) || [],
            financialExits: parsedData.financialExits?.map((e: any) => ({
              ...e,
              date: new Date(e.date),
              createdAt: new Date(e.createdAt),
            })) || [],
            stockMovements: parsedData.stockMovements?.map((sm: any) => ({
              ...sm,
              createdAt: new Date(sm.createdAt),
            })) || [],
            notifications: parsedData.notifications?.map((n: any) => ({
              ...n,
              createdAt: new Date(n.createdAt),
            })) || [],
          };
          
          console.log('Dados carregados do localStorage:', restoredState);
          dispatch({ type: 'LOAD_STATE', payload: restoredState });
        } else {
          console.log('Nenhum dado salvo encontrado, usando dados de teste');
          // Se não há dados salvos, os dados de teste já estão carregados no estado inicial
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        localStorage.removeItem('bizManagerData');
      }
    };

    loadData();
  }, []);

  // Salvar dados no localStorage sempre que o estado mudar
  useEffect(() => {
    const saveData = () => {
      try {
        const dataToSave = {
          ...state,
          products: state.products.map(p => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          })),
          services: state.services.map(s => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
            updatedAt: s.updatedAt.toISOString(),
          })),
          sales: state.sales.map(s => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
          })),
          comandas: state.comandas.map(c => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
            paidAt: c.paidAt?.toISOString(),
            items: c.items.map(item => ({
              ...item,
              addedAt: item.addedAt.toISOString(),
            })),
          })),
          loans: state.loans.map(l => ({
            ...l,
            createdAt: l.createdAt.toISOString(),
            dueDate: l.dueDate.toISOString(),
            paidAt: l.paidAt?.toISOString(),
          })),
          financialEntries: state.financialEntries.map(e => ({
            ...e,
            date: e.date.toISOString(),
            createdAt: e.createdAt.toISOString(),
          })),
          financialExits: state.financialExits.map(e => ({
            ...e,
            date: e.date.toISOString(),
            createdAt: e.createdAt.toISOString(),
          })),
          stockMovements: state.stockMovements.map(sm => ({
            ...sm,
            createdAt: sm.createdAt.toISOString(),
          })),
          notifications: state.notifications.map(n => ({
            ...n,
            createdAt: n.createdAt.toISOString(),
          })),
        };
        
        localStorage.setItem('bizManagerData', JSON.stringify(dataToSave));
        console.log('Dados salvos no localStorage');
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    };

    // Pequeno delay para evitar salvar durante a inicialização
    const timeoutId = setTimeout(saveData, 100);
    return () => clearTimeout(timeoutId);
  }, [state]);

  // Atualizar estatísticas quando necessário
  useEffect(() => {
    dispatch({ type: 'UPDATE_STATS' });
  }, [state.products, state.services, state.sales, state.comandas, state.loans, state.financialEntries, state.financialExits]);

  // Aplicar modo escuro
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

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