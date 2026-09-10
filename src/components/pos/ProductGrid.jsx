import React from 'react';
import { usePOS } from '../../context/POSContext';
import { ProductCard } from './ProductCard';
import { Smartphone } from 'lucide-react';

export const ProductGrid = () => {
  const { products, activeCategory, searchQuery } = usePOS();

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category_name === activeCategory;
    const matchesSearch = !searchQuery || 
      product.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-dim">
        <Smartphone className="w-16 h-16 mb-4 text-slate-700 stroke-[1.5]" />
        <h3 className="text-lg font-bold text-slate-muted mb-1">No Stock Items Found</h3>
        <p className="text-sm">Try selecting another category or clear your search input.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
