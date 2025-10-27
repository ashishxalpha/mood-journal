/**
 * Profile Screen
 * User profile and settings
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
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../contexts/ThemeContext';
import { CustomAlert, useCustomAlert } from '../../components/CustomAlert';

// MenuItem will be created inside the component so it can access dynamic styles

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { streak, dailyLogs } = useAppStore();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const { colors } = useTheme();

  const styles = getStyles(colors);

  // Local MenuItem component so it can use dynamic styles and colors
  const MenuItem: React.FC<{
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    showChevron?: boolean;
  }> = ({ icon, title, subtitle, onPress, color, showChevron = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: (color || colors.primary) + '20' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color || colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && (
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray400} />
      )}
    </TouchableOpacity>
  );

  const handleLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/onboarding');
          },
        },
      ],
      'logout',
      '#E53E3E'
    );
  };

  const totalEntries = dailyLogs.length;
  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.offWhite }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.white }]}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.email, { color: colors.gray500 }]}>{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{currentStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Current Streak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.gray200 }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{totalEntries}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Total Entries</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.gray200 }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{longestStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.gray500 }]}>Best Streak</Text>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>ACCOUNT</Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
            <MenuItem
              icon="account-edit"
              title="Edit Profile"
              subtitle="Update your name and preferences"
              onPress={() => showAlert('Coming Soon', 'Profile editing will be available soon', undefined, 'account-edit', colors.primary)}
              color={colors.primary}
            />
            <MenuItem
              icon="bell-outline"
              title="Notifications"
              subtitle="Manage reminders and alerts"
              onPress={() => router.push('/notifications' as any)}
              color={colors.secondary}
            />
            <MenuItem
              icon="shield-check"
              title="Privacy"
              subtitle="Data and privacy settings"
              onPress={() => showAlert('Coming Soon', 'Privacy settings will be available soon', undefined, 'shield-check', colors.accent)}
              color={colors.accent}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>APP</Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
            <MenuItem
              icon="palette"
              title="Theme"
              subtitle="Choose your color theme"
              onPress={() => router.push('/theme' as any)}
              color={colors.primary}
            />
            <MenuItem
              icon="cog"
              title="Settings"
              subtitle="App preferences and configuration"
              onPress={() => router.push('/settings' as any)}
              color="#7C4DFF"
            />
            <MenuItem
              icon="chat-question"
              title="AI Chatbot"
              subtitle="Get wellness advice and support"
              onPress={() => router.push('/chatbot' as any)}
              color="#00BCD4"
            />
            <MenuItem
              icon="information"
              title="About"
              subtitle="App version and information"
              onPress={() => router.push('/about' as any)}
              color="#FF9800"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.gray500 }]}>DATA</Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.surface, borderColor: colors.gray100 }]}>
            <MenuItem
              icon="database-export"
              title="Export Data"
              subtitle="Download your journal entries"
              onPress={() => showAlert('Export Data', 'Your data will be exported as JSON', undefined, 'database-export', '#4CAF50')}
              color="#4CAF50"
            />
            <MenuItem
              icon="backup-restore"
              title="Backup & Restore"
              subtitle="Sync your data to cloud"
              onPress={() => showAlert('Coming Soon', 'Cloud backup will be available soon', undefined, 'backup-restore', '#2196F3')}
              color="#2196F3"
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#E53E3E" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.gray400 }]}>Version 1.0.0</Text>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        icon={alertConfig.icon}
        iconColor={alertConfig.iconColor}
        onDismiss={hideAlert}
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.offWhite,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    header: {
      backgroundColor: colors.white,
      alignItems: 'center',
      paddingVertical: 30,
      marginBottom: 16,
    },
    avatarContainer: {
      marginBottom: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.white,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.gray500,
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.gray500,
      textAlign: 'center',
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.gray200,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.gray500,
      paddingHorizontal: 20,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    menuContainer: {
      backgroundColor: colors.white,
      marginHorizontal: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.gray100,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
    },
    menuIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    menuSubtitle: {
      fontSize: 12,
      color: colors.gray500,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      padding: 16,
      borderRadius: 12,
      backgroundColor: '#FEE',
      borderWidth: 1,
      borderColor: '#FCC',
      gap: 8,
    },
    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#E53E3E',
    },
    versionText: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.gray400,
      marginTop: 24,
    },
  });
