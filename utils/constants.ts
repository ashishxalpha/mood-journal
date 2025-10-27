/**
 * Application Constants
 * Centralized configuration and constant values
 */

// Import default theme colors
import { THEMES } from '../contexts/ThemeContext';

/**
 * Color palette - Using default teal theme
 * These are static colors for StyleSheet definitions
 * For dynamic theming, use useTheme() hook in components
 */
export const COLORS = {
  // Using teal theme as default
  ...THEMES.teal,
};

/**
 * Spacing values
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

/**
 * Border radius values
 */
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

/**
 * Font sizes
 */
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
};

/**
 * Font weights
 */
export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/**
 * Shadow presets
 */
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

/**
 * API configuration
 */
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000,
};

/**
 * App configuration
 */
export const APP_CONFIG = {
  name: 'Mood Journal',
  version: '1.0.0',
  maxJournalLength: 5000,
  minJournalLength: 10,
  maxTitleLength: 100,
};
