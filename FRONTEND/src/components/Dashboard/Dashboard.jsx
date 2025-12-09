import React, { useState } from 'react';
import { Header } from '../Header/Header';
import { TabNavigation } from '../Tabs/TabNavigation';
import { ProductsTab } from '../Tabs/ProductsTab';
import { OrdersTab } from '../Tabs/OrdersTab';
import { WarehousesTab } from '../Tabs/WarehousesTab';
import { SuppliersTab } from '../Tabs/SuppliersTab';
import { ReorderTab } from '../Tabs/ReorderTab';
import { CreateProductTab } from '../Tabs/CreateProductTab';
import { CreateWarehouseTab } from '../Tabs/CreateWarehouseTab';
import { CreateOrderTab } from '../Tabs/CreateOrderTab';

export function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="main-container">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />

        {activeTab === 'products' && (
          <ProductsTab 
            darkMode={darkMode} 
            key={refreshKey}
            onCreateClick={() => setShowCreateProduct(true)}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab 
            darkMode={darkMode}
            key={refreshKey}
            onCreateClick={() => setShowCreateOrder(true)}
          />
        )}
        {activeTab === 'warehouses' && (
          <WarehousesTab 
            darkMode={darkMode}
            key={refreshKey}
            onCreateClick={() => setShowCreateWarehouse(true)}
          />
        )}
        {activeTab === 'suppliers' && <SuppliersTab darkMode={darkMode} key={refreshKey} />}
        {activeTab === 'reorder' && <ReorderTab darkMode={darkMode} />}
      </div>

      {showCreateProduct && (
        <CreateProductTab
          darkMode={darkMode}
          onClose={() => setShowCreateProduct(false)}
          onSuccess={handleRefresh}
        />
      )}

      {showCreateWarehouse && (
        <CreateWarehouseTab
          darkMode={darkMode}
          onClose={() => setShowCreateWarehouse(false)}
          onSuccess={handleRefresh}
        />
      )}

      {showCreateOrder && (
        <CreateOrderTab
          darkMode={darkMode}
          onClose={() => setShowCreateOrder(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
