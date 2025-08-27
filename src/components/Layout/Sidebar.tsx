import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  BarChart3,
  Store,
  X,
  Tags
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isOpen = true, onToggle }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Productos', icon: Package },
    { path: '/categories', label: 'Categorías', icon: Tags },
    { path: '/sales', label: 'Ventas', icon: ShoppingCart },
    { path: '/stock', label: 'Stock', icon: Warehouse },
    { path: '/reports', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-dark-card border-r border-dark-border flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Store className="w-8 h-8 text-accent" />
              <h1 className="text-xl font-bold text-dark-text">AlmacénPro</h1>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (location.pathname === '/' && item.path === '/dashboard');

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onToggle} // Close mobile menu on link click
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-dark-text-secondary hover:bg-dark-border hover:text-dark-text'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <p className="text-xs text-dark-text-secondary text-center">
            Sistema de Gestión v1.0
          </p>
        </div>
      </div>
    </>
  );
};
