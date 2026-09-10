import { useEffect } from 'react';
import { usePOS } from '../context/POSContext';

export const useKeyboardShortcuts = () => {
  const { setActiveModal, cart, activeModal } = usePOS();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // F2 - IMEI / Barcode Scan Field Auto-Focus
      if (e.key === 'F2') {
        e.preventDefault();
        const scanInput = document.getElementById('top-imei-scan-input');
        if (scanInput) {
          scanInput.focus();
          scanInput.select();
        }
      }

      // F4 - Global Search Modal
      if (e.key === 'F4') {
        e.preventDefault();
        setActiveModal('globalSearch');
      }

      // F6 - Customer Selection Modal
      if (e.key === 'F6') {
        e.preventDefault();
        setActiveModal('customer');
      }

      // F8 - Discount Modal
      if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) {
          setActiveModal('discount');
        }
      }

      // F9 - Quick-Cash / Payment Modal Trigger
      if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) {
          setActiveModal('payment');
        }
      }

      // ESC - Close Modal
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeModal) {
          setActiveModal(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveModal, cart, activeModal]);
};
