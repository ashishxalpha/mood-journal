/**
 * JournalModal Component
 * Modal for viewing and adding journal entries
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { JournalEntry, MoodLevel } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import * as api from '../services/api';

interface JournalModalProps {
  visible: boolean;
  onClose: () => void;
  date: string | null;
  entry: JournalEntry | null;
  mode: 'view' | 'add' | 'edit';
  onSave?: (entry: JournalEntry) => void;
}

/**
 * Mood options for selection
 */
const MOOD_OPTIONS: { level: MoodLevel; emoji: string; label: string; color: string }[] = [
  { level: 5, emoji: '😄', label: 'Excellent', color: '#22c55e' },
  { level: 4, emoji: '🙂', label: 'Good', color: '#84cc16' },
  { level: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
  { level: 2, emoji: '😔', label: 'Not Great', color: '#f97316' },
  { level: 1, emoji: '😢', label: 'Difficult', color: '#ef4444' },
];

/**
 * JournalModal component for creating and viewing journal entries
 */
export const JournalModal: React.FC<JournalModalProps> = ({
  visible,
  onClose,
  date,
  entry,
  mode,
  onSave,
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(entry?.mood?.mood || null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({ title: '', content: '', mood: '' });
  const [voiceRecorderVisible, setVoiceRecorderVisible] = useState(false);
  const [audioAttachment, setAudioAttachment] = useState<{ uri: string; duration: number } | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const isViewMode = mode === 'view';
  const isAddMode = mode === 'add';

  // Reset form when modal opens or entry changes
  React.useEffect(() => {
    if (visible) {
      setTitle(entry?.title || '');
      setContent(entry?.content || '');
      setSelectedMood(entry?.mood?.mood || null);
      setErrors({ title: '', content: '', mood: '' });
    }
  }, [visible, entry]);

  const validateForm = () => {
    const newErrors = { title: '', content: '', mood: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
      isValid = false;
    }

    if (!selectedMood) {
      newErrors.mood = 'Please select your mood';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!date) return;

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const moodData = selectedMood
        ? MOOD_OPTIONS.find((m) => m.level === selectedMood)
        : null;

      const journalData = {
        date,
        title: title.trim(),
        content: content.trim(),
        mood: moodData
          ? {
              id: `mood_${Date.now()}`,
              date,
              mood: moodData.level,
              moodLabel: moodData.label,
              emoji: moodData.emoji,
              timestamp: Date.now(),
            }
          : undefined,
        tags: [],
      };

      if (isAddMode) {
        const newEntry = await api.createJournalEntry(journalData);
        onSave?.(newEntry);
      } else {
        const updatedEntry = await api.updateJournalEntry(entry!.id, journalData);
        onSave?.(updatedEntry);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedMood(null);
    setErrors({ title: '', content: '', mood: '' });
    onClose();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isViewMode ? 'Journal Entry' : isAddMode ? 'New Entry' : 'Edit Entry'}
          </Text>
          {!isViewMode && (
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          )}
          {isViewMode && <View style={styles.placeholder} />}
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Display */}
          <View style={styles.dateContainer}>
            <MaterialCommunityIcons name="calendar" size={20} color="#6366f1" />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </View>

          {/* Mood Selection */}
          {!isViewMode && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How are you feeling? *</Text>
              <View style={styles.moodContainer}>
                {MOOD_OPTIONS.map((mood) => (
                  <TouchableOpacity
                    key={mood.level}
                    style={[
                      styles.moodOption,
                      selectedMood === mood.level && styles.moodOptionSelected,
                      selectedMood === mood.level && { borderColor: mood.color },
                    ]}
                    onPress={() => {
                      setSelectedMood(mood.level);
                      setErrors({ ...errors, mood: '' });
                    }}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.mood ? <Text style={styles.errorText}>{errors.mood}</Text> : null}
            </View>
          )}

          {/* View Mode: Show mood if exists */}
          {isViewMode && entry?.mood && (
            <View style={styles.viewMoodContainer}>
              <Text style={styles.viewMoodEmoji}>{entry.mood.emoji}</Text>
              <Text style={styles.viewMoodLabel}>{entry.mood.moodLabel}</Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title *</Text>
            {isViewMode ? (
              <Text style={styles.titleView}>{entry?.title}</Text>
            ) : (
              <>
                <TextInput
                  ref={titleInputRef}
                  style={[styles.titleInput, errors.title && styles.inputError]}
                  placeholder="Give your entry a title..."
                  placeholderTextColor="#94a3b8"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    setErrors({ ...errors, title: '' });
                  }}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({ y: 150, animated: true });
                    }, 100);
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => contentInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
                {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
              </>
            )}
          </View>

          {/* Content */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Thoughts *</Text>
              {!isViewMode && (
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={() => setVoiceRecorderVisible(true)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="microphone" size={20} color="#6366f1" />
                  <Text style={styles.voiceButtonText}>Voice</Text>
                </TouchableOpacity>
              )}
            </View>
            {isViewMode ? (
              <Text style={styles.contentView}>{entry?.content}</Text>
            ) : (
              <>
                <TextInput
                  ref={contentInputRef}
                  style={[styles.contentInput, errors.content && styles.inputError]}
                  placeholder="Write about your day, feelings, or anything on your mind..."
                  placeholderTextColor="#94a3b8"
                  value={content}
                  onChangeText={(text) => {
                    setContent(text);
                    setErrors({ ...errors, content: '' });
                  }}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({ y: 300, animated: true });
                    }, 300);
                  }}
                />
                {errors.content ? <Text style={styles.errorText}>{errors.content}</Text> : null}
                
                {/* Audio Attachment Indicator */}
                {audioAttachment && (
                  <View style={styles.audioAttachment}>
                    <MaterialCommunityIcons name="volume-high" size={20} color="#6366f1" />
                    <Text style={styles.audioAttachmentText}>
                      Voice recording attached ({Math.floor(audioAttachment.duration / 60)}:
                      {(audioAttachment.duration % 60).toString().padStart(2, '0')})
                    </Text>
                    <TouchableOpacity
                      onPress={() => setAudioAttachment(null)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialCommunityIcons name="close-circle" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Tags (if in view mode and tags exist) */}
          {isViewMode && entry?.tags && entry.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {entry.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Voice Recorder Modal */}
      <VoiceRecorder
        visible={voiceRecorderVisible}
        onClose={() => setVoiceRecorderVisible(false)}
        onSave={(uri, duration) => {
          setAudioAttachment({ uri, duration });
          setVoiceRecorderVisible(false);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366f1',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  voiceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  audioAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  audioAttachmentText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    minWidth: 70,
  },
  moodOptionSelected: {
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  viewMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  viewMoodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  viewMoodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  titleView: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 32,
  },
  contentInput: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    minHeight: 200,
  },
  contentView: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
