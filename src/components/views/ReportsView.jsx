import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR } from '../../utils/formatters';
import { BarChart3, TrendingUp, DollarSign, Smartphone, Wrench, Calendar, ArrowUpRight, Award } from 'lucide-react';

export const ReportsView = () => {
  const { salesHistory } = usePOS();
  const [timeframe, setTimeframe] = useState('7d'); // 7d, 30d, 1y
  const [hoveredBar, setHoveredBar] = useState(null);

  const [summary, setSummary] = useState({
    today_revenue: 1213000,
    total_sales_count: 8,
    available_stock_count: 14,
    pending_repairs_count: 2
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/reports/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(() => console.log('Offline reports view'));
  }, []);

  // Weekly Revenue Trend Data points
  const weeklyData = [
    { day: 'Mon', date: 'Jul 21', val: 385000, items: 3 },
    { day: 'Tue', date: 'Jul 22', val: 740000, items: 5 },
    { day: 'Wed', date: 'Jul 23', val: 520000, items: 4 },
    { day: 'Thu', date: 'Jul 24', val: 890000, items: 6 },
    { day: 'Fri', date: 'Jul 25', val: 1120000, items: 7 },
    { day: 'Sat', date: 'Jul 26', val: 1450000, items: 10 },
    { day: 'Sun', date: 'Jul 27', val: 1213000, items: 8 },
  ];

  const maxVal = Math.max(...weeklyData.map(d => d.val));
  const avgVal = Math.round(weeklyData.reduce((sum, d) => sum + d.val, 0) / weeklyData.length);

  return (
    <div className="flex-1 h-[calc(100vh-72px)] bg-bg-dark p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            <span>Business Analytics & Reports</span>
          </h2>
          <p className="text-xs text-slate-muted font-medium mt-1">
            Real-time daily sales summary, revenue growth trend, inventory turnover, and repair profits
          </p>
        </div>

        <div className="flex items-center gap-2 bg-bg-surface p-1 rounded-xl border border-border-subtle shadow-sm self-start">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === '7d' ? 'bg-primary text-white shadow-sm' : 'text-slate-muted hover:text-slate-text'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeframe === '30d' ? 'bg-primary text-white shadow-sm' : 'text-slate-muted hover:text-slate-text'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-muted font-semibold">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">
            {formatLKR(summary.today_revenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs previous period</span>
          </div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-muted font-semibold">
            <span>Total Invoices Issued</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-text">
            {summary.total_sales_count} Transactions
          </div>
          <div className="text-[11px] text-slate-muted font-medium">Avg ticket: LKR 151,625</div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-muted font-semibold">
            <span>Available Stock Devices</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600">
            {summary.available_stock_count} Items
          </div>
          <div className="text-[11px] text-slate-muted font-medium">Smartphones & Accessories</div>
        </div>

        <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-muted font-semibold">
            <span>Pending Repairs</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-purple-600">
            {summary.pending_repairs_count} Tickets
          </div>
          <div className="text-[11px] text-slate-muted font-medium">Est earnings: LKR 63,500</div>
        </div>
      </div>

      {/* Revenue Trend Interactive Visualization */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-text flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Weekly Revenue Trend (LKR)</span>
            </h3>
            <p className="text-xs text-slate-muted">Daily performance & sales ticket revenue breakdown</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary" />
              <span className="text-slate-muted">Revenue (LKR)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-muted">Average Line</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative pt-8 pb-4 border-b border-border-subtle">
          {/* Average Line Indicator */}
          <div 
            style={{ bottom: `${(avgVal / maxVal) * 75 + 10}%` }}
            className="absolute left-0 right-0 border-b-2 border-dashed border-emerald-400/60 z-0 flex items-center justify-end pr-2"
          >
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded shadow-sm">
              Avg: {formatLKR(avgVal)}
            </span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 font-mono text-xs relative z-10 px-2">
            {weeklyData.map((bar, i) => {
              const heightPercent = Math.round((bar.val / maxVal) * 85);
              const isHovered = hoveredBar === i;
              const isPeak = bar.val === maxVal;

              return (
                <div 
                  key={i} 
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center gap-2 relative group cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  <div className={`absolute -top-12 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl transition-all duration-150 z-30 whitespace-nowrap flex items-center gap-1.5 ${
                    isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
                  }`}>
                    {isPeak && <Award className="w-3.5 h-3.5 text-amber-400" />}
                    <span className="font-bold">{bar.day} ({bar.date}):</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatLKR(bar.val)}</span>
                    <span className="text-slate-400">({bar.items} sales)</span>
                  </div>

                  {/* Top value badge */}
                  <span className={`text-[10px] font-bold transition-all ${
                    isHovered ? 'text-primary scale-110' : 'text-slate-muted'
                  }`}>
                    {formatLKR(bar.val)}
                  </span>

                  {/* Dynamic Bar */}
                  <div className="w-full bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 relative ${
                        isPeak 
                          ? 'bg-gradient-to-t from-primary to-purple-600 shadow-md' 
                          : isHovered 
                            ? 'bg-primary' 
                            : 'bg-gradient-to-t from-primary/80 to-primary/95'
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`font-bold text-xs mt-1 transition-colors ${
                    isHovered ? 'text-primary' : 'text-slate-muted'
                  }`}>
                    {bar.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
