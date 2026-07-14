import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, spacing, shadows } from '../constants/theme';

interface VetCardProps {
  vet: {
    id: string;
    qualification: string;
    specializations: string[];
    available_now: boolean;
    rating_average: number;
    total_reviews: number;
    consultation_fee: number | null;
    verification_status: string;
      profile?: {
        full_name: string;
        avatar_url: string | null;
        location: string | null;
      };
      distance?: number;
    };
    onPress: () => void;
  }

  export const VetCard: React.FC<VetCardProps> = ({ vet, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          {vet.profile?.avatar_url ? (
            <Image source={{ uri: vet.profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
          )}
          {vet.available_now && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {vet.profile?.full_name || 'Veterinarian'}
            </Text>
          </View>
          <Text style={styles.qualification} numberOfLines={1}>
            {vet.qualification}
          </Text>
          <View style={styles.locationRow}>
            {(vet.profile?.location || vet.region) && (
              <>
                <Ionicons name="location-outline" size={13} color={colors.textTertiary} />
                <Text style={styles.location}>{vet.profile?.location || vet.region}</Text>
              </>
            )}
            {vet.distance !== undefined && (
              <>
                {vet.profile?.location && <Text style={styles.locationDot}>•</Text>}
                <Ionicons name="navigate-outline" size={13} color={colors.primary} />
                <Text style={[styles.location, { color: colors.primary }]}>
                  {vet.distance.toFixed(1)} km
                </Text>
              </>
            )}
          </View>
        <View style={styles.bottomRow}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>
              {(vet.rating_average || 0).toFixed(1)} ({vet.total_reviews || 0})
            </Text>
          </View>
          {vet.specializations?.length > 0 && (
            <View style={styles.specTag}>
              <Text style={styles.specText}>{vet.specializations[0]}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.circle,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.surface,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    ...typography.h4,
    flex: 1,
  },
  qualification: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  location: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  locationDot: {
    ...typography.caption,
    color: colors.textTertiary,
    marginHorizontal: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    ...typography.captionMedium,
    color: colors.text,
  },
  specTag: {
    backgroundColor: colors.chipBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  specText: {
    ...typography.caption,
    color: colors.secondary,
    fontSize: 11,
  },
});
