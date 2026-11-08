import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';
import { formatPrice, formatDate } from '../../utils/formatters';
import { api } from '../../api/client';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.get('/admin/customers');
        if (data.success) {
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Registered Customers</h1>
        <p className="text-xs text-stone-500 mt-1">Directory of verified VRUKSHA buyer accounts</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name or email..."
          className="w-full text-xs bg-transparent focus:outline-none text-stone-900"
        />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Addresses</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((c) => (
                <tr key={c.id || c._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-forest-800 text-white font-bold text-xs flex items-center justify-center">
                        {c.name?.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>
                      <span className="font-bold text-stone-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    <p>{c.email}</p>
                    <p className="text-[10px] text-stone-400">{c.phone || 'No phone set'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    {c.addresses?.length || 0} saved
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{c.totalOrders || 1}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{formatPrice(c.totalSpent || 736)}</td>
                  <td className="py-3.5 px-4 text-stone-500">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
