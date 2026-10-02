import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { api } from '../../api/client';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.get('/reviews');
        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Customer Review Moderation</h1>
        <p className="text-xs text-stone-500 mt-1">Review feedback, verify purchases, and ensure compliance</p>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center">
                  {r.avatar || r.name?.[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{r.name}</h4>
                  <p className="text-[10px] text-stone-400">On product: <strong>{r.productName}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-current' : 'text-stone-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>

            <div>
              {r.title && <h5 className="font-bold text-xs text-stone-800 mb-1">{r.title}</h5>}
              <p className="text-xs text-stone-600 leading-relaxed italic">"{r.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
