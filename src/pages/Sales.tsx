import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Search, Trash2 } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, Sale, SaleItem } from '../types';

export const Sales = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(storageService.getProducts());
    setSales(storageService.getSales());
  };

  const filteredSales = sales.filter(sale =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NewSaleModal = ({ onClose, onSave }: {
    onClose: () => void;
    onSave: () => void;
  }) => {
    const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
    const [productSearch, setProductSearch] = useState('');

    const availableProducts = products.filter(product =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.barcode?.includes(productSearch) || ''
    );

    const addProductToSale = (product: Product) => {
      const existingItem = selectedItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          setSelectedItems(items =>
            items.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
                : item
            )
          );
        }
      } else {
        if (product.stock > 0) {
          setSelectedItems([...selectedItems, {
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.price,
            subtotal: product.price
          }]);
        }
      }
      setProductSearch('');
    };

    const updateQuantity = (productId: string, quantity: number) => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      if (quantity <= 0) {
        setSelectedItems(items => items.filter(item => item.productId !== productId));
      } else if (quantity <= product.stock) {
        setSelectedItems(items =>
          items.map(item =>
            item.productId === productId
              ? { ...item, quantity, subtotal: quantity * item.unitPrice }
              : item
          )
        );
      }
    };

    const removeItem = (productId: string) => {
      setSelectedItems(items => items.filter(item => item.productId !== productId));
    };

    const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.18; // 18% IVA
    const total = subtotal + tax;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (selectedItems.length === 0) {
        alert('Debe agregar al menos un producto');
        return;
      }

      const sale: Sale = {
        id: Date.now().toString(),
        items: selectedItems,
        subtotal,
        tax,
        total,
        paymentMethod,
        customerName: customerName || undefined,
        date: new Date()
      };

      storageService.saveSale(sale);
      onSave();
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-dark-card p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold text-dark-text mb-4">Nueva Venta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                  Cliente (Opcional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div>
                <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            {/* Product Search */}
            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Buscar Productos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                  placeholder="Buscar por nombre o código de barras..."
                />
              </div>
              
              {productSearch && (
                <div className="mt-2 max-h-40 overflow-y-auto bg-dark-bg border border-dark-border rounded-lg">
                  {availableProducts.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProductToSale(product)}
                      className="w-full text-left px-4 py-2 hover:bg-dark-card transition-colors border-b border-dark-border last:border-b-0"
                      disabled={product.stock === 0}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-dark-text font-medium">{product.name}</p>
                          <p className="text-dark-text-secondary text-sm">
                            ${product.price.toFixed(2)} - Stock: {product.stock}
                          </p>
                        </div>
                        {product.stock === 0 && (
                          <span className="text-danger text-sm">Sin stock</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Items */}
            <div>
              <h3 className="text-lg font-semibold text-dark-text mb-3">Productos Seleccionados</h3>
              {selectedItems.length > 0 ? (
                <div className="space-y-2">
                  {selectedItems.map(item => (
                    <div key={item.productId} className="flex items-center justify-between bg-dark-bg p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="text-dark-text font-medium">{item.productName}</p>
                        <p className="text-dark-text-secondary text-sm">
                          ${item.unitPrice.toFixed(2)} c/u
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 bg-dark-card border border-dark-border rounded text-dark-text hover:bg-dark-border"
                          >
                            -
                          </button>
                          <span className="text-dark-text font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 bg-dark-card border border-dark-border rounded text-dark-text hover:bg-dark-border"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-accent font-semibold w-20 text-right">
                          ${item.subtotal.toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-danger hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-text-secondary text-center py-4">
                  No hay productos seleccionados
                </p>
              )}
            </div>

            {/* Totals */}
            {selectedItems.length > 0 && (
              <div className="bg-dark-bg p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-dark-text">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-dark-text">
                    <span>IVA (18%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-accent border-t border-dark-border pt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
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
                disabled={selectedItems.length === 0}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Venta
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">Ventas</h1>
          <p className="text-dark-text-secondary">
            Registra y gestiona las ventas
          </p>
        </div>
        <button
          onClick={() => setShowNewSaleModal(true)}
          className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Venta</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar ventas por ID o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  ID Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShoppingCart className="w-8 h-8 text-accent bg-dark-bg p-1.5 rounded-lg mr-3" />
                      <div className="text-sm font-medium text-dark-text">
                        #{sale.id.slice(-6)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {sale.customerName || 'Cliente General'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {sale.items.length} productos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-dark-bg text-dark-text rounded-full capitalize">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-accent">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">No se encontraron ventas</p>
            </div>
          )}
        </div>
      </div>

      {/* New Sale Modal */}
      {showNewSaleModal && (
        <NewSaleModal
          onClose={() => setShowNewSaleModal(false)}
          onSave={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
};
