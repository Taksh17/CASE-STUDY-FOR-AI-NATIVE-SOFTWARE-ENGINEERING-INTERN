/**
 * Coupon discount types supported by the engine.
 *
 * - percentage: Discount is a percentage of the cart total (e.g. 20% off)
 * - flat: Discount is a fixed currency amount (e.g. ₹100 off)
 * - free_shipping: Removes shipping cost entirely
 */
export type DiscountType = 'percentage' | 'flat' | 'free_shipping';

/**
 * Coupon status derived from expiry date comparison.
 *
 * - active: Coupon has not yet expired
 * - expired: Coupon's expiry date has passed
 */
export type CouponStatus = 'active' | 'expired';

/**
 * Core coupon model representing a single discount coupon.
 *
 * This interface is the single source of truth for coupon shape
 * across the entire application — screens, services, validators,
 * and context all reference this type.
 */
export interface Coupon {
  /** Unique identifier for the coupon */
  id: string;

  /** User-facing coupon code (e.g. "SAVE20") */
  code: string;

  /** Human-readable description of the coupon */
  description: string;

  /** Type of discount this coupon provides */
  discountType: DiscountType;

  /**
   * Numeric discount value.
   * - For 'percentage': value between 0-100
   * - For 'flat': absolute currency amount
   * - For 'free_shipping': typically 0 (shipping cost is removed)
   */
  discountValue: number;

  /** Minimum cart total required to apply this coupon */
  minimumOrder: number;

  /** ISO 8601 date string for coupon expiration */
  expiryDate: string;

  /** Product/course categories this coupon applies to */
  applicableCategories: string[];

  /** Current status of the coupon */
  status: CouponStatus;
}

/**
 * Represents a coupon that has been validated and applied to a cart.
 * Extends the base Coupon with computed discount and final price.
 */
export interface AppliedCoupon {
  /** The coupon that was applied */
  coupon: Coupon;

  /** Calculated discount amount in currency */
  discountAmount: number;

  /** Cart total after discount is applied */
  finalPrice: number;

  /** Original cart total before discount */
  cartTotal: number;
}

/**
 * Structured failure codes for coupon validation.
 *
 * Using a const object + type union (instead of enum) because:
 * - It produces no runtime JavaScript when only used as a type
 * - Values are plain strings, making them JSON-serializable
 * - Works identically on client and server
 */
export const ValidationFailureCode = {
  NOT_FOUND: 'NOT_FOUND',
  EXPIRED: 'EXPIRED',
  MINIMUM_ORDER_NOT_MET: 'MINIMUM_ORDER_NOT_MET',
  INVALID_CART_TOTAL: 'INVALID_CART_TOTAL',
  INVALID_DISCOUNT_TYPE: 'INVALID_DISCOUNT_TYPE',
} as const;

export type ValidationFailureCode =
  (typeof ValidationFailureCode)[keyof typeof ValidationFailureCode];

/**
 * Result of validating a coupon against a cart.
 *
 * Discriminated union on `valid`:
 * - Success branch includes the coupon, computed financials, and a user message.
 * - Failure branch includes a structured code (for programmatic use) and a
 *   human-readable message (for UI display).
 */
export type ValidationResult =
  | {
      readonly valid: true;
      readonly coupon: Coupon;
      readonly discountAmount: number;
      readonly finalPrice: number;
      readonly savings: number;
      readonly message: string;
    }
  | {
      readonly valid: false;
      readonly reasonCode: ValidationFailureCode;
      readonly message: string;
    };
