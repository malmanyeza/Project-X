import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, typography, shadows } from '../constants/theme';

interface MessageComposerProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  placeholder = 'Type a message...',
  disabled,
}) => {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (text.trim().length === 0) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, spacing.md) }
    ]}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={2000}
          editable={!disabled}
        />
      </View>
      <TouchableOpacity
        style={[styles.sendButton, text.trim().length === 0 && styles.sendDisabled]}
        onPress={handleSend}
        disabled={text.trim().length === 0 || disabled}
      >
        <Ionicons
          name="send"
          size={20}
          color={text.trim().length > 0 ? colors.textOnPrimary : colors.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: 'transparent',
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  input: {
    ...typography.body,
    color: colors.text,
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    minHeight: 24,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  sendDisabled: {
    backgroundColor: colors.chipBackground,
    ...shadows.sm,
  },
});

