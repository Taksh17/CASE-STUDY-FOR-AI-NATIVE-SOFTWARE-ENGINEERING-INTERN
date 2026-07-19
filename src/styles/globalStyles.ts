/**
 * Global / shared styles.
 *
 * Styles that are reused across multiple screens or components
 * live here to avoid duplication. Screen-specific styles should
 * remain co-located with their screen files.
 */

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../constants';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
});
