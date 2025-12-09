import React, { useState } from 'react';
import { Package, X } from 'lucide-react';

export function CreateProductTab({ darkMode, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    reorderThreshold: '',
    defaultSupplierId: '1'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sku || !formData.name || !formData.reorderThreshold) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: formData.sku,
          name: formData.name,
          description: formData.description,
          reorderThreshold: parseInt(formData.reorderThreshold),
          defaultSupplierId: parseInt(formData.defaultSupplierId)
        })
      });

      if (res.ok) {
        alert('Product created successfully!');
        setFormData({ sku: '', name: '', description: '', reorderThreshold: '', defaultSupplierId: '1' });
        onSuccess();
        onClose();
      } else {
        alert('Error creating product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
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
          <h2 style={{ color: darkMode ? '#ffffff' : '#0f172a', margin: 0 }}>Create New Product</h2>
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
              Product ID *
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="form-input"
              placeholder="e.g., SKU-001"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., Widget A"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              placeholder="Product description"
              rows="3"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Reorder Threshold *
            </label>
            <input
              type="number"
              value={formData.reorderThreshold}
              onChange={(e) => setFormData({ ...formData, reorderThreshold: e.target.value })}
              className="form-input"
              placeholder="e.g., 10"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Default Supplier ID
            </label>
            <input
              type="number"
              value={formData.defaultSupplierId}
              onChange={(e) => setFormData({ ...formData, defaultSupplierId: e.target.value })}
              className="form-input"
              placeholder="1"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn-apply">
              Create Product
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