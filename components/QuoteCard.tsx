/**
 * QuoteCard Component
 * Displays an inspirational quote with author attribution
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from './Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote | null;
  isLoading?: boolean;
}

/**
 * QuoteCard component for displaying motivational quotes
 */
export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLoading = false }) => {
  return (
    <Card
      useGradient
      gradientColors={['#FFF7AE', '#FFE5B4'] as const}
      style={styles.container}
    >
      <View style={styles.quoteIconContainer}>
        <MaterialCommunityIcons name="format-quote-open" size={32} color="#2A374460" />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading quote...</Text>
        </View>
      ) : quote ? (
        <>
          <Text style={styles.quoteText}>{quote.text}</Text>
          <Text style={styles.authorText}>— {quote.author}</Text>
        </>
      ) : (
        <Text style={styles.quoteText}>No quote available</Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    minHeight: 150,
  },
  quoteIconContainer: {
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  loadingText: {
    color: '#2A3744',
    marginTop: 12,
    fontSize: 14,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2A3744',
    fontWeight: '500',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  authorText: {
    fontSize: 14,
    color: '#526780',
    fontWeight: '600',
    textAlign: 'right',
  },
});
