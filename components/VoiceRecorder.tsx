/**
 * VoiceRecorder Component
 * Voice recording functionality for journal entries
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { 
  useAudioRecorder,
  useAudioPlayer,
  AudioModule,
  RecordingPresets,
} from 'expo-audio';
import { useTheme } from '../contexts/ThemeContext';
import { useCustomAlert } from './CustomAlert';

interface VoiceRecorderProps {
  visible: boolean;
  onClose: () => void;
  onSave: (audioUri: string, duration: number) => void;
}

const MAX_DURATION = 300; // 5 minutes in seconds
const WARNING_DURATION = 270; // 4:30 minutes

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const { showAlert } = useCustomAlert();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const audioPlayer = useAudioPlayer(audioRecorder.uri || '');
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request microphone permissions on mount
  useEffect(() => {
    requestPermissions();
    return () => {
      cleanupRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pulsing animation for recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, isPaused, pulseAnim]);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          
          // Show warning at 4:30
          if (newDuration === WARNING_DURATION) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
          }
          
          // Auto-stop at 5 minutes
          if (newDuration >= MAX_DURATION) {
            stopRecording();
            return prev;
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const requestPermissions = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (permission.granted) {
        // Set audio mode for iOS recording
        await AudioModule.setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      }
    } catch (error) {
      console.error('Failed to get permissions:', error);
    }
  };

  const startRecording = async () => {
    // Re-check permissions every time before recording
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      
      if (!permission.granted) {
        showAlert(
          'Permission Required',
          'Please grant microphone permission in your device settings to record audio.',
          [{ text: 'OK', style: 'default' }],
          'alert-circle',
          colors.error
        );
        return;
      }

      // Set audio mode for iOS before recording
      await AudioModule.setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    } catch (error) {
      console.error('Failed to check permissions:', error);
      showAlert(
        'Permission Error',
        'Unable to access microphone permissions. Please check your settings.',
        [{ text: 'OK', style: 'default' }],
        'alert-circle',
        colors.error
      );
      return;
    }

    try {
      await audioRecorder.record();
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      setRecordedUri(null);
    } catch (error) {
      console.error('Failed to start recording:', error);
      showAlert(
        'Recording Error',
        'Failed to start recording. Please try again.',
        [{ text: 'OK', style: 'default' }],
        'microphone-off',
        colors.error
      );
    }
  };

  const pauseRecording = async () => {
    if (!isRecording) return;

    try {
      await audioRecorder.pause();
      setIsPaused(true);
    } catch (error) {
      console.error('Failed to pause recording:', error);
    }
  };

  const resumeRecording = async () => {
    if (!isRecording) return;

    try {
      await audioRecorder.record();
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to resume recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      await audioRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (audioRecorder.uri) {
        setRecordedUri(audioRecorder.uri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;

    try {
      audioPlayer.play();
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };

  const pausePlayback = async () => {
    try {
      audioPlayer.pause();
    } catch (error) {
      console.error('Failed to pause playback:', error);
    }
  };

  const cleanupRecording = async () => {
    try {
      if (isRecording) {
        await audioRecorder.stop();
      }
    } catch (error) {
      console.error('Error cleaning up recording:', error);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleClose = async () => {
    await cleanupRecording();
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    setRecordedUri(null);
    onClose();
  };

  const handleSave = () => {
    if (recordedUri) {
      onSave(recordedUri, duration);
      handleClose();
    }
  };

  const handleCancel = async () => {
    if (isRecording) {
      await stopRecording();
    }
    handleClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribe = () => {
    showAlert(
      'Coming Soon',
      'Transcription feature will be added in a future update.',
      [{ text: 'OK', style: 'default' }],
      'information',
      colors.primary
    );
  };

  const styles = getStyles(colors);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Voice Recording</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Recording UI */}
          {!recordedUri ? (
            <View style={styles.recordingContainer}>
              <Animated.View
                style={[
                  styles.micContainer,
                  isRecording && !isPaused && styles.micContainerRecording,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <MaterialCommunityIcons
                  name={isPaused ? 'microphone-off' : 'microphone'}
                  size={64}
                  color={isRecording ? '#FF6B6B' : colors.primary}
                />
              </Animated.View>

              <Text style={styles.timer}>{formatTime(duration)}</Text>
              
              {showWarning && (
                <Text style={styles.warning}>30 seconds remaining!</Text>
              )}

              {/* Waveform placeholder */}
              <View style={styles.waveformContainer}>
                {[...Array(20)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveformBar,
                      isRecording &&
                        !isPaused && {
                          height: Math.random() * 40 + 10,
                          backgroundColor: '#FF6B6B',
                        },
                    ]}
                  />
                ))}
              </View>

              {/* Recording Controls */}
              <View style={styles.controls}>
                {!isRecording ? (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={startRecording}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons name="microphone" size={32} color={colors.white} />
                    <Text style={styles.startButtonText}>Start Recording</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.recordingControls}>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={isPaused ? resumeRecording : pauseRecording}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={isPaused ? 'play' : 'pause'}
                        size={28}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.controlButton, styles.stopButton]}
                      onPress={stopRecording}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="stop" size={28} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ) : (
            // Playback UI
            <View style={styles.playbackContainer}>
              <View style={styles.audioIndicator}>
                <MaterialCommunityIcons name="volume-high" size={48} color={colors.primary} />
                <Text style={styles.durationText}>{formatTime(duration)}</Text>
              </View>

              {/* Playback Controls */}
              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={styles.playbackButton}
                  onPress={audioPlayer.playing ? pausePlayback : playRecording}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={audioPlayer.playing ? 'pause-circle' : 'play-circle'}
                    size={64}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.transcribeButton}
                  onPress={handleTranscribe}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="text-box" size={20} color={colors.primary} />
                  <Text style={styles.transcribeButtonText}>Transcribe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                  <Text style={styles.saveButtonText}>Attach to Entry</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.rerecordButton}
                onPress={() => {
                  setIsRecording(false);
                  setIsPaused(false);
                  setDuration(0);
                  setRecordedUri(null);
                }}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="refresh" size={20} color={colors.textSecondary} />
                <Text style={styles.rerecordButtonText}>Record Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    container: {
      backgroundColor: colors.white,
      borderRadius: 20,
      width: '100%',
      maxWidth: 400,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    closeButton: {
      padding: 4,
    },
    recordingContainer: {
      alignItems: 'center',
    },
    micContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.gray100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    micContainerRecording: {
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    timer: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    warning: {
      fontSize: 14,
      color: '#FF6B6B',
      fontWeight: '600',
      marginBottom: 16,
    },
    waveformContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 60,
      gap: 4,
      marginBottom: 32,
    },
    waveformBar: {
      width: 4,
      height: 20,
      backgroundColor: colors.gray300,
      borderRadius: 2,
    },
    controls: {
      width: '100%',
    },
    startButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    startButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.white,
    },
    recordingControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.gray100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stopButton: {
      backgroundColor: '#FF6B6B',
    },
    playbackContainer: {
      alignItems: 'center',
    },
    audioIndicator: {
      alignItems: 'center',
      marginBottom: 32,
    },
    durationText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      marginTop: 12,
    },
    playbackControls: {
      marginBottom: 32,
    },
    playbackButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
      width: '100%',
    },
    transcribeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gray100,
      borderRadius: 12,
      paddingVertical: 14,
      gap: 8,
    },
    transcribeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    saveButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      gap: 8,
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
    rerecordButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      gap: 6,
    },
    rerecordButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },
  });
