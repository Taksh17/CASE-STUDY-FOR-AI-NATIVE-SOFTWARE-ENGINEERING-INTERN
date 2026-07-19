/**
 * CouponValidatorScreen — Validate a coupon code against a cart total.
 *
 * This screen is a thin UI shell. It:
 *   1. Collects user input (coupon code, cart total)
 *   2. Looks up the coupon from Context
 *   3. Delegates ALL validation to `validateCoupon()` from the engine
 *   4. Renders the result via `ValidationResultCard`
 *
 * ZERO business logic lives here — no if/else for expiry, no
 * discount math, no minimum-order checks. The validation engine
 * is the single source of truth.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from 'react-native';
import type { ValidationResult } from '../types/coupon';
import { useCoupons } from '../hooks';
import { validateCoupon } from '../utils';
import { PrimaryButton, ValidationResultCard } from '../components/common';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants';

// ─── Input error shape ─────────────────────────────────────────

interface InputErrors {
  couponCode?: string;
  cartTotal?: string;
}

export const CouponValidatorScreen: React.FC = () => {
  const { coupons, appliedCoupons, applyCoupon } = useCoupons();

  // ── Local UI state ────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState('');
  const [cartTotalText, setCartTotalText] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  // ── Derived: is the validated coupon already applied? ─────────
  const isAlreadyApplied = useMemo(() => {
    if (!result || !result.valid) return false;
    return appliedCoupons.some((ac) => ac.coupon.id === result.coupon.id);
  }, [result, appliedCoupons]);

  // ── Input validation (UI-level, not business logic) ───────────
  const getInputErrors = useCallback((): InputErrors => {
    const errors: InputErrors = {};

    if (!couponCode.trim()) {
      errors.couponCode = 'Please enter a coupon code.';
    }

    const trimmedTotal = cartTotalText.trim();
    if (!trimmedTotal) {
      errors.cartTotal = 'Please enter a cart total.';
    } else if (isNaN(Number(trimmedTotal))) {
      errors.cartTotal = 'Cart total must be a number.';
    }

    return errors;
  }, [couponCode, cartTotalText]);

  // ── Validate handler ─────────────────────────────────────────
  const handleValidate = useCallback(() => {
    Keyboard.dismiss();

    const errors = getInputErrors();
    setInputErrors(errors);

    if (Object.keys(errors).length > 0) {
      setResult(null);
      return;
    }

    // Step 1: Normalize input
    const normalizedCode = couponCode.trim().toUpperCase();
    const cartTotal = Number(cartTotalText.trim());

    // Step 2: Find coupon from context (case-insensitive)
    const coupon =
      coupons.find((c) => c.code.toUpperCase() === normalizedCode) ?? null;

    // Step 3: Delegate to validation engine — zero business logic here
    const validationResult = validateCoupon(coupon, cartTotal);

    // Step 4: Store result for rendering
    setResult(validationResult);
  }, [couponCode, cartTotalText, coupons, getInputErrors]);

  // ── Apply handler ─────────────────────────────────────────────
  const handleApply = useCallback(() => {
    if (!result || !result.valid || isAlreadyApplied) return;

    applyCoupon({
      coupon: result.coupon,
      discountAmount: result.discountAmount,
      finalPrice: result.finalPrice,
      cartTotal: Number(cartTotalText.trim()),
    });
  }, [result, isAlreadyApplied, applyCoupon, cartTotalText]);

  // ── Render ────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
      {/* ── Header ────────────────────────────────────────────── */}
      <Text style={styles.title}>Validate Coupon</Text>
      <Text style={styles.subtitle}>
        Enter a coupon code and your cart total to check if the coupon is valid.
      </Text>

      {/* ── Coupon Code Input ─────────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Coupon Code</Text>
        <TextInput
          style={[styles.input, inputErrors.couponCode && styles.inputError]}
          value={couponCode}
          onChangeText={(text) => {
            setCouponCode(text);
            if (inputErrors.couponCode) {
              setInputErrors((prev) => ({ ...prev, couponCode: undefined }));
            }
          }}
          placeholder="Enter coupon code"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="characters"
          autoCorrect={false}
          accessibilityLabel="Coupon code input"
          accessibilityHint="Enter the coupon code you want to validate"
        />
        {inputErrors.couponCode && (
          <Text style={styles.fieldError}>{inputErrors.couponCode}</Text>
        )}
      </View>

      {/* ── Cart Total Input ──────────────────────────────────── */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cart Total (₹)</Text>
        <TextInput
          style={[styles.input, inputErrors.cartTotal && styles.inputError]}
          value={cartTotalText}
          onChangeText={(text) => {
            setCartTotalText(text);
            if (inputErrors.cartTotal) {
              setInputErrors((prev) => ({ ...prev, cartTotal: undefined }));
            }
          }}
          placeholder="Enter cart total"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
          accessibilityLabel="Cart total input"
          accessibilityHint="Enter your cart total amount in rupees"
        />
        {inputErrors.cartTotal && (
          <Text style={styles.fieldError}>{inputErrors.cartTotal}</Text>
        )}
      </View>

      {/* ── Validate Button ───────────────────────────────────── */}
      <PrimaryButton
        title="Validate"
        onPress={handleValidate}
        style={styles.validateButton}
      />

      {/* ── Result Card ───────────────────────────────────────── */}
      {result && (
        <>
          <ValidationResultCard result={result} />

          {result.valid && (
            <PrimaryButton
              title={isAlreadyApplied ? 'Already Applied' : 'Apply Coupon'}
              onPress={handleApply}
              disabled={isAlreadyApplied}
              style={styles.applyButton}
            />
          )}
        </>
      )}
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Header
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },

  // Inputs
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  fieldError: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },

  // Buttons
  validateButton: {
    marginTop: SPACING.sm,
  },
  applyButton: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.success,
  },
});
