import { Search, Bell, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-dark-card border-b border-dark-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section with mobile menu button */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar productos, ventas..."
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Date - Hidden on small screens */}
          <div className="hidden md:block text-sm text-dark-text-secondary capitalize">
            {currentDate}
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-dark-text-secondary hover:text-accent transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-sm">
              <div className="text-dark-text font-medium">Admin</div>
              <div className="text-dark-text-secondary">En línea</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
