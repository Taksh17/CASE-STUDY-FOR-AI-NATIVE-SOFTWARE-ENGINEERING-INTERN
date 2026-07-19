/**
 * Barrel export for all application types.
 * Import from '@/types' instead of individual files.
 */
export type {
  Coupon,
  AppliedCoupon,
  CouponStatus,
  DiscountType,
  ValidationResult,
} from './coupon';

export { ValidationFailureCode } from './coupon';

export type { RootStackParamList } from './navigation';
