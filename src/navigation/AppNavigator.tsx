/**
 * AppNavigator — Root navigation structure.
 *
 * Uses React Navigation's Native Stack for performant,
 * native-backed screen transitions.
 *
 * WHY STACK (not Tab):
 * - The assignment flow is hierarchical: List → Detail, with
 *   Validator and Applied Coupons as separate destinations.
 * - A bottom tab could be added later wrapping this stack
 *   if the app scope grows.
 *
 * Type safety is enforced via RootStackParamList — every
 * navigation.navigate() call is checked at compile time.
 */

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import {
  CouponListScreen,
  CouponDetailScreen,
  CouponValidatorScreen,
  AppliedCouponsScreen,
} from '../screens';
import { COLORS, FONT_SIZE, SPACING } from '../constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CouponList"
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: FONT_SIZE.lg,
        },
        contentStyle: { backgroundColor: COLORS.background },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="CouponList"
        component={CouponListScreen}
        options={({ navigation }) => ({
          title: 'Coupons',
          headerRight: () => (
            <View style={headerStyles.row}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CouponValidator')}
                style={headerStyles.button}
                accessibilityRole="button"
                accessibilityLabel="Validate coupon"
              >
                <Text style={headerStyles.buttonText}>Validate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('AppliedCoupons')}
                style={headerStyles.button}
                accessibilityRole="button"
                accessibilityLabel="View applied coupons"
              >
                <Text style={headerStyles.buttonText}>Applied</Text>
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="CouponDetail"
        component={CouponDetailScreen}
        options={{ title: 'Coupon Details' }}
      />
      <Stack.Screen
        name="CouponValidator"
        component={CouponValidatorScreen}
        options={{ title: 'Validate Coupon' }}
      />
      <Stack.Screen
        name="AppliedCoupons"
        component={AppliedCouponsScreen}
        options={{ title: 'Applied Coupons' }}
      />
    </Stack.Navigator>
  );
};

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  button: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
