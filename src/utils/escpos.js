import { formatLKR, formatDate } from './formatters';

export const generateESCPOSCommand = (saleData) => {
  const storeHeader = [
    "      SMARTZONE MOBILE HUB      ",
    " No. 124, Main Street, Negombo  ",
    "       Tel: 031-2234567         ",
    "--------------------------------",
    `INVOICE #: ${saleData.invoiceNumber}`,
    `DATE: ${formatDate(saleData.createdAt || new Date())}`,
    `CASHIER: ${saleData.cashierName || 'Supun D.'}`,
    `CUSTOMER: ${saleData.customerName || 'Walk-in Customer'}`,
    "--------------------------------"
  ];

  const itemLines = saleData.items.map(item => {
    const title = item.name.length > 30 ? item.name.substring(0, 27) + '...' : item.name;
    const imeiLine = item.imei ? `  IMEI: ${item.imei}` : '';
    const priceLine = `  1 x ${formatLKR(item.price).padEnd(20)} ${formatLKR(item.price)}`;
    return [title, imeiLine, priceLine].filter(Boolean).join('\n');
  });

  const totals = [
    "--------------------------------",
    `SUBTOTAL:            ${formatLKR(saleData.subtotal)}`,
    `DISCOUNT:           -${formatLKR(saleData.discount)}`,
    "================================",
    `GRAND TOTAL:         ${formatLKR(saleData.grandTotal)}`,
    `PAYMENT METHOD:      ${saleData.paymentMethod}`,
    saleData.cashReceived ? `CASH TENDERED:       ${formatLKR(saleData.cashReceived)}` : '',
    saleData.change ? `CHANGE DUE:          ${formatLKR(saleData.change)}` : '',
    "--------------------------------",
    "   WARRANTY NOTICE: 12 MONTHS   ",
    " Please retain receipt for claim ",
    "   Thank You For Shopping!      "
  ].filter(Boolean);

  return [...storeHeader, ...itemLines, ...totals].join('\n');
};
