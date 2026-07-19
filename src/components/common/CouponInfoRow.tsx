/**
 * CouponInfoRow — Label/value pair for displaying coupon details.
 *
 * Used on the detail screen to render structured information
 * like "Discount Type: Percentage Off" or "Min. Order: ₹500".
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants';

interface CouponInfoRowProps {
  label: string;
  value: string;
}

export const CouponInfoRow: React.FC<CouponInfoRowProps> = ({ label, value }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
});
