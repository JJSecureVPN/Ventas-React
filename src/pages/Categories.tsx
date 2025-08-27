import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tags, Save, X } from 'lucide-react';
import { storageService } from '../services/storage';
import type { Category } from '../types';

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(storageService.getCategories());
  };

  const deleteCategory = (id: string) => {
    const success = storageService.deleteCategory(id);
    if (success) {
      loadCategories();
    } else {
      alert('No se puede eliminar esta categoría porque tiene productos asociados');
    }
  };

  const CategoryModal = ({ 
    category, 
    onClose, 
    onSave 
  }: {
    category?: Category | null;
    onClose: () => void;
    onSave: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      description: category?.description || '',
      color: category?.color || '#10b981'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const categoryData: Category = {
        id: category?.id || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        ...formData,
        createdAt: category?.createdAt || new Date()
      };

      storageService.saveCategory(categoryData);
      onSave();
      onClose();
    };

    const predefinedColors = [
      '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
      '#ef4444', '#06b6d4', '#84cc16', '#f97316',
      '#ec4899', '#6366f1', '#14b8a6', '#6b7280'
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-dark-card p-6 rounded-lg w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark-text">
              {category ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button
              onClick={onClose}
              className="text-dark-text-secondary hover:text-dark-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                placeholder="Ej: Electrodomésticos"
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
                placeholder="Descripción opcional de la categoría"
              />
            </div>

            <div>
              <label className="block text-dark-text-secondary text-sm font-medium mb-2">
                Color
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-10 h-10 rounded border border-dark-border cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-accent"
                  placeholder="#10b981"
                />
              </div>
              
              {/* Colores predefinidos */}
              <div className="grid grid-cols-6 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`w-8 h-8 rounded border-2 transition-transform hover:scale-110 ${
                      formData.color === color ? 'border-white' : 'border-dark-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
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
          <h1 className="text-2xl font-bold text-dark-text mb-2">Categorías</h1>
          <p className="text-dark-text-secondary">
            Gestiona las categorías de tus productos
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const products = storageService.getProducts().filter(p => p.category === category.id);
          
          return (
            <div
              key={category.id}
              className="bg-dark-card p-4 rounded-lg border border-dark-border hover:border-accent/50 transition-colors"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold text-dark-text">{category.name}</h3>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowModal(true);
                    }}
                    className="p-1.5 text-dark-text-secondary hover:text-accent rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-1.5 text-dark-text-secondary hover:text-danger rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Info */}
              <div className="space-y-2">
                {category.description && (
                  <p className="text-dark-text-secondary text-sm">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-text-secondary">Productos:</span>
                  <span className="font-medium text-dark-text">{products.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-text-secondary">Total stock:</span>
                  <span className="font-medium text-dark-text">
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mt-3 pt-3 border-t border-dark-border">
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  <Tags className="w-3 h-3 mr-1" />
                  {category.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <Tags className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-text mb-2">No hay categorías</h3>
          <p className="text-dark-text-secondary mb-4">
            Crea tu primera categoría para organizar tus productos
          </p>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="inline-flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Categoría</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            loadCategories();
          }}
        />
      )}
    </div>
  );
};
