import React from 'react';
import { usePOS } from '../../context/POSContext';
import { PERMISSIONS } from '../../utils/rbac';
import { 
  ShoppingCart, 
  History, 
  Smartphone, 
  Wrench, 
  Users, 
  BarChart3, 
  Settings,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';

export const Sidebar = () => {
  const { activeView, setActiveView, cart, repairs, checkPerm } = usePOS();

  const allNavItems = [
    { id: 'owner', label: 'Owner Portal', icon: LayoutDashboard, perm: PERMISSIONS.VIEW_FINANCIAL_ANALYTICS },
    { id: 'pos', label: 'New Sale (POS)', icon: ShoppingCart, shortcut: 'F2', badge: cart.length > 0 ? cart.length : null, perm: PERMISSIONS.CREATE_INVOICE },
    { id: 'sales', label: 'Sales History', icon: History, perm: PERMISSIONS.VIEW_PERSONAL_SALES },
    { id: 'stock', label: 'Stock & IMEI', icon: Smartphone, perm: PERMISSIONS.ADD_STOCK },
    { id: 'repairs', label: 'Repairs', icon: Wrench, badge: repairs.filter(r => r.status !== 'Delivered').length || null, perm: PERMISSIONS.CREATE_INVOICE },
    { id: 'customers', label: 'Customers', icon: Users, perm: PERMISSIONS.CREATE_INVOICE },
    { id: 'reports', label: 'Reports', icon: BarChart3, perm: PERMISSIONS.VIEW_BRANCH_REPORTS },
    { id: 'settings', label: 'Settings', icon: Settings, perm: PERMISSIONS.FULL_ADMIN },
  ];

  const allowedNavItems = allNavItems.filter(item => !item.perm || checkPerm(item.perm));

  return (
    <aside className="w-[240px] h-[calc(100vh-72px)] min-h-0 overflow-y-auto bg-white border-r border-slate-200 flex flex-col justify-between p-4 z-20 select-none shadow-xs">
      {/* Primary Navigation Menu */}
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Menu
        </div>
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.shortcut && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}>
                    {item.shortcut}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Keyboard Shortcuts</span>
        </div>
        <div className="text-[11px] text-slate-600 space-y-1 font-mono">
          <div className="flex justify-between"><span>Scan IMEI</span><span className="text-indigo-600 font-bold">F2</span></div>
          <div className="flex justify-between"><span>Search Stock</span><span className="text-indigo-600 font-bold">F4</span></div>
          <div className="flex justify-between"><span>Attach Customer</span><span className="text-indigo-600 font-bold">F6</span></div>
          <div className="flex justify-between"><span>Complete Sale</span><span className="text-emerald-600 font-bold">F9</span></div>
        </div>
      </div>
    </aside>
  );
};
