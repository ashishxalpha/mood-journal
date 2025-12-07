/**
 * AudioPlayer Component
 * Plays back saved audio recordings from journal entries
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer, AudioModule } from 'expo-audio';
import { useTheme } from '../contexts/ThemeContext';

interface AudioPlayerProps {
  audioUri: string;
  duration: number; // Duration in seconds
  compact?: boolean; // Compact mode for inline display
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUri,
  duration,
  compact = false,
}) => {
  const { colors } = useTheme();
  const audioPlayer = useAudioPlayer(audioUri);
  const [isPlaying, setIsPlaying] = useState(false);

  // Monitor audio player state
  useEffect(() => {
    if (!audioPlayer) return;
    
    const checkPlaybackStatus = setInterval(() => {
      const playing = audioPlayer.playing;
      if (playing !== isPlaying) {
        console.log('[AudioPlayer] Playback state changed:', playing);
        setIsPlaying(playing);
      }
    }, 100);

    return () => clearInterval(checkPlaybackStatus);
  }, [audioPlayer, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (isPlaying && audioPlayer) {
          audioPlayer.pause();
        }
      } catch (error) {
        console.error('[AudioPlayer] Cleanup error:', error);
      }
    };
  }, [audioPlayer, isPlaying]);

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        console.log('[AudioPlayer] Pausing playback');
        audioPlayer.pause();
        setIsPlaying(false);
      } else {
        console.log('[AudioPlayer] Starting playback');
        
        // CRITICAL: Seek to the beginning before playing
        // This ensures playback works even after audio has finished
        console.log('[AudioPlayer] Seeking to start...');
        audioPlayer.seekTo(0);
        
        await AudioModule.setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        });
        audioPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('[AudioPlayer] Playback error:', error);
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = getStyles(colors);

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={togglePlayback}
        activeOpacity={0.7}
      >
        <View style={styles.compactIconContainer}>
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={colors.white}
          />
        </View>
        <View style={styles.compactInfo}>
          <Text style={styles.compactLabel}>Voice Note</Text>
          <Text style={styles.compactDuration}>{formatTime(duration)}</Text>
        </View>
        <MaterialCommunityIcons
          name="waveform"
          size={24}
          color={isPlaying ? colors.primary : colors.gray400}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={togglePlayback}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={48}
          color={colors.primary}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <View style={styles.waveform}>
          <MaterialCommunityIcons
            name="waveform"
            size={32}
            color={isPlaying ? colors.primary : colors.gray300}
          />
        </View>
        <Text style={styles.duration}>{formatTime(duration)}</Text>
        <Text style={styles.status}>
          {isPlaying ? 'Playing...' : 'Tap to play'}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray50,
      borderRadius: 16,
      padding: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    playButton: {
      marginRight: 16,
    },
    info: {
      flex: 1,
    },
    waveform: {
      marginBottom: 4,
    },
    duration: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    status: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    compactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gray50,
      borderRadius: 12,
      padding: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    compactIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    compactInfo: {
      flex: 1,
    },
    compactLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    compactDuration: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
