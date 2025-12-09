import React, { useState, useEffect } from 'react';
import { Building2, RefreshCw, MoreVertical, X } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';
import { Plus } from 'lucide-react';

export function WarehousesTab({ darkMode, onCreateClick }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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

  const closeModal = () => {
    setSelectedWarehouse(null);
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="section-header">
        <h2 className="section-title">Warehouses</h2>
{<div style={{ display: 'flex', gap: '0.5rem' }}>
  <button onClick={fetchWarehouses} className="refresh-button">
    <RefreshCw size={16} />
    Refresh
  </button>
  <button
    onClick={onCreateClick}
    className="refresh-button"
    style={{ background: 'linear-gradient(to right, #06b6d4, #3b82f6)' }}
  >
    <Plus size={16} />
    Add Warehouse
  </button>
</div> }
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
                
                {/* Three-dot menu for warehouse */}
                <div style={{ position: 'relative', marginLeft: 'auto' }}>
                  <button
                    onClick={() => setOpenMenuId(openMenuId === warehouse.id ? null : warehouse.id)}
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
                  {openMenuId === warehouse.id && (
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
                      <button
                        onClick={() => {
                          setSelectedWarehouse(warehouse);
                          setOpenMenuId(null);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          color: darkMode ? '#60a5fa' : '#2563eb',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = darkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        📋 View Details
                      </button>
                    </div>
                  )}
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

      {/* Modal for warehouse details */}
      {selectedWarehouse && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              borderRadius: '0.75rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                paddingBottom: '1rem'
              }}
            >
              <h2 style={{ color: darkMode ? '#ffffff' : '#0f172a', margin: 0 }}>
                Warehouse Details
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} color={darkMode ? '#cbd5e1' : '#64748b'} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  marginBottom: '1.5rem',
                  backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}
              >
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                  Warehouse Name
                </p>
                <p style={{ color: darkMode ? '#ffffff' : '#0f172a', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                  {selectedWarehouse.name}
                </p>
              </div>

              <div
                style={{
                  marginBottom: '1.5rem',
                  backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}
              >
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                  Location
                </p>
                <p style={{ color: darkMode ? '#ffffff' : '#0f172a', fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                  📍 {selectedWarehouse.location}
                </p>
              </div>

              <div
                style={{
                  marginBottom: '1.5rem',
                  backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}
              >
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                  Total Capacity
                </p>
                <p style={{ color: darkMode ? '#60a5fa' : '#2563eb', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  {selectedWarehouse.capacity} <span style={{ fontSize: '0.875rem', color: darkMode ? '#cbd5e1' : '#64748b' }}>units</span>
                </p>
              </div>

              <div
                style={{
                  backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                  padding: '1rem',
                  borderRadius: '0.5rem'
                }}
              >
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                  Warehouse ID
                </p>
                <p style={{ color: darkMode ? '#22d3ee' : '#0891b2', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  #{selectedWarehouse.id}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <button
              onClick={closeModal}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                marginTop: '1rem'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
