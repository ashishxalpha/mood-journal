/**
 * Type definitions for the Mood Journal App
 * Defines all interfaces and types used throughout the application
 */

/**
 * Mood levels from 1 (very negative) to 5 (very positive)
 */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Represents a single mood entry with associated metadata
 */
export interface MoodEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  mood: MoodLevel;
  moodLabel: string; // e.g., "Happy", "Sad", "Neutral"
  emoji: string; // emoji representation of mood
  timestamp: number; // Unix timestamp
}

/**
 * Represents a journal entry with optional mood
 */
export interface JournalEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string;
  content: string;
  mood?: MoodEntry;
  tags?: string[];
  timestamp: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Daily log combining mood and journal data
 */
export interface DailyLog {
  date: string;
  mood?: MoodEntry;
  journal?: JournalEntry;
  hasEntry: boolean;
}

/**
 * User streak information
 */
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string;
}

/**
 * Mood statistics and analytics
 */
export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  moodDistribution: Record<MoodLevel, number>;
  weeklyAverage: number;
  monthlyAverage: number;
}

/**
 * Quote of the day data
 */
export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
}

/**
 * API response wrapper for loading states
 */
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Calendar marked dates for react-native-calendars
 */
export interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
    customStyles?: {
      container?: object;
      text?: object;
    };
  };
}

/**
 * Modal types for different actions
 */
export type ModalType = 'none' | 'view' | 'add' | 'edit';

/**
 * Modal state interface
 */
export interface ModalState {
  visible: boolean;
  type: ModalType;
  selectedDate: string | null;
  journalEntry: JournalEntry | null;
}

// ============================================
// Authentication & User Types
// ============================================

/**
 * User account information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: number;
  settings: UserSettings;
}

/**
 * User settings and preferences
 */
export interface UserSettings {
  theme: ThemeMode;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
}

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string; // HH:mm format
  streakReminder: boolean;
  inspirationNotifications: boolean;
}

export interface PrivacySettings {
  dataBackup: boolean;
  analytics: boolean;
  crashReports: boolean;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup data
 */
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// ============================================
// Journal & Entries Types (Extended)
// ============================================

/**
 * Journal filter options
 */
export interface JournalFilter {
  mood?: MoodLevel;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  tags?: string[];
}

/**
 * Paginated journal response
 */
export interface PaginatedJournals {
  entries: JournalEntry[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// Analytics & Statistics Types
// ============================================

/**
 * Mood trend data point
 */
export interface MoodTrendPoint {
  date: string;
  mood: number;
  label: string;
}

/**
 * Analytics time range
 */
export type AnalyticsRange = 'week' | 'month' | 'year' | 'all';

/**
 * Detailed analytics data
 */
export interface AnalyticsData {
  moodTrend: MoodTrendPoint[];
  moodDistribution: Record<MoodLevel, number>;
  streakData: StreakData;
  bestDay: { date: string; mood: number } | null;
  worstDay: { date: string; mood: number } | null;
  totalEntries: number;
  averageMood: number;
  wordCloud: { text: string; value: number }[];
}

// ============================================
// Inspiration & Quotes Types
// ============================================

/**
 * Inspiration post with metadata
 */
export interface Inspiration {
  id: string;
  text: string;
  author?: string;
  category: 'quote' | 'affirmation' | 'tip' | 'challenge';
  date: string;
  liked: boolean;
  imageUrl?: string;
}

/**
 * Paginated inspiration response
 */
export interface PaginatedInspiration {
  items: Inspiration[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ============================================
// AI Chatbot Types
// ============================================

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

/**
 * Chat session
 */
export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Suggested prompt for chatbot
 */
export interface ChatPrompt {
  id: string;
  text: string;
  category: 'mood' | 'reflection' | 'gratitude' | 'goals';
}

// ============================================
// Notifications & Reminders Types
// ============================================

/**
 * Reminder configuration
 */
export interface Reminder {
  id: string;
  title: string;
  time: string; // HH:mm format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  type: 'daily' | 'streak' | 'inspiration';
}

// ============================================
// Data Export Types
// ============================================

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv' | 'pdf';

/**
 * Export data structure
 */
export interface ExportData {
  user: User;
  journals: JournalEntry[];
  moods: MoodEntry[];
  analytics: AnalyticsData;
  exportedAt: number;
  version: string;
}

// ============================================
// Error Handling Types
// ============================================

/**
 * API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };
