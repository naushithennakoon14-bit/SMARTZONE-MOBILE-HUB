import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { 
  ShoppingCart, 
  Trash2, 
  UserPlus, 
  Percent, 
  ArrowRight, 
  Plus, 
  Minus, 
  Cpu, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const CartDrawer = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQty, 
    clearCart,
    subtotal,
    discountVal,
    grandTotal,
    selectedCustomer,
    setActiveModal
  } = usePOS();

  return (
    <aside className="w-[460px] h-[calc(100vh-72px)] bg-white border-l border-slate-200 flex flex-col justify-between z-20 select-none shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-200">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900">Current Order Cart</h2>
            <p className="text-xs text-slate-500 font-medium">{cart.length} Line Item(s) Selected</p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-all font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <ShoppingCart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <p className="text-sm font-bold text-slate-700">Cart is currently empty</p>
            <p className="text-xs text-slate-500 text-center max-w-xs">Scan an IMEI number above (F2) or select a product from the catalog to begin sales checkout.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.cart_id}
              className="bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-3.5 flex items-center gap-3 transition-all"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                  <button
                    onClick={() => removeFromCart(item.cart_id)}
                    className="text-slate-400 hover:text-red-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* IMEI or Warranty */}
                {item.imei ? (
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded w-max">
                    <Cpu className="w-3 h-3" />
                    <span>IMEI: {item.imei}</span>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{item.warranty_months} Months Warranty</span>
                  </div>
                )}

                {/* Price & Qty */}
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm font-extrabold text-slate-900 font-mono">
                    {formatLKR(item.price * item.qty)}
                  </div>

                  {!item.imei && (
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateCartQty(item.cart_id, -1)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-slate-900 px-1">{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item.cart_id, 1)}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Controls & Summary */}
      <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Customer */}
          <button
            onClick={() => setActiveModal('customer')}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
              selectedCustomer
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {selectedCustomer ? (
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              ) : (
                <UserPlus className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className="truncate">{selectedCustomer ? selectedCustomer.name : 'Attach Customer'}</span>
            </div>
            <kbd className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
              F6
            </kbd>
          </button>

          {/* Discount */}
          <button
            onClick={() => cart.length > 0 && setActiveModal('discount')}
            disabled={cart.length === 0}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
              discountVal > 0
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{discountVal > 0 ? `Discount (${formatLKR(discountVal)})` : 'Add Discount'}</span>
            </div>
            <kbd className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
              F8
            </kbd>
          </button>
        </div>

        {/* Totals Summary */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 font-mono text-xs shadow-sm">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Subtotal</span>
            <span className="text-slate-900 font-bold">{formatLKR(subtotal)}</span>
          </div>

          {discountVal > 0 && (
            <div className="flex justify-between text-amber-600 font-bold">
              <span>Bill Discount</span>
              <span>- {formatLKR(discountVal)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
            <span>GRAND TOTAL</span>
            <span className="text-emerald-600 text-lg font-mono">{formatLKR(grandTotal)}</span>
          </div>
        </div>

        {/* COMPLETE SALE (F9) CTA Button */}
        <button
          disabled={cart.length === 0}
          onClick={() => setActiveModal('payment')}
          className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-md ${
            cart.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99]'
          }`}
        >
          <span>COMPLETE SALE</span>
          <span className="text-xs bg-black/20 font-mono px-2 py-0.5 rounded text-white border border-white/20">
            F9
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
