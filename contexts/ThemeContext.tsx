/**
 * Theme Context
 * Manages app-wide theme selection and color schemes
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeName = 'teal' | 'blue' | 'purple' | 'green' | 'sunset';

export interface ColorScheme {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Mood colors
  moodExcellent: string;
  moodGood: string;
  moodNeutral: string;
  moodNotGreat: string;
  moodDifficult: string;
  
  // Functional colors
  quote: string;
  success: string;
  warmth: string;
  warning: string;
  error: string;
  info: string;
  
  // Neutral colors
  white: string;
  offWhite: string;
  surfaceLight: string;
  black: string;
  
  // Gray scale
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  gray600: string;
  gray700: string;
  gray800: string;
  gray900: string;
  
  // Background colors
  background: string;
  surface: string;
  cardBackground: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  
  // Overlay colors
  overlay: string;
  shadowColor: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
  
  // Button colors
  buttonPrimary: string;
  buttonSecondary: string;
  buttonDisabled: string;
  
  // Card colors
  cardShadow: string;
  cardBorder: string;
  
  // Status colors
  successLight: string;
  warningLight: string;
  errorLight: string;
  infoLight: string;
}

// Theme definitions
export const THEMES: Record<ThemeName, ColorScheme> = {
  teal: {
    primary: '#4ECDC4',
    primaryLight: '#7ED6D1',
    primaryDark: '#36B5AC',
    secondary: '#95E1A9',
    secondaryLight: '#B8EECA',
    secondaryDark: '#6FD88A',
    accent: '#C5A3E0',
    accentLight: '#DBC4F0',
    accentDark: '#B088D6',
    moodExcellent: '#5FCF80',
    moodGood: '#8DE4A4',
    moodNeutral: '#FFD666',
    moodNotGreat: '#FFB347',
    moodDifficult: '#FF8A8A',
    quote: '#FFD666',
    success: '#5FCF80',
    warmth: '#FFB347',
    warning: '#FFB347',
    error: '#FF6B6B',
    info: '#4ECDC4',
    white: '#ffffff',
    offWhite: '#F8F9FA',
    surfaceLight: '#F1F3F5',
    black: '#000000',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#1A1D20',
    background: '#F8F9FA',
    surface: '#ffffff',
    cardBackground: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    textInverse: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',
    inputBackground: '#ffffff',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94a3b8',
    buttonPrimary: '#4ECDC4',
    buttonSecondary: '#F1F5F9',
    buttonDisabled: '#ADB5BD',
    cardShadow: '#000000',
    cardBorder: '#E2E8F0',
    successLight: '#D1FAE5',
    warningLight: '#FED7AA',
    errorLight: '#FEE2E2',
    infoLight: '#E0F2F1',
  },
  blue: {
    primary: '#5B9BD5',
    primaryLight: '#8BB8E8',
    primaryDark: '#4682C4',
    secondary: '#7EC8E3',
    secondaryLight: '#A8D8ED',
    secondaryDark: '#5FB4D4',
    accent: '#9B7EBD',
    accentLight: '#B8A3D4',
    accentDark: '#7D5FA6',
    moodExcellent: '#5FCF80',
    moodGood: '#8DE4A4',
    moodNeutral: '#FFD666',
    moodNotGreat: '#FFB347',
    moodDifficult: '#FF8A8A',
    quote: '#FFD666',
    success: '#5FCF80',
    warmth: '#FFB347',
    warning: '#FFB347',
    error: '#FF6B6B',
    info: '#5B9BD5',
    white: '#ffffff',
    offWhite: '#F8F9FA',
    surfaceLight: '#F1F3F5',
    black: '#000000',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#1A1D20',
    background: '#F8F9FA',
    surface: '#ffffff',
    cardBackground: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    textInverse: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',
    inputBackground: '#ffffff',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94a3b8',
    buttonPrimary: '#5B9BD5',
    buttonSecondary: '#F1F5F9',
    buttonDisabled: '#ADB5BD',
    cardShadow: '#000000',
    cardBorder: '#E2E8F0',
    successLight: '#D1FAE5',
    warningLight: '#FED7AA',
    errorLight: '#FEE2E2',
    infoLight: '#DBEAFE',
  },
  purple: {
    primary: '#A78BFA',
    primaryLight: '#C4B5FD',
    primaryDark: '#8B5CF6',
    secondary: '#C084FC',
    secondaryLight: '#D8B4FE',
    secondaryDark: '#A855F7',
    accent: '#F472B6',
    accentLight: '#F9A8D4',
    accentDark: '#EC4899',
    moodExcellent: '#5FCF80',
    moodGood: '#8DE4A4',
    moodNeutral: '#FFD666',
    moodNotGreat: '#FFB347',
    moodDifficult: '#FF8A8A',
    quote: '#FFD666',
    success: '#5FCF80',
    warmth: '#FFB347',
    warning: '#FFB347',
    error: '#FF6B6B',
    info: '#A78BFA',
    white: '#ffffff',
    offWhite: '#F8F9FA',
    surfaceLight: '#F1F3F5',
    black: '#000000',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#1A1D20',
    background: '#F8F9FA',
    surface: '#ffffff',
    cardBackground: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    textInverse: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',
    inputBackground: '#ffffff',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94a3b8',
    buttonPrimary: '#A78BFA',
    buttonSecondary: '#F1F5F9',
    buttonDisabled: '#ADB5BD',
    cardShadow: '#000000',
    cardBorder: '#E2E8F0',
    successLight: '#D1FAE5',
    warningLight: '#FED7AA',
    errorLight: '#FEE2E2',
    infoLight: '#EDE9FE',
  },
  green: {
    primary: '#10B981',
    primaryLight: '#6EE7B7',
    primaryDark: '#059669',
    secondary: '#34D399',
    secondaryLight: '#6EE7B7',
    secondaryDark: '#10B981',
    accent: '#14B8A6',
    accentLight: '#5EEAD4',
    accentDark: '#0D9488',
    moodExcellent: '#5FCF80',
    moodGood: '#8DE4A4',
    moodNeutral: '#FFD666',
    moodNotGreat: '#FFB347',
    moodDifficult: '#FF8A8A',
    quote: '#FFD666',
    success: '#5FCF80',
    warmth: '#FFB347',
    warning: '#FFB347',
    error: '#FF6B6B',
    info: '#10B981',
    white: '#ffffff',
    offWhite: '#F8F9FA',
    surfaceLight: '#F1F3F5',
    black: '#000000',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#1A1D20',
    background: '#F8F9FA',
    surface: '#ffffff',
    cardBackground: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    textInverse: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',
    inputBackground: '#ffffff',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94a3b8',
    buttonPrimary: '#10B981',
    buttonSecondary: '#F1F5F9',
    buttonDisabled: '#ADB5BD',
    cardShadow: '#000000',
    cardBorder: '#E2E8F0',
    successLight: '#D1FAE5',
    warningLight: '#FED7AA',
    errorLight: '#FEE2E2',
    infoLight: '#D1FAE5',
  },
  sunset: {
    primary: '#F97316',
    primaryLight: '#FB923C',
    primaryDark: '#EA580C',
    secondary: '#FB7185',
    secondaryLight: '#FDA4AF',
    secondaryDark: '#F43F5E',
    accent: '#FBBF24',
    accentLight: '#FCD34D',
    accentDark: '#F59E0B',
    moodExcellent: '#5FCF80',
    moodGood: '#8DE4A4',
    moodNeutral: '#FFD666',
    moodNotGreat: '#FFB347',
    moodDifficult: '#FF8A8A',
    quote: '#FFD666',
    success: '#5FCF80',
    warmth: '#FFB347',
    warning: '#FFB347',
    error: '#FF6B6B',
    info: '#F97316',
    white: '#ffffff',
    offWhite: '#F8F9FA',
    surfaceLight: '#F1F3F5',
    black: '#000000',
    gray50: '#F8F9FA',
    gray100: '#E9ECEF',
    gray200: '#DEE2E6',
    gray300: '#CED4DA',
    gray400: '#ADB5BD',
    gray500: '#6C757D',
    gray600: '#495057',
    gray700: '#343A40',
    gray800: '#212529',
    gray900: '#1A1D20',
    background: '#F8F9FA',
    surface: '#ffffff',
    cardBackground: '#FFFFFF',
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textDisabled: '#ADB5BD',
    textInverse: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadowColor: '#000000',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',
    inputBackground: '#ffffff',
    inputBorder: '#E2E8F0',
    inputPlaceholder: '#94a3b8',
    buttonPrimary: '#F97316',
    buttonSecondary: '#F1F5F9',
    buttonDisabled: '#ADB5BD',
    cardShadow: '#000000',
    cardBorder: '#E2E8F0',
    successLight: '#D1FAE5',
    warningLight: '#FED7AA',
    errorLight: '#FEE2E2',
    infoLight: '#FFEDD5',
  },
};

interface ThemeContextType {
  theme: ThemeName;
  colors: ColorScheme;
  setTheme: (theme: ThemeName) => Promise<void>;
  availableThemes: { name: ThemeName; label: string; preview: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@wellness_app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('teal');
  const [loading, setLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && savedTheme in THEMES) {
        setThemeState(savedTheme as ThemeName);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeName) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const availableThemes = [
    { name: 'teal' as ThemeName, label: 'Teal Breeze', preview: '#4ECDC4' },
    { name: 'blue' as ThemeName, label: 'Ocean Blue', preview: '#5B9BD5' },
    { name: 'purple' as ThemeName, label: 'Purple Dream', preview: '#A78BFA' },
    { name: 'green' as ThemeName, label: 'Forest Green', preview: '#10B981' },
    { name: 'sunset' as ThemeName, label: 'Sunset Glow', preview: '#F97316' },
  ];

  const value: ThemeContextType = {
    theme,
    colors: THEMES[theme],
    setTheme,
    availableThemes,
  };

  if (loading) {
    return null; // Or a loading screen
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
