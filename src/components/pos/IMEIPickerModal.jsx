import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR, formatIMEIMasked } from '../../utils/formatters';
import { Cpu, X, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export const IMEIPickerModal = () => {
  const { 
    activeModal, 
    setActiveModal, 
    pendingIMEIProduct, 
    availableIMEIs, 
    addToCartWithIMEI,
    showToast 
  } = usePOS();

  const [customIMEI, setCustomIMEI] = useState('');

  if (activeModal !== 'imeiPicker' || !pendingIMEIProduct) return null;

  const handleSelectIMEI = (imeiItem) => {
    addToCartWithIMEI(
      pendingIMEIProduct, 
      imeiItem.id, 
      imeiItem.imei_or_serial
    );
    showToast(`Added IMEI ${imeiItem.imei_or_serial} to cart!`, 'success');
    setActiveModal(null);
  };

  const handleCustomIMEISubmit = (e) => {
    e.preventDefault();
    if (!customIMEI || customIMEI.length < 15) {
      showToast('Please enter a valid 15-digit IMEI number', 'error');
      return;
    }

    addToCartWithIMEI(
      pendingIMEIProduct, 
      `stk_custom_${Date.now()}`, 
      customIMEI.trim()
    );
    showToast(`Added custom IMEI ${customIMEI} to cart!`, 'success');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-lg shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-text">Select Device IMEI</h3>
              <p className="text-xs text-slate-muted font-medium">
                {pendingIMEIProduct.brand_name} {pendingIMEIProduct.model_name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1.5 rounded-lg hover:bg-bg-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-muted bg-bg-card p-3 rounded-xl border border-border-subtle">
            <div>Base Price: <span className="font-bold font-mono text-slate-text">{formatLKR(pendingIMEIProduct.base_price)}</span></div>
            <div className="flex items-center gap-1 text-success font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{pendingIMEIProduct.warranty_months} Months Warranty</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-dim mb-2">
              Available In-Stock IMEIs ({availableIMEIs.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableIMEIs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectIMEI(item)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-card hover:bg-primary/20 border border-border-subtle hover:border-primary/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-bold font-mono text-slate-text group-hover:text-primary">
                        {item.imei_or_serial}
                      </div>
                      <div className="text-[11px] text-slate-muted">
                        Status: <span className="text-success font-semibold">AVAILABLE</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    Select <Check className="w-4 h-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Entry Fallback */}
          <form onSubmit={handleCustomIMEISubmit} className="pt-3 border-t border-border-subtle">
            <label className="block text-xs font-semibold text-slate-muted mb-1.5">
              Or Scan / Enter Custom IMEI Number:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={18}
                value={customIMEI}
                onChange={(e) => setCustomIMEI(e.target.value)}
                placeholder="Enter 15-digit IMEI number..."
                className="flex-1 bg-bg-dark border border-border-subtle focus:border-primary text-slate-text font-mono text-sm px-3.5 py-2 rounded-xl outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Add IMEI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
