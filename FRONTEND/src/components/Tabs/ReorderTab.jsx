import React, { useState } from 'react';
import { Zap, RefreshCw } from 'lucide-react';

export function ReorderTab({ darkMode }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runReorderScan = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/v1/reorder/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      if (res.ok) {
        setResult({ success: true, message: 'Reorder scan completed successfully!' });
        setTimeout(() => setResult(null), 5000);
      } else {
        setResult({ success: false, message: 'Error running reorder scan' });
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({ success: false, message: 'Error running reorder scan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="section-header">
        <h2 className="section-title">Automatic Reorder Scan</h2>
      </div>

      <div
        style={{
          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
          border: `2px dashed ${darkMode ? '#334155' : '#e2e8f0'}`,
          borderRadius: '0.75rem',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <Zap
          size={48}
          style={{
            color: darkMode ? '#60a5fa' : '#2563eb',
            marginBottom: '1rem',
            margin: '0 auto 1rem'
          }}
        />
        <h3 style={{ color: darkMode ? '#ffffff' : '#0f172a', marginBottom: '0.5rem' }}>
          Run Automatic Reorder Scan
        </h3>
        <p style={{ color: darkMode ? '#cbd5e1' : '#64748b', marginBottom: '1.5rem' }}>
          This will automatically check all products in warehouses and create purchase orders for items below their reorder threshold.
        </p>

        <button
          onClick={runReorderScan}
          disabled={loading}
          style={{
            background: loading ? '#94a3b8' : 'linear-gradient(to right, #06b6d4, #3b82f6)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto'
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Running...
            </>
          ) : (
            <>
              <Zap size={20} />
              Run Scan Now
            </>
          )}
        </button>

        {result && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: result.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${result.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
              borderRadius: '0.5rem',
              color: result.success ? '#22c55e' : '#ef4444'
            }}
          >
            {result.message}
          </div>
        )}
      </div>

      <div
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}
      >
        <h4 style={{ color: darkMode ? '#ffffff' : '#0f172a', marginTop: 0 }}>How it works:</h4>
        <ul style={{ color: darkMode ? '#cbd5e1' : '#64748b', marginBottom: 0 }}>
          <li>Monitors product stock levels across all warehouses</li>
          <li>Identifies products below their reorder threshold</li>
          <li>Automatically creates purchase orders from default suppliers</li>
          <li>Respects warehouse capacity constraints</li>
          <li>Calculates expected arrival dates based on lead time</li>
        </ul>
      </div>
    </div>
  );
}