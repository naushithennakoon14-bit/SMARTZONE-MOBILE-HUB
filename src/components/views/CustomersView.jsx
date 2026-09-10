import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { Users, Phone, Mail, Award, Search, Plus } from 'lucide-react';

export const CustomersView = () => {
  const { setActiveModal, customers } = usePOS();
  const [search, setSearch] = useState('');
  const filteredCustomers = customers.filter(c => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-slate-50 p-8 overflow-y-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>Customer Loyalty Directory</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Registered customer contact details, purchase history & loyalty rewards
          </p>
        </div>

        <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full bg-slate-50 border border-slate-200 text-xs pl-10 pr-3 py-2.5 rounded-xl outline-none" />
        </div>
        <button
          onClick={() => setActiveModal('customer')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer</span>
        </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Lifetime Spend</th>
              <th className="px-6 py-4">Loyalty Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
            {filteredCustomers.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <span>{c.name}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-slate-700">{c.phone}</td>
                <td className="px-6 py-4 text-slate-500 font-medium">{c.email}</td>
                <td className="px-6 py-4 font-mono font-extrabold text-emerald-600">{formatLKR(c.total_spent)}</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">{c.points} Pts</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
