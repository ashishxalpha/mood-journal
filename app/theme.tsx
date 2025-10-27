/**
 * Theme Settings Screen
 * Allow users to choose their color theme
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeSettingsScreen() {
  const { theme: currentTheme, colors, setTheme, availableThemes } = useTheme();

  const handleThemeSelect = async (themeName: string) => {
    await setTheme(themeName as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Choose Theme</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Select a color theme that matches your mood and personality
        </Text>

        <View style={styles.themesContainer}>
          {availableThemes.map((themeOption) => {
            const isSelected = currentTheme === themeOption.name;
            
            return (
              <TouchableOpacity
                key={themeOption.name}
                style={[
                  styles.themeCard,
                  { backgroundColor: colors.surface, borderColor: colors.gray200 },
                  isSelected && { borderColor: colors.primary, borderWidth: 2 },
                ]}
                onPress={() => handleThemeSelect(themeOption.name)}
                activeOpacity={0.7}
              >
                <View style={styles.themeCardContent}>
                  <View
                    style={[
                      styles.colorPreview,
                      { backgroundColor: themeOption.preview },
                    ]}
                  >
                    {isSelected && (
                      <MaterialCommunityIcons name="check" size={32} color="#fff" />
                    )}
                  </View>
                  
                  <View style={styles.themeInfo}>
                    <Text style={[styles.themeName, { color: colors.textPrimary }]}>
                      {themeOption.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.selectedBadge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.selectedText, { color: colors.white }]}>
                          Active
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.primaryLight + '20', borderColor: colors.primary + '30' }]}>
          <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textPrimary }]}>
            Your theme preference is saved and will be applied across the entire app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  themesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  themeCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  themeCardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  colorPreview: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
