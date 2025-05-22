/**
 * Format a number as currency
 */
export const formatOrderCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format a date to a localized string
 */
export const formatOrderDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

/**
 * Format a date and time to a localized string
 */
export const formatOrderDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return `${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString()}`;
}; 