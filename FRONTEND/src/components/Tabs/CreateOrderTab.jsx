import React, { useState } from 'react';
import { X } from 'lucide-react';

export function CreateOrderTab({ darkMode, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    warehouseId: '',
    quantityOrdered: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.warehouseId || !formData.quantityOrdered) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(formData.productId),
          supplierId: formData.supplierId ? parseInt(formData.supplierId) : null,
          warehouseId: parseInt(formData.warehouseId),
          quantityOrdered: parseInt(formData.quantityOrdered)
        })
      });

      if (res.ok) {
        alert('Purchase order created successfully!');
        setFormData({ productId: '', supplierId: '', warehouseId: '', quantityOrdered: '' });
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Error creating order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating order');
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
          <h2 style={{ color: darkMode ? '#ffffff' : '#0f172a', margin: 0 }}>Create Purchase Order</h2>
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
              
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="form-input"
              placeholder="e.g., SKU-001"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Supplier ID
            </label>
            <input
              type="number"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="form-input"
              placeholder="e.g., 1 (optional)"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Warehouse ID *
            </label>
            <input
              type="number"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              className="form-input"
              placeholder="e.g., 1"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: darkMode ? '#cbd5e1' : '#64748b', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
              Quantity Ordered *
            </label>
            <input
              type="number"
              value={formData.quantityOrdered}
              onChange={(e) => setFormData({ ...formData, quantityOrdered: e.target.value })}
              className="form-input"
              placeholder="e.g., 20"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn-apply">
              Create Order
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