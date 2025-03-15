import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
// Existing utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(dateString) {
  if (!dateString) return "Not specified";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
}

// Format currency for display
export function formatCurrency(amount, currency = "USD") {
  if (amount === undefined || amount === null) return "Not specified";
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error("Currency formatting error:", error);
    return `${amount} ${currency}`;
  }
}

// Format weight for display
export function formatWeight(weight, unit = "kg") {
  if (!weight) return "Not specified";
  return `${weight} ${unit}`;
}
