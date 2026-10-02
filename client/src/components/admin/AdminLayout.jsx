import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Tag,
  Star,
  Building2,
  Store,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, isAdmin, logout, quickLogin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // If not logged in as admin, provide a quick login banner
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-premium">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Admin Authorization Required</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            You must be logged in as an administrator to access the VRUKSHA corporate control panel.
          </p>
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={async () => {
                const res = await quickLogin('admin');
                if (res?.success) navigate('/admin');
              }}
              className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Sign In as Administrator
            </button>
            <Link
              to="/"
              className="block py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/bulk-orders', label: 'Bulk Inquiries', icon: Building2 },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
      isActive
        ? 'bg-forest-800 text-cream-50 shadow-sm'
        : 'text-cream-200/70 hover:bg-forest-900/60 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-forest-950 text-white p-4 flex items-center justify-between border-b border-forest-900">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg text-cream-200 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-serif font-bold text-lg">VRUKSHA Admin</span>
        </div>
        <Link to="/" className="text-xs text-forest-300 flex items-center gap-1 hover:underline">
          <Store className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-forest-950 text-cream-100 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-forest-900">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="VRUKSHA Admin"
                className="w-8 h-8 rounded-full object-cover shadow-xs"
              />
              <div>
                <span className="font-serif font-bold text-lg text-white block leading-tight">
                  VRUKSHA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                  Admin Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={linkClass}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer in Sidebar */}
        <div className="pt-6 border-t border-forest-900 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-cream-300 hover:bg-forest-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Live Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
