import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { UserPlus, UserCheck, X, Search, Phone, Mail, User } from 'lucide-react';

export const CustomerModal = () => {
  const { activeModal, setActiveModal, setSelectedCustomer, showToast, customers, addCustomer } = usePOS();
  
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  if (activeModal !== 'customer') return null;

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    showToast(`Attached Customer: ${customer.name}`, 'success');
    setActiveModal(null);
  };

  const handleRegisterNew = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast('Please enter customer name and phone number', 'error');
      return;
    }
    const newCust = await addCustomer({ name, phone, email });
    setSelectedCustomer(newCust);
    showToast(`New Customer Registered & Attached: ${name}`, 'success');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-xl shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-text">Attach / Select Customer</h3>
              <p className="text-xs text-slate-muted font-medium">Link sales transaction to customer record (F6)</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1.5 rounded-lg hover:bg-bg-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Existing */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-dim mb-2">
              Search Existing Customer Directory
            </label>
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-dim absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer name or phone number..."
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text font-medium text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {filtered.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-card hover:bg-primary/15 border border-border-subtle hover:border-primary/40 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-text group-hover:text-primary">{c.name}</div>
                      <div className="text-xs text-slate-muted flex items-center gap-2">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-dim" /> {c.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-success bg-success/10 px-2.5 py-1 rounded-md border border-success/20">
                    {c.points} Loyalty Pts
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Register New */}
          <form onSubmit={handleRegisterNew} className="pt-4 border-t border-border-subtle space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-dim">
              Or Register New Walk-in Customer
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-muted mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Supun Perera"
                  className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text text-xs px-3 py-2 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-muted mb-1">Mobile Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0771234567"
                  className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text text-xs px-3 py-2 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-muted mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@example.com"
                className="w-full bg-bg-dark border border-border-subtle focus:border-primary text-slate-text text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-bg-card hover:bg-bg-hover text-slate-muted border border-border-subtle"
              >
                Clear Customer
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-glow-purple"
              >
                Save & Attach
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
