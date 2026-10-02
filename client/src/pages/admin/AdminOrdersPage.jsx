import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ChevronDown, CheckCircle2, Clock, Truck, Eye } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { addToast } = useToast();

  const statuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/orders/all');
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        addToast(`Order ${orderId} updated to ${newStatus}`, 'success');
        fetchOrders();
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderNumber === orderId)) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      addToast('Failed to update order status', 'error');
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Order Management</h1>
          <p className="text-xs text-stone-500 mt-1">Review customer orders, transition fulfillment stages, and inspect invoices</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, or email..."
            className="w-full text-xs bg-transparent focus:outline-none text-stone-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white px-4 py-3 rounded-2xl border border-stone-200 text-xs font-bold text-stone-800 shadow-2xs focus:outline-none cursor-pointer"
        >
          <option value="all">All Statuses ({orders.length})</option>
          {statuses.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((ord) => (
                <tr key={ord.id || ord.orderNumber} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-stone-900">{ord.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-stone-900">{ord.customerInfo?.fullName}</p>
                    <p className="text-[10px] text-stone-400">{ord.customerInfo?.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">{formatDate(ord.createdAt)}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{formatPrice(ord.total)}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] uppercase font-bold text-stone-700">
                      {ord.paymentMethod}
                    </span>
                    <span className={`block text-[10px] ${ord.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord.id || ord.orderNumber, e.target.value)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider focus:outline-none cursor-pointer ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 text-stone-500 hover:text-forest-800 hover:bg-stone-100 rounded-lg inline-flex items-center gap-1 font-bold"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {selectedOrder.orderNumber}
                </h3>
                <p className="text-[11px] text-stone-400">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {/* Shipping Address */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-stone-700 block mb-1">Shipping To:</span>
              <p className="font-semibold text-stone-900">{selectedOrder.customerInfo?.fullName}</p>
              <p className="text-stone-600">
                {selectedOrder.shippingAddress?.house}, {selectedOrder.shippingAddress?.street}<br />
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </p>
              <p className="text-stone-500 pt-1">Phone: {selectedOrder.customerInfo?.phone}</p>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">Products</span>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                  <span>{item.name} ({item.size}) x {item.quantity}</span>
                  <span className="font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Quick Status Update */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Update Order Status:
              </label>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder.id || selectedOrder.orderNumber, e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 font-bold bg-white"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
