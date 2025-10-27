/**
 * Inspiration Feed Screen
 * Daily quotes and wellness tips
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../utils/constants';

interface InspirationItem {
  id: string;
  type: 'quote' | 'tip';
  content: string;
  author?: string;
  category: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const INSPIRATION_DATA: InspirationItem[] = [
  {
    id: '1',
    type: 'quote',
    content: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Motivation',
    icon: 'lightbulb-on',
    color: COLORS.quote,
  },
  {
    id: '2',
    type: 'tip',
    content: 'Take 5 deep breaths when you feel stressed. It activates your parasympathetic nervous system and helps calm your mind.',
    category: 'Wellness',
    icon: 'spa',
    color: COLORS.secondary,
  },
  {
    id: '3',
    type: 'quote',
    content: 'Happiness is not something ready made. It comes from your own actions.',
    author: 'Dalai Lama',
    category: 'Mindfulness',
    icon: 'meditation',
    color: COLORS.accent,
  },
  {
    id: '4',
    type: 'tip',
    content: 'Journal for 10 minutes each morning. It helps process emotions and sets a positive tone for the day.',
    category: 'Self-Care',
    icon: 'notebook-heart',
    color: COLORS.primary,
  },
  {
    id: '5',
    type: 'quote',
    content: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
    category: 'Inspiration',
    icon: 'heart-outline',
    color: '#FF6B9D',
  },
  {
    id: '6',
    type: 'tip',
    content: 'Practice gratitude daily. Write down 3 things you&apos;re grateful for before bed.',
    category: 'Gratitude',
    icon: 'star-outline',
    color: '#FFB74D',
  },
];

export default function InspirationScreen() {
  const [data, setData] = useState<InspirationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    // Simulate API call
    setTimeout(() => {
      setData(INSPIRATION_DATA);
      setLoading(false);
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderItem = ({ item }: { item: InspirationItem }) => (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.category}</Text>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.author && (
        <Text style={styles.author}>— {item.author}</Text>
      )}

      {item.type === 'tip' && (
        <View style={styles.tipLabel}>
          <MaterialCommunityIcons name="information" size={16} color={COLORS.primary} />
          <Text style={styles.tipText}>Wellness Tip</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inspiration</Text>
        <Text style={styles.headerSubtitle}>Daily wisdom & wellness tips</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  content: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.textPrimary,
    marginBottom: 12,
    fontWeight: '500',
  },
  author: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.gray500,
    marginTop: 8,
  },
  tipLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
});