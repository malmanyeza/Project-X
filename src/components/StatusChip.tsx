import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../constants/theme';
import { URGENCY_LEVELS } from '../constants';

interface StatusChipProps {
  status: string;
  variant?: 'urgency' | 'default' | 'success' | 'warning' | 'error';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, variant = 'default' }) => {
  const getColors = () => {
    if (variant === 'urgency') {
      const level = URGENCY_LEVELS[status as keyof typeof URGENCY_LEVELS];
      if (level) return { bg: level.bg, text: level.color };
    }
    switch (variant) {
      case 'success':
        return { bg: colors.successLight, text: colors.success };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'error':
        return { bg: colors.errorLight, text: colors.error };
      default:
        return { bg: colors.chipBackground, text: colors.textSecondary };
    }
  };

  const chipColors = getColors();
  const displayStatus = status || 'N/A';

  return (
    <View style={[styles.chip, { backgroundColor: chipColors.bg }]}>
      <Text style={[styles.text, { color: chipColors.text }]}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.captionMedium,
    fontWeight: '600',
  },
});
