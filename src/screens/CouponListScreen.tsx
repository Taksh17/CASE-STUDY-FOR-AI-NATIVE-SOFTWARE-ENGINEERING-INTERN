/**
 * CouponListScreen — Browse and filter available coupons.
 *
 * Data flow (strictly enforced):
 *   coupons.json → couponService → CouponContext → useCoupons() → this screen
 *
 * UI state (search text, active filter) is local to this screen.
 * Global state (coupons, loading, error) comes from context.
 *
 * Two distinct empty states:
 *   1. API returned zero coupons → "No coupons available"
 *   2. Search/filter yielded zero matches → "No matching coupons found"
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, ListRenderItemInfo, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Coupon, DiscountType } from '../types/coupon';
import { useCoupons } from '../hooks';
import { CouponCard } from '../components/coupon/CouponCard';
import { SearchBar, FilterChip, LoadingView, ErrorView, EmptyState } from '../components/common';
import { COLORS, SPACING, DISCOUNT_TYPE_FILTERS } from '../constants';

type FilterValue = DiscountType | 'all';

type Props = NativeStackScreenProps<RootStackParamList, 'CouponList'>;

// ─── FlatList performance constants ────────────────────────────

const FLATLIST_INITIAL_RENDER = 9;
const FLATLIST_WINDOW_SIZE = 5;

// Responsive Breakpoint

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

const getNumColumns = (width: number): number => {
  if(width >= DESKTOP_BREAKPOINT) return 3;
  if(width >= TABLET_BREAKPOINT) return 2;
  return 1;
};

export const CouponListScreen: React.FC<Props> = ({ navigation }) => {
  const { coupons, loading, error, loadCoupons } = useCoupons();
  const { width } = useWindowDimensions();

  const numColumns = getNumColumns(width);

  const cardWidth = useMemo(() => {
    if (numColumns === 1) return undefined;
    const containerPadding = SPACING.sm * 2;
    const cardMargins = SPACING.sm * 2;
    const availableWidth = width - containerPadding;
    return { width: availableWidth / numColumns - cardMargins }; 
  }, [width, numColumns]);

  // ── Local UI state ────────────────────────────────────────────
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  // ── Fetch coupons on mount ────────────────────────────────────
  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  // ── Derived: filtered + searched coupons (memoized) ───────────
  const filteredCoupons = useMemo(() => {
    const trimmed = searchText.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesSearch =
        !trimmed ||
        coupon.code.toLowerCase().includes(trimmed) ||
        coupon.description.toLowerCase().includes(trimmed);

      const matchesFilter =
        activeFilter === 'all' || coupon.discountType === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [coupons, searchText, activeFilter]);

  // ── Callbacks (stable references) ─────────────────────────────
  const handleCouponPress = useCallback(
    (coupon: Coupon) => {
      navigation.navigate('CouponDetail', { couponId: coupon.id });
    },
    [navigation]
  );

  const keyExtractor = useCallback((item: Coupon) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Coupon>) => (
      <CouponCard coupon={item} onPress={handleCouponPress} style={cardWidth} />
    ),
    [handleCouponPress, cardWidth]
  );

  // ── State-driven rendering ────────────────────────────────────

  if (loading) {
    return <LoadingView message="Fetching coupons..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCoupons} />;
  }

  if (coupons.length === 0) {
    return (
      <EmptyState
        title="No coupons available"
        subtitle="Check back later for new offers."
      />
    );
  }

  // ── Main list UI ──────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search by code or description..."
      />

      <View style={styles.filterRow}>
        {DISCOUNT_TYPE_FILTERS.map((filter) => (
          <FilterChip
            key={filter.value}
            label={filter.label}
            selected={activeFilter === filter.value}
            onPress={() => setActiveFilter(filter.value as FilterValue)}
          />
        ))}
      </View>

      {filteredCoupons.length === 0 ? (
        <EmptyState
          title="No matching coupons found"
          subtitle="Try a different search or filter."
        />
      ) : (
        <FlatList
          key={numColumns}
          data={filteredCoupons}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={FLATLIST_INITIAL_RENDER}
          windowSize={FLATLIST_WINDOW_SIZE}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
});
