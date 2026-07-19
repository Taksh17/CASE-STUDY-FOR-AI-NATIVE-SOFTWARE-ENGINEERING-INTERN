/**
 * CategoryChip — Small read-only pill showing a category name.
 *
 * Unlike FilterChip (interactive toggle), CategoryChip is purely
 * presentational — used to display applicable categories on the
 * coupon detail screen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';

interface CategoryChipProps {
  label: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label }) => {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const CHIP_BG_COLOR = `${COLORS.primaryLight}20`;

const styles = StyleSheet.create({
  chip: {
    backgroundColor: CHIP_BG_COLOR,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
});
