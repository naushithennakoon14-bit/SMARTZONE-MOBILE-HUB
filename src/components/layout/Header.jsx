import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { ROLES, ROLE_DETAILS } from '../../utils/rbac';
import { Smartphone, Search, Building2, Wifi, WifiOff, Clock, UserCheck } from 'lucide-react';

export const Header = () => {
  const { currentBranch, setCurrentBranch, cashier, isOnline, setActiveModal, userRole, setUserRole, setActiveView } = usePOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    if (newRole === ROLES.OWNER_ADMIN) {
      setActiveView('owner');
    } else {
      setActiveView('pos');
    }
  };

  const currentRoleInfo = ROLE_DETAILS[userRole] || ROLE_DETAILS[ROLES.OWNER_ADMIN];

  return (
    <header className="h-[72px] w-full bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 select-none shadow-xs">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm text-white">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">SMARTZONE</h1>
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              POS v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">MOBILE HUB & REPAIRS</p>
        </div>
      </div>

      {/* Center: Global Search Bar & RBAC Role Selector */}
      <div className="flex items-center gap-4">
        {/* Dynamic 4-Role RBAC Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">ACTIVE SYSTEM ROLE</span>
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
            >
              <option value={ROLES.CASHIER}>Cashier</option>
              <option value={ROLES.STORE_MANAGER}>Store Manager</option>
              <option value={ROLES.INVENTORY_CONTROLLER}>Inventory Controller</option>
              <option value={ROLES.OWNER_ADMIN}>Owner / Admin</option>
            </select>
          </div>
        </div>

        {/* Global Search Bar */}
        <button
          onClick={() => setActiveModal('globalSearch')}
          className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-xs transition-all w-64 group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="flex-1 text-left font-medium">Search IMEI or Model...</span>
          <kbd className="hidden sm:inline-block bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] rounded text-slate-400 font-mono font-bold">
            ⌘K
          </kbd>
        </button>

        {/* Branch Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <select
            value={currentBranch}
            onChange={(e) => setCurrentBranch(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option value="Main Branch - Negombo">Negombo Branch</option>
            <option value="Colombo Flagship Store">Colombo Branch</option>
            <option value="Kandy Express Store">Kandy Branch</option>
          </select>
        </div>
      </div>

      {/* Right: Status, Time & User Profile */}
      <div className="flex items-center gap-4">
        {/* Sync Status */}
        <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-bold ${
          isOnline 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          {isOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cloud Synced</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline DB</span>
            </>
          )}
        </div>

        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-mono font-semibold bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
            {cashier.name.charAt(0)}
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold text-slate-900">{cashier.name}</div>
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mt-0.5 inline-block ${currentRoleInfo.badgeColor}`}>
              {currentRoleInfo.title}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
