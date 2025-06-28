/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) return "$0.00";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}; 