/**
 * Journal API Service
 * Handles all journal-related data operations
 */

import { Result, JournalEntry, JournalFilter, PaginatedJournals, MoodLevel } from '../types';

// Helper to create a MoodEntry from a level
const createMoodEntry = (level: MoodLevel, note: string, timestamp: number) => {
  const moodMap: Record<MoodLevel, { label: string; emoji: string }> = {
    1: { label: 'Difficult', emoji: '😢' },
    2: { label: 'Not Great', emoji: '😕' },
    3: { label: 'Neutral', emoji: '😐' },
    4: { label: 'Good', emoji: '🙂' },
    5: { label: 'Excellent', emoji: '😊' },
  };
  
  return {
    id: `m_${timestamp}`,
    date: new Date(timestamp).toISOString().split('T')[0],
    mood: level,
    moodLabel: moodMap[level].label,
    emoji: moodMap[level].emoji,
    timestamp,
  };
};

// Mock journal data
const mockJournals: JournalEntry[] = [
  {
    id: '1',
    date: '2025-10-24',
    title: 'Great Day at the Park',
    content: 'Spent the afternoon at the park. The weather was perfect and I felt really energized.',
    mood: createMoodEntry(5, 'Felt amazing!', Date.parse('2025-10-24T10:30:00Z')),
    tags: ['outdoors', 'exercise'],
    timestamp: Date.parse('2025-10-24T10:30:00Z'),
    createdAt: Date.parse('2025-10-24T10:30:00Z'),
    updatedAt: Date.parse('2025-10-24T10:30:00Z'),
  },
  {
    id: '2',
    date: '2025-10-23',
    title: 'Productive Work Day',
    content: 'Completed all my tasks today. Feeling accomplished!',
    mood: createMoodEntry(4, '', Date.parse('2025-10-23T15:45:00Z')),
    tags: ['work', 'productivity'],
    timestamp: Date.parse('2025-10-23T15:45:00Z'),
    createdAt: Date.parse('2025-10-23T15:45:00Z'),
    updatedAt: Date.parse('2025-10-23T15:45:00Z'),
  },
  {
    id: '3',
    date: '2025-10-22',
    title: 'Quiet Evening',
    content: 'Not much happened today. Just a normal day.',
    mood: createMoodEntry(3, '', Date.parse('2025-10-22T20:00:00Z')),
    tags: ['rest'],
    timestamp: Date.parse('2025-10-22T20:00:00Z'),
    createdAt: Date.parse('2025-10-22T20:00:00Z'),
    updatedAt: Date.parse('2025-10-22T20:00:00Z'),
  },
  {
    id: '4',
    date: '2025-10-21',
    title: 'Stressful Meeting',
    content: 'Had a tough meeting at work today. Feeling a bit overwhelmed.',
    mood: createMoodEntry(2, 'Stressed', Date.parse('2025-10-21T14:20:00Z')),
    tags: ['work', 'stress'],
    timestamp: Date.parse('2025-10-21T14:20:00Z'),
    createdAt: Date.parse('2025-10-21T14:20:00Z'),
    updatedAt: Date.parse('2025-10-21T14:20:00Z'),
  },
  {
    id: '5',
    date: '2025-10-20',
    title: 'Coffee with Friends',
    content: 'Caught up with old friends over coffee. So refreshing!',
    mood: createMoodEntry(5, '', Date.parse('2025-10-20T11:00:00Z')),
    tags: ['social', 'friends'],
    timestamp: Date.parse('2025-10-20T11:00:00Z'),
    createdAt: Date.parse('2025-10-20T11:00:00Z'),
    updatedAt: Date.parse('2025-10-20T11:00:00Z'),
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get paginated list of journals with optional filters
 */
export async function getJournals(
  filter?: JournalFilter
): Promise<Result<PaginatedJournals>> {
  try {
    await delay(600);

    let filtered = [...mockJournals];

    // Apply mood filter
    if (filter?.mood) {
      filtered = filtered.filter(j => j.mood?.mood === filter.mood);
    }

    // Apply date range filter
    if (filter?.dateFrom) {
      filtered = filtered.filter(j => j.date >= filter.dateFrom!);
    }
    if (filter?.dateTo) {
      filtered = filtered.filter(j => j.date <= filter.dateTo!);
    }

    // Apply search filter
    if (filter?.searchQuery) {
      const search = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(search) ||
        j.content.toLowerCase().includes(search) ||
        (j.tags && j.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }

    // Apply tag filter
    if (filter?.tags && filter.tags.length > 0) {
      filtered = filtered.filter(j =>
        j.tags && filter.tags!.some(tag => j.tags!.includes(tag))
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    // Pagination
    const page = 1;
    const pageSize = 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        entries: paginatedData,
        total: filtered.length,
        page,
        pageSize,
        hasMore: endIndex < filtered.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch journals',
      },
    };
  }
}

/**
 * Get a single journal entry by ID
 */
export async function getJournalById(id: string): Promise<Result<JournalEntry>> {
  try {
    await delay(400);

    const journal = mockJournals.find(j => j.id === id);

    if (!journal) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Journal entry not found',
        },
      };
    }

    return {
      success: true,
      data: journal,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch journal',
      },
    };
  }
}

/**
 * Create a new journal entry
 */
export async function createJournal(
  data: Omit<JournalEntry, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>
): Promise<Result<JournalEntry>> {
  try {
    await delay(800);

    const newJournal: JournalEntry = {
      ...data,
      id: Date.now().toString(),
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    mockJournals.unshift(newJournal);

    return {
      success: true,
      data: newJournal,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create journal',
      },
    };
  }
}

/**
 * Update an existing journal entry
 */
export async function updateJournal(
  id: string,
  data: Partial<Omit<JournalEntry, 'id' | 'timestamp' | 'createdAt'>>
): Promise<Result<JournalEntry>> {
  try {
    await delay(800);

    const index = mockJournals.findIndex(j => j.id === id);

    if (index === -1) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Journal entry not found',
        },
      };
    }

    const updated = {
      ...mockJournals[index],
      ...data,
      updatedAt: Date.now(),
    };

    mockJournals[index] = updated;

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update journal',
      },
    };
  }
}

/**
 * Delete a journal entry
 */
export async function deleteJournal(id: string): Promise<Result<void>> {
  try {
    await delay(600);

    const index = mockJournals.findIndex(j => j.id === id);

    if (index === -1) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Journal entry not found',
        },
      };
    }

    mockJournals.splice(index, 1);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete journal',
      },
    };
  }
}
