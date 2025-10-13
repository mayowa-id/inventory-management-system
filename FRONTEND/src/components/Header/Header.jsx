import { Package, Sun, Moon } from 'lucide-react';

export function Header({ darkMode, onToggleDarkMode }) {
  return (
    <div className="header">
      <div className="header-container">
        <div className="header-content">
          <Package className="header-icon" />
          <div>
            <h1 className="header-title">Inventory Manager</h1>
            <p className="header-subtitle">Real-time stock and order management</p>
          </div>
        </div>
        <button className="theme-toggle" onClick={onToggleDarkMode}>
          {darkMode ? <Sun className="header-icon" /> : <Moon className="header-icon" />}
        </button>
      </div>
    </div>
  );
}