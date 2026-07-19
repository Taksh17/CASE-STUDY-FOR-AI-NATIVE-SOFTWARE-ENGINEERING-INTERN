/**
 * Mock Coupon API Service
 *
 * This module simulates a REST API for coupon data. It reads from
 * a static JSON file and wraps responses in Promises with artificial
 * network delay, exactly mirroring how a real HTTP client would behave.
 *
 * WHY THIS PATTERN:
 * - Screens and context never know whether data comes from a mock or
 *   a real backend — they only call service methods and await results.
 * - When a real API is ready, we replace the implementation in THIS
 *   file only. Zero changes to UI or state management.
 * - The simulated delay lets us exercise loading/error states in the UI.
 */

import { Coupon } from '../types/coupon';
import { API_DELAY_MIN, API_DELAY_MAX, API_FAILURE_RATE } from '../constants/config';
import couponsData from '../data/coupons.json';

/**
 * Simulate network latency with a random delay.
 */
const simulateDelay = (): Promise<void> => {
  const delay = Math.floor(
    Math.random() * (API_DELAY_MAX - API_DELAY_MIN) + API_DELAY_MIN
  );
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Optionally simulate a network failure based on configured failure rate.
 * Useful for testing error states during development.
 */
const maybeThrowError = (): void => {
  if (Math.random() < API_FAILURE_RATE) {
    throw new Error('Network error: Failed to fetch coupons. Please try again.');
  }
};

/**
 * Fetch all available coupons.
 * Simulates GET /api/coupons
 */
export const fetchCoupons = async (): Promise<Coupon[]> => {
  await simulateDelay();
  maybeThrowError();
  return couponsData as Coupon[];
};

/**
 * Fetch a single coupon by its code.
 * Simulates GET /api/coupons/:code
 *
 * @returns The matching coupon, or null if not found.
 */
export const fetchCouponByCode = async (code: string): Promise<Coupon | null> => {
  await simulateDelay();
  maybeThrowError();

  const coupon = (couponsData as Coupon[]).find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );
  return coupon ?? null;
};
