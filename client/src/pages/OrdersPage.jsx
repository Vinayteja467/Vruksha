import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, CheckCircle2, Clock, AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { formatPrice, formatDate, formatDateTime } from '../utils/formatters';
import { api } from '../api/client';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const stages = ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await api.get('/orders/myorders');
        if (data.success) {
          setOrders(data.orders || []);
          if (data.orders?.length > 0) {
            setSelectedOrder(data.orders[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStageIndex = (status) => {
    const idx = stages.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-cream-200">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest-950">My Orders & Shipments</h1>
            <p className="text-xs text-stone-500 mt-1">Live fulfillment tracking and status timeline</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest-800 hover:text-forest-600"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-cream-200 text-center text-xs text-stone-500">
            Loading order histories...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-cream-200 text-center max-w-md mx-auto space-y-4 shadow-soft">
            <Package className="w-12 h-12 text-stone-300 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-forest-950">No orders placed yet</h2>
            <p className="text-xs text-stone-500">Discover our collection of 100% natural products for everyday wellness.</p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Orders List (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 block mb-2">
                All Orders ({orders.length})
              </span>
              {orders.map((ord) => (
                <div
                  key={ord.id || ord.orderNumber}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedOrder?.id === ord.id || selectedOrder?.orderNumber === ord.orderNumber
                      ? 'bg-white border-forest-800 shadow-elevated ring-2 ring-forest-100'
                      : 'bg-white/80 border-cream-200 hover:bg-white shadow-soft'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif font-bold text-sm text-forest-950">
                      {ord.orderNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                    <span>{formatDate(ord.createdAt)}</span>
                    <span className="font-bold text-forest-950">{formatPrice(ord.total)}</span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto">
                    {ord.items?.slice(0, 3).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-lg object-cover bg-cream-100 flex-shrink-0"
                      />
                    ))}
                    {ord.items?.length > 3 && (
                      <span className="text-[10px] text-stone-400 font-bold bg-cream-100 w-8 h-8 rounded-lg flex items-center justify-center">
                        +{ord.items.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Order Detailed Tracking Timeline (7 cols) */}
            {selectedOrder && (
              <div className="lg:col-span-7 bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-soft space-y-8 sticky top-28">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                      Order Details
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-forest-950 mt-1">
                      {selectedOrder.orderNumber}
                    </h2>
                    <p className="text-xs text-stone-500">Placed on {formatDateTime(selectedOrder.createdAt)}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Payment</span>
                    <span className="text-xs font-bold text-forest-900 uppercase">
                      {selectedOrder.paymentMethod} • {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* 6-Stage Visual Timeline */}
                <div>
                  <h3 className="font-serif font-bold text-base text-forest-950 mb-6">
                    Fulfillment Progress
                  </h3>

                  <div className="relative">
                    {/* Progress Bar background */}
                    <div className="hidden sm:block absolute top-3.5 left-4 right-4 h-1 bg-cream-200 z-0" />
                    <div
                      className="hidden sm:block absolute top-3.5 left-4 h-1 bg-forest-700 transition-all duration-500 z-0"
                      style={{
                        width: `${(getStageIndex(selectedOrder.orderStatus) / (stages.length - 1)) * 90}%`
                      }}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                      {stages.map((st, idx) => {
                        const currentIdx = getStageIndex(selectedOrder.orderStatus);
                        const isCompleted = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div key={st} className="flex flex-col sm:items-center text-left sm:text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                                isCompleted
                                  ? 'bg-forest-800 text-cream-50 shadow-sm'
                                  : 'bg-cream-200 text-stone-400'
                              } ${isCurrent ? 'ring-4 ring-forest-200' : ''}`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[11px] leading-tight ${
                                isCurrent
                                  ? 'font-bold text-forest-950'
                                  : isCompleted
                                  ? 'font-semibold text-stone-700'
                                  : 'text-stone-400'
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Timeline Log Updates */}
                {selectedOrder.timeline && (
                  <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-xs space-y-2">
                    <span className="font-bold text-forest-900 block mb-1">Status Updates:</span>
                    {selectedOrder.timeline.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-stone-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>{t.status}</strong>: {t.description || 'Status registered'}{' '}
                          <span className="text-[10px] text-stone-400 ml-1">({formatDateTime(t.date)})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shipping Address & Customer Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cream-100 text-xs">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-forest-800 mb-1.5">Shipping Address</h4>
                    <p className="text-stone-600 leading-relaxed">
                      {selectedOrder.shippingAddress?.house}, {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-forest-800 mb-1.5">Customer Contact</h4>
                    <p className="text-stone-600 leading-relaxed">
                      {selectedOrder.customerInfo?.fullName}<br />
                      {selectedOrder.customerInfo?.email}<br />
                      Phone: {selectedOrder.customerInfo?.phone}
                    </p>
                  </div>
                </div>

                {/* Ordered Items Breakdown */}
                <div className="pt-4 border-t border-cream-100">
                  <h4 className="font-bold uppercase tracking-wider text-forest-800 mb-3 text-xs">Items in this shipment</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-cream-100" />
                          <div>
                            <p className="font-bold text-forest-950">{item.name}</p>
                            <p className="text-[10px] text-stone-500">Size: {item.size} • Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-forest-950">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-cream-200 flex justify-between text-sm font-bold text-forest-950">
                    <span>Total Amount:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
