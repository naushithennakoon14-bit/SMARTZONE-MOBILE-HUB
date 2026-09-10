import React, { useState, useRef, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Scan, ArrowRight, XCircle } from 'lucide-react';

export const TopScanBanner = () => {
  const [scanValue, setScanValue] = useState('');
  const { handleScanInput, showToast } = usePOS();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scanValue.trim()) {
      showToast('Please type or scan a 15-digit IMEI, model name, or barcode', 'info');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    const success = await handleScanInput(scanValue);
    if (success) {
      setScanValue('');
    }
  };

  return (
    <div className="h-[72px] w-full bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-xs">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full max-w-4xl">
        <div className="relative flex-1 flex items-center">
          {/* Light Violet Scanner Ready Container */}
          <div className="absolute left-3 flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-lg">
            <Scan className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">
              SCANNER READY
            </span>
          </div>

          <input
            id="top-imei-scan-input"
            ref={inputRef}
            type="text"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            placeholder="Scan 15-Digit IMEI or Accessory Barcode (F2 to Focus)..."
            className="w-full bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 font-mono text-xs pl-44 pr-10 py-2.5 rounded-xl outline-none shadow-xs transition-all font-semibold"
            autoComplete="off"
          />

          {scanValue && (
            <button
              type="button"
              onClick={() => setScanValue('')}
              className="absolute right-3 text-slate-400 hover:text-slate-700"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0"
        >
          <span>ADD TO CART</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
