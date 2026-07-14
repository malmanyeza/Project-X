import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { DisclaimerCard, StatusChip, Avatar, SecondaryButton, PrimaryButton } from '../../components';
import { supabase } from '../../lib/supabase';

export const SharedReportDetailScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { shareId, farmer: farmerParam } = route.params;
  const [assessment, setAssessment] = React.useState<any>(route.params?.assessment || null);
  const [farmer, setFarmer] = React.useState<any>(farmerParam || null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchFullReport();
  }, [shareId]);

  const fetchFullReport = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vet_shares')
        .select(`
          *,
          assessment:assessments(
            id, farmer_id, likely_condition, certainty_level, ai_summary, 
            urgency_level, possible_causes, suggested_next_steps, prevention_tips,
            raw_farmer_input, created_at,
            animal:animals(*)
          ),
          farmer:profiles!vet_shares_farmer_id_fkey(id, full_name, avatar_url, phone, location)
        `)
        .eq('id', shareId)
        .single();

      if (error) throw error;

      // Normalize JSON fields — Supabase can return arrays as strings
      const a = data.assessment;
      if (a) {
        const parse = (val: any) => {
          if (Array.isArray(val)) return val;
          if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return [val]; }
          }
          return [];
        };
        setAssessment({
          ...a,
          possible_causes: parse(a.possible_causes),
          suggested_next_steps: parse(a.suggested_next_steps),
          prevention_tips: parse(a.prevention_tips),
        });
      }

      setFarmer(data.farmer);
    } catch (err) {
      console.error('Fetch report detail error:', err);
      Alert.alert('Error', 'Could not load the full report.');
    } finally {
      setLoading(false);
    }
  };

  const handleCallFarmer = () => {
    if (farmer?.phone) {
      Linking.openURL(`tel:${farmer.phone}`);
    } else {
      Alert.alert('No Phone', "This farmer hasn't provided a phone number.");
    }
  };

  const handleMessageFarmer = () => {
    if (!assessment?.farmer_id) return;
    navigation.navigate('ChatWithFarmer', {
      farmerId: assessment.farmer_id,
      recipientName: farmer?.full_name || 'Farmer',
      recipientAvatar: farmer?.avatar_url,
      recipientPhone: farmer?.phone,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Farmer's Report</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading full report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const Section = ({ icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={18} color={colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farmer's Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Farmer Info Card */}
        <View style={styles.farmerCard}>
          <Avatar size={52} url={farmer?.avatar_url} />
          <View style={{ flex: 1 }}>
            <Text style={styles.farmerLabel}>Report submitted by</Text>
            <Text style={styles.farmerName}>{farmer?.full_name || 'Farmer'}</Text>
            {farmer?.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.locationText}>{farmer.location}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.callBtn} onPress={handleCallFarmer}>
            <Ionicons name="call" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <DisclaimerCard />

        {/* Diagnosis Card */}
        <View style={styles.diagnosisCard}>
          <View style={styles.diagnosisHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="stethoscope" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.diagnosisLabel}>AI Preliminary Diagnosis</Text>
              <Text style={styles.diagnosisName}>{assessment?.likely_condition || 'Awaiting Analysis'}</Text>
            </View>
            <StatusChip status={assessment?.urgency_level} variant="urgency" />
          </View>
          <View style={styles.confidenceRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.success} />
            <Text style={styles.confidenceText}>
              {assessment?.certainty_level || 'Unknown'} Confidence · AI Generated
            </Text>
          </View>
        </View>

        {/* Clinical Summary */}
        <Section icon="clipboard-outline" title="Clinical Summary">
          <Text style={styles.bodyText}>{assessment?.ai_summary || 'No summary available.'}</Text>
        </Section>

        {/* Farmer's Raw Description */}
        {assessment?.raw_farmer_input && (
          <Section icon="chatbubble-outline" title="Farmer's Description">
            <View style={styles.rawInputCard}>
              <Text style={styles.bodyText}>{assessment.raw_farmer_input}</Text>
            </View>
          </Section>
        )}

        {/* Possible Causes */}
        <Section icon="help-circle-outline" title="Differential Diagnosis (Possible Causes)">
          {Array.isArray(assessment?.possible_causes) && assessment.possible_causes.length > 0 ? (
            assessment.possible_causes.map((cause: string, i: number) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.bodyText}>{cause}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No causes listed in this report.</Text>
          )}
        </Section>

        {/* Suggested Next Steps */}
        <Section icon="arrow-forward-circle-outline" title="Suggested Management Plan">
          {Array.isArray(assessment?.suggested_next_steps) && assessment.suggested_next_steps.length > 0 ? (
            assessment.suggested_next_steps.map((step: string, i: number) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                <Text style={styles.bodyText}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No steps listed in this report.</Text>
          )}
        </Section>

        {/* Prevention Tips */}
        <Section icon="shield-checkmark-outline" title="Prevention Tips">
          <View style={styles.preventionCard}>
            {Array.isArray(assessment?.prevention_tips) && assessment.prevention_tips.length > 0 ? (
              assessment.prevention_tips.map((tip: string, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.bodyText}>{tip}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No prevention tips listed.</Text>
            )}
          </View>
        </Section>

        {/* Animal Info */}
        {assessment?.animal && (
          <Section icon="paw-outline" title="Animal Information">
            <View style={styles.animalGrid}>
              {[
                { label: 'Species', value: assessment.animal.species },
                { label: 'Breed', value: assessment.animal.breed || 'Unknown' },
                { label: 'Age', value: assessment.animal.age || 'Unknown' },
                { label: 'Sex', value: assessment.animal.sex || 'Unknown' },
                { label: 'Tag #', value: assessment.animal.tag_number || 'N/A' },
              ].map((item) => (
                <View key={item.label} style={styles.animalGridItem}>
                  <Text style={styles.animalLabel}>{item.label}</Text>
                  <Text style={styles.animalValue}>{item.value}</Text>
                </View>
              ))}
            </View>
            {assessment.animal.notes && (
              <View style={styles.notesCard}>
                <Text style={styles.animalLabel}>Notes</Text>
                <Text style={styles.bodyText}>{assessment.animal.notes}</Text>
              </View>
            )}
          </Section>
        )}

        {/* Actions */}
        <View style={styles.footer}>
          <PrimaryButton
            title="Message Farmer"
            onPress={handleMessageFarmer}
            icon={<Ionicons name="chatbubble-ellipses" size={20} color="#fff" />}
          />
          <SecondaryButton
            title="Call Farmer"
            onPress={handleCallFarmer}
            icon={<Ionicons name="call-outline" size={20} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  loadingText: { ...typography.body, color: colors.textSecondary },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  headerTitle: { ...typography.h4 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  farmerCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  farmerLabel: { ...typography.caption, color: colors.textSecondary },
  farmerName: { ...typography.h3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  locationText: { ...typography.caption, color: colors.textSecondary },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  diagnosisCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  diagnosisHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  diagnosisLabel: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  diagnosisName: { ...typography.h3, color: colors.text },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.success + '10', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  confidenceText: { ...typography.caption, color: colors.success, fontWeight: '600' },
  section: { gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sectionTitle: { ...typography.h4 },
  bodyText: { ...typography.body, color: colors.textSecondary, lineHeight: 22, flex: 1 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 9 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  stepNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: colors.primary, fontWeight: '700', fontSize: 11 },
  preventionCard: { backgroundColor: colors.success + '05', padding: spacing.md, borderRadius: borderRadius.lg, borderLeftWidth: 4, borderLeftColor: colors.success, gap: spacing.xs },
  rawInputCard: { backgroundColor: colors.background, padding: spacing.md, borderRadius: borderRadius.lg, borderLeftWidth: 4, borderLeftColor: colors.primary + '40' },
  animalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  animalGridItem: { width: '47%', backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.sm },
  animalLabel: { ...typography.caption, color: colors.textSecondary },
  animalValue: { ...typography.bodyMedium, fontWeight: '600', marginTop: 2 },
  notesCard: { backgroundColor: colors.background, padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.xs },
  emptyText: { ...typography.bodySm, color: colors.textSecondary, fontStyle: 'italic' },
  footer: { gap: spacing.md, marginTop: spacing.md },
});
