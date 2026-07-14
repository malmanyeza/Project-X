import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../constants/theme';
import { StatusChip } from './StatusChip';
import { Assessment } from '../types';

interface AssessmentCardProps {
  assessment: Assessment;
  onPress: () => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onPress }) => {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.condition} numberOfLines={1}>
            {assessment.likely_condition || 'Preliminary Assessment'}
          </Text>
          <Text style={styles.date}>{formatDate(assessment.created_at)}</Text>
        </View>
        <StatusChip status={assessment.urgency_level} variant="urgency" />
      </View>
      <Text style={styles.summary} numberOfLines={2}>
        {assessment.ai_summary}
      </Text>
      <View style={styles.footer}>
        {assessment.animal && (
          <View style={styles.animalTag}>
            <Ionicons name="paw" size={14} color={colors.secondary} />
            <Text style={styles.animalText}>{assessment.animal.species}</Text>
          </View>
        )}
        {assessment.shared && (
          <View style={styles.sharedBadge}>
            <Ionicons name="share-social" size={12} color={colors.primary} />
            <Text style={styles.sharedText}>Shared with vet</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  condition: {
    ...typography.h4,
  },
  date: {
    ...typography.caption,
  },
  summary: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  animalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.chipBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  animalText: {
    ...typography.caption,
    color: colors.secondary,
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  sharedText: {
    ...typography.caption,
    color: colors.primary,
  },
});
