import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, StockMovement } from '../types';

export const Stock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(storageService.getProducts());
    setMovements(storageService.getStockMovements());
  };

  const StockModal = ({ onClose, onSave }: {
    onClose: () => void;
    onSave: () => void;
  }) => {
    const [formData, setFormData] = useState({
      productId: '',
      type: 'entrada' as 'entrada' | 'salida' | 'ajuste',
      quantity: 0,
      reason: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const movement: StockMovement = {
        id: Date.now().toString(),
        ...formData,
        date: new Date()
      };

      // Actualizar stock del producto
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        const quantityChange = formData.type === 'salida' ? -formData.quantity : formData.quantity;
        const updatedProduct = {
          ...product,
          stock: Math.max(0, product.stock + quantityChange),
          updatedAt: new Date()
        };
        storageService.saveProduct(updatedProduct);
      }

      storageService.saveStockMovement(movement);
      onSave();
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-dark-card p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-dark-text mb-4">Movimiento de Stock</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Producto
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock actual: {product.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Tipo de Movimiento
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              >
                <option value="entrada">Entrada (Agregar stock)</option>
                <option value="salida">Salida (Reducir stock)</option>
                <option value="ajuste">Ajuste (Corrección)</option>
              </select>
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Motivo
              </label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                rows={3}
                placeholder="Describe el motivo del movimiento..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-dark-border text-dark-text rounded-lg hover:bg-dark-bg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada': return <TrendingUp className="w-4 h-4 text-accent" />;
      case 'salida': return <TrendingDown className="w-4 h-4 text-danger" />;
      default: return <RotateCcw className="w-4 h-4 text-warning" />;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'entrada': return 'text-accent';
      case 'salida': return 'text-danger';
      default: return 'text-warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">Control de Stock</h1>
          <p className="text-dark-text-secondary">
            Gestiona entradas, salidas y ajustes de inventario
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Movimiento</span>
        </button>
      </div>

      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Productos con Stock</p>
              <p className="text-2xl font-bold text-accent mt-1">
                {products.filter(p => p.stock > 0).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Stock Bajo</p>
              <p className="text-2xl font-bold text-warning mt-1">
                {products.filter(p => p.stock <= p.minStock).length}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-warning" />
          </div>
        </div>
        
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-text-secondary text-sm font-medium">Sin Stock</p>
              <p className="text-2xl font-bold text-danger mt-1">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <RotateCcw className="w-8 h-8 text-danger" />
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-dark-text">Estado Actual del Inventario</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Valor del Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-dark-text">{product.name}</div>
                    <div className="text-sm text-dark-text-secondary capitalize">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {product.stock} unidades
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {product.minStock} unidades
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock === 0
                        ? 'bg-danger/20 text-danger'
                        : product.stock <= product.minStock
                        ? 'bg-warning/20 text-warning'
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {product.stock === 0 ? 'Sin Stock' : 
                       product.stock <= product.minStock ? 'Stock Bajo' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    ${(product.stock * product.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-dark-text">Movimientos Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {movements.slice(-10).reverse().map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                return (
                  <tr key={movement.id} className="hover:bg-dark-bg transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                      {new Date(movement.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                      {product?.name || 'Producto no encontrado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getMovementIcon(movement.type)}
                        <span className={`text-sm font-medium capitalize ${getMovementColor(movement.type)}`}>
                          {movement.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                      {movement.type === 'salida' ? '-' : '+'}{movement.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-text-secondary">
                      {movement.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {movements.length === 0 && (
            <div className="text-center py-8">
              <RotateCcw className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">No hay movimientos registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <StockModal
          onClose={() => setShowModal(false)}
          onSave={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
