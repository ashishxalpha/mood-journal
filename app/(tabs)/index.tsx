/**
 * Dashboard/Home Screen
 * Main screen displaying streak, mood stats, daily quote, and interactive calendar
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../contexts/ThemeContext';
import { StatCard, QuoteCard, JournalModal, DateActionModal } from '../../components';
import { MarkedDates } from '../../types';
import * as api from '../../services/api';

/**
 * Main Dashboard Component
 */
const Index: React.FC = () => {
  // Theme colors
  const { colors } = useTheme();
  
  // Global state from Zustand store
  const {
    streak,
    moodStats,
    quote,
    dailyLogs,
    isLoadingStreak,
    isLoadingMood,
    isLoadingQuote,
    initializeApp,
  } = useAppStore();

  // Local state for modals and UI
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateActionModalVisible, setDateActionModalVisible] = useState(false);
  const [journalModalVisible, setJournalModalVisible] = useState(false);
  const [journalModalMode, setJournalModalMode] = useState<'view' | 'add' | 'edit'>('view');
  const [currentJournalEntry, setCurrentJournalEntry] = useState<any>(null);
  const [bellScale] = useState(new Animated.Value(1));
  
  // Mock unread notifications count - replace with actual data from store/API
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  /**
   * Initialize app data on mount
   */
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  /**
   * Handle notification bell press
   */
  const handleNotificationPress = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(bellScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bellScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to notifications screen
    router.push('/notifications');
  };

  /**
   * Generate marked dates for calendar based on daily logs
   */
  const getMarkedDates = (): MarkedDates => {
    const marked: MarkedDates = {};
    
    dailyLogs.forEach((log) => {
      if (log.hasEntry) {
        marked[log.date] = {
          marked: true,
          dotColor: log.mood ? getMoodColor(log.mood.mood) : '#6366f1',
        };
      }
    });

    // Mark selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marked;
  };

  /**
   * Get color based on mood level
   */
  const getMoodColor = (moodLevel: number): string => {
    const moodColors = {
      5: colors.moodExcellent,
      4: colors.moodGood,
      3: colors.moodNeutral,
      2: colors.moodNotGreat,
      1: colors.moodDifficult,
    };
    return moodColors[moodLevel as keyof typeof moodColors] || colors.primary;
  };

  /**
   * Handle calendar day press
   */
  const onDayPress = async (day: DateData) => {
    // Prevent selecting future dates
    const today = new Date().toISOString().split('T')[0];
    if (day.dateString > today) {
      return; // Don't allow future dates
    }
    
    setSelectedDate(day.dateString);
    
    // Fetch the journal entry for preview in the modal
    const entry = await api.getJournalByDate(day.dateString);
    setCurrentJournalEntry(entry);
    
    setDateActionModalVisible(true);
  };

  /**
   * Handle view journal action - Closes date modal immediately
   */
  const handleViewJournal = async () => {
    if (!selectedDate) return;
    
    const entry = await api.getJournalByDate(selectedDate);
    setCurrentJournalEntry(entry);
    setJournalModalMode('view');
    setJournalModalVisible(true);
    setDateActionModalVisible(false);
  };

  /**
   * Handle add/edit journal action - Closes date modal immediately
   */
  const handleAddJournal = async () => {
    if (!selectedDate) return;
    
    const entry = await api.getJournalByDate(selectedDate);
    setCurrentJournalEntry(entry);
    setJournalModalMode(entry ? 'edit' : 'add');
    setJournalModalVisible(true);
    setDateActionModalVisible(false);
  };  /**
   * Handle journal save
   */
  const handleJournalSave = (entry: any) => {
    useAppStore.getState().addJournalEntry(entry);
    setJournalModalVisible(false);
    initializeApp(); // Refresh data
  };

  /**
   * Check if selected date has an entry
   */
  const hasEntry = selectedDate
    ? dailyLogs.some((log) => log.date === selectedDate && log.hasEntry)
    : false;

  /**
   * Get the maximum date (today)
   */
  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.offWhite} />
      
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Gradient - Theme colors */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.headerTitle}>Your Mood Journal</Text>
            </View>
            
            <View style={styles.headerRight}>
              {/* Notification Bell */}
              <TouchableOpacity
                onPress={handleNotificationPress}
                activeOpacity={0.7}
                style={styles.notificationButton}
              >
                <Animated.View style={[styles.notificationIconContainer, { transform: [{ scale: bellScale }] }]}>
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={28}
                    color={colors.textPrimary}
                  />
                  {unreadNotifications > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationBadgeText}>
                        {unreadNotifications > 99 ? '99+' : unreadNotifications}
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </TouchableOpacity>
              
              {/* Mood Icon */}
              <View style={styles.headerIconContainer}>
                <MaterialCommunityIcons name="emoticon-happy-outline" size={32} color={colors.textPrimary} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statCardWrapper}>
              <StatCard
                icon="fire"
                label="Current Streak"
                value={streak?.currentStreak || 0}
                iconColor={colors.warmth}
                isLoading={isLoadingStreak}
              />
            </View>
            <View style={styles.statCardWrapper}>
              <StatCard
                icon="emoticon-happy"
                label="Avg Mood"
                value={moodStats ? moodStats.averageMood.toFixed(1) : '0.0'}
                iconColor={colors.success}
                isLoading={isLoadingMood}
              />
            </View>
          </View>
        </View>

        {/* Quote Section */}
        <View style={styles.quoteSection}>
          <Text style={styles.sectionTitle}>Daily Inspiration</Text>
          <QuoteCard quote={quote} isLoading={isLoadingQuote} />
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              maxDate={getMaxDate()}
              enableSwipeMonths={true}
              theme={{
                backgroundColor: colors.white,
                calendarBackground: colors.white,
                textSectionTitleColor: colors.textSecondary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.white,
                todayTextColor: colors.primary,
                dayTextColor: colors.textPrimary,
                textDisabledColor: colors.gray300,
                dotColor: colors.primary,
                selectedDotColor: colors.white,
                arrowColor: colors.primary,
                monthTextColor: colors.textPrimary,
                textDayFontWeight: '500',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 14,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 12,
              }}
              style={styles.calendar}
            />
            
            {/* Calendar Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.legendText}>Has Entry</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.moodExcellent }]} />
                <Text style={styles.legendText}>Great Mood</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.moodNeutral }]} />
                <Text style={styles.legendText}>Neutral</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Padding for scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Date Action Modal */}
      <DateActionModal
        visible={dateActionModalVisible}
        onClose={() => setDateActionModalVisible(false)}
        date={selectedDate}
        hasEntry={hasEntry}
        journalEntry={currentJournalEntry}
        onViewJournal={handleViewJournal}
        onAddJournal={handleAddJournal}
      />

      {/* Journal Modal */}
      <JournalModal
        visible={journalModalVisible}
        onClose={() => setJournalModalVisible(false)}
        date={selectedDate}
        entry={currentJournalEntry}
        mode={journalModalMode}
        onSave={handleJournalSave}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 20,
      paddingBottom: 32,
      paddingHorizontal: 20,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    notificationButton: {
      position: 'relative',
      padding: 8,
      marginRight: 4,
    },
    notificationIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    notificationBadge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: '#FF6B6B',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    notificationBadgeText: {
      color: colors.white,
      fontSize: 10,
      fontWeight: '700',
      lineHeight: 14,
    },
    greeting: {
      fontSize: 14,
      color: colors.textPrimary,
      marginBottom: 4,
      opacity: 0.8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    headerIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsSection: {
      paddingHorizontal: 20,
      marginTop: -16,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    statCardWrapper: {
      flex: 1,
    },
    quoteSection: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    calendarSection: {
      paddingHorizontal: 20,
      marginTop: 32,
      paddingBottom: 20,
    },
    calendarContainer: {
      backgroundColor: colors.white,
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
    calendar: {
      borderRadius: 12,
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.gray200,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    overviewSection: {
      paddingHorizontal: 20,
      marginTop: 32,
    },
    overviewCard: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    overviewItem: {
      flex: 1,
      alignItems: 'center',
    },
    overviewValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginTop: 8,
    },
    overviewLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    overviewDivider: {
      width: 1,
      backgroundColor: colors.gray200,
      marginHorizontal: 12,
    },
    bottomPadding: {
      height: 40,
    },
  });

export default Index;
