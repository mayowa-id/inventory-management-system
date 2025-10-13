import React, { useState, useEffect } from 'react';
import { Truck, AlertCircle, TrendingDown, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';

export function OrdersTab({ darkMode }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'COMPLETED') return <Truck size={20} />;
    if (status === 'ALERT') return <AlertCircle size={20} />;
    return <TrendingDown size={20} />;
  };

  const getStatusClass = (status) => {
    if (status === 'COMPLETED') return 'completed';
    if (status === 'ALERT') return 'alert';
    return 'pending';
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="section-header">
        <h2 className="section-title">Purchase Orders</h2>
        <button onClick={fetchOrders} className="refresh-button">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner darkMode={darkMode} />
      ) : orders.length === 0 ? (
        <EmptyState message="No purchase orders found." darkMode={darkMode} />
      ) : (
        <div>
          {orders.map((order) => {
            const statusClass = getStatusClass(order.status);
            return (
              <div key={order.id} className={`order-card ${statusClass}`}>
                <div className="order-header">
                  <div style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
                    <div className={`order-icon-box ${statusClass}`}>
                      <div className="order-icon">
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                    <div className="order-info">
                      <h3 className="order-id">Order #{order.id}</h3>
                      <p className="order-detail">Product ID: <strong>#{order.productId}</strong></p>
                      <p className="order-detail">Quantity: <strong>{order.quantityOrdered} units</strong></p>
                      <p className="order-detail">Warehouse: <strong>#{order.warehouseId}</strong></p>
                    </div>
                  </div>
                  <span className={`status-badge ${statusClass}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}