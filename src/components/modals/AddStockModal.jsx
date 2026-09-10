import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { X, Plus, Package, Cpu, DollarSign, Shield, AlertTriangle } from 'lucide-react';

export const AddStockModal = () => {
  const { activeModal, setActiveModal, addNewStock } = usePOS();

  const [modelName, setModelName] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [category, setCategory] = useState('Smartphones');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('2');
  const [imei, setImei] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [warrantyMonths, setWarrantyMonths] = useState('12');
  const [imageUrl, setImageUrl] = useState('');

  if (activeModal !== 'addStock') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelName || !price) return;

    await addNewStock({
      modelName,
      brand,
      category,
      price,
      costPrice: costPrice || price * 0.85,
      minStockAlert,
      imei,
      quantity,
      warrantyMonths,
      imageUrl
    });

    setModelName('');
    setPrice('');
    setCostPrice('');
    setImei('');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Add Stock / Inventory Item</h3>
              <p className="text-xs text-slate-500 font-medium">Enter cost price, base selling price, IMEI & alert limits</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
          <div>
            <label className="block mb-1 font-bold text-slate-800">Product / Model Name *</label>
            <input
              type="text"
              required
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. iPhone 16 Pro Max (256GB)"
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-800">Brand Name</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-semibold"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Anker">Anker</option>
                <option value="Baseus">Baseus</option>
                <option value="Remax">Remax</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-semibold"
              >
                <option value="Smartphones">Smartphones</option>
                <option value="Accessories">Accessories</option>
                <option value="Chargers">Chargers</option>
                <option value="Audio & Cables">Audio & Cables</option>
                <option value="Tempered Glass">Tempered Glass</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-800">Selling Price (LKR) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="385000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">Cost Price (LKR)</label>
              <input
                type="number"
                min="0"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="340000"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-800">Warranty Period</label>
              <select
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-semibold"
              >
                <option value="0">No Warranty (0 Months)</option>
                <option value="3">3 Months Warranty</option>
                <option value="6">6 Months Warranty</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">Min Stock Alert Threshold</label>
              <input
                type="number"
                min="1"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>

          {category === 'Smartphones' ? (
            <div>
              <label className="block mb-1 font-bold text-slate-800 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>15-Digit IMEI Number</span>
              </label>
              <input
                type="text"
                maxLength={15}
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="e.g. 358291048291055"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 font-mono text-xs px-3.5 py-2.5 rounded-xl outline-none font-bold"
              />
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-bold text-slate-800">Initial Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 font-mono font-bold px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-bold text-slate-800">Product Image URL (Optional)</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-600 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Save Inventory Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
