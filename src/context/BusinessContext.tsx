import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, Service, Sale, StockMovement, DashboardStats, Notification, Comanda, Loan, UserSettings } from '../types';
import { generateId } from '../utils/helpers';

interface BusinessState {
  products: Product[];
  services: Service[];
  sales: Sale[];
  comandas: Comanda[];
  loans: Loan[];
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
  | { type: 'ADD_STOCK_MOVEMENT'; payload: StockMovement }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_STATS' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'TOGGLE_SHOW_VALUES' }
  | { type: 'UPDATE_USER_SETTINGS'; payload: UserSettings }
  | { type: 'LOAD_DATA'; payload: BusinessState };

const initialState: BusinessState = {
  products: [],
  services: [],
  sales: [],
  comandas: [],
  loans: [],
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
    name: 'João Silva',
    companyName: 'Mercadinho do João',
    document: '12.345.678/0001-90',
    phone: '(11) 99999-9999',
    email: 'joao@mercadinho.com',
    address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
  },
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
  {
    id: generateId(),
    name: 'Farinha de Trigo',
    description: 'Farinha de trigo especial para panificação, pacote de 1kg',
    unit: 'kg',
    quantity: 22,
    costPrice: 4.80,
    salePrice: 7.20,
    minQuantity: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Detergente Líquido',
    description: 'Detergente líquido neutro, frasco de 500ml',
    unit: 'liters',
    quantity: 15,
    costPrice: 2.30,
    salePrice: 3.80,
    minQuantity: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Biscoito Recheado',
    description: 'Biscoito recheado sabor chocolate, pacote de 140g',
    unit: 'units',
    quantity: 45,
    costPrice: 1.80,
    salePrice: 2.90,
    minQuantity: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Água Mineral',
    description: 'Água mineral natural sem gás, garrafa de 1,5L',
    unit: 'liters',
    quantity: 35,
    costPrice: 1.20,
    salePrice: 2.50,
    minQuantity: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Margarina',
    description: 'Margarina cremosa com sal, pote de 500g',
    unit: 'kg',
    quantity: 18,
    costPrice: 3.90,
    salePrice: 6.20,
    minQuantity: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Shampoo',
    description: 'Shampoo para todos os tipos de cabelo, frasco de 400ml',
    unit: 'units',
    quantity: 12,
    costPrice: 8.50,
    salePrice: 13.90,
    minQuantity: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Pão de Açúcar',
    description: 'Pão de açúcar tradicional, unidade de 50g',
    unit: 'units',
    quantity: 80,
    costPrice: 0.35,
    salePrice: 0.60,
    minQuantity: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Cerveja Lata',
    description: 'Cerveja pilsen gelada, lata de 350ml',
    unit: 'units',
    quantity: 4,
    costPrice: 2.80,
    salePrice: 4.50,
    minQuantity: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Iogurte Natural',
    description: 'Iogurte natural integral, pote de 170g',
    unit: 'units',
    quantity: 25,
    costPrice: 2.20,
    salePrice: 3.80,
    minQuantity: 8,
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
  {
    id: generateId(),
    name: 'Sobrancelha',
    description: 'Design e modelagem de sobrancelhas com pinça',
    price: 18.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Hidratação Capilar',
    description: 'Hidratação profunda para cabelos ressecados',
    price: 40.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Penteado para Festa',
    description: 'Penteado elaborado para eventos especiais',
    price: 70.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Reflexo no Cabelo',
    description: 'Aplicação de reflexo para realçar a cor natural',
    price: 55.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Tratamento Anti-idade',
    description: 'Tratamento facial anti-idade com produtos premium',
    price: 150.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Massagem nos Pés',
    description: 'Massagem relaxante nos pés com óleos essenciais',
    price: 30.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Luzes no Cabelo',
    description: 'Aplicação de luzes para clarear mechas do cabelo',
    price: 95.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Esmaltação em Gel',
    description: 'Esmaltação com esmalte em gel de longa duração',
    price: 35.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: generateId(),
    name: 'Alongamento de Unhas',
    description: 'Alongamento de unhas com fibra de vidro',
    price: 50.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample loans for testing
const sampleLoans: Loan[] = [
  {
    id: generateId(),
    customerName: 'João Silva',
    amount: 500.00,
    interestRate: 10.0,
    totalAmount: 550.00,
    status: 'ACTIVE',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    description: 'Empréstimo para compra de material de construção',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: generateId(),
    customerName: 'Maria Santos',
    amount: 1200.00,
    interestRate: 8.5,
    totalAmount: 1302.00,
    status: 'PAID',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    description: 'Empréstimo para emergência médica',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: generateId(),
    customerName: 'Carlos Oliveira',
    amount: 800.00,
    interestRate: 12.0,
    totalAmount: 896.00,
    status: 'OVERDUE',
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (overdue)
    description: 'Empréstimo para pagamento de contas',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
  },
  {
    id: generateId(),
    customerName: 'Ana Costa',
    amount: 300.00,
    interestRate: 5.0,
    totalAmount: 315.00,
    status: 'ACTIVE',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    description: 'Empréstimo para compra de eletrodoméstico',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  },
  {
    id: generateId(),
    customerName: 'Pedro Ferreira',
    amount: 2000.00,
    interestRate: 15.0,
    totalAmount: 2300.00,
    status: 'ACTIVE',
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    description: 'Empréstimo para investimento no negócio',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: generateId(),
    customerName: 'Lucia Mendes',
    amount: 1500.00,
    interestRate: 7.0,
    totalAmount: 1605.00,
    status: 'ACTIVE',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    description: 'Empréstimo para reforma da casa',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: generateId(),
    customerName: 'Roberto Santos',
    amount: 600.00,
    interestRate: 9.0,
    totalAmount: 654.00,
    status: 'PAID',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    description: 'Empréstimo para compra de moto',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: generateId(),
    customerName: 'Sandra Lima',
    amount: 400.00,
    interestRate: 6.0,
    totalAmount: 424.00,
    status: 'OVERDUE',
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago (overdue)
    description: 'Empréstimo para pagamento de escola',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
  },
  {
    id: generateId(),
    customerName: 'Marcos Oliveira',
    amount: 1000.00,
    interestRate: 11.0,
    totalAmount: 1110.00,
    status: 'ACTIVE',
    dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    description: 'Empréstimo para capital de giro',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: generateId(),
    customerName: 'Carla Rodrigues',
    amount: 250.00,
    interestRate: 4.0,
    totalAmount: 260.00,
    status: 'PAID',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    description: 'Empréstimo para compra de remédios',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: generateId(),
    customerName: 'Eduardo Costa',
    amount: 3000.00,
    interestRate: 13.0,
    totalAmount: 3390.00,
    status: 'ACTIVE',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    description: 'Empréstimo para abertura de negócio',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

// Sample sales for testing
const sampleSales: Sale[] = [
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[0].id, // Açúcar Cristal
        name: 'Açúcar Cristal',
        quantity: 2,
        unitPrice: 5.20,
        total: 10.40,
        profit: 3.40,
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[1].id, // Arroz Branco
        name: 'Arroz Branco',
        quantity: 1,
        unitPrice: 18.50,
        total: 18.50,
        profit: 6.50,
      },
    ],
    total: 28.90,
    profit: 9.90,
    paymentMethod: 'PIX',
    netAmount: 28.90,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[0].id, // Corte Masculino
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
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[2].id, // Feijão Carioca
        name: 'Feijão Carioca',
        quantity: 2,
        unitPrice: 9.90,
        total: 19.80,
        profit: 6.20,
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[3].id, // Óleo de Soja
        name: 'Óleo de Soja',
        quantity: 1,
        unitPrice: 6.50,
        total: 6.50,
        profit: 2.30,
      },
    ],
    total: 26.30,
    profit: 8.50,
    paymentMethod: 'PIX',
    netAmount: 26.30,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[1].id, // Corte Feminino
        name: 'Corte de Cabelo Feminino',
        quantity: 1,
        unitPrice: 45.00,
        total: 45.00,
        profit: 45.00,
      },
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[3].id, // Manicure
        name: 'Manicure',
        quantity: 1,
        unitPrice: 20.00,
        total: 20.00,
        profit: 20.00,
      },
    ],
    total: 65.00,
    profit: 65.00,
    paymentMethod: 'CARD',
    cardFeeRate: 2.8,
    cardFeeAmount: 1.82,
    netAmount: 63.18,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[4].id, // Macarrão
        name: 'Macarrão Espaguete',
        quantity: 5,
        unitPrice: 4.20,
        total: 21.00,
        profit: 7.00,
      },
    ],
    total: 21.00,
    profit: 7.00,
    paymentMethod: 'CREDIT',
    netAmount: 21.00,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[5].id, // Leite
        name: 'Leite Integral',
        quantity: 3,
        unitPrice: 5.50,
        total: 16.50,
        profit: 5.10,
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[6].id, // Café
        name: 'Café em Pó',
        quantity: 1,
        unitPrice: 12.90,
        total: 12.90,
        profit: 4.40,
      },
    ],
    total: 29.40,
    profit: 9.50,
    paymentMethod: 'PIX',
    netAmount: 29.40,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[5].id, // Escova Progressiva
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
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[8].id, // Papel Higiênico
        name: 'Papel Higiênico',
        quantity: 2,
        unitPrice: 9.90,
        total: 19.80,
        profit: 6.20,
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[11].id, // Detergente
        name: 'Detergente Líquido',
        quantity: 1,
        unitPrice: 3.80,
        total: 3.80,
        profit: 1.50,
      },
    ],
    total: 23.60,
    profit: 7.70,
    paymentMethod: 'PIX',
    netAmount: 23.60,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[7].id, // Limpeza de Pele
        name: 'Limpeza de Pele',
        quantity: 1,
        unitPrice: 60.00,
        total: 60.00,
        profit: 60.00,
      },
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[10].id, // Sobrancelha
        name: 'Sobrancelha',
        quantity: 1,
        unitPrice: 18.00,
        total: 18.00,
        profit: 18.00,
      },
    ],
    total: 78.00,
    profit: 78.00,
    paymentMethod: 'CARD',
    cardFeeRate: 2.9,
    cardFeeAmount: 2.26,
    netAmount: 75.74,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
  },
  {
    id: generateId(),
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[12].id, // Biscoito
        name: 'Biscoito Recheado',
        quantity: 4,
        unitPrice: 2.90,
        total: 11.60,
        profit: 4.40,
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[13].id, // Água
        name: 'Água Mineral',
        quantity: 2,
        unitPrice: 2.50,
        total: 5.00,
        profit: 2.60,
      },
    ],
    total: 16.60,
    profit: 7.00,
    paymentMethod: 'PIX',
    netAmount: 16.60,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
];

