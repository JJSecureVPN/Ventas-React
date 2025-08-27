import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Product, Category } from '../types';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    setProducts(storageService.getProducts());
  };

  const loadCategories = () => {
    setCategories(storageService.getCategories());
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const deleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      storageService.deleteProduct(id);
      loadProducts();
    }
  };

  const ProductModal = ({ product, onClose, onSave }: {
    product?: Product | null;
    onClose: () => void;
    onSave: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      category: product?.category || (categories.length > 0 ? categories[0].id : 'otros'),
      price: product?.price || 0,
      stock: product?.stock || 0,
      minStock: product?.minStock || 5,
      barcode: product?.barcode || '',
      description: product?.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const productData: Product = {
        id: product?.id || Date.now().toString(),
        ...formData,
        createdAt: product?.createdAt || new Date(),
        updatedAt: new Date()
      };

      storageService.saveProduct(productData);
      onSave();
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-dark-card p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-dark-text mb-4">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                {categories.length === 0 && (
                  <option value="otros">Otros</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Código de Barras
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                rows={3}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">Productos</h1>
          <p className="text-dark-text-secondary">
            Gestiona tu inventario de productos
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o código de barras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-dark-card rounded-lg border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg border-b border-dark-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-dark-text-secondary uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-dark-bg transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-8 h-8 text-accent bg-dark-bg p-1.5 rounded-lg mr-3" />
                      <div>
                        <div className="text-sm font-medium text-dark-text">
                          {product.name}
                        </div>
                        {product.barcode && (
                          <div className="text-sm text-dark-text-secondary">
                            {product.barcode}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-dark-bg text-dark-text rounded-full capitalize">
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {product.stock} unidades
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock <= product.minStock
                        ? 'bg-warning/20 text-warning'
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {product.stock <= product.minStock ? 'Stock Bajo' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setShowModal(true);
                        }}
                        className="text-accent hover:text-accent-dark"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-danger hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            loadProducts();
          }}
        />
      )}
    </div>
  );
};
