import React, { useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatLKR, formatDate } from '../../utils/formatters';
import { generateESCPOSCommand } from '../../utils/escpos';
import { Printer, Download, PlusCircle, CheckCircle, ShieldAlert, X } from 'lucide-react';

export const ReceiptModal = () => {
  const { activeModal, setActiveModal, currentReceiptData, showToast } = usePOS();
  const receiptRef = useRef(null);

  if (activeModal !== 'receipt' || !currentReceiptData) return null;

  const handlePrint = async () => {
    // If Electron window native IPC bridge is present, trigger hardware print
    if (window.electronAPI) {
      try {
        await window.electronAPI.printReceipt(currentReceiptData);
        showToast('ESC/POS Command sent to USB Thermal Printer!', 'success');
      } catch (e) {
        showToast('Printed via Browser Print dialog', 'info');
        window.print();
      }
    } else {
      window.print();
      showToast('Thermal Receipt printed cleanly', 'success');
    }
  };

  const rawESCPOS = generateESCPOSCommand(currentReceiptData);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-bg-surface border border-border-subtle rounded-2xl w-full max-w-xl shadow-glass overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center text-success border border-success/30">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-text">Transaction Completed!</h3>
              <p className="text-xs text-slate-muted font-medium">Invoice #{currentReceiptData.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="text-slate-muted hover:text-slate-text p-1.5 rounded-lg hover:bg-bg-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Container */}
        <div className="p-6 flex flex-col items-center bg-bg-dark/50 space-y-4">
          {/* Simulated 80mm ESC/POS Thermal Paper Roll */}
          <div
            ref={receiptRef}
            className="thermal-paper w-[340px] p-6 rounded-md shadow-2xl text-xs space-y-3 border-t-8 border-slate-300"
          >
            {/* Store Banner */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-400">
              <h2 className="font-extrabold text-sm tracking-wider">SMARTZONE MOBILE HUB</h2>
              <p className="text-[11px] leading-tight text-gray-700">No. 124, Main Street, Negombo</p>
              <p className="text-[11px] text-gray-700">Tel: 031-2234567 / 077-9876543</p>
              <p className="text-[10px] text-gray-500 font-sans">VAT / Reg No: SZ-99410-LK</p>
            </div>

            {/* Transaction Info */}
            <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-gray-400">
              <div className="flex justify-between"><span className="font-bold">INVOICE:</span> <span>{currentReceiptData.invoiceNumber}</span></div>
              <div className="flex justify-between"><span>DATE:</span> <span>{formatDate(currentReceiptData.createdAt)}</span></div>
              <div className="flex justify-between"><span>CASHIER:</span> <span>{currentReceiptData.cashierName}</span></div>
              <div className="flex justify-between"><span>CUSTOMER:</span> <span>{currentReceiptData.customerName}</span></div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 py-2 border-b border-dashed border-gray-400">
              {currentReceiptData.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-gray-900 leading-tight">{item.name}</div>
                  {item.imei && (
                    <div className="text-[10px] font-mono text-gray-600 pl-2">
                      IMEI: {item.imei}
                    </div>
                  )}
                  <div className="flex justify-between text-[11px]">
                    <span>{item.qty} x {formatLKR(item.price)}</span>
                    <span className="font-bold">{formatLKR(item.price * item.qty)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 pt-1 font-mono text-[11px]">
              <div className="flex justify-between"><span>SUBTOTAL:</span> <span>{formatLKR(currentReceiptData.subtotal)}</span></div>
              {currentReceiptData.discount > 0 && (
                <div className="flex justify-between font-bold"><span>DISCOUNT:</span> <span>-{formatLKR(currentReceiptData.discount)}</span></div>
              )}
              <div className="flex justify-between font-extrabold text-sm border-t border-b border-black py-1 my-1">
                <span>TOTAL:</span>
                <span>{formatLKR(currentReceiptData.grandTotal)}</span>
              </div>
              <div className="flex justify-between"><span>PAYMENT METHOD:</span> <span>{currentReceiptData.paymentMethod}</span></div>
              {currentReceiptData.cashReceived > 0 && (
                <>
                  <div className="flex justify-between"><span>CASH TENDERED:</span> <span>{formatLKR(currentReceiptData.cashReceived)}</span></div>
                  <div className="flex justify-between font-bold"><span>CHANGE DUE:</span> <span>{formatLKR(currentReceiptData.change)}</span></div>
                </>
              )}
            </div>

            {/* Footer / Warranty Note */}
            <div className="text-center pt-3 border-t border-dashed border-gray-400 space-y-1">
              <div className="font-bold text-[11px]">WARRANTY TERMS: 12 MONTHS</div>
              <p className="text-[10px] text-gray-600 leading-tight">Please retain this thermal invoice for warranty claims & returns.</p>
              
              {/* Barcode Graphic */}
              <div className="pt-2 flex flex-col items-center">
                <div className="w-48 h-8 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-mono tracking-widest">
                  ||||||| | ||||| |||| || |||
                </div>
                <div className="text-[9px] font-mono text-gray-500 mt-0.5">{currentReceiptData.invoiceNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-border-subtle bg-bg-card flex items-center justify-between">
          <button
            onClick={() => setActiveModal(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-bg-dark border border-border-subtle text-slate-muted hover:text-slate-text"
          >
            <PlusCircle className="w-4 h-4 text-primary" />
            <span>Start New Sale</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-success hover:bg-success-hover text-white shadow-glow-green"
            >
              <Printer className="w-4 h-4" />
              <span>Print ESC/POS Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
