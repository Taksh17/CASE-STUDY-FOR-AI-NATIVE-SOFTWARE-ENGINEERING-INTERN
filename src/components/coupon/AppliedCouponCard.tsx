/**
 * AppliedCouponCard — Displays a single applied coupon with remove action.
 *
 * Purely presentational — receives all data and callbacks via props.
 * No Context, no business logic, no service calls.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { AppliedCoupon } from '../../types/coupon';
import { StatusBadge } from '../common/StatusBadge';
import { CouponInfoRow } from '../common/CouponInfoRow';
import { PrimaryButton } from '../common/PrimaryButton';
import { formatDiscount, formatDiscountType, formatCurrency } from '../../utils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, CARD_SHADOW } from '../../constants';

interface AppliedCouponCardProps {
  appliedCoupon: AppliedCoupon;
  onRemove: (couponId: string) => void;
}

export const AppliedCouponCard: React.FC<AppliedCouponCardProps> = memo(
  ({ appliedCoupon, onRemove }) => {
    const { coupon, discountAmount, finalPrice, cartTotal } = appliedCoupon;

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.code}>{coupon.code}</Text>
          <StatusBadge status={coupon.status} />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {coupon.description}
        </Text>

        {/* Details */}
        <View style={styles.details}>
          <CouponInfoRow label="Discount Type" value={formatDiscountType(coupon.discountType)} />
          <CouponInfoRow
            label="Discount"
            value={formatDiscount(coupon.discountType, coupon.discountValue)}
          />
          <CouponInfoRow label="Cart Total" value={formatCurrency(cartTotal)} />
          <CouponInfoRow label="Savings" value={formatCurrency(discountAmount)} />
          <CouponInfoRow label="Final Price" value={formatCurrency(finalPrice)} />
        </View>

        {/* Remove button */}
        <PrimaryButton
          title="Remove Coupon"
          onPress={() => onRemove(coupon.id)}
          style={styles.removeButton}
        />
      </View>
    );
  }
);

AppliedCouponCard.displayName = 'AppliedCouponCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...CARD_SHADOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  code: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  details: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  removeButton: {
    backgroundColor: COLORS.error,
  },
});
