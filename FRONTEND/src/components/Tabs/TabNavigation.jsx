import { Package, Truck, Building2, User, Zap } from 'lucide-react';

export function TabNavigation({ activeTab, onTabChange, darkMode }) {
  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'warehouses', label: 'Warehouses', icon: Building2 },
    { id: 'suppliers', label: 'Suppliers', icon: User },
    { id: 'reorder', label: 'Reorder Scan', icon: Zap }
  ];

  return (
    <div className="tab-nav" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`tab-button ${activeTab === id ? 'active' : 'inactive'}`}
          style={{ flexShrink: 0 }}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </div>
  );
}
