// Role-Based Access Control (RBAC) Permissions Engine for SmartZone POS

export const ROLES = {
  CASHIER: 'CASHIER',
  STORE_MANAGER: 'STORE_MANAGER',
  INVENTORY_CONTROLLER: 'INVENTORY_CONTROLLER',
  OWNER_ADMIN: 'OWNER_ADMIN'
};

export const ROLE_DETAILS = {
  [ROLES.CASHIER]: {
    id: ROLES.CASHIER,
    title: 'Cashier',
    localName: 'Cashier',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Basic POS Access: Create bills, accept payments, personal sales summary'
  },
  [ROLES.STORE_MANAGER]: {
    id: ROLES.STORE_MANAGER,
    title: 'Store Manager',
    localName: 'Store Manager',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Branch Operations: Add stock, branch reports, approve void bills, custom discounts'
  },
  [ROLES.INVENTORY_CONTROLLER]: {
    id: ROLES.INVENTORY_CONTROLLER,
    title: 'Inventory Controller',
    localName: 'Inventory Controller',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Stock Management: Master catalog, stock adjustments, min re-order alerts'
  },
  [ROLES.OWNER_ADMIN]: {
    id: ROLES.OWNER_ADMIN,
    title: 'Business Owner / Admin',
    localName: 'Owner / Admin',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Full System Privileges: User management, financial profit/loss analytics'
  }
};

export const PERMISSIONS = {
  CREATE_INVOICE: 'CREATE_INVOICE',
  ACCEPT_PAYMENT: 'ACCEPT_PAYMENT',
  VIEW_PERSONAL_SALES: 'VIEW_PERSONAL_SALES',
  
  ADD_STOCK: 'ADD_STOCK',
  VIEW_BRANCH_REPORTS: 'VIEW_BRANCH_REPORTS',
  APPROVE_VOID_BILL: 'APPROVE_VOID_BILL',
  APPLY_CUSTOM_DISCOUNT: 'APPLY_CUSTOM_DISCOUNT',
  STOCK_TRANSFER: 'STOCK_TRANSFER',
  
  MANAGE_CATALOG: 'MANAGE_CATALOG',
  ADJUST_STOCK_LEVELS: 'ADJUST_STOCK_LEVELS',
  SET_MIN_REORDER_ALERT: 'SET_MIN_REORDER_ALERT',
  MANAGE_SUPPLIERS: 'MANAGE_SUPPLIERS',
  
  FULL_ADMIN: 'FULL_ADMIN',
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_FINANCIAL_ANALYTICS: 'VIEW_FINANCIAL_ANALYTICS',
  PRICE_OVERRIDE: 'PRICE_OVERRIDE'
};

const ROLE_PERMISSIONS_MAP = {
  [ROLES.CASHIER]: [
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.ACCEPT_PAYMENT,
    PERMISSIONS.VIEW_PERSONAL_SALES
  ],
  [ROLES.STORE_MANAGER]: [
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.ACCEPT_PAYMENT,
    PERMISSIONS.VIEW_PERSONAL_SALES,
    PERMISSIONS.ADD_STOCK,
    PERMISSIONS.VIEW_BRANCH_REPORTS,
    PERMISSIONS.APPROVE_VOID_BILL,
    PERMISSIONS.APPLY_CUSTOM_DISCOUNT,
    PERMISSIONS.STOCK_TRANSFER
  ],
  [ROLES.INVENTORY_CONTROLLER]: [
    PERMISSIONS.ADD_STOCK,
    PERMISSIONS.MANAGE_CATALOG,
    PERMISSIONS.ADJUST_STOCK_LEVELS,
    PERMISSIONS.SET_MIN_REORDER_ALERT,
    PERMISSIONS.MANAGE_SUPPLIERS
  ],
  [ROLES.OWNER_ADMIN]: Object.values(PERMISSIONS)
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  if (userRole === ROLES.OWNER_ADMIN) return true;
  const userPermissions = ROLE_PERMISSIONS_MAP[userRole] || [];
  return userPermissions.includes(permission);
};
