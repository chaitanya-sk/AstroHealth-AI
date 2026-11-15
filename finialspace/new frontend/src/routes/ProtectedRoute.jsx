import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'var(--bg-primary, #090B10)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          position: 'relative',
        }}
        className="space-bg-grid"
      >
        <div
          style={{
            background: 'var(--card-bg, rgba(16, 20, 28, 0.85))',
            border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
            borderRadius: '20px',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          }}
          className="glass-panel cyber-corners"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(40, 184, 232, 0.25)',
              borderTopColor: 'var(--cosmic-cyan, #28B8E8)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-tech)',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#FFF',
              }}
            >
              VERIFYING CRYPTOGRAPHIC SESSION...
            </div>
            <div
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-secondary, #94A3B8)',
                marginTop: '2px',
              }}
            >
              Astra Health Deep Space Telemetry Link
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