// Sample comandas for testing
const sampleComandas: Comanda[] = [
  {
    id: generateId(),
    customerName: 'Roberto Lima',
    status: 'OPEN',
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[4].id, // Macarrão
        name: 'Macarrão Espaguete',
        quantity: 3,
        unitPrice: 4.20,
        total: 12.60,
        addedAt: new Date(),
      },
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[2].id, // Barba
        name: 'Barba e Bigode',
        quantity: 1,
        unitPrice: 15.00,
        total: 15.00,
        addedAt: new Date(),
      },
    ],
    total: 27.60,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: generateId(),
    customerName: 'Fernanda Alves',
    status: 'PAID',
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[1].id, // Corte Feminino
        name: 'Corte de Cabelo Feminino',
        quantity: 1,
        unitPrice: 45.00,
        total: 45.00,
        addedAt: new Date(),
      },
    ],
    total: 45.00,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    paidAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: generateId(),
    customerName: 'Carlos Mendes',
    status: 'OPEN',
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[14].id, // Margarina
        name: 'Margarina',
        quantity: 1,
        unitPrice: 6.20,
        total: 6.20,
        addedAt: new Date(),
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[16].id, // Pão
        name: 'Pão de Açúcar',
        quantity: 10,
        unitPrice: 0.60,
        total: 6.00,
        addedAt: new Date(),
      },
    ],
    total: 12.20,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: generateId(),
    customerName: 'Ana Paula',
    status: 'PAID',
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[6].id, // Coloração
        name: 'Coloração de Cabelo',
        quantity: 1,
        unitPrice: 80.00,
        total: 80.00,
        addedAt: new Date(),
      },
    ],
    total: 80.00,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    paidAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: generateId(),
    customerName: 'José Santos',
    status: 'OPEN',
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[17].id, // Cerveja
        name: 'Cerveja Lata',
        quantity: 6,
        unitPrice: 4.50,
        total: 27.00,
        addedAt: new Date(),
      },
    ],
    total: 27.00,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: generateId(),
    customerName: 'Patrícia Lima',
    status: 'PAID',
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[8].id, // Massagem
        name: 'Massagem Relaxante',
        quantity: 1,
        unitPrice: 90.00,
        total: 90.00,
        addedAt: new Date(),
      },
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[15].id, // Massagem nos Pés
        name: 'Massagem nos Pés',
        quantity: 1,
        unitPrice: 30.00,
        total: 30.00,
        addedAt: new Date(),
      },
    ],
    total: 120.00,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: generateId(),
    customerName: 'Ricardo Alves',
    status: 'OPEN',
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[15].id, // Shampoo
        name: 'Shampoo',
        quantity: 1,
        unitPrice: 13.90,
        total: 13.90,
        addedAt: new Date(),
      },
    ],
    total: 13.90,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    id: generateId(),
    customerName: 'Silvia Costa',
    status: 'PAID',
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[9].id, // Depilação
        name: 'Depilação com Cera',
        quantity: 1,
        unitPrice: 35.00,
        total: 35.00,
        addedAt: new Date(),
      },
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[18].id, // Esmaltação em Gel
        name: 'Esmaltação em Gel',
        quantity: 1,
        unitPrice: 35.00,
        total: 35.00,
        addedAt: new Date(),
      },
    ],
    total: 70.00,
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    paidAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: generateId(),
    customerName: 'Marcos Silva',
    status: 'OPEN',
    items: [
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[18].id, // Iogurte
        name: 'Iogurte Natural',
        quantity: 3,
        unitPrice: 3.80,
        total: 11.40,
        addedAt: new Date(),
      },
      {
        id: generateId(),
        type: 'product',
        productId: sampleProducts[10].id, // Farinha
        name: 'Farinha de Trigo',
        quantity: 2,
        unitPrice: 7.20,
        total: 14.40,
        addedAt: new Date(),
      },
    ],
    total: 25.80,
    createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
  },
  {
    id: generateId(),
    customerName: 'Helena Rodrigues',
    status: 'PAID',
    items: [
      {
        id: generateId(),
        type: 'service',
        serviceId: sampleServices[16].id, // Luzes
        name: 'Luzes no Cabelo',
        quantity: 1,
        unitPrice: 95.00,
        total: 95.00,
        addedAt: new Date(),
      },
    ],
    total: 95.00,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    paidAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
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
      const salesRevenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
      const comandasRevenue = state.comandas
        .filter(c => c.status === 'PAID')
        .reduce((sum, comanda) => sum + comanda.total, 0);
      const loansRevenue = state.loans
        .filter(l => l.status === 'PAID')
        .reduce((sum, loan) => sum + loan.totalAmount, 0);
      const revenue = salesRevenue + comandasRevenue + loansRevenue;
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
    
    case 'TOGGLE_SHOW_VALUES':
      return { ...state, showValues: !state.showValues };
    
    case 'TOGGLE_DARK_MODE':
      console.log('Toggling dark mode from', state.darkMode, 'to', !state.darkMode);
      return { ...state, darkMode: !state.darkMode };
    
    case 'UPDATE_USER_SETTINGS':
      return { ...state, userSettings: action.payload };
    
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
    // Load theme preference first - check both sources
    let isDarkMode = false;
    
    // First check if there's a saved preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      isDarkMode = JSON.parse(savedTheme);
    } else {
      // If no saved preference, check system preference
      isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    const savedData = localStorage.getItem('businessData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        // Convert date strings back to Date objects
        const restoredData = {
          ...parsedData,
          userSettings: parsedData.userSettings || initialState.userSettings,
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
          stockMovements: parsedData.stockMovements?.map((sm: any) => ({
            ...sm,
            createdAt: new Date(sm.createdAt),
          })) || [],
          notifications: parsedData.notifications?.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          })) || [],
          darkMode: isDarkMode,
        };
        
        dispatch({ type: 'LOAD_DATA', payload: restoredData });
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Clear corrupted data and load sample data
        localStorage.removeItem('businessData');
        loadSampleData(isDarkMode);
      }
    } else {
      // No saved data, load sample data
      loadSampleData(isDarkMode);
    }
    
    function loadSampleData(isDarkMode: boolean) {
      const initialDataWithSamples = {
        ...initialState,
        products: sampleProducts,
        services: sampleServices,
        sales: sampleSales,
        comandas: sampleComandas,
        loans: sampleLoans,
        darkMode: isDarkMode,
      };
      console.log('Loading sample data:', initialDataWithSamples);
      dispatch({ type: 'LOAD_DATA', payload: initialDataWithSamples });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    // Skip saving during initial load
    if (state === initialState) {
      return;
    }
    
    // Save data to localStorage
    try {
      const dataToSave = {
        ...state,
        // Convert dates to strings for JSON serialization
        userSettings: state.userSettings,
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
        stockMovements: state.stockMovements.map(sm => ({
          ...sm,
          createdAt: sm.createdAt.toISOString(),
        })),
        notifications: state.notifications.map(n => ({
          ...n,
          createdAt: n.createdAt.toISOString(),
        })),
      };
      
      localStorage.setItem('businessData', JSON.stringify(dataToSave));
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  // Update stats separately to avoid infinite loops
  useEffect(() => {
    // Skip stats update during initial load
    if (state === initialState) {
      return;
    }
    dispatch({ type: 'UPDATE_STATS' });
  }, [state.products, state.services, state.sales, state.comandas, state.loans, state.stockMovements, state.notifications, state.showValues]);

  // Apply dark mode to document
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (state.darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
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