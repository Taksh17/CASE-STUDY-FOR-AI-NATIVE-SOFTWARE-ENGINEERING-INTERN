/**
 * AppliedCouponsScreen — View and manage applied coupons.
 *
 * Displays every coupon applied during the current session.
 * Data comes exclusively from CouponContext via useCoupons().
 *
 * No local duplication of state — the FlatList reads directly
 * from context. When a coupon is removed via removeAppliedCoupon(),
 * context dispatches a reducer action, which produces a new
 * appliedCoupons array, which triggers a re-render of this
 * component and FlatList automatically reflects the change.
 */

import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import type { AppliedCoupon } from '../types/coupon';
import { useCoupons } from '../hooks';
import { AppliedCouponCard } from '../components/coupon/AppliedCouponCard';
import { EmptyState } from '../components/common';
import { COLORS, SPACING, FONT_SIZE } from '../constants';

const FLATLIST_INITIAL_RENDER = 8;
const FLATLIST_WINDOW_SIZE = 5;

export const AppliedCouponsScreen: React.FC = () => {
  const { appliedCoupons, removeAppliedCoupon } = useCoupons();

  // ── Callbacks (stable references) ─────────────────────────────
  const handleRemove = useCallback(
    (couponId: string) => {
      removeAppliedCoupon(couponId);
    },
    [removeAppliedCoupon]
  );

  const keyExtractor = useCallback(
    (item: AppliedCoupon) => item.coupon.id,
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<AppliedCoupon>) => (
      <AppliedCouponCard appliedCoupon={item} onRemove={handleRemove} />
    ),
    [handleRemove]
  );

  // ── Empty state ───────────────────────────────────────────────
  if (appliedCoupons.length === 0) {
    return (
      <EmptyState
        title="No Applied Coupons"
        subtitle="Coupons you apply will appear here."
      />
    );
  }

  // ── List ──────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Applied Coupons</Text>
      <Text style={styles.subtitle}>
        Coupons applied during this session
      </Text>

      <FlatList
        data={appliedCoupons}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={FLATLIST_INITIAL_RENDER}
        windowSize={FLATLIST_WINDOW_SIZE}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
});
