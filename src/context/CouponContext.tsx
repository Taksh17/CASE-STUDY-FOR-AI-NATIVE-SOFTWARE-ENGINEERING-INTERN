/**
 * Coupon Context — Global State Management
 *
 * Manages application-wide coupon state:
 * - Fetched coupon list (from mock/real API)
 * - Loading & error states for async operations
 * - Applied coupons list (session-local)
 *
 * WHY CONTEXT (not Redux):
 * - This app has a single domain (coupons) with straightforward
 *   state transitions. Context + useReducer handles this cleanly
 *   without the boilerplate overhead of Redux.
 * - If the app grew to multiple domains (cart, user, orders),
 *   we'd introduce either multiple contexts or migrate to a
 *   dedicated state library.
 *
 * WHY useReducer (not useState):
 * - Multiple pieces of related state (coupons, loading, error)
 *   that transition together. useReducer keeps transitions
 *   explicit and predictable via action types.
 */

import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import { Coupon, AppliedCoupon } from '../types/coupon';
import { fetchCoupons as fetchCouponsApi } from '../services/couponService';

// ─── State Shape ───────────────────────────────────────────────

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  appliedCoupons: AppliedCoupon[];
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
  appliedCoupons: [],
};

// ─── Actions ───────────────────────────────────────────────────

type CouponAction =
  | { type: 'FETCH_COUPONS_START' }
  | { type: 'FETCH_COUPONS_SUCCESS'; payload: Coupon[] }
  | { type: 'FETCH_COUPONS_ERROR'; payload: string }
  | { type: 'APPLY_COUPON'; payload: AppliedCoupon }
  | { type: 'REMOVE_APPLIED_COUPON'; payload: string };

// ─── Reducer ───────────────────────────────────────────────────

const couponReducer = (state: CouponState, action: CouponAction): CouponState => {
  switch (action.type) {
    case 'FETCH_COUPONS_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_COUPONS_SUCCESS':
      return { ...state, loading: false, coupons: action.payload };

    case 'FETCH_COUPONS_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'APPLY_COUPON':
      // Prevent duplicate application of the same coupon
      if (state.appliedCoupons.some((ac) => ac.coupon.id === action.payload.coupon.id)) {
        return state;
      }
      return {
        ...state,
        appliedCoupons: [...state.appliedCoupons, action.payload],
      };

    case 'REMOVE_APPLIED_COUPON':
      return {
        ...state,
        appliedCoupons: state.appliedCoupons.filter(
          (ac) => ac.coupon.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

// ─── Context Shape ─────────────────────────────────────────────

interface CouponContextValue extends CouponState {
  loadCoupons: () => Promise<void>;
  applyCoupon: (applied: AppliedCoupon) => void;
  removeAppliedCoupon: (couponId: string) => void;
}

export const CouponContext = createContext<CouponContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────

interface CouponProviderProps {
  children: ReactNode;
}

export const CouponProvider: React.FC<CouponProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(couponReducer, initialState);

  const loadCoupons = useCallback(async () => {
    dispatch({ type: 'FETCH_COUPONS_START' });
    try {
      const data = await fetchCouponsApi();
      dispatch({ type: 'FETCH_COUPONS_SUCCESS', payload: data });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      dispatch({ type: 'FETCH_COUPONS_ERROR', payload: message });
    }
  }, []);

  const applyCoupon = useCallback((applied: AppliedCoupon) => {
    dispatch({ type: 'APPLY_COUPON', payload: applied });
  }, []);

  const removeAppliedCoupon = useCallback((couponId: string) => {
    dispatch({ type: 'REMOVE_APPLIED_COUPON', payload: couponId });
  }, []);

  const value: CouponContextValue = {
    ...state,
    loadCoupons,
    applyCoupon,
    removeAppliedCoupon,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};
