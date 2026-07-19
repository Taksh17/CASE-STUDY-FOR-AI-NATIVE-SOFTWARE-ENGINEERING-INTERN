/**
 * Navigation type definitions for React Navigation.
 *
 * Centralizing route params here ensures type-safe navigation
 * across all screens — navigator.navigate() calls are checked
 * at compile time for correct param shapes.
 */

export type RootStackParamList = {
  CouponList: undefined;
  CouponDetail: { couponId: string };
  CouponValidator: undefined;
  AppliedCoupons: undefined;
};
