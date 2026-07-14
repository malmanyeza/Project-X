import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../constants/theme';

interface DisclaimerCardProps {
  text?: string;
}

export const DisclaimerCard: React.FC<DisclaimerCardProps> = ({
  text = 'This is a symptom-based preliminary assessment and not a veterinary diagnosis. Please consult a qualified veterinarian for confirmation and treatment.',
}) => (
  <View style={styles.container}>
    <Ionicons name="information-circle" size={20} color={colors.warning} />
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#EFE0B0',
    alignItems: 'flex-start',
  },
  text: {
    ...typography.caption,
    color: '#7A5D00',
    flex: 1,
    lineHeight: 18,
  },
});
