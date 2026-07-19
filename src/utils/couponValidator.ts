/**
 * Coupon Validation Engine — Pure Business Logic
 *
 * This module is the SINGLE SOURCE OF TRUTH for all coupon validation
 * rules in the application. No screen, context, or component should
 * contain validation logic — they call these functions exclusively.
 *
 * DESIGN PRINCIPLES:
 * - Pure functions: no side effects, no state, no I/O.
 * - Stateless: every function receives all data it needs via params.
 * - Framework-agnostic: zero React/React Native imports. Runs in
 *   Node.js, a test runner, or a backend without modification.
 * - Single responsibility: each function does exactly one thing.
 * - Fail-fast: validation checks execute in a strict pipeline order;
 *   the first failure short-circuits and returns immediately.
 *
 * VALIDATION PIPELINE (order matters):
 *   1. Coupon exists?
 *   2. Cart total valid?
 *   3. Coupon expired?
 *   4. Minimum order met?
 *   5. Calculate discount
 *   6. Calculate final price
 *   7. Return success result
 */

import { Coupon, ValidationResult, ValidationFailureCode } from '../types/coupon';
import { CURRENCY_SYMBOL, DEFAULT_SHIPPING_COST } from '../constants/config';

// ─── Centralized User-Facing Messages ──────────────────────────
//
// All human-readable validation messages live here. No magic strings
// are scattered through the validation functions. If the app adds
// i18n later, only this object needs a translation layer.

const VALIDATION_MESSAGES = {
  notFound: 'Coupon code not found.',

  expired: (code: string, date: string): string =>
    `Coupon "${code}" expired on ${date}.`,

  minimumOrderNotMet: (minimum: number, cartTotal: number): string =>
    `Minimum order of ${CURRENCY_SYMBOL}${minimum} required. ` +
    `Your cart total is ${CURRENCY_SYMBOL}${cartTotal}.`,

  invalidCartTotal: 'Cart total must be a valid positive number.',

  invalidDiscountType: (type: string): string =>
    `Unsupported discount type: "${type}".`,

  success: (code: string, savings: number): string =>
    `Coupon "${code}" applied! You save ${CURRENCY_SYMBOL}${savings}.`,
} as const;

// ─── Individual Validation Checks ──────────────────────────────

/**
 * Check whether a coupon has expired.
 *
 * Compares the coupon's expiry date against the current timestamp.
 * A coupon that expires today (at midnight) is considered valid
 * for the entire day — the check uses end-of-day semantics by
 * comparing `expiryDate < today` at date-level granularity.
 *
 * @param coupon - The coupon to check.
 * @param referenceDate - Optional date to compare against (defaults to now).
 *                        Exposed for deterministic unit testing.
 */
export const isCouponExpired = (
  coupon: Readonly<Coupon>,
  referenceDate: Date = new Date()
): boolean => {
  const expiry = new Date(coupon.expiryDate);
  return expiry < referenceDate;
};

/**
 * Check whether a cart total meets the coupon's minimum order threshold.
 *
 * A cart total EQUAL to the minimum IS valid (>=, not >).
 */
export const meetsMinimumOrder = (
  coupon: Readonly<Coupon>,
  cartTotal: number
): boolean => {
  return cartTotal >= coupon.minimumOrder;
};

/**
 * Check whether a cart total is a valid positive number.
 *
 * Rejects NaN, Infinity, negative values, and non-finite numbers.
 * Zero is accepted (some coupons may apply to free-tier items).
 */
export const isValidCartTotal = (cartTotal: number): boolean => {
  return Number.isFinite(cartTotal) && cartTotal >= 0;
};

// ─── Discount Calculation ──────────────────────────────────────

/**
 * Calculate the monetary discount amount for a coupon.
 *
 * @param coupon       - The coupon being applied.
 * @param cartTotal    - Current cart total in currency units.
 * @param shippingCost - Shipping cost (used only for free_shipping type).
 *                       Defaults to the app-wide constant.
 *
 * @returns The discount amount in currency units, always >= 0.
 *          Returns -1 for unrecognized discount types (sentinel value
 *          that the caller checks to produce an INVALID_DISCOUNT_TYPE error).
 */
