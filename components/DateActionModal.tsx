/**
 * DateActionModal Component
 * Bottom sheet modal that appears when tapping a calendar date
 * Shows options to view or add journal entry
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Animated,
  PanResponder,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { JournalEntry } from '../types';

interface DateActionModalProps {
  visible: boolean;
  onClose: () => void;
  date: string | null;
  hasEntry: boolean;
  journalEntry?: JournalEntry | null;
  onViewJournal: () => void;
  onAddJournal: () => void;
}

/**
 * DateActionModal component for calendar date actions
 */
export const DateActionModal: React.FC<DateActionModalProps> = ({
  visible,
  onClose,
  date,
  hasEntry,
  journalEntry,
  onViewJournal,
  onAddJournal,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture swipe down gestures
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging down (positive values)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down more than 100px, close the modal
        if (gestureState.dy > 100) {
          // Animate out smoothly then close
          Animated.timing(translateY, {
            toValue: 400,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            // Reset after animation completes
            translateY.setValue(0);
            onClose();
          });
        } else {
          // Otherwise, spring back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Reset animation ONLY when modal opens (not when it closes)
  const prevVisibleRef = useRef(visible);
  React.useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      // Modal just opened
      translateY.setValue(0);
    }
    prevVisibleRef.current = visible;
  }, [visible, translateY]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle Bar - Draggable area indicator */}
          <View style={styles.handleBar} />

          {/* Date Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="calendar" size={24} color="#6366f1" />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </View>

          {/* Journal Preview - Show if entry exists */}
          {hasEntry && journalEntry && (
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <MaterialCommunityIcons name="notebook" size={20} color="#6366f1" />
                <Text style={styles.previewHeaderText}>Journal Preview</Text>
              </View>
              
              {journalEntry.mood && (
                <View style={styles.previewMood}>
                  <Text style={styles.previewMoodEmoji}>{journalEntry.mood.emoji}</Text>
                  <Text style={styles.previewMoodLabel}>{journalEntry.mood.moodLabel}</Text>
                </View>
              )}
              
              <Text style={styles.previewTitle} numberOfLines={1}>
                {journalEntry.title}
              </Text>
              <Text style={styles.previewContent} numberOfLines={2}>
                {truncateText(journalEntry.content, 100)}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            {hasEntry && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onViewJournal}
              >
                <View style={[styles.iconContainer, styles.viewIconContainer]}>
                  <MaterialCommunityIcons name="eye" size={24} color="#6366f1" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>View Journal</Text>
                  <Text style={styles.actionSubtitle}>Read your entry for this day</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={onAddJournal}
            >
              <View style={[styles.iconContainer, styles.addIconContainer]}>
                <MaterialCommunityIcons
                  name={hasEntry ? 'pencil' : 'plus'}
                  size={24}
                  color="#10b981"
                />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>
                  {hasEntry ? 'Edit Entry' : 'Add New Journal'}
                </Text>
                <Text style={styles.actionSubtitle}>
                  {hasEntry ? 'Update your journal entry' : 'Create a new entry for this day'}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBar: {
    width: 48,
    height: 5,
    backgroundColor: '#cbd5e1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 12,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  viewIconContainer: {
    backgroundColor: '#e0e7ff',
  },
  addIconContainer: {
    backgroundColor: '#d1fae5',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  previewContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginLeft: 8,
  },
  previewMood: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewMoodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  previewMoodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  previewContent: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});
