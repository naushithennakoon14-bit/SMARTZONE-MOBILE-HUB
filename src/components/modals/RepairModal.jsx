import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Wrench, X, Check, Phone, Smartphone, DollarSign, FileText } from 'lucide-react';

export const RepairModal = () => {
  const { activeModal, setActiveModal, createRepair, showToast } = usePOS();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [imei, setImei] = useState('');
  const [fault, setFault] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [advancePaid, setAdvancePaid] = useState('');

  if (activeModal !== 'repair') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deviceModel || !fault || !estimatedCost) {
      showToast('Please fill out all required repair fields', 'error');
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      device_model: deviceModel,
      imei_or_serial: imei,
      fault_description: fault,
      estimated_cost: parseFloat(estimatedCost),
      advance_paid: parseFloat(advancePaid) || 0.0
    };

    try {
      const data = await createRepair(payload);
      showToast(`Repair Job Ticket ${data.job_number} Created${data.offline ? ' Offline' : ''}!`, data.offline ? 'warning' : 'success');
      setActiveModal(null);
    } catch (e) {
      showToast('Could not create repair ticket', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-xl shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-text">Create Repair Job Ticket</h3>
              <p className="text-xs text-slate-muted font-medium">Log customer phone fault & generate job card</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1.5 rounded-lg hover:bg-bg-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-muted mb-1">Customer Full Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Kasun Perera"
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-muted mb-1">Mobile Phone Number *</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 0771234567"
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text font-mono px-3.5 py-2 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-muted mb-1">Device Brand & Model *</label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="e.g. iPhone 14 Pro"
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-muted mb-1">Device IMEI or Serial</label>
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="15-digit IMEI..."
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text font-mono px-3.5 py-2 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-muted mb-1">Fault / Issue Description *</label>
            <textarea
              rows={2}
              value={fault}
              onChange={(e) => setFault(e.target.value)}
              placeholder="e.g. Display glass cracked, touch unresponsive, battery drain issue..."
              className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text px-3.5 py-2 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-medium text-slate-muted mb-1">Estimated Total Repair Cost (LKR) *</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="e.g. 45000"
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text font-mono text-sm font-bold px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-muted mb-1">Advance Payment Paid (LKR)</label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text font-mono text-sm font-bold px-3.5 py-2 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-bg-card hover:bg-bg-hover text-slate-muted border border-border-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-glow-purple flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Create Repair Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
