import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { CreditCard, Banknote, QrCode, UserCheck, X, Check, ArrowRight } from 'lucide-react';

export const PaymentModal = () => {
  const { 
    activeModal, 
    setActiveModal, 
    grandTotal, 
    subtotal, 
    discountVal,
    selectedCustomer,
    executeCompleteSale 
  } = usePOS();

  const [method, setMethod] = useState('Cash'); // Cash, Card, QR Pay, Customer Credit
  const [cashTendered, setCashTendered] = useState('');

  if (activeModal !== 'payment') return null;

  const cashVal = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashVal - grandTotal);
  const isSufficient = method !== 'Cash' || cashVal >= grandTotal;

  const handleComplete = (e) => {
    e.preventDefault();
    if (!isSufficient) return;
    executeCompleteSale(method, cashVal);
  };

  const quickCashDenominations = [
    { label: 'Exact Amount', val: grandTotal },
    { label: 'LKR 1,000', val: 1000 },
    { label: 'LKR 5,000', val: 5000 },
    { label: 'LKR 10,000', val: 10000 },
    { label: 'LKR 50,000', val: 50000 },
    { label: 'LKR 100,000', val: 100000 },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] shadow-glass overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success border border-success/30 shadow-glow-green">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-text">Complete Checkout & Payment</h3>
              <p className="text-xs text-slate-muted font-medium">Select payment provider & tender cash (F9)</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1.5 rounded-lg hover:bg-bg-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleComplete} className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-dim mb-2.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { id: 'Cash', label: 'Cash Payment', icon: Banknote },
                { id: 'Card', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'QR Pay', label: 'LANKAQR Pay', icon: QrCode },
                { id: 'Customer Credit', label: 'Store Credit', icon: UserCheck }
              ].map((m) => {
                const Icon = m.icon;
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                      isActive
                        ? 'bg-success/20 border-success text-slate-text shadow-glow-green font-bold'
                        : 'bg-bg-card hover:bg-bg-hover border-border-subtle text-slate-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-success' : 'text-slate-dim'}`} />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Tendered Section */}
          {method === 'Cash' && (
            <div className="bg-bg-dark border border-border-subtle rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-muted mb-2">Quick Cash Tendered Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  {quickCashDenominations.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCashTendered(d.val)}
                      className="py-2 px-3 rounded-lg bg-bg-card hover:bg-success/20 border border-border-subtle hover:border-success/40 text-xs font-mono font-bold text-slate-text transition-all"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">Cash Received (LKR) *</label>
                  <input
                    type="number"
                    step="any"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="e.g. 400000"
                    className="w-full bg-bg-surface border border-border-subtle focus:border-success text-slate-text font-mono text-lg font-bold px-4 py-2.5 rounded-xl outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-muted mb-1">Change Due to Customer</label>
                  <div className="w-full bg-bg-surface border border-border-subtle text-success font-mono text-lg font-extrabold px-4 py-2.5 rounded-xl flex items-center">
                    {formatLKR(changeDue)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Breakdown */}
          <div className="bg-bg-card border border-border-subtle rounded-xl p-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-muted">
              <span>Subtotal:</span>
              <span className="text-slate-text">{formatLKR(subtotal)}</span>
            </div>
            {discountVal > 0 && (
              <div className="flex justify-between text-warning">
                <span>Discount Applied:</span>
                <span>- {formatLKR(discountVal)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-muted">
              <span>Customer:</span>
              <span className="text-slate-text font-sans font-semibold">
                {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
              </span>
            </div>
            <div className="pt-2 border-t border-border-subtle flex justify-between text-lg font-extrabold">
              <span className="text-slate-text font-sans">FINAL TOTAL</span>
              <span className="text-success">{formatLKR(grandTotal)}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-5 py-3 rounded-xl text-xs font-semibold bg-bg-card hover:bg-bg-hover text-slate-muted border border-border-subtle"
            >
              Back to Order
            </button>

            <button
              type="submit"
              disabled={!isSufficient}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-glow-green ${
                isSufficient
                  ? 'bg-success hover:bg-success-hover text-white active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>CONFIRM PAYMENT & PRINT RECEIPT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
