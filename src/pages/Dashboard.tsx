import { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, Sale, DashboardStats } from '../types';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    todaySales: 0,
    monthSales: 0,
    totalRevenue: 0
  });

  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const products = storageService.getProducts();
    const sales = storageService.getSales();
    
    // Calcular estadísticas
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const todaySales = sales.filter(sale => 
      new Date(sale.date).toDateString() === today.toDateString()
    );
    
    const monthSales = sales.filter(sale => 
      new Date(sale.date) >= startOfMonth
    );

    const lowStock = products.filter(product => product.stock <= product.minStock);

    setStats({
      totalProducts: products.length,
      lowStockProducts: lowStock.length,
      todaySales: todaySales.length,
      monthSales: monthSales.length,
      totalRevenue: monthSales.reduce((sum, sale) => sum + sale.total, 0)
    });

    setRecentSales(sales.slice(-5).reverse());
    setLowStockProducts(lowStock.slice(0, 5));
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-text-secondary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-dark-text mt-1">{value}</p>
          {subtitle && (
            <p className="text-dark-text-secondary text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-text mb-2">Dashboard</h1>
        <p className="text-dark-text-secondary">
          Resumen general de tu almacén
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Ventas Hoy"
          value={stats.todaySales}
          icon={ShoppingCart}
          color="bg-accent"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          color="bg-warning"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-green-500"
          subtitle={`${stats.monthSales} ventas`}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Sales */}
        <div className="bg-dark-card p-4 lg:p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-text">Ventas Recientes</h2>
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-dark-text font-medium truncate">
                      Venta #{sale.id.slice(-6)}
                    </p>
                    <p className="text-dark-text-secondary text-sm">
                      {new Date(sale.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-accent font-semibold">${sale.total.toFixed(2)}</p>
                    <p className="text-dark-text-secondary text-sm">
                      {sale.items.length} items
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-dark-text-secondary text-center py-4">
                No hay ventas registradas
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-dark-card p-4 lg:p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-text">Alertas de Stock</h2>
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-warning/20">
                  <div className="min-w-0 flex-1">
                    <p className="text-dark-text font-medium truncate">{product.name}</p>
                    <p className="text-dark-text-secondary text-sm capitalize">
                      {product.category}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-warning font-semibold">{product.stock} unidades</p>
                    <p className="text-dark-text-secondary text-sm">
                      Mín: {product.minStock}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-dark-text-secondary text-center py-4">
                ¡Todos los productos tienen stock suficiente!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
