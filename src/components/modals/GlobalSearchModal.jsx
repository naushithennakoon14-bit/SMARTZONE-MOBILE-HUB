import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { Search, Smartphone, User, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const GlobalSearchModal = () => {
  const { activeModal, setActiveModal, products, selectProductForCart, handleScanInput } = usePOS();
  const [query, setQuery] = useState('');

  if (activeModal !== 'globalSearch') return null;

  const matches = products.filter(p => 
    p.model_name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand_name.toLowerCase().includes(query.toLowerCase()) ||
    p.category_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (product) => {
    selectProductForCart(product);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-2xl shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-bg-card">
          <Search className="w-5 h-5 text-primary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Global Search: Type IMEI, Device Model, Brand or Customer..."
            className="flex-1 bg-transparent text-slate-text font-medium text-base outline-none placeholder:text-slate-dim"
            autoFocus
          />
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {matches.length === 0 ? (
            <div className="p-8 text-center text-slate-dim text-xs">
              No matching products or IMEIs found for "{query}"
            </div>
          ) : (
            matches.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-card hover:bg-primary/20 border border-border-subtle hover:border-primary/50 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bg-dark border border-border-subtle overflow-hidden flex items-center justify-center">
                    <img src={p.image_url} alt={p.model_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase text-slate-dim">{p.brand_name} • {p.category_name}</div>
                    <div className="text-sm font-bold text-slate-text group-hover:text-primary">{p.model_name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-slate-text">{formatLKR(p.base_price)}</div>
                    <div className="text-[11px] text-success font-semibold">{p.available_stock} Available</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
