import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = 0;
  }
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(number) {
  if (typeof number !== 'number') {
    number = 0;
  }
  return new Intl.NumberFormat('es-MX').format(number);
}

export function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  
  const cleanValue = value.replace(/[$\s]/g, '').replace(/,/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}