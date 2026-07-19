/**
 * Generic formatting utilities.
 */

import { DiscountType, CouponStatus } from '../types/coupon';
import { CURRENCY_SYMBOL } from '../constants/config';

/**
 * Format a discount value for display based on its type.
 *
 * Examples:
 *   formatDiscount('percentage', 20)   → "20% off"
 *   formatDiscount('flat', 100)        → "₹100 off"
 *   formatDiscount('free_shipping', 0) → "Free Shipping"
 */
export const formatDiscount = (type: DiscountType, value: number): string => {
  switch (type) {
    case 'percentage':
      return `${value}% off`;
    case 'flat':
      return `${CURRENCY_SYMBOL}${value} off`;
    case 'free_shipping':
      return 'Free Shipping';
    default:
      return '';
  }
};

/**
 * Format a discount type enum into a human-readable label.
 *
 * Examples:
 *   formatDiscountType('percentage')    → "Percentage Off"
 *   formatDiscountType('flat')          → "Flat Discount"
 *   formatDiscountType('free_shipping') → "Free Shipping"
 */
export const formatDiscountType = (type: DiscountType): string => {
  switch (type) {
    case 'percentage':
      return 'Percentage Off';
    case 'flat':
      return 'Flat Discount';
    case 'free_shipping':
      return 'Free Shipping';
    default:
      return '';
  }
};

/**
 * Format a numeric amount as currency.
 * e.g. 1500 → "₹1,500"
 */
export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format an ISO date string into a human-readable short date.
 * e.g. "2027-03-31" → "31 Mar 2027"
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a coupon status into a human-readable label.
 * e.g. 'active' → "Active", 'expired' → "Expired"
 */
export const formatCouponStatus = (status: CouponStatus): string => {
  return status === 'active' ? 'Active' : 'Expired';
};
