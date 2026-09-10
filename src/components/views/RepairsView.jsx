import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { Wrench, Plus, Phone, User } from 'lucide-react';

export const RepairsView = () => {
  const { repairs, setRepairs, setActiveModal, showToast } = usePOS();

  const statuses = ['Pending', 'In Diagnostics', 'Waiting for Parts', 'Repaired', 'Delivered'];

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await fetch(`http://localhost:8000/api/v1/repairs/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.log('Status updated locally');
    }

    setRepairs(prev => prev.map(r => r.id === jobId ? { ...r, status: newStatus } : r));
    showToast(`Updated Repair Status to "${newStatus}"`, 'success');
  };

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-slate-50 p-8 overflow-y-auto space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <Wrench className="w-7 h-7 text-indigo-600" />
            <span>Repair Job Ticket Kanban Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Track hardware repairs, screen replacements, component status & customer deposits
          </p>
        </div>

        <button
          onClick={() => setActiveModal('repair')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Repair Job Ticket</span>
        </button>
      </div>

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statuses.map(st => {
          const list = repairs.filter(r => r.status === st);
          return (
            <div key={st} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">{st}</span>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  {list.length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-240px)]">
                {list.map(r => (
                  <div key={r.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-indigo-600">{r.job_number}</span>
                      <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">{r.device_model}</span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r.customer_name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{r.customer_phone}</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-2 rounded-lg text-[11px] text-slate-600">
                      <div className="font-bold text-slate-900">Fault:</div>
                      <div className="line-clamp-2">{r.fault_description}</div>
                    </div>

                    <div className="flex justify-between text-[11px] font-mono border-t border-slate-200 pt-2 font-bold">
                      <span className="text-slate-600">Est: <span className="text-slate-900">{formatLKR(r.estimated_cost)}</span></span>
                      <span className="text-emerald-600">Adv: {formatLKR(r.advance_paid)}</span>
                    </div>

                    {/* Status Select */}
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      className="w-full bg-white border border-slate-200 text-[11px] font-bold text-slate-800 p-1.5 rounded-lg outline-none cursor-pointer"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
