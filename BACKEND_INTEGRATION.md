# Backend Integration Guide

Guide for connecting the Mood Journal app to a real backend API.

## Current Architecture

The app currently uses mock APIs in `services/api.ts` with simulated delays. All functions return promises and are ready for backend integration.

## API Endpoints to Implement

### 1. Authentication

#### Register User
```
POST /api/auth/register
Body: {
  email: string,
  password: string,
  name: string
}
Response: {
  user: User,
  token: string
}
```

#### Login
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  user: User,
  token: string
}
```

### 2. User Profile

#### Get Profile
```
GET /api/user/profile
Headers: { Authorization: Bearer {token} }
Response: {
  user: User
}
```

#### Update Profile
```
PUT /api/user/profile
Headers: { Authorization: Bearer {token} }
Body: {
  name?: string,
  email?: string,
  preferences?: object
}
Response: {
  user: User
}
```

### 3. Streak Data

#### Get Streak
```
GET /api/user/streak
Headers: { Authorization: Bearer {token} }
Response: {
  currentStreak: number,
  longestStreak: number,
  lastEntryDate: string
}
```

### 4. Mood Statistics

#### Get Mood Stats
```
GET /api/mood/statistics
Headers: { Authorization: Bearer {token} }
Query: {
  startDate?: string,
  endDate?: string
}
Response: {
  averageMood: number,
  totalEntries: number,
  moodDistribution: {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number
  },
  weeklyAverage: number,
  monthlyAverage: number
}
```

### 5. Quotes

#### Get Quote of the Day
```
GET /api/quotes/daily
Response: {
  id: string,
  text: string,
  author: string,
  category: string
}
```

#### Get Random Quote
```
GET /api/quotes/random
Response: {
  id: string,
  text: string,
  author: string,
  category: string
}
```

### 6. Journal Entries

#### Get All Entries
```
GET /api/journals
Headers: { Authorization: Bearer {token} }
Query: {
  startDate?: string,
  endDate?: string,
  limit?: number,
  offset?: number
}
Response: {
  entries: JournalEntry[],
  total: number,
  hasMore: boolean
}
```

#### Get Entry by Date
```
GET /api/journals/:date
Headers: { Authorization: Bearer {token} }
Response: {
  entry: JournalEntry | null
}
```

#### Create Entry
```
POST /api/journals
Headers: { Authorization: Bearer {token} }
Body: {
  date: string,
  title: string,
  content: string,
  mood?: {
    level: 1 | 2 | 3 | 4 | 5,
    label: string,
    emoji: string
  },
  tags?: string[]
}
Response: {
  entry: JournalEntry
}
```

#### Update Entry
```
PUT /api/journals/:id
Headers: { Authorization: Bearer {token} }
Body: {
  title?: string,
  content?: string,
  mood?: MoodEntry,
  tags?: string[]
}
Response: {
  entry: JournalEntry
}
```

#### Delete Entry
```
DELETE /api/journals/:id
Headers: { Authorization: Bearer {token} }
Response: {
  success: boolean
}
```

### 7. Mood Entries

#### Save Mood
```
POST /api/mood
Headers: { Authorization: Bearer {token} }
Body: {
  date: string,
  mood: 1 | 2 | 3 | 4 | 5,
  moodLabel: string,
  emoji: string
}
Response: {
  moodEntry: MoodEntry
}
```

## Integration Steps

### Step 1: Install HTTP Client

```bash
npm install axios
# or
npm install @tanstack/react-query
```

### Step 2: Create API Configuration

Create `services/config.ts`:

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - change based on environment
const BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://api.yourapp.com/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - logout user
      await AsyncStorage.removeItem('authToken');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);
```

### Step 3: Update API Service

Update `services/api.ts`:

```typescript
import { apiClient } from './config';
import {
  StreakData,
  MoodStats,
  Quote,
  JournalEntry,
  MoodEntry,
  MoodLevel,
} from '../types';

/**
 * Fetches the current streak count
 */
export const getStreakCount = async (): Promise<StreakData> => {
  const response = await apiClient.get<StreakData>('/user/streak');
  return response.data;
};

/**
 * Fetches mood statistics
 */
export const getMoodScore = async (): Promise<MoodStats> => {
  const response = await apiClient.get<MoodStats>('/mood/statistics');
  return response.data;
};

/**
 * Fetches quote of the day
 */
export const getQuoteOfTheDay = async (): Promise<Quote> => {
  const response = await apiClient.get<Quote>('/quotes/daily');
  return response.data;
};

/**
 * Fetches daily logs
 */
export const getDailyLogs = async (
  startDate?: string,
  endDate?: string
): Promise<JournalEntry[]> => {
  const params = { startDate, endDate };
  const response = await apiClient.get<{ entries: JournalEntry[] }>(
    '/journals',
    { params }
  );
  return response.data.entries;
};

/**
 * Fetches journal entry by date
 */
export const getJournalByDate = async (
  date: string
): Promise<JournalEntry | null> => {
  try {
    const response = await apiClient.get<{ entry: JournalEntry }>(
      `/journals/${date}`
    );
    return response.data.entry;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * Creates a new journal entry
 */
export const createJournalEntry = async (
  entry: Omit<JournalEntry, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> => {
  const response = await apiClient.post<{ entry: JournalEntry }>(
    '/journals',
    entry
  );
  return response.data.entry;
};

/**
 * Updates an existing journal entry
 */
export const updateJournalEntry = async (
  id: string,
  updates: Partial<JournalEntry>
): Promise<JournalEntry> => {
  const response = await apiClient.put<{ entry: JournalEntry }>(
    `/journals/${id}`,
    updates
  );
  return response.data.entry;
};

/**
 * Saves a mood entry
 */
export const saveMoodEntry = async (
  date: string,
  mood: MoodLevel,
  moodLabel: string,
  emoji: string
): Promise<MoodEntry> => {
  const response = await apiClient.post<{ moodEntry: MoodEntry }>(
    '/mood',
    { date, mood, moodLabel, emoji }
  );
  return response.data.moodEntry;
};
```

