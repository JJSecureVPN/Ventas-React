import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, Sale } from '../types';

export const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(storageService.getProducts());
    setSales(storageService.getSales());
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return { startDate, endDate: now };
  };

  const getFilteredSales = () => {
    const { startDate, endDate } = getDateRange();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  };

  const getSalesStats = () => {
    const filteredSales = getFilteredSales();
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = filteredSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    return { totalSales, totalRevenue, totalItems, avgSale };
  };

  const getTopProducts = () => {
    const filteredSales = getFilteredSales();
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (productSales[item.productId]) {
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.subtotal;
        } else {
          productSales[item.productId] = {
            name: item.productName,
            quantity: item.quantity,
            revenue: item.subtotal
          };
        }
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const getCategoryStats = () => {
    const categoryStats: { [key: string]: { quantity: number; revenue: number } } = {};

    products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = { quantity: 0, revenue: 0 };
      }
    });

    getFilteredSales().forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          categoryStats[product.category].quantity += item.quantity;
          categoryStats[product.category].revenue += item.subtotal;
        }
      });
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      ...stats
    }));
  };

  const stats = getSalesStats();
  const topProducts = getTopProducts();
  const categoryStats = getCategoryStats();

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">Reportes</h1>
          <p className="text-dark-text-secondary">
            Análisis y estadísticas de tu negocio
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
        >
          <option value="today">Hoy</option>
          <option value="week">Última semana</option>
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Ventas"
          value={stats.totalSales}
          icon={BarChart3}
          color="bg-blue-500"
          subtitle={`Período: ${selectedPeriod}`}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-accent"
        />
        <StatCard
          title="Productos Vendidos"
          value={stats.totalItems}
          icon={TrendingUp}
          color="bg-green-500"
          subtitle="unidades"
        />
        <StatCard
          title="Venta Promedio"
          value={`$${stats.avgSale.toFixed(2)}`}
          icon={Calendar}
          color="bg-purple-500"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h2 className="text-lg font-semibold text-dark-text mb-4">
            Productos Más Vendidos
          </h2>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-dark-text font-medium">{product.name}</p>
                      <p className="text-dark-text-secondary text-sm">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-accent font-semibold">${product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-dark-text-secondary text-center py-4">
                No hay datos de ventas para este período
              </p>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h2 className="text-lg font-semibold text-dark-text mb-4">
            Rendimiento por Categoría
          </h2>
          <div className="space-y-3">
            {categoryStats.map((category) => (
              <div key={category.category} className="p-3 bg-dark-bg rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-dark-text font-medium capitalize">
                    {category.category}
                  </span>
                  <span className="text-accent font-semibold">
                    ${category.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-dark-text-secondary">
                  <span>{category.quantity} unidades</span>
                  <span>
                    {((category.revenue / stats.totalRevenue) * 100).toFixed(1)}% del total
                  </span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2 mt-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: `${(category.revenue / stats.totalRevenue) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <h2 className="text-lg font-semibold text-dark-text mb-4">
          Resumen de Inventario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">
              {products.length}
            </p>
            <p className="text-dark-text-secondary">Productos Registrados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning">
              {products.filter(p => p.stock <= p.minStock).length}
            </p>
            <p className="text-dark-text-secondary">Con Stock Bajo</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-danger">
              {products.filter(p => p.stock === 0).length}
            </p>
            <p className="text-dark-text-secondary">Sin Stock</p>
          </div>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
        <h2 className="text-lg font-semibold text-dark-text mb-4">
          Ventas del Período
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  ID Venta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {getFilteredSales().slice(-10).reverse().map((sale) => (
                <tr key={sale.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-dark-text">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-dark-text">
                    #{sale.id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-dark-text">
                    {sale.customerName || 'Cliente General'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-dark-text">
                    {sale.items.length}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-accent">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {getFilteredSales().length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">
                No hay ventas registradas para este período
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
