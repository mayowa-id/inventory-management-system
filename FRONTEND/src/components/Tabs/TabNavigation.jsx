import { Package, Truck, Building2 } from 'lucide-react';

export function TabNavigation({ activeTab, onTabChange, darkMode }) {
  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'warehouses', label: 'Warehouses', icon: Building2 }
  ];

  return (
    <div className="tab-nav">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`tab-button ${activeTab === id ? 'active' : 'inactive'}`}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </div>
  );
}