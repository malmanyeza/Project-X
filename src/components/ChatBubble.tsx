import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../constants/theme';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, timestamp, onAction, actionLabel }) => (
  <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
      <Text style={[styles.message, isUser ? styles.userText : styles.assistantText]}>
        {message}
      </Text>
      
      {onAction && actionLabel && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
    {timestamp && (
      <Text style={[styles.timestamp, isUser && styles.timestampRight]}>{timestamp}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    maxWidth: '82%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  message: {
    ...typography.body,
    lineHeight: 22,
  },
  userText: {
    color: colors.textOnPrimary,
  },
  assistantText: {
    color: colors.text,
  },
  actionButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  actionText: {
    ...typography.bodySm,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  timestamp: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
    fontSize: 11,
  },
  timestampRight: {
    textAlign: 'right',
  },
});
