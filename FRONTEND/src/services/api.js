const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const api = {
  products: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/products`);
      return res.json();
    },
    adjustStock: async (productId, warehouseId, delta) => {
      const res = await fetch(`${API_BASE}/products/${productId}/adjust-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouseId, delta })
      });
      return res.json();
    }
  },
  orders: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/purchase-orders`);
      return res.json();
    }
  },
  warehouses: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/warehouses`);
      return res.json();
    }
  }
};
