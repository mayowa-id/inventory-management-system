import { RefreshCw } from 'lucide-react';

export function LoadingSpinner({ darkMode }) {
  return (
    <div className="loading-spinner">
      <RefreshCw className="spinner-icon" />
    </div>
  );
}