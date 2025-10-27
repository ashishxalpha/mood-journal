/**
 * Global State Management using Zustand
 * Manages application state including streak, mood, quotes, journal entries, and UI state
 */

import { create } from 'zustand';
import {
  StreakData,
  MoodStats,
  Quote,
  DailyLog,
  JournalEntry,
  ModalState,
  ModalType,
} from '../types';
import * as api from '../services/api';

/**
 * Application state interface
 */
interface AppState {
  // Data state
  streak: StreakData | null;
  moodStats: MoodStats | null;
  quote: Quote | null;
  dailyLogs: DailyLog[];
  selectedDate: string | null;
  
  // Loading states
  isLoadingStreak: boolean;
  isLoadingMood: boolean;
  isLoadingQuote: boolean;
  isLoadingLogs: boolean;
  
  // Error states
  streakError: string | null;
  moodError: string | null;
  quoteError: string | null;
  logsError: string | null;
  
  // Modal state
  modalState: ModalState;
  
  // Actions
  fetchStreak: () => Promise<void>;
  fetchMoodStats: () => Promise<void>;
  fetchQuote: () => Promise<void>;
  fetchDailyLogs: () => Promise<void>;
  setSelectedDate: (date: string | null) => void;
  openModal: (type: ModalType, date: string, entry?: JournalEntry) => void;
  closeModal: () => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, entry: JournalEntry) => void;
  initializeApp: () => Promise<void>;
}

/**
 * Zustand store for application state
 */
export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  streak: null,
  moodStats: null,
  quote: null,
  dailyLogs: [],
  selectedDate: null,
  
  // Loading states
  isLoadingStreak: false,
  isLoadingMood: false,
  isLoadingQuote: false,
  isLoadingLogs: false,
  
  // Error states
  streakError: null,
  moodError: null,
  quoteError: null,
  logsError: null,
  
  // Modal state
  modalState: {
    visible: false,
    type: 'none',
    selectedDate: null,
    journalEntry: null,
  },
  
  /**
   * Fetches streak data from API
   */
  fetchStreak: async () => {
    set({ isLoadingStreak: true, streakError: null });
    try {
      const streak = await api.getStreakCount();
      set({ streak, isLoadingStreak: false });
    } catch (error) {
      set({
        streakError: error instanceof Error ? error.message : 'Failed to fetch streak',
        isLoadingStreak: false,
      });
    }
  },
  
  /**
   * Fetches mood statistics from API
   */
  fetchMoodStats: async () => {
    set({ isLoadingMood: true, moodError: null });
    try {
      const moodStats = await api.getMoodScore();
      set({ moodStats, isLoadingMood: false });
    } catch (error) {
      set({
        moodError: error instanceof Error ? error.message : 'Failed to fetch mood stats',
        isLoadingMood: false,
      });
    }
  },
  
  /**
   * Fetches quote of the day from API
   */
  fetchQuote: async () => {
    set({ isLoadingQuote: true, quoteError: null });
    try {
      const quote = await api.getQuoteOfTheDay();
      set({ quote, isLoadingQuote: false });
    } catch (error) {
      set({
        quoteError: error instanceof Error ? error.message : 'Failed to fetch quote',
        isLoadingQuote: false,
      });
    }
  },
  
  /**
   * Fetches daily logs from API
   */
  fetchDailyLogs: async () => {
    set({ isLoadingLogs: true, logsError: null });
    try {
      const dailyLogs = await api.getDailyLogs();
      set({ dailyLogs, isLoadingLogs: false });
    } catch (error) {
      set({
        logsError: error instanceof Error ? error.message : 'Failed to fetch logs',
        isLoadingLogs: false,
      });
    }
  },
  
  /**
   * Sets the selected date
   */
  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },
  
  /**
   * Opens modal with specified type and data
   */
  openModal: (type: ModalType, date: string, entry?: JournalEntry) => {
    set({
      modalState: {
        visible: true,
        type,
        selectedDate: date,
        journalEntry: entry || null,
      },
    });
  },
  
  /**
   * Closes the modal and resets modal state
   */
  closeModal: () => {
    set({
      modalState: {
        visible: false,
        type: 'none',
        selectedDate: null,
        journalEntry: null,
      },
    });
  },
  
  /**
   * Adds a new journal entry to the store
   */
  addJournalEntry: (entry: JournalEntry) => {
    const { dailyLogs } = get();
    const existingLogIndex = dailyLogs.findIndex((log) => log.date === entry.date);
    
    if (existingLogIndex !== -1) {
      // Update existing log
      const updatedLogs = [...dailyLogs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        journal: entry,
        hasEntry: true,
      };
      set({ dailyLogs: updatedLogs });
    } else {
      // Add new log
      const newLog: DailyLog = {
        date: entry.date,
        journal: entry,
        mood: entry.mood,
        hasEntry: true,
      };
      set({ dailyLogs: [...dailyLogs, newLog] });
    }
  },
  
  /**
   * Updates an existing journal entry
   */
  updateJournalEntry: (id: string, entry: JournalEntry) => {
    const { dailyLogs } = get();
    const updatedLogs = dailyLogs.map((log) => {
      if (log.journal?.id === id) {
        return {
          ...log,
          journal: entry,
        };
      }
      return log;
    });
    set({ dailyLogs: updatedLogs });
  },
  
  /**
   * Initializes the app by fetching all required data
   */
  initializeApp: async () => {
    const { fetchStreak, fetchMoodStats, fetchQuote, fetchDailyLogs } = get();
    
    // Fetch all data in parallel for better performance
    await Promise.all([
      fetchStreak(),
      fetchMoodStats(),
      fetchQuote(),
      fetchDailyLogs(),
    ]);
  },
}));
