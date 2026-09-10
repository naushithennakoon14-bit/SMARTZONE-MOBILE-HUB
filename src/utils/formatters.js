export const formatLKR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'LKR 0.00';
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('LKR', 'LKR ');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatIMEIMasked = (imei) => {
  if (!imei) return 'N/A';
  if (imei.length >= 15) {
    return `${imei.slice(0, 4)} •••• ${imei.slice(-4)}`;
  }
  return imei;
};

export const isValidIMEI = (imei) => {
  if (!imei) return false;
  const clean = imei.trim();
  return /^\d{15}$/.test(clean);
};
