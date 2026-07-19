/**
 * CouponDetailScreen — View full details of a single coupon.
 *
 * Data flow:
 *   Receives couponId via navigation params →
 *   Looks up coupon in context (triggers loadCoupons if needed) →
 *   Renders all coupon fields, copy-to-clipboard, and apply button.
 *
 * Clipboard feedback uses local state with a timeout —
 * no toast libraries or alerts required.
 */

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useCoupons } from '../hooks';
import {
  LoadingView,
  ErrorView,
  EmptyState,
  PrimaryButton,
  StatusBadge,
  CouponInfoRow,
  CategoryChip,
} from '../components/common';
import {
  formatDiscount,
  formatDiscountType,
  formatCurrency,
  formatDate,
  formatCouponStatus,
} from '../utils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, CARD_SHADOW } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'CouponDetail'>;

const COPY_FEEDBACK_DURATION = 2000;

export const CouponDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { couponId } = route.params;
  const { coupons, loading, error, appliedCoupons, loadCoupons } =
    useCoupons();

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load coupons if not already fetched ───────────────────────
  useEffect(() => {
    if (coupons.length === 0 && !loading && !error) {
      loadCoupons();
    }
  }, [coupons.length, loading, error, loadCoupons]);

  // ── Clean up copy feedback timer on unmount ───────────────────
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // ── Derived data (memoized) ───────────────────────────────────
  const coupon = useMemo(
    () => coupons.find((c) => c.id === couponId) ?? null,
    [coupons, couponId]
  );

  const isAlreadyApplied = useMemo(
    () => appliedCoupons.some((ac) => ac.coupon.id === couponId),
    [appliedCoupons, couponId]
  );

  // ── Callbacks ─────────────────────────────────────────────────
  const handleCopyCode = useCallback(async () => {
    if (!coupon) return;
    await Clipboard.setStringAsync(coupon.code);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
  }, [coupon]);

  const handleApply = useCallback(() => {
    if (!coupon || isAlreadyApplied) return;
    navigation.navigate('CouponValidator');
  }, [coupon, isAlreadyApplied, navigation]);

  // ── State-driven rendering ────────────────────────────────────

  if (loading) {
    return <LoadingView message="Loading coupon details..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCoupons} />;
  }

  if (!coupon) {
    return (
      <EmptyState
        title="Coupon not found"
        subtitle="The requested coupon does not exist."
      />
    );
  }

  // ── Main detail UI ────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero section ──────────────────────────────────────── */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.code}>{coupon.code}</Text>
          <StatusBadge status={coupon.status} />
        </View>
        <Text style={styles.discountText}>
          {formatDiscount(coupon.discountType, coupon.discountValue)}
        </Text>
        <Text style={styles.description}>{coupon.description}</Text>
      </View>

      {/* ── Details section ───────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsCard}>
          <CouponInfoRow label="Discount Type" value={formatDiscountType(coupon.discountType)} />
          <CouponInfoRow
            label="Discount Value"
            value={formatDiscount(coupon.discountType, coupon.discountValue)}
          />
          <CouponInfoRow label="Min. Order" value={formatCurrency(coupon.minimumOrder)} />
          <CouponInfoRow label="Expires" value={formatDate(coupon.expiryDate)} />
          <CouponInfoRow label="Status" value={formatCouponStatus(coupon.status)} />
        </View>
      </View>

      {/* ── Categories section ────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Applicable Categories</Text>
        <View style={styles.categoriesRow}>
          {coupon.applicableCategories.map((category) => (
            <CategoryChip key={category} label={category} />
          ))}
        </View>
      </View>

      {/* ── Action buttons ────────────────────────────────────── */}
      <View style={styles.actions}>
        <PrimaryButton
          title={copied ? '✓ Copied!' : 'Copy Coupon Code'}
          onPress={handleCopyCode}
          style={copied ? styles.copiedButton : styles.copyButton}
        />

        <PrimaryButton
          title={isAlreadyApplied ? 'Already Applied' : 'Validate & Apply'}
          onPress={handleApply}
          disabled={isAlreadyApplied || coupon.status === 'expired'}
          style={styles.applyButton}
        />
      </View>
    </ScrollView>
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

  // Hero
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...CARD_SHADOW,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  code: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  discountText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Sections
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...CARD_SHADOW,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Actions
  actions: {
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  copyButton: {
    backgroundColor: COLORS.primaryDark,
  },
  copiedButton: {
    backgroundColor: COLORS.success,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
  },
});
