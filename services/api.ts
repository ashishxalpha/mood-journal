/**
 * Dummy API Service
 * Simulates backend API calls with mock data and artificial delays
 * All functions return promises to simulate asynchronous operations
 */

import {
  StreakData,
  MoodStats,
  Quote,
  DailyLog,
  JournalEntry,
  MoodEntry,
  MoodLevel,
} from '../types';

/**
 * Simulates network delay for realistic API behavior
 * @param ms - Delay in milliseconds
 */
const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock data: Streak information
 */
const mockStreakData: StreakData = {
  currentStreak: 7,
  longestStreak: 15,
  lastEntryDate: new Date().toISOString().split('T')[0],
};

/**
 * Mock data: Mood statistics
 */
const mockMoodStats: MoodStats = {
  averageMood: 3.8,
  totalEntries: 45,
  moodDistribution: {
    1: 2,
    2: 5,
    3: 15,
    4: 18,
    5: 5,
  },
  weeklyAverage: 4.1,
  monthlyAverage: 3.8,
};

/**
 * Mock data: Inspirational quotes
 */
const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'motivation',
  },
  {
    id: '2',
    text: 'Your time is limited, don\'t waste it living someone else\'s life.',
    author: 'Steve Jobs',
    category: 'inspiration',
  },
  {
    id: '3',
    text: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
    category: 'motivation',
  },
  {
    id: '4',
    text: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
    category: 'confidence',
  },
  {
    id: '5',
    text: 'Every moment is a fresh beginning.',
    author: 'T.S. Eliot',
    category: 'mindfulness',
  },
];

/**
 * Mock data: Sample journal entries
 */
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'A Productive Day',
    content: 'Today was incredibly productive. I completed all my tasks and even had time for a workout. Feeling accomplished and energized!',
    mood: {
      id: 'm1',
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      moodLabel: 'Excellent',
      emoji: '😄',
      timestamp: Date.now(),
    },
    tags: ['productivity', 'fitness', 'happiness'],
    timestamp: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    title: 'Reflective Evening',
    content: 'Spent some time reflecting on my goals and where I want to be. It\'s important to pause and think about life direction.',
    mood: {
      id: 'm2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      mood: 4,
      moodLabel: 'Good',
      emoji: '🙂',
      timestamp: Date.now() - 86400000,
    },
    tags: ['reflection', 'goals'],
    timestamp: Date.now() - 86400000,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
];

/**
 * Fetches the current streak count and related data
 * @returns Promise with streak information
 */
export const getStreakCount = async (): Promise<StreakData> => {
  await simulateDelay(600);
  return mockStreakData;
};

/**
 * Fetches mood statistics and average mood score
 * @returns Promise with mood statistics
 */
export const getMoodScore = async (): Promise<MoodStats> => {
  await simulateDelay(700);
  return mockMoodStats;
};

/**
 * Fetches a random quote of the day
 * @returns Promise with a motivational quote
 */
export const getQuoteOfTheDay = async (): Promise<Quote> => {
  await simulateDelay(500);
  const randomIndex = Math.floor(Math.random() * mockQuotes.length);
  return mockQuotes[randomIndex];
};

/**
 * Fetches daily logs with mood and journal entries
 * @param startDate - Start date for fetching logs (ISO string)
 * @param endDate - End date for fetching logs (ISO string)
 * @returns Promise with array of daily logs
 */
export const getDailyLogs = async (
  startDate?: string,
  endDate?: string
): Promise<DailyLog[]> => {
  await simulateDelay(800);
  
  // Convert journal entries to daily logs
  const dailyLogs: DailyLog[] = mockJournalEntries.map((entry) => ({
    date: entry.date,
    mood: entry.mood,
    journal: entry,
    hasEntry: true,
  }));

  return dailyLogs;
};

/**
 * Fetches a specific journal entry by date
 * @param date - Date string in ISO format (YYYY-MM-DD)
 * @returns Promise with journal entry or null if not found
 */
export const getJournalByDate = async (
  date: string
): Promise<JournalEntry | null> => {
  await simulateDelay(400);
  const entry = mockJournalEntries.find((e) => e.date === date);
  return entry || null;
};

/**
 * Creates a new journal entry (mock implementation)
 * @param entry - Partial journal entry data
 * @returns Promise with created journal entry
 */
export const createJournalEntry = async (
  entry: Omit<JournalEntry, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> => {
  await simulateDelay(600);
  
  const newEntry: JournalEntry = {
    ...entry,
    id: `journal_${Date.now()}`,
    timestamp: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // In a real app, this would be persisted to backend/storage
  mockJournalEntries.push(newEntry);
  
  return newEntry;
};

/**
 * Updates an existing journal entry (mock implementation)
 * @param id - Journal entry ID
 * @param updates - Partial journal entry data to update
 * @returns Promise with updated journal entry
 */
export const updateJournalEntry = async (
  id: string,
  updates: Partial<JournalEntry>
): Promise<JournalEntry> => {
  await simulateDelay(500);
  
  const entryIndex = mockJournalEntries.findIndex((e) => e.id === id);
  if (entryIndex === -1) {
    throw new Error('Journal entry not found');
  }

  const updatedEntry: JournalEntry = {
    ...mockJournalEntries[entryIndex],
    ...updates,
    updatedAt: Date.now(),
  };

  mockJournalEntries[entryIndex] = updatedEntry;
  
  return updatedEntry;
};

/**
 * Saves a mood entry for a specific date (mock implementation)
 * @param date - Date string in ISO format
 * @param mood - Mood level (1-5)
 * @param moodLabel - Text label for the mood
 * @param emoji - Emoji representation
 * @returns Promise with created mood entry
 */
export const saveMoodEntry = async (
  date: string,
  mood: MoodLevel,
  moodLabel: string,
  emoji: string
): Promise<MoodEntry> => {
  await simulateDelay(400);
  
  const moodEntry: MoodEntry = {
    id: `mood_${Date.now()}`,
    date,
    mood,
    moodLabel,
    emoji,
    timestamp: Date.now(),
  };

  // In a real app, this would update the backend
  return moodEntry;
};
