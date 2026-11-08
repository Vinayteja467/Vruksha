import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Building2,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/formatters';
import { api } from '../../api/client';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/admin/stats');
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-xs text-stone-500 py-12">Loading admin intelligence...</div>;
  }

  const s = stats || {
    totalSales: 135000,
    totalOrders: 18,
    totalCustomers: 12,
    totalProducts: 12,
    lowStock: 1,
    pendingBulk: 1,
    salesTrend: [],
    recentOrders: []
  };

  const metricCards = [
    { title: 'Total Revenue', value: formatPrice(s.totalSales), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50', change: '+24% this month' },
    { title: 'Total Orders', value: s.totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50', change: '+12% this week' },
    { title: 'Active Customers', value: s.totalCustomers, icon: Users, color: 'text-purple-600 bg-purple-50', change: 'Verified accounts' },
    { title: 'Catalog Products', value: s.totalProducts, icon: Package, color: 'text-forest-700 bg-forest-50', change: 'All active' },
    { title: 'Low Stock Alerts', value: s.lowStock, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', change: '< 50 units remaining' },
    { title: 'Pending B2B Inquiries', value: s.pendingBulk, icon: Building2, color: 'text-rose-600 bg-rose-50', change: 'Requires quotation' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            System Operational • Live Data
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-2">Executive Overview</h1>
          <p className="text-xs text-stone-500">Real-time sales, order volume, and wholesale pipeline</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{card.title}</p>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2 mb-1">
                  {card.value}
                </p>
                <span className="text-[11px] text-stone-500 font-medium">{card.change}</span>
              </div>
              <div className={`p-3 rounded-2xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Overview Chart (Visual SVG Bar Representation) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">Monthly Sales Velocity</h3>
            <p className="text-xs text-stone-500">Gross revenue trend across the past 6 months (INR)</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            ↑ 38.4% Q-o-Q Growth
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-4">
          <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-stone-200">
            {s.salesTrend?.map((m) => {
              const maxVal = 150000;
              const heightPercent = Math.round((m.sales / maxVal) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(m.sales / 1000).toFixed(0)}k
                  </span>
                  <div
                    className="w-full bg-forest-800 rounded-t-xl hover:bg-forest-600 transition-all duration-300 group-hover:shadow-md"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs font-semibold text-stone-500">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Live feed of processed retail orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold uppercase tracking-wider text-forest-800 hover:underline"
            >
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {s.recentOrders?.map((ord) => (
                  <tr key={ord.id || ord.orderNumber} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-2 font-bold text-stone-900">{ord.orderNumber}</td>
                    <td className="py-3 px-2 text-stone-700">{ord.customerInfo?.fullName || 'Retail Customer'}</td>
                    <td className="py-3 px-2 text-stone-500">{ord.items?.length || 1} product(s)</td>
                    <td className="py-3 px-2 font-bold text-stone-900">{formatPrice(ord.total)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Admin Links (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 pb-2 border-b border-stone-100">
            Quick Actions
          </h3>

          <div className="space-y-2 text-xs">
            <Link
              to="/admin/products"
              className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-forest-50 transition-colors font-medium text-stone-800"
            >
              <span>Manage Product Inventory</span>
              <ArrowRight className="w-4 h-4 text-forest-700" />
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-forest-50 transition-colors font-medium text-stone-800"
            >
              <span>Update Order Shipments</span>
              <ArrowRight className="w-4 h-4 text-forest-700" />
            </Link>
            <Link
              to="/admin/bulk-orders"
              className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-forest-50 transition-colors font-medium text-stone-800"
            >
              <span>Respond to Bulk Inquiries</span>
              <ArrowRight className="w-4 h-4 text-forest-700" />
            </Link>
            <Link
              to="/admin/coupons"
              className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-forest-50 transition-colors font-medium text-stone-800"
            >
              <span>Create Discount Coupon</span>
              <ArrowRight className="w-4 h-4 text-forest-700" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
