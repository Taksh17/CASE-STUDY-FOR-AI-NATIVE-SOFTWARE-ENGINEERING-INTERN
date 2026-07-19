/**
 * App Entry Point
 *
 * Wiring order (outermost → innermost):
 * 1. NavigationContainer — React Navigation root
 * 2. CouponProvider — Global coupon state
 * 3. AppNavigator — Screen stack
 *
 * StatusBar is configured here at the app root so it applies
 * consistently to all screens.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CouponProvider } from './src/context';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CouponProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </CouponProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
