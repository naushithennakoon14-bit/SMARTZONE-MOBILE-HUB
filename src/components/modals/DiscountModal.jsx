import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { Percent, X, Check } from 'lucide-react';

export const DiscountModal = () => {
  const { 
    activeModal, 
    setActiveModal, 
    discountAmount, 
    setDiscountAmount, 
    discountType, 
    setDiscountType,
    subtotal,
    showToast 
  } = usePOS();

  const [val, setVal] = useState(discountAmount || '');

  if (activeModal !== 'discount') return null;

  const handleApply = (e) => {
    e.preventDefault();
    const num = parseFloat(val) || 0;
    setDiscountAmount(num);
    showToast(`Applied ${num} ${discountType} Bill Discount`, 'success');
    setActiveModal(null);
  };

  const quickDiscounts = [
    { label: '5%', type: 'PERCENT', val: 5 },
    { label: '10%', type: 'PERCENT', val: 10 },
    { label: '15%', type: 'PERCENT', val: 15 },
    { label: 'LKR 1,000', type: 'LKR', val: 1000 },
    { label: 'LKR 2,500', type: 'LKR', val: 2500 },
    { label: 'LKR 5,000', type: 'LKR', val: 5000 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-md shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center text-warning border border-warning/30">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-text">Apply Bill Discount</h3>
              <p className="text-xs text-slate-muted font-medium">Add manager discount or seasonal promo (F8)</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1.5 rounded-lg hover:bg-bg-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-6 space-y-5">
          {/* Subtotal Indicator */}
          <div className="bg-bg-dark border border-border-subtle p-3 rounded-xl flex justify-between items-center text-xs font-mono">
            <span className="text-slate-muted">Order Subtotal:</span>
            <span className="text-slate-text font-bold">{formatLKR(subtotal)}</span>
          </div>

          {/* Discount Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-dim mb-2">Discount Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('LKR')}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  discountType === 'LKR'
                    ? 'bg-warning text-black border-warning shadow-glow-warning font-extrabold'
                    : 'bg-bg-card text-slate-muted border-border-subtle hover:bg-bg-hover'
                }`}
              >
                Fixed Amount (LKR)
              </button>

              <button
                type="button"
                onClick={() => setDiscountType('PERCENT')}
                className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  discountType === 'PERCENT'
                    ? 'bg-warning text-black border-warning shadow-glow-warning font-extrabold'
                    : 'bg-bg-card text-slate-muted border-border-subtle hover:bg-bg-hover'
                }`}
              >
                Percentage (%)
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-muted mb-2">Quick Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {quickDiscounts.map((qd, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDiscountType(qd.type);
                    setVal(qd.val);
                  }}
                  className="py-2 px-3 rounded-lg bg-bg-card hover:bg-warning/20 border border-border-subtle hover:border-warning/40 text-xs font-mono font-bold text-slate-text transition-all"
                >
                  {qd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-muted mb-1">
              Enter Custom Value ({discountType === 'LKR' ? 'LKR' : '%'}):
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder={discountType === 'LKR' ? 'e.g. 2500' : 'e.g. 10'}
              className="w-full bg-bg-dark border border-border-subtle focus:border-warning text-slate-text font-mono text-base font-bold px-4 py-2.5 rounded-xl outline-none"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => {
                setDiscountAmount(0);
                setActiveModal(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-bg-card hover:bg-bg-hover text-slate-muted border border-border-subtle"
            >
              Reset Discount
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-warning hover:bg-amber-500 text-black shadow-glow-warning flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply Discount</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
