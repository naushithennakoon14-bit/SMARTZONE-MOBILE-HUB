import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { X, UserPlus, Shield, Building, Lock } from 'lucide-react';

export const AddUserModal = () => {
  const { activeModal, setActiveModal, addUser, currentBranch } = usePOS();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Cashier');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState(currentBranch || 'Main Branch - Negombo');

  if (activeModal !== 'addUser') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username) return;

    await addUser({
      fullName,
      username,
      role,
      password,
      branch
    });

    setFullName('');
    setUsername('');
    setPassword('');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-primary flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Add New Cashier / Staff</h3>
              <p className="text-xs text-slate-500 font-medium">Create login credentials and system role</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
          <div>
            <label className="block mb-1 font-bold text-slate-800">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Kasun Jayawardena"
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary text-slate-900 px-3.5 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-800">Username *</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kasun.pos"
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-bold text-slate-800">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-semibold"
              >
                <option value="Cashier">Cashier</option>
                <option value="Senior Cashier">Senior Cashier</option>
                <option value="Store Admin">Store Admin</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-800">Assign Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-semibold"
              >
                <option value="Main Branch - Negombo">Negombo Branch</option>
                <option value="Colombo Flagship Store">Colombo Branch</option>
                <option value="Kandy Express Store">Kandy Branch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold text-slate-800">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary text-slate-900 px-3.5 py-2.5 rounded-xl outline-none font-mono"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
