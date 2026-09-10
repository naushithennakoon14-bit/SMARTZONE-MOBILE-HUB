import React from 'react';
import { TopScanBanner } from '../layout/TopScanBanner';
import { CategoryTabs } from '../pos/CategoryTabs';
import { ProductGrid } from '../pos/ProductGrid';
import { CartDrawer } from '../pos/CartDrawer';

export const POSView = () => {
  return (
    <div className="flex-1 flex h-[calc(100vh-72px)] overflow-hidden bg-slate-50">
      {/* Central Workspace (Catalog + Top Scan Banner) */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 border-r border-slate-200 overflow-hidden">
        <TopScanBanner />
        <CategoryTabs />
        <ProductGrid />
      </div>

      {/* Right Checkout Drawer */}
      <CartDrawer />
    </div>
  );
};
