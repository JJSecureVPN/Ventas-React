export interface Product {
  id: string;
  name: string;
  category: string; // Ahora es string libre en lugar de union type fijo
  price: number;
  stock: number;
  minStock: number;
  barcode?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  tax: number;
  subtotal: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  date: Date;
  customerName?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'entrada' | 'salida' | 'ajuste';
  quantity: number;
  reason: string;
  date: Date;
  userId?: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todaySales: number;
  monthSales: number;
  totalRevenue: number;
}
