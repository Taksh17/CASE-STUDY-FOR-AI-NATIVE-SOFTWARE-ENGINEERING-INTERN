/**
 * Application-wide configuration constants.
 *
 * Extracted here so they can be swapped per environment
 * (dev/staging/prod) without touching business logic.
 */

/** Simulated network delay range for the mock API (ms) */
export const API_DELAY_MIN = 400;
export const API_DELAY_MAX = 1200;

/** Probability (0-1) that the mock API will simulate a failure */
export const API_FAILURE_RATE = 0;

/** Currency symbol used for display formatting */
export const CURRENCY_SYMBOL = '₹';

/** Coupon filter options presented in the UI */
export const DISCOUNT_TYPE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Percentage Off', value: 'percentage' },
  { label: 'Flat Discount', value: 'flat' },
  { label: 'Free Shipping', value: 'free_shipping' },
] as const;

/** Default shipping cost used for free_shipping coupon calculations (₹) */
export const DEFAULT_SHIPPING_COST = 50;
