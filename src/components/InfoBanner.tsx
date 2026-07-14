import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing } from '../constants/theme';

interface InfoBannerProps {
  message: string;
  variant?: 'info' | 'tip' | 'warning';
  icon?: keyof typeof Ionicons.glyphMap;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  message,
  variant = 'info',
  icon,
}) => {
  const variantConfig = {
    info: { bg: '#EEF4FF', color: '#1A56DB', border: '#C3DAFE', icon: 'information-circle' as const },
    tip: { bg: colors.successLight, color: colors.success, border: '#A5D6A7', icon: 'bulb' as const },
    warning: { bg: colors.warningLight, color: colors.warning, border: '#EFE0B0', icon: 'warning' as const },
  };

  const config = variantConfig[variant];

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
      <Ionicons name={icon || config.icon} size={18} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  text: {
    ...typography.bodySm,
    flex: 1,
    lineHeight: 20,
  },
});
