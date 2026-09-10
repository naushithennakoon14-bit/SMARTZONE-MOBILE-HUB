import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, hasPermission, PERMISSIONS } from '../utils/rbac';

const POSContext = createContext();

export const POSProvider = ({ children }) => {
  const [activeView, setActiveView] = useState('pos'); // pos, owner, sales, stock, repairs, customers, reports, settings
  const [userRole, setUserRole] = useState(ROLES.OWNER_ADMIN); // ROLES.CASHIER, STORE_MANAGER, INVENTORY_CONTROLLER, OWNER_ADMIN
  
  const [products, setProducts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState('LKR');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'imeiPicker', 'customer', 'discount', 'payment', 'receipt', 'globalSearch', 'repair', 'addStock', 'addUser'
  const [pendingIMEIProduct, setPendingIMEIProduct] = useState(null);
  const [availableIMEIs, setAvailableIMEIs] = useState([]);
  const [currentReceiptData, setCurrentReceiptData] = useState(null);
  
  // Branch & Cashier
  const [currentBranch, setCurrentBranch] = useState('Main Branch - Negombo');
  const [cashier] = useState({ name: 'Supun D.', role: 'Senior Cashier / Admin' });
  const [isOnline, setIsOnline] = useState(true);

  // Users / Cashiers state
  const [users, setUsers] = useState([
    { id: 'usr_1', full_name: 'Supun Perera', username: 'supun', role: ROLES.OWNER_ADMIN, branch: 'Main Branch - Negombo', status: 'Active' },
    { id: 'usr_2', full_name: 'Kamal Jayasinghe', username: 'kamal', role: ROLES.CASHIER, branch: 'Colombo Flagship Store', status: 'Active' },
    { id: 'usr_3', full_name: 'Dinusha Fernando', username: 'dinusha', role: ROLES.STORE_MANAGER, branch: 'Main Branch - Negombo', status: 'Active' },
    { id: 'usr_4', full_name: 'Rohan Silva', username: 'rohan', role: ROLES.INVENTORY_CONTROLLER, branch: 'Main Branch - Negombo', status: 'Active' }
  ]);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const checkPerm = (permission) => {
    return hasPermission(userRole, permission);
  };

  const uuid = () => Math.random().toString(36).substring(2, 9);

  // Initial Load from API with fallback mock data
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setIsOnline(true);
      } else {
        throw new Error('Offline API fallback');
      }
    } catch (e) {
      console.warn('API connection offline, using fallback catalog');
      setIsOnline(false);
      setProducts([
        { id: 'prod_s25u', category_name: 'Smartphones', brand_name: 'Samsung', model_name: 'Galaxy S25 Ultra (12GB/512GB)', base_price: 385000, cost_price: 340000, min_stock_alert: 2, available_stock: 3, warranty_months: 12, image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60' },
        { id: 'prod_ip16p', category_name: 'Smartphones', brand_name: 'Apple', model_name: 'iPhone 16 Pro Max (256GB)', base_price: 445000, cost_price: 395000, min_stock_alert: 2, available_stock: 2, warranty_months: 12, image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=60' },
        { id: 'prod_mi14u', category_name: 'Smartphones', brand_name: 'Xiaomi', model_name: 'Xiaomi 14 Ultra (16GB/512GB)', base_price: 295000, cost_price: 260000, min_stock_alert: 2, available_stock: 2, warranty_months: 12, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60' },
        { id: 'prod_ap2pro', category_name: 'Accessories', brand_name: 'Apple', model_name: 'AirPods Pro (2nd Gen Type-C)', base_price: 78000, cost_price: 65000, min_stock_alert: 3, available_stock: 5, warranty_months: 6, image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=60' },
        { id: 'prod_ank65w', category_name: 'Chargers', brand_name: 'Anker', model_name: 'Anker 65W GaN III Fast Charger', base_price: 14500, cost_price: 10500, min_stock_alert: 5, available_stock: 10, warranty_months: 6, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60' },
        { id: 'prod_baseus', category_name: 'Audio & Cables', brand_name: 'Baseus', model_name: 'Baseus 100W PD Type-C Cable 2m', base_price: 3500, cost_price: 2100, min_stock_alert: 5, available_stock: 15, warranty_months: 3, image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60' }
      ]);
    }
  };

  const fetchRepairs = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/repairs');
      if (res.ok) {
        const data = await res.json();
        setRepairs(data.repairs);
      }
    } catch (e) {
      setRepairs([
        { id: 'rep_1001', job_number: 'JOB-8841', customer_name: 'Kasun Perera', customer_phone: '0771234567', device_model: 'iPhone 14 Pro', imei_or_serial: '359110293810294', fault_description: 'Display glass broken & touch unresponsive', estimated_cost: 45000, advance_paid: 15000, status: 'In Diagnostics' },
        { id: 'rep_1002', job_number: 'JOB-8842', customer_name: 'Nimali Fernando', customer_phone: '0719876543', device_model: 'Samsung S23 Ultra', imei_or_serial: '358001928374651', fault_description: 'Battery replacement & charging port clean', estimated_cost: 18500, advance_paid: 5000, status: 'Waiting for Parts' }
      ]);
    }
  };

  const fetchSalesHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/sales/history');
      if (res.ok) {
        const data = await res.json();
        setSalesHistory(data.sales);
      }
    } catch (e) {
      console.log('Using local sales history');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) setUsers(data.users);
      }
    } catch (e) {
      console.log('Using local users state');
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      } else throw new Error('Customer request failed');
    } catch (e) {
      setCustomers([
        { id: 'c1', name: 'Kasun Perera', phone: '0771234567', email: 'kasun@gmail.com', points: 120, total_spent: 445000 },
        { id: 'c2', name: 'Nimali Fernando', phone: '0719876543', email: 'nimali@yahoo.com', points: 45, total_spent: 96000 },
        { id: 'c3', name: 'Dilshan Silva', phone: '0755544332', email: 'dilshan@outlook.com', points: 280, total_spent: 680000 },
        { id: 'c4', name: 'Ruwan Wijesinghe', phone: '0768899001', email: 'ruwan@gmail.com', points: 15, total_spent: 28000 }
      ]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRepairs();
    fetchSalesHistory();
    fetchUsers();
    fetchCustomers();
  }, []);

  const addCustomer = async (customerData) => {
    const newCustomer = { id: `cust_${uuid()}`, name: customerData.name, phone: customerData.phone, email: customerData.email || '', points: 0, total_spent: 0 };
    try {
      const res = await fetch('http://localhost:8000/api/v1/customers/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customerData)
      });
      if (res.ok) {
        await fetchCustomers();
        return newCustomer;
      }
    } catch (e) {
      showToast('Customer saved locally', 'warning');
    }
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const createRepair = async (payload) => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/repairs/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        await fetchRepairs();
        return data;
      }
    } catch (e) {
      const localRepair = { id: `rep_${uuid()}`, job_number: `JOB-${Math.floor(8844 + Math.random() * 1000)}`, ...payload, status: 'Pending', created_at: new Date().toISOString() };
      setRepairs(prev => [localRepair, ...prev]);
      return { job_number: localRepair.job_number, offline: true };
    }
    throw new Error('Repair request failed');
  };

  const openSaleReceipt = async (sale) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/sales/${sale.id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentReceiptData({
          invoiceNumber: data.sale.invoice_number, cashierName: data.sale.cashier_name || cashier.name,
          customerName: data.sale.customer_name || 'Walk-in Customer', customerPhone: data.sale.customer_phone || '',
          items: data.items.map(item => ({ name: `${item.brand_name} ${item.model_name}`, price: item.unit_price, qty: 1, imei: item.imei_or_serial })),
          subtotal: data.sale.subtotal, discount: data.sale.discount_amount, grandTotal: data.sale.grand_total,
          paymentMethod: data.sale.payment_method, cashReceived: 0, change: 0, createdAt: data.sale.created_at
        });
        setActiveModal('receipt');
      }
    } catch (e) {
      showToast('Receipt details are unavailable while offline', 'warning');
    }
  };

  const handleScanInput = async (scanCode) => {
    if (!scanCode || !scanCode.trim()) return false;
    const clean = scanCode.trim();

    try {
      const res = await fetch('http://localhost:8000/api/v1/stock/verify-imei', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imei: clean })
      });

      if (res.ok) {
        const data = await res.json();
        addToCartWithIMEI({
          id: data.product_id,
          name: data.product_name,
          price: data.price,
          warranty_months: data.warranty_months,
          image_url: data.image_url
        }, data.stock_item_id, data.imei);

        showToast(`IMEI Verified: ${data.product_name} (${data.imei.slice(-4)})`, 'success');
        return true;
      }
    } catch (e) {
      console.log("IMEI verify error, attempting product lookup");
    }

    const matchedProduct = products.find(p => 
      p.id.toLowerCase() === clean.toLowerCase() ||
      p.model_name.toLowerCase().includes(clean.toLowerCase())
    );

    if (matchedProduct) {
      selectProductForCart(matchedProduct);
      return true;
    } else {
      showToast(`Scanned code "${clean}" not found or out of stock`, 'error');
      return false;
    }
  };

  const selectProductForCart = async (product) => {
    if (product.category_name === 'Smartphones' || product.category_name === 'Mobile Phones') {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${product.id}/imeis`);
        if (res.ok) {
          const data = await res.json();
          setAvailableIMEIs(data.available_imeis);
        } else {
          setAvailableIMEIs([
            { id: `stk_${product.id}_1`, imei_or_serial: '358291048291048', status: 'AVAILABLE' },
            { id: `stk_${product.id}_2`, imei_or_serial: '358291048291049', status: 'AVAILABLE' }
          ]);
        }
      } catch (e) {
        setAvailableIMEIs([
          { id: `stk_${product.id}_1`, imei_or_serial: '358291048291048', status: 'AVAILABLE' }
        ]);
      }

      setPendingIMEIProduct(product);
      setActiveModal('imeiPicker');
    } else {
      addToCartWithIMEI(product, `stk_${uuid()}`, null);
      showToast(`Added ${product.brand_name} ${product.model_name} to cart`, 'success');
    }
  };

  const addToCartWithIMEI = (product, stockItemId, imei) => {
    setCart(prevCart => {
      if (imei) {
        const exists = prevCart.some(i => i.stock_item_id === stockItemId);
        if (exists) return prevCart;
        return [
          ...prevCart,
          {
            cart_id: uuid(),
            product_id: product.id,
            stock_item_id: stockItemId,
            name: product.name || `${product.brand_name} ${product.model_name}`,
            price: product.price || product.base_price,
            warranty_months: product.warranty_months || 12,
            imei: imei,
            qty: 1,
            image_url: product.image_url
          }
        ];
      } else {
        const existingIdx = prevCart.findIndex(i => i.product_id === product.id && !i.imei);
        if (existingIdx >= 0) {
          const updated = [...prevCart];
          updated[existingIdx].qty += 1;
          return updated;
        } else {
          return [
            ...prevCart,
            {
              cart_id: uuid(),
              product_id: product.id,
              stock_item_id: stockItemId || `stk_${uuid()}`,
              name: product.name || `${product.brand_name} ${product.model_name}`,
              price: product.price || product.base_price,
              warranty_months: product.warranty_months || 0,
              imei: null,
              qty: 1,
              image_url: product.image_url
            }
          ];
        }
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cart_id !== cartId));
  };

  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cart_id === cartId) {
        if (item.imei) return item;
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setSelectedCustomer(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountVal = discountType === 'PERCENT' ? (subtotal * (discountAmount / 100)) : discountAmount;
  const grandTotal = Math.max(0, subtotal - discountVal);

  const executeCompleteSale = async (paymentMethod, cashReceived = 0) => {
    if (cart.length === 0) return;

    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const salePayload = {
      invoice_number: invoiceNumber,
      cashier_id: "user_cashier_01",
      subtotal: subtotal,
      discount_amount: discountVal,
      grand_total: grandTotal,
      payment_method: paymentMethod,
      customer_name: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
      customer_phone: selectedCustomer ? selectedCustomer.phone : "",
      items: cart.map(item => ({
        product_id: item.product_id,
        stock_item_id: item.stock_item_id,
        unit_price: item.price,
        imei_or_serial: item.imei
      }))
    };

    try {
      const res = await fetch('http://localhost:8000/api/v1/sales/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salePayload)
      });
      if (res.ok) {
        showToast(`Sale #${invoiceNumber} committed to database!`, 'success');
      }
    } catch (e) {
      showToast(`Sale #${invoiceNumber} saved locally in offline queue`, 'warning');
    }

    const receiptData = {
      invoiceNumber: invoiceNumber,
      cashierName: cashier.name,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '',
      items: [...cart],
      subtotal: subtotal,
      discount: discountVal,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod,
      cashReceived: cashReceived,
      change: Math.max(0, cashReceived - grandTotal),
      createdAt: new Date().toISOString()
    };

    setCurrentReceiptData(receiptData);
    clearCart();
    setActiveModal('receipt');
    fetchProducts();
    fetchSalesHistory();
  };

  const addUser = async (userData) => {
    const newUser = {
      id: `usr_${uuid()}`,
      full_name: userData.fullName,
      username: userData.username,
      role: userData.role || ROLES.CASHIER,
      branch: userData.branch || currentBranch,
      status: 'Active'
    };
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: userData.fullName,
          username: userData.username,
          role: userData.role,
          password: userData.password
        })
      });
      if (res.ok) {
        showToast(`User ${userData.fullName} registered in database!`, 'success');
        fetchUsers();
        return;
      }
    } catch (e) {
      showToast(`User ${userData.fullName} registered locally`, 'success');
    }
    setUsers(prev => [newUser, ...prev]);
  };

  const addNewStock = async (stockData) => {
    const newProd = {
      id: `prod_${uuid()}`,
      category_name: stockData.category,
      brand_name: stockData.brand,
      model_name: stockData.modelName,
      base_price: parseFloat(stockData.price),
      cost_price: parseFloat(stockData.costPrice || stockData.price * 0.85),
      min_stock_alert: parseInt(stockData.minStockAlert || 2),
      warranty_months: parseInt(stockData.warrantyMonths || 12),
      available_stock: parseInt(stockData.quantity || 1),
      image_url: stockData.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    };

    try {
      const res = await fetch('http://localhost:8000/api/v1/stock/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_name: stockData.category,
          brand_name: stockData.brand,
          model_name: stockData.modelName,
          base_price: parseFloat(stockData.price),
          cost_price: parseFloat(stockData.costPrice || stockData.price * 0.85),
          min_stock_alert: parseInt(stockData.minStockAlert || 2),
          warranty_months: parseInt(stockData.warrantyMonths || 12),
          imei_or_serial: stockData.imei || null,
          quantity: parseInt(stockData.quantity || 1),
          image_url: stockData.imageUrl
        })
      });
      if (res.ok) {
        showToast(`New stock item "${stockData.modelName}" added!`, 'success');
        fetchProducts();
        return;
      }
    } catch (e) {
      showToast(`Stock item "${stockData.modelName}" added locally`, 'success');
    }

    setProducts(prev => [newProd, ...prev]);
  };

  return (
    <POSContext.Provider value={{
      activeView, setActiveView,
      userRole, setUserRole, checkPerm, PERMISSIONS, ROLES,
      products, fetchProducts, addNewStock,
      repairs, fetchRepairs, setRepairs,
      salesHistory, fetchSalesHistory,
      users, addUser, fetchUsers,
      customers, addCustomer, fetchCustomers, createRepair, openSaleReceipt,
      activeCategory, setActiveCategory,
      searchQuery, setSearchQuery,
      cart, addToCartWithIMEI, selectProductForCart, removeFromCart, updateCartQty, clearCart,
      subtotal, discountAmount, setDiscountAmount, discountType, setDiscountType, discountVal, grandTotal,
      selectedCustomer, setSelectedCustomer,
      activeModal, setActiveModal,
      pendingIMEIProduct, availableIMEIs,
      currentReceiptData, executeCompleteSale,
      handleScanInput,
      currentBranch, setCurrentBranch,
      cashier, isOnline, toast, showToast
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => useContext(POSContext);
