import React from 'react';
import { usePOS } from '../../context/POSContext';
import { LayoutGrid, Smartphone, Headphones, Zap, Disc } from 'lucide-react';

export const CategoryTabs = () => {
  const { activeCategory, setActiveCategory } = usePOS();

  const categories = [
    { id: 'All', label: 'All Products', icon: LayoutGrid },
    { id: 'Smartphones', label: 'Smartphones', icon: Smartphone },
    { id: 'Accessories', label: 'Accessories', icon: Headphones },
    { id: 'Chargers', label: 'Chargers', icon: Zap },
    { id: 'Audio & Cables', label: 'Audio & Cables', icon: Disc },
  ];

  return (
    <div className="h-[52px] w-full border-b border-slate-200 px-6 flex items-center gap-2 bg-white overflow-x-auto select-none no-scrollbar shadow-xs">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
