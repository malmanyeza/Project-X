import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../constants/theme';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadiusSize?: number;
  style?: any;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadiusSize = borderRadius.sm,
  style,
}) => (
  <View
    style={[
      styles.skeleton,
      { width: width as any, height, borderRadius: borderRadiusSize },
      style,
    ]}
  />
);

export const CardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.row}>
      <LoadingSkeleton width={44} height={44} borderRadiusSize={22} />
      <View style={styles.flex}>
        <LoadingSkeleton width="60%" height={14} />
        <LoadingSkeleton width="40%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
    <LoadingSkeleton width="100%" height={12} style={{ marginTop: spacing.md }} />
    <LoadingSkeleton width="80%" height={12} style={{ marginTop: 6 }} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.borderLight,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
