/**
 * Authentication API Service
 * Mock implementation for user authentication
 */

import { User, LoginCredentials, SignupData, Result } from '../types';

// Simulated delay for API calls
const API_DELAY = 800;

// Mock user data
const MOCK_USER: User = {
  id: 'user_001',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: undefined,
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  settings: {
    theme: 'auto',
    notifications: {
      enabled: true,
      dailyReminder: true,
      reminderTime: '20:00',
      streakReminder: true,
      inspirationNotifications: true,
    },
    privacy: {
      dataBackup: true,
      analytics: true,
      crashReports: true,
    },
    language: 'en',
  },
};

/**
 * Login user with credentials
 */
export const login = async (
  credentials: LoginCredentials
): Promise<Result<User>> => {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  try {
    // Mock validation
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      };
    }

    if (credentials.password.length < 6) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      };
    }

    // Simulate successful login
    console.log('[Auth API] Login successful:', credentials.email);
    return {
      success: true,
      data: { ...MOCK_USER, email: credentials.email },
    };
  } catch (error) {
    console.error('[Auth API] Login error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again.',
      },
    };
  }
};

/**
 * Sign up new user
 */
export const signup = async (data: SignupData): Promise<Result<User>> => {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  try {
    // Mock validation
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'All fields are required',
        },
      };
    }

    if (data.password.length < 6) {
      return {
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 6 characters',
        },
      };
    }

    // Simulate successful signup
    console.log('[Auth API] Signup successful:', data.email);
    return {
      success: true,
      data: {
        ...MOCK_USER,
        name: data.name,
        email: data.email,
        createdAt: Date.now(),
      },
    };
  } catch (error) {
    console.error('[Auth API] Signup error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again.',
      },
    };
  }
};

/**
 * Logout current user
 */
export const logout = async (): Promise<Result<void>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    console.log('[Auth API] Logout successful');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('[Auth API] Logout error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to logout',
      },
    };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<Result<User>> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    console.log('[Auth API] Fetched current user');
    return { success: true, data: MOCK_USER };
  } catch (error) {
    console.error('[Auth API] Get user error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to fetch user profile',
      },
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  updates: Partial<User>
): Promise<Result<User>> => {
  await new Promise((resolve) => setTimeout(resolve, API_DELAY));

  try {
    console.log('[Auth API] Updated user profile:', updates);
    return {
      success: true,
      data: { ...MOCK_USER, ...updates },
    };
  } catch (error) {
    console.error('[Auth API] Update profile error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Failed to update profile',
      },
    };
  }
};
