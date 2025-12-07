/**
 * VoiceRecorder Component
 * Voice recording with 3D circular visualizer
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

const MAX_DURATION = 300;
const WARNING_DURATION = 270;
const CIRCULAR_BARS = 24;
const VISUALIZER_RADIUS = 70;

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const { showAlert } = useCustomAlert();
  
  // Initialize audio recorder with high quality preset and metering enabled
  const recordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  };
  
  const audioRecorder = useAudioRecorder(recordingOptions);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioPlayer = useAudioPlayer(recordedUri || '');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meteringRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const barAnimations = useRef(
    Array(CIRCULAR_BARS).fill(0).map(() => new Animated.Value(0))
  ).current;

  // Update audio player source when URI changes
  useEffect(() => {
    if (recordedUri && audioPlayer) {
      console.log('[VoiceRecorder] 🔄 Audio URI changed, updating player:', recordedUri);
      try {
        audioPlayer.replace(recordedUri);
        setIsPlaying(false);
      } catch (error) {
        console.error('[VoiceRecorder] ❌ Error updating audio source:', error);
      }
    }
  }, [recordedUri, audioPlayer]);

  useEffect(() => {
    console.log('[VoiceRecorder] 🎬 Component mounted, visible:', visible);
    requestPermissions();
    return () => {
      console.log('[VoiceRecorder] 👋 Component unmounting, cleaning up...');
      cleanupRecording();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monitor audio player state
  useEffect(() => {
    if (!audioPlayer) return;
    
    const checkPlaybackStatus = setInterval(() => {
      const playing = audioPlayer.playing;
      if (playing !== isPlaying) {
        console.log('[VoiceRecorder] 🔊 Playback state changed:', playing);
        setIsPlaying(playing);
        
        // If playback stopped (completed or paused)
        if (!playing && isPlaying) {
          console.log('[VoiceRecorder] 🏁 Playback finished or paused');
        }
      }
    }, 100);

    return () => clearInterval(checkPlaybackStatus);
  }, [audioPlayer, isPlaying]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      console.log('[VoiceRecorder] 🎵 Starting metering monitor...');
      meteringRef.current = setInterval(() => {
        try {
          const status = audioRecorder.getStatus();
          const metering = status.metering;
          
          // Log metering data periodically (every 2 seconds to avoid spam)
          if (Math.random() < 0.04) { // ~2% chance = ~1 log per 2 seconds at 50ms interval
            console.log('[VoiceRecorder] 📊 Metering:', {
              metering,
              isRecording: status.isRecording,
              durationMillis: status.durationMillis,
            });
          }
          
          if (metering !== undefined && metering !== null) {
            const normalized = Math.max(0, Math.min(1, (metering + 160) / 160));
            setAudioLevel(normalized);
            animateCircularBars(normalized);
          } else {
            setAudioLevel(0);
            animateCircularBars(0);
          }
        } catch (error) {
          console.error('[VoiceRecorder] ❌ Metering error:', error);
        }
      }, 50);
    } else {
      if (meteringRef.current) {
        console.log('[VoiceRecorder] 🔇 Stopping metering monitor...');
        clearInterval(meteringRef.current);
        meteringRef.current = null;
      }
      setAudioLevel(0);
      barAnimations.forEach(anim => {
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      if (meteringRef.current) {
        clearInterval(meteringRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isPaused]);

  const animateCircularBars = (level: number) => {
    barAnimations.forEach((anim, index) => {
      const offset = index / CIRCULAR_BARS;
      const wave = Math.sin(Date.now() / 200 + offset * Math.PI * 2) * 0.3 + 0.7;
      const targetValue = level * wave;
      
      Animated.spring(anim, {
        toValue: targetValue,
        useNativeDriver: false,
        speed: 20,
        bounciness: 8,
      }).start();
    });
  };

  useEffect(() => {
    if (isRecording && !isPaused) {
      console.log('[VoiceRecorder] ⏱️ Starting timer...');
      timerRef.current = setInterval(() => {
        // Verify recording is still active
        const status = audioRecorder.getStatus();
        if (!status.isRecording) {
          console.warn('[VoiceRecorder] ⚠️ Timer running but recorder not recording! Stopping timer.');
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsRecording(false);
          return;
        }
        
        setDuration((prev) => {
          const newDuration = prev + 1;
          
          if (newDuration === WARNING_DURATION) {
            console.log('[VoiceRecorder] ⚠️ 30 seconds remaining warning');
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
          }
          
          if (newDuration >= MAX_DURATION) {
            console.log('[VoiceRecorder] ⏰ Max duration reached, stopping recording');
            stopRecording();
            return prev;
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        console.log('[VoiceRecorder] ⏹️ Stopping timer...');
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isPaused]);

  const requestPermissions = async () => {
    try {
      console.log('[VoiceRecorder] 🔐 Requesting initial permissions...');
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      console.log('[VoiceRecorder] 🔐 Initial permission result:', {
        granted: permission.granted,
        canAskAgain: permission.canAskAgain,
      });
      setHasPermission(permission.granted);
      
      if (permission.granted) {
        console.log('[VoiceRecorder] ✅ Permission granted, setting audio mode...');
        await AudioModule.setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
        console.log('[VoiceRecorder] ✅ Initial audio mode set');
      } else {
        console.warn('[VoiceRecorder] ⚠️ Permission not granted initially');
      }
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Permission error:', error);
    }
  };

  const startRecording = async () => {
    try {
      console.log('[VoiceRecorder] 🎤 Starting recording process...');
      
      // Step 1: Request permissions
      console.log('[VoiceRecorder] 📋 Requesting microphone permissions...');
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      console.log('[VoiceRecorder] 📋 Permission result:', {
        granted: permission.granted,
        canAskAgain: permission.canAskAgain,
        expires: permission.expires,
      });
      
      if (!permission.granted) {
        console.warn('[VoiceRecorder] ❌ Microphone permission denied');
        showAlert(
          'Microphone Permission Required',
          'This app needs access to your microphone to record voice notes for your journal entries.',
          [{ text: 'OK', style: 'default' }],
          'microphone',
          colors.error
        );
        return;
      }

      // Step 2: Set audio mode BEFORE preparing recorder
      console.log('[VoiceRecorder] 🔊 Setting audio mode...');
      await AudioModule.setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      console.log('[VoiceRecorder] ✅ Audio mode set');

      // Step 3: Check if we need to stop any existing recording
      const statusBefore = audioRecorder.getStatus();
      console.log('[VoiceRecorder] 📊 Recorder status before start:', {
        isRecording: statusBefore.isRecording,
        durationMillis: statusBefore.durationMillis,
        canRecord: statusBefore.canRecord,
      });

      if (statusBefore.isRecording) {
        console.log('[VoiceRecorder] 🛑 Stopping existing recording before starting new one...');
        await audioRecorder.stop();
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Step 4: PREPARE the recorder before recording (CRITICAL!)
      console.log('[VoiceRecorder] 🔧 Preparing recorder...');
      await audioRecorder.prepareToRecordAsync();
      console.log('[VoiceRecorder] ✅ Recorder prepared');

      // Step 5: Start recording
      console.log('[VoiceRecorder] 🎙️ Calling audioRecorder.record()...');
      await audioRecorder.record();
      
      // Wait a moment for recording to initialize
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Step 5: Verify recording started
      const statusAfter = audioRecorder.getStatus();
      console.log('[VoiceRecorder] 📊 Recorder status after start:', {
        isRecording: statusAfter.isRecording,
        durationMillis: statusAfter.durationMillis,
        metering: statusAfter.metering,
        canRecord: statusAfter.canRecord,
      });

      if (statusAfter.isRecording) {
        console.log('[VoiceRecorder] ✅ Recording started successfully!');
        setIsRecording(true);
        setIsPaused(false);
        setDuration(0);
        setRecordedUri(null);
      } else {
        console.error('[VoiceRecorder] ❌ Recording did not start - isRecording is false');
        console.error('[VoiceRecorder] ❌ Recorder state:', {
          canRecord: statusAfter.canRecord,
          isRecording: statusAfter.isRecording,
          durationMillis: statusAfter.durationMillis,
        });
        
        throw new Error(
          `Recording failed to start. ` +
          `Status: canRecord=${statusAfter.canRecord}, isRecording=${statusAfter.isRecording}. ` +
          `This may be due to another app using the microphone or a system restriction.`
        );
      }
    } catch (error) {
      console.error('[VoiceRecorder] 💥 Recording error:', error);
      console.error('[VoiceRecorder] 💥 Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      // Reset state if recording failed
      setIsRecording(false);
      setIsPaused(false);
      setDuration(0);
      
      showAlert(
        'Recording Error',
        `Failed to start recording: ${error instanceof Error ? error.message : String(error)}\n\nTry:\n• Close other apps using the microphone\n• Restart the app\n• Check microphone permissions in Settings`,
        [{ text: 'OK', style: 'default' }],
        'alert-circle',
        colors.error
      );
    }
  };

  const pauseRecording = async () => {
    try {
      console.log('[VoiceRecorder] ⏸️ Pausing recording...');
      await audioRecorder.pause();
      console.log('[VoiceRecorder] ✅ Recording paused');
      setIsPaused(true);
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Pause error:', error);
    }
  };

  const resumeRecording = async () => {
    try {
      console.log('[VoiceRecorder] ▶️ Resuming recording...');
      await audioRecorder.record();
      console.log('[VoiceRecorder] ✅ Recording resumed');
      setIsPaused(false);
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Resume error:', error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('[VoiceRecorder] 🛑 Stopping recording...');
      await audioRecorder.stop();
      
      const uri = audioRecorder.uri;
      console.log('[VoiceRecorder] ✅ Recording stopped');
      console.log('[VoiceRecorder] 💾 Recording saved to:', uri);
      
      setIsRecording(false);
      setIsPaused(false);
      
      if (uri) {
        setRecordedUri(uri);
      } else {
        console.warn('[VoiceRecorder] ⚠️ No URI returned from recorder');
      }
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Stop error:', error);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) {
      console.warn('[VoiceRecorder] ⚠️ No recording to play');
      return;
    }

    try {
      console.log('[VoiceRecorder] ▶️ Starting playback...');
      console.log('[VoiceRecorder] 📂 Playing URI:', recordedUri);
      console.log('[VoiceRecorder] 📏 Expected duration:', duration, 'seconds');
      
      // Stop any existing playback first
      if (isPlaying) {
        console.log('[VoiceRecorder] ⏸️ Stopping existing playback first...');
        audioPlayer.pause();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // CRITICAL: Seek to the beginning before playing
      // This ensures playback works even after audio has finished
      console.log('[VoiceRecorder] ⏮️ Seeking to start...');
      audioPlayer.seekTo(0);
      
      // Set audio mode for playback
      await AudioModule.setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
      
      // Start playback
      audioPlayer.play();
      setIsPlaying(true);
      console.log('[VoiceRecorder] ✅ Playback started');
      
      // Monitor for completion
      const checkCompletion = setInterval(() => {
        if (!audioPlayer.playing) {
          console.log('[VoiceRecorder] 🎵 Playback completed');
          clearInterval(checkCompletion);
          setIsPlaying(false);
        }
      }, 500);
      
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Playback error:', error);
      setIsPlaying(false);
    }
  };

  const pausePlayback = () => {
    try {
      console.log('[VoiceRecorder] ⏸️ Pausing playback...');
      audioPlayer.pause();
      setIsPlaying(false);
      console.log('[VoiceRecorder] ✅ Playback paused');
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Pause playback error:', error);
    }
  };

  const cleanupRecording = async () => {
    console.log('[VoiceRecorder] 🧹 Starting cleanup...');
    
    try {
      if (isRecording) {
        console.log('[VoiceRecorder] 🛑 Stopping active recording...');
        await audioRecorder.stop();
      }
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Error stopping recorder:', error);
    }
    
    try {
      // Don't access audioPlayer.playing - just try to pause
      if (isPlaying) {
        console.log('[VoiceRecorder] ⏸️ Pausing active playback...');
        audioPlayer.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('[VoiceRecorder] ❌ Error pausing player:', error);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (meteringRef.current) {
      clearInterval(meteringRef.current);
      meteringRef.current = null;
    }
    
    console.log('[VoiceRecorder] ✅ Cleanup complete');
  };

  const handleClose = async () => {
    await cleanupRecording();
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    setRecordedUri(null);
    setShowWarning(false);
    setAudioLevel(0);
    onClose();
  };

  const handleSave = () => {
    if (recordedUri && duration > 0) {
      onSave(recordedUri, duration);
      handleClose();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribe = () => {
    showAlert(
      'Coming Soon',
      'AI transcription will be available soon.',
      [{ text: 'OK', style: 'default' }],
      'robot',
      colors.primary
    );
  };

  const renderCircularVisualizer = () => {
    const bars = [];
    const containerSize = VISUALIZER_RADIUS * 2;
    
    for (let i = 0; i < CIRCULAR_BARS; i++) {
      const angle = (i / CIRCULAR_BARS) * 2 * Math.PI - Math.PI / 2;
      const x = VISUALIZER_RADIUS * Math.cos(angle);
      const y = VISUALIZER_RADIUS * Math.sin(angle);
      
      const animatedHeight = barAnimations[i].interpolate({
        inputRange: [0, 1],
        outputRange: [8, 40],
      });
      
      const animatedOpacity = barAnimations[i].interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
      });

      bars.push(
        <Animated.View
          key={i}
          style={[
            styles.circularBar,
            {
              position: 'absolute',
              left: containerSize / 2 + x - 3,
              top: containerSize / 2 + y - 20,
              height: animatedHeight,
              opacity: animatedOpacity,
              backgroundColor: isRecording && !isPaused ? '#FF6B6B' : colors.gray300,
              transform: [
                { rotate: `${(angle + Math.PI / 2) * (180 / Math.PI)}deg` },
              ],
            },
          ]}
        />
      );
    }
    
    return bars;
  };

  const styles = getStyles(colors);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Voice Note</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {!recordedUri ? (
            <View style={styles.recordingContainer}>
              <View style={styles.visualizerContainer}>
                <View style={styles.visualizerCircle}>
                  {renderCircularVisualizer()}
                  
                  <Animated.View
                    style={[
                      styles.micContainer,
                      isRecording && !isPaused && styles.micContainerRecording,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={isPaused ? 'pause' : isRecording ? 'microphone' : 'microphone-outline'}
                      size={48}
                      color={isRecording && !isPaused ? '#FF6B6B' : colors.primary}
                    />
                  </Animated.View>
                </View>
              </View>

              <Text style={styles.timer}>{formatTime(duration)}</Text>
              
              {showWarning && <Text style={styles.warning}> 30 seconds remaining!</Text>}
              {isRecording && !isPaused && <Text style={styles.recordingLabel}> Recording...</Text>}
              {isPaused && <Text style={styles.pausedLabel}> Paused</Text>}

              {isRecording && !isPaused && (
                <View style={styles.audioLevelContainer}>
                  <View style={styles.audioLevelBar}>
                    <View style={[styles.audioLevelFill, { width: `${audioLevel * 100}%` }]} />
                  </View>
                  <Text style={styles.audioLevelText}>
                    {audioLevel > 0.1 ? ' Detecting voice...' : ' Speak louder...'}
                  </Text>
                </View>
              )}

              <View style={styles.controls}>
                {!isRecording ? (
                  <TouchableOpacity style={styles.startButton} onPress={startRecording}>
                    <MaterialCommunityIcons name="microphone" size={32} color={colors.white} />
                    <Text style={styles.startButtonText}>Start Recording</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.recordingControls}>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={isPaused ? resumeRecording : pauseRecording}
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
                    >
                      <MaterialCommunityIcons name="stop" size={28} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {!hasPermission && !isRecording && (
                <Text style={styles.permissionHint}>
                   Microphone permission required
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.playbackContainer}>
              <View style={styles.audioIndicator}>
                <MaterialCommunityIcons name="check-circle" size={64} color={colors.success} />
                <Text style={styles.successText}>Recording Complete!</Text>
                <Text style={styles.durationText}>{formatTime(duration)}</Text>
              </View>

              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={styles.playbackButton}
                  onPress={isPlaying ? pausePlayback : playRecording}
                >
                  <MaterialCommunityIcons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={72}
                    color={colors.primary}
                  />
                  <Text style={styles.playbackLabel}>
                    {isPlaying ? 'Playing...' : 'Tap to Play'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.transcribeButton} onPress={handleTranscribe}>
                  <MaterialCommunityIcons name="text-box" size={20} color={colors.primary} />
                  <Text style={styles.transcribeButtonText}>Transcribe</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <MaterialCommunityIcons name="check" size={20} color={colors.white} />
                  <Text style={styles.saveButtonText}>Save & Attach</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.rerecordButton}
                onPress={() => {
                  if (isPlaying) {
                    audioPlayer.pause();
                    setIsPlaying(false);
                  }
                  setIsRecording(false);
                  setIsPaused(false);
                  setDuration(0);
                  setRecordedUri(null);
                  setAudioLevel(0);
                }}
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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    container: {
      backgroundColor: colors.white,
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    closeButton: {
      padding: 4,
    },
    recordingContainer: {
      alignItems: 'center',
    },
    visualizerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      height: 220,
      width: '100%',
    },
    visualizerCircle: {
      width: 140,
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    circularBar: {
      width: 6,
      borderRadius: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    micContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.gray100,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    micContainerRecording: {
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      borderWidth: 3,
      borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    timer: {
      fontSize: 40,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
      fontVariant: ['tabular-nums'],
    },
    warning: {
      fontSize: 14,
      color: '#FF6B6B',
      fontWeight: '600',
      marginBottom: 16,
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    recordingLabel: {
      fontSize: 14,
      color: '#FF6B6B',
      fontWeight: '600',
      marginBottom: 16,
    },
    pausedLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
      marginBottom: 16,
    },
    audioLevelContainer: {
      width: '100%',
      marginBottom: 24,
      alignItems: 'center',
    },
    audioLevelBar: {
      width: '80%',
      height: 6,
      backgroundColor: colors.gray200,
      borderRadius: 3,
      overflow: 'hidden',
      marginBottom: 8,
    },
    audioLevelFill: {
      height: '100%',
      backgroundColor: '#FF6B6B',
      borderRadius: 3,
    },
    audioLevelText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    controls: {
      width: '100%',
    },
    startButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    startButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.white,
    },
    recordingControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    controlButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.gray100,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    stopButton: {
      backgroundColor: '#FF6B6B',
      shadowColor: '#FF6B6B',
      shadowOpacity: 0.3,
    },
    playbackContainer: {
      alignItems: 'center',
    },
    audioIndicator: {
      alignItems: 'center',
      marginBottom: 32,
    },
    successText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.success,
      marginTop: 16,
      marginBottom: 8,
    },
    durationText: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      fontVariant: ['tabular-nums'],
    },
    playbackControls: {
      marginBottom: 32,
    },
    playbackButton: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    playbackLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
      width: '100%',
    },
    transcribeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.gray100,
      borderRadius: 12,
      paddingVertical: 16,
      gap: 8,
    },
    transcribeButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.primary,
    },
    saveButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonText: {
      fontSize: 15,
      fontWeight: '700',
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
      fontWeight: '600',
      color: colors.textSecondary,
    },
    permissionHint: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      paddingHorizontal: 20,
      lineHeight: 18,
    },
  });
