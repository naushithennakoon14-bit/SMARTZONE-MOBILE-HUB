import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { useKeyboardShortcuts } from './utils/keyboardShortcuts';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { POSView } from './components/views/POSView';
import { OwnerDashboardView } from './components/views/OwnerDashboardView';
import { SalesHistoryView } from './components/views/SalesHistoryView';
import { StockIMEIView } from './components/views/StockIMEIView';
import { RepairsView } from './components/views/RepairsView';
import { CustomersView } from './components/views/CustomersView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { IMEIPickerModal } from './components/pos/IMEIPickerModal';
import { CustomerModal } from './components/modals/CustomerModal';
import { DiscountModal } from './components/modals/DiscountModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { RepairModal } from './components/modals/RepairModal';
import { AddStockModal } from './components/modals/AddStockModal';
import { AddUserModal } from './components/modals/AddUserModal';

const AppContent = () => {
  const { activeView, toast } = usePOS();
  useKeyboardShortcuts();

  const renderView = () => {
    switch (activeView) {
      case 'owner': return <OwnerDashboardView />;
      case 'pos': return <POSView />;
      case 'sales': return <SalesHistoryView />;
      case 'stock': return <StockIMEIView />;
      case 'repairs': return <RepairsView />;
      case 'customers': return <CustomersView />;
      case 'reports': return <ReportsView />;
      case 'settings': return <SettingsView />;
      default: return <OwnerDashboardView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden select-none font-sans">
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold font-mono animate-in fade-in slide-in-from-top-4 duration-200 ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
          toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
          toast.type === 'info' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
          'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden">
          {renderView()}
        </main>
      </div>

      {/* Modals Layer */}
      <IMEIPickerModal />
      <CustomerModal />
      <DiscountModal />
      <PaymentModal />
      <ReceiptModal />
      <GlobalSearchModal />
      <RepairModal />
      <AddStockModal />
      <AddUserModal />
    </div>
  );
};

export default function App() {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
}
