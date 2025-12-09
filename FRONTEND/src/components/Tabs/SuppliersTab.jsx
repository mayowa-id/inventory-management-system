import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Plus, X } from 'lucide-react';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';

export function SuppliersTab({ darkMode }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contactInfo: { email: formData.email, phone: formData.phone }
        })
      });

      if (res.ok) {
        alert('Supplier created successfully!');
        setFormData({ name: '', email: '', phone: '' });
        setShowForm(false);
        fetchSuppliers();
      } else {
        alert('Error creating supplier');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating supplier');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="section-header">
        <h2 className="section-title">Suppliers</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={fetchSuppliers} className="refresh-button">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="refresh-button"
            style={{ background: 'linear-gradient(to right, #06b6d4, #3b82f6)' }}
          >
            <Plus size={16} />
            Add Supplier
          </button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: darkMode ? '#ffffff' : '#0f172a', margin: 0 }}>Create New Supplier</h3>
            <button
              onClick={() => setShowForm(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
            >
              <X size={20} color={darkMode ? '#cbd5e1' : '#64748b'} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                Supplier Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="e.g., Acme Supplies"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                placeholder="supplier@example.com"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
                placeholder="07000000000"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-apply">
                Create Supplier
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner darkMode={darkMode} />
      ) : suppliers.length === 0 ? (
        <EmptyState message="No suppliers found. Click 'Add Supplier' to create one." darkMode={darkMode} />
      ) : (
        <div>
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="product-card"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <User size={20} style={{ color: '#22d3ee' }} />
                  <h3 style={{ color: darkMode ? '#ffffff' : '#0f172a', margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {supplier.name}
                  </h3>
                </div>
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                  Email: {supplier.contactInfo?.email || 'N/A'}
                </p>
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                  Phone: {supplier.contactInfo?.phone || 'N/A'}
                </p>
              </div>
              <div style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.75rem', margin: 0 }}>ID</p>
                <p style={{ color: darkMode ? '#60a5fa' : '#2563eb', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>#{supplier.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}