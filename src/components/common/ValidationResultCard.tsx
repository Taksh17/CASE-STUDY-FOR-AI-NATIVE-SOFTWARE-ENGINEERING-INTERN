/**
 * ValidationResultCard — Renders a coupon validation result.
 *
 * Presentational component that accepts a `ValidationResult`
 * discriminated union and renders either a success or failure card.
 *
 * No business logic — purely display. The parent screen owns
 * the result data and any action callbacks.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ValidationResult } from '../../types/coupon';
import { CouponInfoRow } from './CouponInfoRow';
import { formatCurrency, formatDiscount, formatDate } from '../../utils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';

interface ValidationResultCardProps {
  result: ValidationResult;
}

export const ValidationResultCard: React.FC<ValidationResultCardProps> = memo(
  ({ result }) => {
    if (result.valid) {
      return (
        <View style={[styles.card, styles.successCard]}>
          <Text style={styles.icon}>✅</Text>
          <Text style={styles.successTitle}>Coupon Valid!</Text>
          <Text style={styles.successMessage}>{result.message}</Text>

          <View style={styles.detailsContainer}>
            <CouponInfoRow label="Coupon Code" value={result.coupon.code} />
            <CouponInfoRow
              label="Discount"
              value={formatDiscount(result.coupon.discountType, result.coupon.discountValue)}
            />
            <CouponInfoRow
              label="You Save"
              value={formatCurrency(result.savings)}
            />
            <CouponInfoRow
              label="Final Price"
              value={formatCurrency(result.finalPrice)}
            />
            <CouponInfoRow
              label="Expires"
              value={formatDate(result.coupon.expiryDate)}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.card, styles.errorCard]}>
        <Text style={styles.icon}>❌</Text>
        <Text style={styles.errorTitle}>Validation Failed</Text>
        <Text style={styles.errorMessage}>{result.message}</Text>
      </View>
    );
  }
);

ValidationResultCard.displayName = 'ValidationResultCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginTop: SPACING.xl,
    borderWidth: 1,
  },
  successCard: {
    backgroundColor: COLORS.successLight,
    borderColor: COLORS.success,
  },
  errorCard: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  icon: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  successMessage: {
    fontSize: FONT_SIZE.md,
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  errorMessage: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
});
