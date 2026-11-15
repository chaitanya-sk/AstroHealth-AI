import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AstronautProvider } from './contexts/AstronautContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { DashboardPlaceholderPage } from './pages/DashboardPlaceholderPage';

// Protected Route Component - Simple Placeholder for Current Development Stage
const ProtectedAppRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4">
        <div className="bg-[#0A101D] p-6 rounded-2xl border border-white/10 shadow-card flex items-center gap-3">
          <div className="h-6 w-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">Restoring Supabase Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardPlaceholderPage />;
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AstronautProvider>
          <Routes>
            {/* Public Standalone Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

            {/* Authenticated Application Placeholder Route */}
            <Route path="/app/*" element={<ProtectedAppRoute />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AstronautProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
