import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../constants/theme';

interface QuickReplyChipsProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export const QuickReplyChips: React.FC<QuickReplyChipsProps> = ({ replies, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >
    {replies.map((reply) => (
      <TouchableOpacity
        key={reply}
        style={styles.chip}
        onPress={() => onSelect(reply)}
        activeOpacity={0.7}
      >
        <Text style={styles.text}>{reply}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: {
    ...typography.buttonSm,
    color: colors.primary,
  },
});
