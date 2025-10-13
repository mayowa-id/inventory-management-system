import React, { useState } from 'react';
import { Header } from '../Header/Header';
import { TabNavigation } from '../Tabs/TabNavigation';
import { ProductsTab } from '../Tabs/ProductsTab';
import { OrdersTab } from '../Tabs/OrdersTab';
import { WarehousesTab } from '../Tabs/WarehousesTab';

export function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="main-container">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
        {activeTab === 'products' && <ProductsTab darkMode={darkMode} />}
        {activeTab === 'orders' && <OrdersTab darkMode={darkMode} />}
        {activeTab === 'warehouses' && <WarehousesTab darkMode={darkMode} />}
      </div>
    </div>
  );
}