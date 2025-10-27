/**
 * Analytics Screen
 * Mood trends and insights
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';
import { useAppStore } from '../../store/useAppStore';

const { width } = Dimensions.get('window');

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function AnalyticsScreen() {
  const { dailyLogs, streak } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Get actual entries from the store
  const moodEntries = dailyLogs.filter(day => day.mood).map(day => day.mood!);
  const journalEntries = dailyLogs.filter(day => day.journal).map(day => day.journal!);
  const currentStreak = streak?.currentStreak || 0;

  // Calculate stats
  const totalEntries = moodEntries.length + journalEntries.length;
  const totalJournals = journalEntries.length;
  const totalMoods = moodEntries.length;

  // Calculate average mood
  const avgMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum: number, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)
    : '0.0';

  // Get mood distribution
  const moodCounts = moodEntries.reduce((acc: Record<number, number>, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const moodData = [
    { mood: 5, label: 'Excellent', emoji: '😊', count: moodCounts[5] || 0, color: COLORS.moodExcellent },
    { mood: 4, label: 'Good', emoji: '🙂', count: moodCounts[4] || 0, color: COLORS.moodGood },
    { mood: 3, label: 'Neutral', emoji: '😐', count: moodCounts[3] || 0, color: COLORS.moodNeutral },
    { mood: 2, label: 'Not Great', emoji: '😕', count: moodCounts[2] || 0, color: COLORS.moodNotGreat },
    { mood: 1, label: 'Difficult', emoji: '😢', count: moodCounts[1] || 0, color: COLORS.moodDifficult },
  ];

  const maxCount = Math.max(...moodData.map(d => d.count), 1);

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Your wellness insights</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="fire"
            label="Current Streak"
            value={`${currentStreak} days`}
            color="#FF6B6B"
          />
          <StatCard
            icon="notebook"
            label="Total Journals"
            value={totalJournals}
            color={COLORS.primary}
          />
          <StatCard
            icon="emoticon-happy"
            label="Mood Entries"
            value={totalMoods}
            color={COLORS.secondary}
          />
          <StatCard
            icon="chart-line"
            label="Avg Mood"
            value={avgMood}
            color={COLORS.accent}
          />
        </View>

        {/* Mood Distribution Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="chart-bar" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Mood Distribution</Text>
          </View>

          {totalMoods === 0 ? (
            <View style={styles.emptyChart}>
              <MaterialCommunityIcons name="emoticon-neutral" size={48} color={COLORS.gray300} />
              <Text style={styles.emptyText}>No mood data yet</Text>
              <Text style={styles.emptySubtext}>Start logging your moods to see insights</Text>
            </View>
          ) : (
            <View style={styles.chart}>
              {moodData.map((item) => (
                <View key={item.mood} style={styles.chartRow}>
                  <View style={styles.chartLabel}>
                    <Text style={styles.chartEmoji}>{item.emoji}</Text>
                    <Text style={styles.chartLabelText}>{item.label}</Text>
                  </View>
                  <View style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          width: `${(item.count / maxCount) * 100}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Weekly Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar-week" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>This Week</Text>
          </View>

          <View style={styles.weeklyCard}>
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>Total Entries</Text>
              <Text style={styles.weeklyValue}>{totalEntries}</Text>
            </View>
            <View style={styles.weeklyDivider} />
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>Journals Written</Text>
              <Text style={styles.weeklyValue}>{totalJournals}</Text>
            </View>
            <View style={styles.weeklyDivider} />
            <View style={styles.weeklyRow}>
              <Text style={styles.weeklyLabel}>Moods Logged</Text>
              <Text style={styles.weeklyValue}>{totalMoods}</Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightbulb-on" size={24} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Insights</Text>
          </View>

          {totalEntries > 0 ? (
            <>
              <View style={styles.insightCard}>
                <Text style={styles.insightText}>
                  🎉 You&apos;ve made {totalEntries} total entries! Keep up the great work.
                </Text>
              </View>
              {currentStreak >= 3 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightText}>
                    🔥 Amazing! You&apos;re on a {currentStreak}-day streak. Stay consistent!
                  </Text>
                </View>
              )}
              {parseFloat(avgMood) >= 4 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightText}>
                    ✨ Your average mood is {avgMood}/5. You&apos;re doing wonderfully!
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>
                Start logging your moods and journals to get personalized insights!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 20,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emptyChart: {
    backgroundColor: COLORS.white,
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray500,
    marginTop: 4,
  },
  chart: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chartLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    gap: 8,
  },
  chartEmoji: {
    fontSize: 20,
  },
  chartLabelText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  chartBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
  },
  chartBar: {
    height: '100%',
    borderRadius: 12,
  },
  chartCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    width: 30,
    textAlign: 'right',
  },
  weeklyCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyDivider: {
    height: 1,
    backgroundColor: COLORS.gray100,
    marginVertical: 16,
  },
  weeklyLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  weeklyValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  insightCard: {
    backgroundColor: COLORS.primaryLight + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  insightText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
});
