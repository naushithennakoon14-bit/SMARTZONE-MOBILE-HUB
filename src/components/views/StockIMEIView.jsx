import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { Smartphone, Search, Plus, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Package, DollarSign } from 'lucide-react';

export const StockIMEIView = () => {
  const { products, setActiveModal } = usePOS();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category_name === selectedCategory;
    const matchSearch = !search || 
      p.model_name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalStockVal = products.reduce((sum, p) => sum + ((p.base_price || 0) * (p.available_stock || 0)), 0);

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-slate-50 p-8 overflow-y-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <Smartphone className="w-7 h-7 text-indigo-600" />
            <span>Stock & IMEI Serial Master Catalog</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Real-time inventory levels, cost vs selling prices, 15-digit IMEI tracking, and minimum stock threshold alerts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search IMEI or Device Model..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl outline-none"
            />
          </div>

          <button
            onClick={() => setActiveModal('addStock')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Catalog Items</div>
            <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">{products.length} Models</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Stock Asset Value</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">{formatLKR(totalStockVal)}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Low Stock Alerts</div>
            <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">
              {products.filter(p => p.available_stock <= (p.min_stock_alert || 2)).length} Products
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Stock Cards / Master Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Cost Price (LKR)</th>
              <th className="px-6 py-4">Selling Price (LKR)</th>
              <th className="px-6 py-4">In-Stock IMEIs / Qty</th>
              <th className="px-6 py-4">Warranty</th>
              <th className="px-6 py-4">Stock Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
            {filtered.map((p) => {
              const isPhone = p.category_name === 'Smartphones' || p.category_name === 'Mobile Phones';
              const minAlert = p.min_stock_alert || 2;
              const isLowStock = p.available_stock > 0 && p.available_stock <= minAlert;
              const isOut = p.available_stock === 0;

              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        <img src={p.image_url} alt={p.model_name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{p.model_name}</div>
                        <div className="text-[11px] text-slate-400 font-semibold">{p.brand_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold">
                      {p.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-slate-500">
                    {formatLKR(p.cost_price || p.base_price * 0.85)}
                  </td>
                  <td className="px-6 py-4 font-mono font-extrabold text-slate-900">
                    {formatLKR(p.base_price)}
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {isPhone ? (
                      <span className="flex items-center gap-1.5 text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md w-max">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{p.available_stock} IMEI Serials</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 font-bold">{p.available_stock} Units</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{p.warranty_months} Months</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isOut ? (
                      <span className="text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-max">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Out of Stock</span>
                      </span>
                    ) : isLowStock ? (
                      <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Low Stock ({p.available_stock})</span>
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Stock ({p.available_stock})</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
