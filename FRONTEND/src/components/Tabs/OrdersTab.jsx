import React, { useState, useEffect } from 'react';
import { Truck, AlertCircle, TrendingDown, RefreshCw, MoreVertical } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';

export function OrdersTab({ darkMode }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

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

  const markOrderAsArrived = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/purchase-orders/${orderId}/arrive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('Order marked as arrived!');
        setOpenMenuId(null);
        fetchOrders();
      } else {
        alert(data.error || 'Error marking order as arrived');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error marking order as arrived');
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`status-badge ${statusClass}`}>
                      {order.status}
                    </span>
                    
                    {/* Three-dot menu */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MoreVertical size={20} color={darkMode ? '#cbd5e1' : '#64748b'} />
                      </button>

                      {/* Dropdown menu */}
                      {openMenuId === order.id && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                            borderRadius: '0.5rem',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            zIndex: 10,
                            minWidth: '200px'
                          }}
                        >
                          {order.status !== 'COMPLETED' && (
                            <button
                              onClick={() => markOrderAsArrived(order.id)}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                color: darkMode ? '#22c55e' : '#16a34a',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = darkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                              }}
                            >
                              ✓ Mark as Arrived
                            </button>
                          )}
                          {order.status === 'COMPLETED' && (
                            <div
                              style={{
                                padding: '0.75rem 1rem',
                                color: darkMode ? '#94a3b8' : '#94a3b8',
                                fontSize: '0.875rem',
                                fontStyle: 'italic'
                              }}
                            >
                              Order already completed
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
