/**
 * Authentication Store
 * Manages user authentication state and actions
 */

import { create } from 'zustand';
import { User, AuthState } from '../types';
import * as authApi from '../services/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = '@mood_journal_auth_token';
const USER_DATA_KEY = '@mood_journal_user_data';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

/**
 * Authentication state management store
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  /**
   * Login user with email and password
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      console.log('[Auth Store] Attempting login for:', email);
      
      // MOCK LOGIN - Accept any email/password for testing
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        createdAt: Date.now(),
        settings: {
          theme: 'light',
          notifications: {
            enabled: true,
            dailyReminder: true,
            reminderTime: '09:00',
            streakReminder: true,
            inspirationNotifications: true,
          },
          privacy: {
            dataBackup: true,
            analytics: false,
            crashReports: true,
          },
          language: 'en',
        },
      };

      // Store auth token and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_' + Date.now());
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[Auth Store] Mock login successful');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error('[Auth Store] Login error:', error);
      return false;
    }
  },

  /**
   * Sign up new user
   */
  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      console.log('[Auth Store] Attempting signup for:', email);
      
      // MOCK SIGNUP - Accept any credentials for testing
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: name,
        createdAt: Date.now(),
        settings: {
          theme: 'light',
          notifications: {
            enabled: true,
            dailyReminder: true,
            reminderTime: '09:00',
            streakReminder: true,
            inspirationNotifications: true,
          },
          privacy: {
            dataBackup: true,
            analytics: false,
            crashReports: true,
          },
          language: 'en',
        },
      };

      // Store auth token and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, 'mock_token_' + Date.now());
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[Auth Store] Mock signup successful');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error('[Auth Store] Signup error:', error);
      return false;
    }
  },

  /**
   * Logout current user
   */
  logout: async () => {
    try {
      console.log('[Auth Store] Logging out');
      
      await authApi.logout();
      
      // Clear stored data
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);

      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });

      console.log('[Auth Store] Logout successful');
    } catch (error) {
      console.error('[Auth Store] Logout error:', error);
    }
  },

  /**
   * Check if user is authenticated on app startup
   */
  checkAuth: async () => {
    set({ isLoading: true });

    try {
      console.log('[Auth Store] Checking authentication');
      
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        const user = JSON.parse(userData) as User;
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        console.log('[Auth Store] User authenticated');
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        console.log('[Auth Store] No authentication found');
      }
    } catch (error) {
      console.error('[Auth Store] Auth check error:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Update user profile
   */
  updateUser: async (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    try {
      console.log('[Auth Store] Updating user profile');
      
      const result = await authApi.updateUserProfile(updates);

      if (result.success) {
        const updatedUser = result.data;
        
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
        
        set({ user: updatedUser });

        console.log('[Auth Store] User profile updated');
      }
    } catch (error) {
      console.error('[Auth Store] Update user error:', error);
    }
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
