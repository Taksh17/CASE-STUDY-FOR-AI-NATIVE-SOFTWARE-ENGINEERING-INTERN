/**
 * StatusBadge — Small colored badge showing coupon status.
 *
 * Renders "Active" or "Expired" with appropriate color coding.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CouponStatus } from '../../types/coupon';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants';

interface StatusBadgeProps {
  status: CouponStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === 'active';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isActive ? COLORS.successLight : COLORS.errorLight },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isActive ? COLORS.success : COLORS.error },
        ]}
      >
        {isActive ? 'Active' : 'Expired'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
