/**
 * StatCard Component
 * Displays a statistic with an icon, label, and value
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from './Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string | number;
  iconColor?: string;
  isLoading?: boolean;
}

/**
 * StatCard component for displaying statistics with icons
 */
export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  iconColor = '#6366f1',
  isLoading = false,
}) => {
  return (
    <Card style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f1ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});
