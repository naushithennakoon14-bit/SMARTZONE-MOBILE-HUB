import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { ShieldCheck, Cpu, Plus, AlertTriangle } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { selectProductForCart } = usePOS();
  const isPhone = product.category_name === 'Smartphones' || product.category_name === 'Mobile Phones';
  const isLowStock = product.available_stock > 0 && product.available_stock <= (product.min_stock_alert || 2);
  const isOutOfStock = product.available_stock === 0;

  return (
    <div
      onClick={() => !isOutOfStock && selectProductForCart(product)}
      className={`bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 flex flex-col justify-between group cursor-pointer relative transition-all duration-150 hover:border-indigo-400 hover:shadow-md ${
        isOutOfStock ? 'opacity-50 cursor-not-allowed border-red-200 bg-red-50/20' : ''
      }`}
    >
      {/* Top Bar: Category & Stock Badges */}
      <div className="flex items-center justify-between z-10 mb-2 gap-1 flex-wrap">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
          {product.brand_name}
        </span>

        {isPhone && (
          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>IMEI TRACKED</span>
          </span>
        )}

        {isLowStock && (
          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>LOW ({product.available_stock})</span>
          </span>
        )}
      </div>

      {/* Center: Image & Model Name */}
      <div className="flex flex-col items-center text-center my-2">
        <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300'}
            alt={product.model_name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
            }}
          />
        </div>

        {/* High-Contrast Product Title */}
        <h3 className="font-bold text-sm text-slate-900 line-clamp-2 min-h-[40px] group-hover:text-indigo-600 transition-colors leading-snug">
          {product.model_name}
        </h3>
      </div>

      {/* Bottom Bar: Price, Warranty & Add Button (Non-clipped flex layout) */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between mt-1 gap-2">
        <div className="min-w-0 flex-1">
          {/* High-Contrast Price */}
          <div className="text-base font-extrabold text-slate-900 font-mono tracking-tight truncate">
            {formatLKR(product.base_price)}
          </div>
          {/* High-Contrast Warranty */}
          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{product.warranty_months} M Warranty</span>
          </div>
        </div>

        {/* Fully Visible Add Button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) selectProductForCart(product);
          }}
          className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-all ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-400 border border-slate-300'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
