/**
 * CouponCard — Displays a single coupon in a list.
 *
 * Shows the coupon code, discount summary, expiry date, and status.
 * Tapping the card navigates to the detail screen.
 *
 * This is a presentational component — it receives all data via
 * props and delegates navigation to the parent via onPress.
 */

import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Coupon } from '../../types/coupon';
import { StatusBadge } from '../common/StatusBadge';
import { formatDiscount, formatDate } from '../../utils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, CARD_SHADOW } from '../../constants';

interface CouponCardProps {
  coupon: Coupon;
  onPress: (coupon: Coupon) => void;
  style?: ViewStyle;
}

export const CouponCard: React.FC<CouponCardProps> = memo(({ coupon, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress(coupon)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`View coupon ${coupon.code}`}
    >
      <View style={styles.header}>
        <Text style={styles.code}>{coupon.code}</Text>
        <StatusBadge status={coupon.status} />
      </View>

      <Text style={styles.discount}>
        {formatDiscount(coupon.discountType, coupon.discountValue)}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {coupon.description}
      </Text>

      <Text style={styles.expiry}>Expires: {formatDate(coupon.expiryDate)}</Text>
    </TouchableOpacity>
  );
});

CouponCard.displayName = 'CouponCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...CARD_SHADOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  code: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  discount: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  expiry: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
