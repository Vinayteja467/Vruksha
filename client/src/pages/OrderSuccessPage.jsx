import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, Calendar, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-cream-50/50">
        <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">No Active Order Found</h2>
        <p className="text-xs text-stone-500 mb-6">You can browse our collection or check your order history.</p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Calculate estimated delivery: 3 to 4 days from now
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 4);
  const formattedDelivery = estDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-10 shadow-soft text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment & Order Verified
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 mt-3 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-sm text-stone-600">
              Thank you, <strong>{order.customerInfo?.fullName || 'Valued Customer'}</strong>. We have received your order and our fulfillment team is preparing your fresh products.
            </p>
          </div>

          {/* Key Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-cream-50 border border-cream-200 text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Order Number</span>
              <span className="font-serif text-sm font-bold text-forest-950">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Estimated Delivery</span>
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                By {formattedDelivery}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Payment Mode</span>
              <span className="text-xs font-semibold text-forest-900 uppercase">
                {order.paymentMethod} • {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="text-left border-t border-cream-200 pt-6">
            <h3 className="font-serif font-bold text-base text-forest-950 mb-3">
              Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="space-y-3 divide-y divide-cream-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-cream-100" />
                    <div>
                      <p className="text-xs font-bold text-forest-950">{item.name}</p>
                      <p className="text-[11px] text-stone-500">Size: {item.size} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-forest-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-cream-200 flex justify-between text-sm font-bold text-forest-950">
              <span>Total Paid:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3.5 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>TRACK ORDER</span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-cream-100 text-forest-900 border border-cream-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CONTINUE SHOPPING</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