### Step 4: Add Authentication

Create `services/auth.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './config';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export const authService = {
  /**
   * Register new user
   */
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    
    // Save token
    await AsyncStorage.setItem('authToken', response.data.token);
    
    return response.data;
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    
    // Save token
    await AsyncStorage.setItem('authToken', response.data.token);
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};
```

### Step 5: Add Error Handling

Create `utils/errorHandler.ts`:

```typescript
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string; code?: string }>;
    
    return {
      message: axiosError.response?.data?.message || 'An error occurred',
      code: axiosError.response?.data?.code,
      statusCode: axiosError.response?.status,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'An unknown error occurred',
  };
};
```

### Step 6: Update Zustand Store

Update error handling in `store/useAppStore.ts`:

```typescript
import { handleApiError } from '../utils/errorHandler';

// In each action:
fetchStreak: async () => {
  set({ isLoadingStreak: true, streakError: null });
  try {
    const streak = await api.getStreakCount();
    set({ streak, isLoadingStreak: false });
  } catch (error) {
    const apiError = handleApiError(error);
    set({
      streakError: apiError.message,
      isLoadingStreak: false,
    });
  }
},
```

## Data Persistence

### Using AsyncStorage

Install:
```bash
npm install @react-native-async-storage/async-storage
```

Create `services/storage.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  /**
   * Save data
   */
  async set(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Get data
   */
  async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  /**
   * Remove data
   */
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  /**
   * Clear all data
   */
  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
```

### Caching Strategy

```typescript
// Cache journal entries locally
export const getCachedJournals = async (): Promise<JournalEntry[]> => {
  const cached = await storage.get<JournalEntry[]>('journals');
  return cached || [];
};

export const setCachedJournals = async (
  entries: JournalEntry[]
): Promise<void> => {
  await storage.set('journals', entries);
};

// Fetch with cache fallback
export const getJournalsWithCache = async (): Promise<JournalEntry[]> => {
  try {
    const entries = await api.getDailyLogs();
    await setCachedJournals(entries);
    return entries;
  } catch (error) {
    // Return cached data if API fails
    return await getCachedJournals();
  }
};
```

## Offline Support

### Using React Query

Install:
```bash
npm install @tanstack/react-query
```

Setup:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// In _layout.tsx
<QueryClientProvider client={queryClient}>
  {/* Your app */}
</QueryClientProvider>
```

Usage:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['journals'],
  queryFn: () => api.getDailyLogs(),
});

// Mutate data
const mutation = useMutation({
  mutationFn: api.createJournalEntry,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['journals'] });
  },
});
```

## Testing Backend Integration

### 1. Mock Server Setup

Using json-server:

```bash
npm install -g json-server
```

Create `db.json`:

```json
{
  "journals": [],
  "users": [],
  "moods": []
}
```

Run:
```bash
json-server --watch db.json --port 3000
```

### 2. Test Endpoints

Using Postman or curl:

```bash
# Test get streak
curl http://localhost:3000/user/streak

# Test create journal
curl -X POST http://localhost:3000/journals \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content"}'
```

## Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Token Storage**: Use secure storage (Keychain/Keystore)
3. **Token Refresh**: Implement refresh token mechanism
4. **Rate Limiting**: Handle rate limit responses
5. **Input Validation**: Validate all user inputs
6. **Error Messages**: Don't expose sensitive info in errors

## Monitoring

### Sentry Integration

```bash
npm install @sentry/react-native
```

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: __DEV__ ? 'development' : 'production',
});

// Capture API errors
try {
  await api.getStreakCount();
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

## Migration Checklist

- [ ] Backend API implemented and deployed
- [ ] API endpoints tested
- [ ] Authentication flow working
- [ ] Token refresh implemented
- [ ] Error handling added
- [ ] Offline support configured
- [ ] Data persistence working
- [ ] Cache invalidation tested
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Documentation updated

---

This guide provides a complete roadmap for backend integration. Adjust based on your specific backend technology and requirements.
