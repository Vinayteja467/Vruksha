import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';

export const AdminBulkOrdersPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bulk-orders');
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.put(`/bulk-orders/${id}/status`, { status });
      if (res.success) {
        addToast(`Inquiry status updated to ${status}`, 'success');
        fetchInquiries();
      }
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">B2B Wholesale Inquiries</h1>
        <p className="text-xs text-stone-500 mt-1">Manage institutional quote requests and industrial volume orders</p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <span className="font-serif font-bold text-base text-stone-900">{inq.company}</span>
                <span className="text-xs text-stone-500 ml-2">Contact: <strong>{inq.name}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400">{formatDate(inq.createdAt)}</span>
                <select
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider cursor-pointer ${
                    inq.status === 'Quoted'
                      ? 'bg-blue-100 text-blue-800'
                      : inq.status === 'Contacted'
                      ? 'bg-amber-100 text-amber-800'
                      : inq.status === 'Closed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Product Required</span>
                <span className="font-bold text-stone-900">{inq.product}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Quantity Tier</span>
                <span className="font-bold text-forest-800">{inq.requiredQuantity}</span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Packaging</span>
                <span className="font-semibold text-stone-700">{inq.packagingPreference}</span>
              </div>
            </div>

            {inq.message && (
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700">
                <strong className="text-stone-900 block mb-0.5">Notes / Specifications:</strong>
                {inq.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
              <div className="flex items-center gap-4 text-stone-500">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {inq.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {inq.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {inq.location}</span>
              </div>

              <a
                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)}%2C%20regarding%20your%20VRUKSHA%20bulk%20inquiry.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
