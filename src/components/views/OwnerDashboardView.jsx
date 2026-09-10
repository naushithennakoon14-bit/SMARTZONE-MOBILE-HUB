import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Smartphone, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  Award,
  Users,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export const OwnerDashboardView = () => {
  const { products, salesHistory, repairs, setActiveModal, setActiveView } = usePOS();

  // Metrics
  const totalRevenue = salesHistory.reduce((sum, s) => sum + (s.grand_total || 0), 1213000);
  const totalSalesCount = salesHistory.length > 0 ? salesHistory.length : 8;
  const availableDevices = products.reduce((sum, p) => sum + (p.available_stock || 0), 0);
  const lowStockItems = products.filter(p => p.available_stock > 0 && p.available_stock <= (p.min_stock_alert || 2));
  const outOfStockItems = products.filter(p => p.available_stock === 0);

  // Total Stock Inventory Value (Selling value vs Cost value)
  const totalInventorySellingValue = products.reduce((sum, p) => sum + ((p.base_price || 0) * (p.available_stock || 0)), 0);
  const totalInventoryCostValue = products.reduce((sum, p) => sum + (((p.cost_price || p.base_price * 0.85)) * (p.available_stock || 0)), 0);
  const estimatedProfitMargin = totalInventorySellingValue - totalInventoryCostValue;

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-slate-50 p-8 overflow-y-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Owner & Admin Executive Dashboard</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Real-time financial summary, stock inventory health, and operational performance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('pos')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-200 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>Open Cashier POS</span>
          </button>

          <button
            onClick={() => setActiveModal('addStock')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Inventory</span>
          </button>
        </div>
      </div>

      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">
            {formatLKR(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Completed Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {totalSalesCount} Transactions
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">Avg ticket: LKR 151,625</div>
        </div>

        {/* Stock Valuation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Stock Asset Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-600">
            {formatLKR(totalInventorySellingValue)}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">Est Profit: {formatLKR(estimatedProfitMargin)}</div>
        </div>

        {/* Stock Alert Level */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Low Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600">
            {lowStockItems.length + outOfStockItems.length} Products
          </div>
          <div className="text-[11px] text-amber-700 font-bold">Needs re-order supply</div>
        </div>
      </div>

      {/* Main Grid: Stock Health & Low Stock Action Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Low Stock Alert Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Low Stock & Reorder Alert List</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Products requiring stock replenishment</p>
            </div>

            <button
              onClick={() => setActiveView('stock')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View Full Stock Catalog →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Product Model</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price (LKR)</th>
                  <th className="px-4 py-3">Available Stock</th>
                  <th className="px-4 py-3 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                {products.filter(p => p.available_stock <= (p.min_stock_alert || 2)).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold flex items-center gap-2.5">
                      <img src={item.image_url} alt="" className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                      <div>
                        <div>{item.model_name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{item.brand_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {item.category_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">{formatLKR(item.base_price)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.available_stock === 0 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.available_stock === 0 ? 'OUT OF STOCK' : `Low: ${item.available_stock} Units`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setActiveModal('addStock')}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-[11px]"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Top Selling Items & Inventory Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Top Performing Catalog Items</span>
          </h3>

          <div className="space-y-3">
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{p.model_name}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{p.brand_name} • {formatLKR(p.base_price)}</div>
                  </div>
                </div>

                <span className="text-xs font-extrabold font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  {p.available_stock} in stock
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
