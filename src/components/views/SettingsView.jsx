import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Settings, Printer, Database, Building, Save, UserPlus, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsView = () => {
  const { currentBranch, setCurrentBranch, showToast, users, setActiveModal } = usePOS();

  const [storeName, setStoreName] = useState('SMARTZONE MOBILE HUB');
  const [address, setAddress] = useState('No. 124, Main Street, Negombo');
  const [phone, setPhone] = useState('031-2234567');
  const [printerInterface, setPrinterInterface] = useState('printer:Auto-USB-Thermal-Printer');
  const [paperWidth, setPaperWidth] = useState('80mm');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Hardware & System configurations saved!', 'success');
  };

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-bg-dark p-8 overflow-y-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-text flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary" />
          <span>Hardware & System Settings</span>
        </h2>
        <p className="text-xs text-slate-muted font-medium mt-1">
          Configure thermal printers, store headers, cashier staff profiles, and SQLite parameters
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Information */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-text flex items-center gap-2 border-b border-border-subtle pb-3">
            <Building className="w-4 h-4 text-primary" />
            <span>Store & Receipt Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-muted font-medium mb-1">Store Name on Invoice</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-bg-card border border-border-subtle focus:border-primary text-slate-text px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-muted font-medium mb-1">Store Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-bg-card border border-border-subtle focus:border-primary text-slate-text px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-muted font-medium mb-1">Telephone Contact</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bg-card border border-border-subtle focus:border-primary text-slate-text font-mono px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-muted font-medium mb-1">Current Branch Location</label>
              <select
                value={currentBranch}
                onChange={(e) => setCurrentBranch(e.target.value)}
                className="w-full bg-bg-card border border-border-subtle text-slate-text font-semibold px-3.5 py-2 rounded-xl outline-none"
              >
                <option value="Main Branch - Negombo">Main Branch - Negombo</option>
                <option value="Colombo Flagship Store">Colombo Flagship Store</option>
                <option value="Kandy Express Store">Kandy Express Store</option>
              </select>
            </div>
          </div>
        </div>

        {/* ESC/POS Thermal Printer Configuration */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-text flex items-center gap-2 border-b border-border-subtle pb-3">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>ESC/POS Hardware Thermal Printer</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-muted font-medium mb-1">Thermal Printer Interface / USB Driver</label>
              <input
                type="text"
                value={printerInterface}
                onChange={(e) => setPrinterInterface(e.target.value)}
                className="w-full bg-bg-card border border-border-subtle focus:border-emerald-500 text-slate-text font-mono px-3.5 py-2 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-muted font-medium mb-1">Paper Roll Width</label>
              <select
                value={paperWidth}
                onChange={(e) => setPaperWidth(e.target.value)}
                className="w-full bg-bg-card border border-border-subtle text-slate-text font-mono font-semibold px-3.5 py-2 rounded-xl outline-none"
              >
                <option value="80mm">80mm Standard Thermal Roll (Epson / Star)</option>
                <option value="58mm">58mm Compact Receipt Roll</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="block text-slate-muted font-medium mb-1">Cash Drawer Ejection Command</label>
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-mono text-[11px] text-emerald-800 font-bold">
                ESC p 0 25 250 (Auto-pulse Cash Drawer via RJ11)
              </div>
            </div>
          </div>
        </div>

        {/* Cashier & User Management */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-bold text-sm text-slate-text flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Cashier & Staff User Management</span>
            </h3>

            <button
              type="button"
              onClick={() => setActiveModal('addUser')}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Cashier</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-card text-slate-muted font-bold uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Full Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Assigned Branch</th>
                  <th className="px-4 py-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-medium text-slate-text">
                {users && users.map((u) => (
                  <tr key={u.id} className="hover:bg-bg-hover transition-colors">
                    <td className="px-4 py-3 font-bold">{u.full_name}</td>
                    <td className="px-4 py-3 font-mono text-slate-muted">@{u.username}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-50 text-primary border border-purple-200 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-muted">{u.branch || currentBranch}</td>
                    <td className="px-4 py-3">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Database & Offline Sync */}
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 md:col-span-2">
          <h3 className="font-bold text-sm text-slate-text flex items-center gap-2 border-b border-border-subtle pb-3">
            <Database className="w-4 h-4 text-amber-600" />
            <span>Offline SQLite Database & Cloud Sync</span>
          </h3>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-text">Local SQLite Storage File</div>
              <div className="text-slate-muted font-mono text-[11px]">smartzone_local.db (Zero latency offline DB)</div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Force Sync Triggered: SQLite -> Cloud PostgreSQL', 'success')}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold transition-all"
            >
              Force Sync Now
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
