import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-500 font-medium">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-cream-50">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-cream-200 font-medium">Validating administrative credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Access Denied</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your account does not possess administrator privileges.
          </p>
          <a
            href="/"
            className="block w-full py-3 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            Return to Storefront
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || '/account';
    return <Navigate to={destination} replace />;
  }

  return children;
};
