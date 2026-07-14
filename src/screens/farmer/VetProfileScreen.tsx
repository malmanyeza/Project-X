import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { Avatar, Card, PrimaryButton, SecondaryButton, StatusChip } from '../../components';
import { useAuth } from '../../context/AuthContext';

export const VetProfileScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user } = useAuth();
  const vet = route?.params?.vet || {
    id: '1', 
    profile_id: '1',
    qualification: 'BVSc, MVSc in Large Animal Medicine',
    specializations: ['Large Animals', 'Cattle', 'General Practice'],
    available_now: true, rating_average: 4.8, total_reviews: 24,
    consultation_fee: 50, verification_status: 'verified', bio: 'Experienced large animal veterinarian with 12 years in rural practice. Specializing in cattle and small ruminant health management.',
    consultation_methods: ['Chat', 'Phone Call', 'In-person'],
    profile: { full_name: 'Dr. Tendai Moyo', avatar_url: null, location: 'Harare, Zimbabwe' },
  };

  const InfoRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.textTertiary} />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vet Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar size={80} />
          <Text style={styles.name}>{vet.profile?.full_name}</Text>
          <View style={styles.verifiedRow}>
            {/* Verified section removed */}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="star" size={18} color={colors.accent} />
              <Text style={styles.statValue}>{vet.rating_average || 0}</Text>
              <Text style={styles.statLabel}>({vet.total_reviews || 0} reviews)</Text>
            </View>
            <StatusChip status={vet.available_now ? 'Available' : 'Offline'} variant={vet.available_now ? 'success' : 'default'} />
          </View>
        </View>

        {/* Bio */}
        {vet.bio && (
          <Card>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{vet.bio}</Text>
          </Card>
        )}

        {/* Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Details</Text>
          <InfoRow icon="school" label="Qualification" value={vet.qualification} />
          <InfoRow icon="location" label="Location" value={vet.profile?.location || vet.region || 'N/A'} />
          <InfoRow icon="cash" label="Consultation Fee" value={vet.consultation_fee ? `$${vet.consultation_fee}` : 'Contact for details'} />
        </Card>

        {/* Specializations */}
        {vet.specializations?.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Specializations</Text>
            <View style={styles.tags}>
              {vet.specializations.map((s: string) => (
                <View key={s} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Consultation Methods */}
        {vet.consultation_methods?.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Consultation Methods</Text>
            <View style={styles.tags}>
              {vet.consultation_methods.map((m: string) => (
                <View key={m} style={styles.methodTag}>
                  <Ionicons
                    name={m === 'Chat' ? 'chatbubble' : m === 'Phone Call' ? 'call' : m === 'Video Call' ? 'videocam' : 'location'}
                    size={14} color={colors.primary}
                  />
                  <Text style={styles.methodText}>{m}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Practice Location Map */}
        {vet.profile?.latitude && vet.profile?.longitude && (
          <Card>
            <Text style={styles.sectionTitle}>Practice Location</Text>
            <View style={styles.mapWrapper}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: vet.profile.latitude,
                  longitude: vet.profile.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: vet.profile.latitude,
                    longitude: vet.profile.longitude,
                  }}
                  title={vet.profile.full_name}
                  description="Practice Location"
                />
              </MapView>
            </View>
            <Text style={styles.locationText}>{vet.profile.location}</Text>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Chat with Vet"
            onPress={() => {
              if (!user) {
                Alert.alert('Sign In Required', 'Please sign in to chat with veterinary professionals.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
                ]);
                return;
              }
              navigation.navigate('ChatWithVet', { 
                vetId: vet.profile_id,
                recipientName: vet.profile?.full_name,
                recipientAvatar: vet.profile?.avatar_url,
                recipientPhone: vet.profile?.phone
              });
            }}
            icon={<Ionicons name="chatbubble" size={20} color={colors.textOnPrimary} />}
          />
          <SecondaryButton
            title="Share AI Assessment"
            onPress={() => {
              if (!user) {
                Alert.alert('Sign In Required', 'Please sign in to share health reports with veterinary professionals.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
                ]);
                return;
              }
              Alert.alert('Assessment History', 'Please navigate to Saved Assessments and select a saved health report to share.');
            }}
            icon={<Ionicons name="share-social" size={20} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.h4 },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm },
  name: { ...typography.h2, marginTop: spacing.md },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { ...typography.bodySm, color: colors.primary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.sm },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { ...typography.h4 },
  statLabel: { ...typography.caption },
  sectionTitle: { ...typography.h4, marginBottom: spacing.md },
  bio: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  detailsCard: { gap: spacing.md },
  infoRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  infoLabel: { ...typography.caption, color: colors.textTertiary },
  infoValue: { ...typography.bodyMedium },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.chipBackground, paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs, borderRadius: borderRadius.pill,
  },
  tagText: { ...typography.captionMedium, color: colors.secondary },
  methodTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.successLight, paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: borderRadius.pill,
  },
  methodText: { ...typography.captionMedium, color: colors.primary },
  mapWrapper: {
    height: 150,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  map: { flex: 1 },
  locationText: { ...typography.caption, color: colors.textSecondary },
  actions: { gap: spacing.md, marginTop: spacing.md },
});
