/**
 * Reusable Card Component
 * A container component with shadow, rounded corners, and gradient support
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  useGradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
}

/**
 * Card component for displaying content with elevation and rounded corners
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  useGradient = false,
  gradientColors = ['#ffffff', '#f8f9fa'],
}) => {
  if (useGradient) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={[styles.card, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
