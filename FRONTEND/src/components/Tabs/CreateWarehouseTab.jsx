import React, { useState } from 'react';
import { X } from 'lucide-react';

export function CreateWarehouseTab({ darkMode, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', location: '', capacity: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.capacity) {
      alert('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          capacity: parseInt(formData.capacity)
        })
      });

      if (res.ok) {
        alert('Warehouse created successfully!');
        setFormData({ name: '', location: '', capacity: '' });
        onSuccess();
        onClose();
      } else {
        alert('Error creating warehouse');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating warehouse');
    }
  };

  return (
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
      onClick={onClose}
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
          <h2 style={{ color: darkMode ? '#ffffff' : '#0f172a', margin: 0 }}>Create New Warehouse</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
          >
            <X size={24} color={darkMode ? '#cbd5e1' : '#64748b'} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Warehouse Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Main Depot"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
              placeholder="e.g., Lagos, Nigeria"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Capacity (units) *
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="form-input"
              placeholder="e.g., 500"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn-apply">
              Create Warehouse
            </button>
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}