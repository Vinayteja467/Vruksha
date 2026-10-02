import React, { useState, useEffect } from 'react';
import { Tag, Plus, X, Percent, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 10,
    minOrderAmount: 499,
    description: '',
    freeShipping: false
  });

  const { addToast } = useToast();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await api.get('/coupons');
      if (data.success) setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', newCoupon);
      if (res.success) {
        addToast(`Coupon ${newCoupon.code.toUpperCase()} created!`, 'success');
        setShowModal(false);
        setNewCoupon({ code: '', discountPercent: 10, minOrderAmount: 499, description: '', freeShipping: false });
        fetchCoupons();
      }
    } catch (err) {
      addToast('Failed to create coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Discount Coupons</h1>
          <p className="text-xs text-stone-500 mt-1">Configure promotional discount codes and minimum order values</p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-forest-900 hover:bg-forest-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.code} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-forest-700" />
                <span className="font-mono text-lg font-bold text-stone-900 uppercase">
                  {c.code}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>

            <p className="text-xs text-stone-600">{c.description || 'Promotional Discount'}</p>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-500">Min. Order:</span>
              <span className="text-stone-900">{formatPrice(c.minOrderAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-stone-500">Discount Value:</span>
              <span className="text-emerald-700 font-bold">
                {c.freeShipping ? 'Free Shipping' : `${c.discountPercent}% OFF`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">Create New Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HARVEST15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={newCoupon.discountPercent}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="15% off orders above ₹599"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCoupon.freeShipping}
                  onChange={(e) => setNewCoupon({ ...newCoupon, freeShipping: e.target.checked })}
                  className="rounded text-forest-700"
                />
                <span>Include Free Shipping</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 border border-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-900 text-white font-bold"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
