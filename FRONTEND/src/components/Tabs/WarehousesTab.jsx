import React, { useState, useEffect } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';

export function WarehousesTab({ darkMode }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const data = await api.warehouses.getAll();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="section-header">
        <h2 className="section-title">Warehouses</h2>
        <button onClick={fetchWarehouses} className="refresh-button">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner darkMode={darkMode} />
      ) : warehouses.length === 0 ? (
        <EmptyState message="No warehouses found." darkMode={darkMode} />
      ) : (
        <div>
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="warehouse-card">
              <div className="warehouse-header">
                <Building2 className="warehouse-icon" size={24} />
                <div>
                  <h3 className="warehouse-name">{warehouse.name}</h3>
                  <p className="warehouse-location">📍 {warehouse.location}</p>
                </div>
              </div>

              <div className="warehouse-grid">
                <div className="warehouse-stat">
                  <p className="stat-label">Total Capacity</p>
                  <p className="stat-value">
                    {warehouse.capacity}
                    <span className="stat-unit"> units</span>
                  </p>
                </div>
                <div className="warehouse-stat">
                  <p className="stat-label">Warehouse ID</p>
                  <p className="stat-value">#{warehouse.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}