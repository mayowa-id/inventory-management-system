import React, { useState, useEffect } from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';

export function ProductsTab({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('1');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (productId) => {
    if (!adjustmentDelta || isNaN(adjustmentDelta)) {
      alert('Please enter a valid number');
      return;
    }

    try {
      await api.products.adjustStock(productId, parseInt(selectedWarehouse), parseInt(adjustmentDelta));
      setAdjustmentDelta('');
      setSelectedProduct(null);
      fetchProducts();
      alert('Stock adjusted successfully!');
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Error adjusting stock');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="section-header">
        <h2 className="section-title">Product Inventory</h2>
        <button onClick={fetchProducts} className="refresh-button">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner darkMode={darkMode} />
      ) : products.length === 0 ? (
        <EmptyState message="No products found. Make sure your backend is running." darkMode={darkMode} />
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <div className="product-info-left">
                  <div className="product-name-row">
                    <Package className="product-icon" size={20} />
                    <h3 className="product-name">{product.name}</h3>
                  </div>
                  <p className="product-sku">SKU: {product.sku}</p>
                  <p className="product-description">{product.description}</p>
                </div>
                <div className="product-stock">
                  <p className="stock-number">{product.currentStock || 0}</p>
                  <p className="stock-label">units in stock</p>
                </div>
              </div>

              <div className="product-footer">
                <div className="reorder-level">
                  <span className="reorder-label">Reorder Level:</span>
                  <span className="reorder-value">{product.reorderThreshold}</span>
                </div>
                <button
                  onClick={() => setSelectedProduct(product.id)}
                  className="adjust-button"
                >
                  Adjust Stock
                </button>
              </div>

              {selectedProduct === product.id && (
                <div className="adjustment-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Warehouse</label>
                      <select
                        value={selectedWarehouse}
                        onChange={(e) => setSelectedWarehouse(e.target.value)}
                        className="form-select"
                      >
                        <option value="1">Warehouse 1</option>
                        <option value="2">Warehouse 2</option>
                        <option value="3">Warehouse 3</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity Change</label>
                      <input
                        type="number"
                        value={adjustmentDelta}
                        onChange={(e) => setAdjustmentDelta(e.target.value)}
                        placeholder="e.g., -15 or +20"
                        className="form-input"
                      />
                    </div>
                    <div className="form-buttons">
                      <button
                        onClick={() => adjustStock(product.id)}
                        className="btn-apply"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}