import type { Product, Sale, StockMovement, Category } from '../types';

// Almacenamiento local simulado
class LocalStorageService {
  private getItem<T>(key: string): T[] {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Categorías
  getCategories(): Category[] {
    return this.getItem<Category>('categories');
  }

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const existingIndex = categories.findIndex(c => c.id === category.id);
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    this.setItem('categories', categories);
  }

  deleteCategory(id: string): boolean {
    const products = this.getProducts();
    const hasProducts = products.some(product => product.category === id);
    
    if (hasProducts) {
      return false; // No se puede eliminar si tiene productos asociados
    }
    
    const categories = this.getCategories().filter(c => c.id !== id);
    this.setItem('categories', categories);
    return true;
  }

  // Productos
  getProducts(): Product[] {
    return this.getItem<Product>('products');
  }

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    this.setItem('products', products);
  }

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.setItem('products', products);
  }

  // Ventas
  getSales(): Sale[] {
    return this.getItem<Sale>('sales');
  }

  saveSale(sale: Sale): void {
    const sales = this.getSales();
    sales.push(sale);
    this.setItem('sales', sales);
    
    // Actualizar stock
    sale.items.forEach(item => {
      this.updateProductStock(item.productId, -item.quantity);
    });
  }

  // Movimientos de stock
  getStockMovements(): StockMovement[] {
    return this.getItem<StockMovement>('stockMovements');
  }

  saveStockMovement(movement: StockMovement): void {
    const movements = this.getStockMovements();
    movements.push(movement);
    this.setItem('stockMovements', movements);
  }

  private updateProductStock(productId: string, quantity: number): void {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      product.stock += quantity;
      product.updatedAt = new Date();
      this.setItem('products', products);
    }
  }

  // Datos de ejemplo
  initializeData(): void {
    // Inicializar categorías por defecto
    if (this.getCategories().length === 0) {
      const defaultCategories: Category[] = [
        {
          id: 'bebidas',
          name: 'Bebidas',
          description: 'Refrescos, jugos, agua, etc.',
          color: '#3b82f6',
          createdAt: new Date()
        },
        {
          id: 'comestibles',
          name: 'Comestibles',
          description: 'Alimentos y productos para cocinar',
          color: '#10b981',
          createdAt: new Date()
        },
        {
          id: 'limpieza',
          name: 'Artículos de Limpieza',
          description: 'Detergentes, desinfectantes, etc.',
          color: '#8b5cf6',
          createdAt: new Date()
        },
        {
          id: 'higiene',
          name: 'Higiene Personal',
          description: 'Jabones, champús, pasta dental, etc.',
          color: '#f59e0b',
          createdAt: new Date()
        },
        {
          id: 'hogar',
          name: 'Artículos del Hogar',
          description: 'Utensilios, decoración, etc.',
          color: '#ef4444',
          createdAt: new Date()
        },
        {
          id: 'otros',
          name: 'Otros',
          description: 'Productos varios',
          color: '#6b7280',
          createdAt: new Date()
        }
      ];
      
      defaultCategories.forEach(category => this.saveCategory(category));
    }

    if (this.getProducts().length === 0) {
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Coca Cola 500ml',
          category: 'bebidas',
          price: 2.50,
          stock: 50,
          minStock: 10,
          barcode: '7501055309123',
          description: 'Bebida gaseosa sabor cola',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'Arroz Blanco 1kg',
          category: 'comestibles',
          price: 3.75,
          stock: 25,
          minStock: 5,
          barcode: '7501030123456',
          description: 'Arroz grano largo premium',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Detergente Ariel 1L',
          category: 'limpieza',
          price: 8.90,
          stock: 15,
          minStock: 3,
          barcode: '7501001234567',
          description: 'Detergente líquido para ropa',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          name: 'Shampoo Head & Shoulders',
          category: 'higiene',
          price: 12.50,
          stock: 20,
          minStock: 5,
          barcode: '7501002345678',
          description: 'Shampoo anticaspa 400ml',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '5',
          name: 'Papel Higiénico Suave 4 rollos',
          category: 'higiene',
          price: 4.25,
          stock: 30,
          minStock: 8,
          barcode: '7501003456789',
          description: 'Papel higiénico suave doble hoja',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      sampleProducts.forEach(product => this.saveProduct(product));
    }
  }
}

export const storageService = new LocalStorageService();
