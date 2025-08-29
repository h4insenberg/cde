export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function calculateProfit(costPrice: number, salePrice: number, quantity: number): number {
  return (salePrice - costPrice) * quantity;
}

export function getUnitLabel(unit: string): string {
  const labels = {
    kg: 'Quilogramas',
    liters: 'Litros',
    meters: 'Metros',
    units: 'Unidades',
  };
  return labels[unit as keyof typeof labels] || unit;
}

export function calculateCardFee(amount: number, feeRate: number): number {
  return (amount * feeRate) / 100;
}

export function getPaymentMethodLabel(method: string): string {
  const labels = {
    CASH: 'Dinheiro',
    PIX: 'PIX',
    CARD: 'Cartão',
    CREDIT: 'Fiado',
  };
  return labels[method as keyof typeof labels] || method;
}