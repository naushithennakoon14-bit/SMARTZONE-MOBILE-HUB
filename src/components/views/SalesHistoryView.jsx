import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR, formatDate } from '../../utils/formatters';
import { History, Search, Printer, CheckCircle } from 'lucide-react';

export const SalesHistoryView = () => {
  const { salesHistory, openSaleReceipt } = usePOS();
  const [search, setSearch] = useState('');

  const filtered = salesHistory.filter(s => 
    s.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_name && s.customer_name.toLowerCase().includes(search.toLowerCase())) ||
    s.payment_method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-slate-50 p-8 overflow-y-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <History className="w-7 h-7 text-indigo-600" />
            <span>Sales & Transaction History</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Real-time audit log of all issued thermal invoices, discounts, and payments
          </p>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Invoice #, Customer or Payment..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl outline-none font-medium"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Grand Total</th>
              <th className="px-6 py-4">Sync Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-semibold">
                  No transaction records found matching your search filter.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">{s.invoice_number}</td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{formatDate(s.created_at)}</td>
                  <td className="px-6 py-4 font-bold">{s.customer_name || 'Walk-in Customer'}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700">
                      {s.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-amber-600 font-mono font-bold">
                    {s.discount_amount > 0 ? `-${formatLKR(s.discount_amount)}` : 'LKR 0.00'}
                  </td>
                  <td className="px-6 py-4 font-mono font-extrabold text-emerald-600 text-sm">
                    {formatLKR(s.grand_total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Local SQLite</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openSaleReceipt(s)}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-indigo-200"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Re-Print</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
