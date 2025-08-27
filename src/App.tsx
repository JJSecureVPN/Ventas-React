import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header.tsx';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products.tsx';
import { Categories } from './pages/Categories.tsx';
import { Sales } from './pages/Sales.tsx';
import { Stock } from './pages/Stock.tsx';
import { Reports } from './pages/Reports.tsx';
import { storageService } from './services/storage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    // Inicializar datos de ejemplo en el primer uso
    storageService.initializeData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="flex h-screen bg-dark-bg text-dark-text overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={closeSidebar} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuToggle={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
