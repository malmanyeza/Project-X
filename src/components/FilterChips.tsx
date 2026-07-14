import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../constants/theme';

interface FilterChipsProps {
  filters: string[];
  selected: string;
  onSelect: (filter: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({ filters, selected, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >
    {filters.map((filter) => (
      <TouchableOpacity
        key={filter}
        style={[styles.chip, selected === filter && styles.chipSelected]}
        onPress={() => onSelect(filter)}
        activeOpacity={0.7}
      >
        <Text style={[styles.chipText, selected === filter && styles.chipTextSelected]}>
          {filter}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.buttonSm,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.textOnPrimary,
  },
});
