/**
 * Custom hook for consuming the CouponContext.
 *
 * Throws a clear error if used outside the provider — this
 * catches wiring bugs at development time instead of producing
 * cryptic "cannot read property of undefined" errors.
 */

import { useContext } from 'react';
import { CouponContext } from '../context/CouponContext';

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a <CouponProvider>');
  }
  return context;
};