export const calculateDiscount = (
  coupon: Readonly<Coupon>,
  cartTotal: number,
  shippingCost: number = DEFAULT_SHIPPING_COST
): number => {
  switch (coupon.discountType) {
    case 'percentage': {
      const rawDiscount = (coupon.discountValue / 100) * cartTotal;
      // Round to nearest integer to avoid floating-point display issues.
      // Cap at cartTotal so discount never exceeds the cart value.
      return Math.min(Math.round(rawDiscount), cartTotal);
    }

    case 'flat': {
      // Flat discount cannot exceed the cart total.
      return Math.min(coupon.discountValue, cartTotal);
    }

    case 'free_shipping': {
      // Shipping waiver — the discount equals the shipping cost.
      return shippingCost;
    }

    default:
      // Unrecognized type — signal to caller via sentinel value.
      return -1;
  }
};

/**
 * Calculate the final price after discount.
 *
 * Clamps the result at zero — the customer never "earns" money
 * from a coupon.
 */
export const calculateFinalPrice = (
  cartTotal: number,
  discountAmount: number
): number => {
  return Math.max(0, cartTotal - discountAmount);
};

// ─── Main Validation Orchestrator ──────────────────────────────

/**
 * Validate a coupon against a cart total and return a typed result.
 *
 * This is the ONLY function that screens/consumers should call.
 * It orchestrates the validation pipeline in strict order and
 * short-circuits on the first failure.
 *
 * @param coupon       - The coupon to validate, or null/undefined.
 * @param cartTotal    - The customer's current cart total.
 * @param shippingCost - Optional override for shipping cost
 *                       (defaults to DEFAULT_SHIPPING_COST from config).
 *
 * @returns A discriminated union: success with financials, or failure
 *          with a structured code and human-readable message.
 */
export const validateCoupon = (
  coupon: Readonly<Coupon> | null | undefined,
  cartTotal: number,
  shippingCost: number = DEFAULT_SHIPPING_COST
): ValidationResult => {
  // Step 1: Coupon existence
  if (!coupon) {
    return {
      valid: false,
      reasonCode: ValidationFailureCode.NOT_FOUND,
      message: VALIDATION_MESSAGES.notFound,
    };
  }

  // Step 2: Cart total validity
  if (!isValidCartTotal(cartTotal)) {
    return {
      valid: false,
      reasonCode: ValidationFailureCode.INVALID_CART_TOTAL,
      message: VALIDATION_MESSAGES.invalidCartTotal,
    };
  }

  // Step 3: Expiry check
  if (isCouponExpired(coupon)) {
    return {
      valid: false,
      reasonCode: ValidationFailureCode.EXPIRED,
      message: VALIDATION_MESSAGES.expired(coupon.code, coupon.expiryDate),
    };
  }

  // Step 4: Minimum order check
  if (!meetsMinimumOrder(coupon, cartTotal)) {
    return {
      valid: false,
      reasonCode: ValidationFailureCode.MINIMUM_ORDER_NOT_MET,
      message: VALIDATION_MESSAGES.minimumOrderNotMet(
        coupon.minimumOrder,
        cartTotal
      ),
    };
  }

  // Step 5: Calculate discount
  const discountAmount = calculateDiscount(coupon, cartTotal, shippingCost);

  if (discountAmount < 0) {
    return {
      valid: false,
      reasonCode: ValidationFailureCode.INVALID_DISCOUNT_TYPE,
      message: VALIDATION_MESSAGES.invalidDiscountType(coupon.discountType),
    };
  }

  // Step 6: Calculate final price
  const finalPrice = calculateFinalPrice(cartTotal, discountAmount);

  // Step 7: Success
  return {
    valid: true,
    coupon,
    discountAmount,
    finalPrice,
    savings: discountAmount,
    message: VALIDATION_MESSAGES.success(coupon.code, discountAmount),
  };
};
