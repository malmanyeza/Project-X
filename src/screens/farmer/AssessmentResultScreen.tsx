import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Share, Modal, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { Card, StatusChip, DisclaimerCard, PrimaryButton, SecondaryButton, Avatar } from '../../components';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { assessmentService } from '../../services/assessments';
import { vetService } from '../../services/vets';

export const AssessmentResultScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [assessment, setAssessment] = React.useState<any>(route?.params?.assessment || null);
  const [loading, setLoading] = React.useState(!assessment && !!route?.params?.assessmentId);
  const [saving, setSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(assessment?.is_saved || false);

  // Send to Vet state
  const [vetModalVisible, setVetModalVisible] = React.useState(false);
  const [vets, setVets] = React.useState<any[]>([]);
  const [loadingVets, setLoadingVets] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [sentVetIds, setSentVetIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!assessment && route?.params?.assessmentId) {
      fetchAssessment();
    }
  }, [route?.params?.assessmentId]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessments')
        .select('*, animal:animals(*)')
        .eq('id', route.params.assessmentId)
        .single();

      if (error) throw error;
      setAssessment(data);
      setIsSaved(data.is_saved);
    } catch (err: any) {
      console.error('Error fetching assessment:', err);
      Alert.alert('Error', 'Could not load report details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (isSaved) {
      Alert.alert('Saved', 'This assessment is already in your history.');
      return;
    }

    try {
      setSaving(true);
      const id = assessment?.id || route.params?.assessmentId;

      const { error } = await supabase
        .from('assessments')
        .update({
          is_saved: true,
          likely_condition: assessment.likely_condition,
          certainty_level: assessment.certainty_level,
          ai_summary: assessment.ai_summary,
          urgency_level: assessment.urgency_level,
          possible_causes: assessment.possible_causes,
          suggested_next_steps: assessment.suggested_next_steps,
          prevention_tips: assessment.prevention_tips,
        })
        .eq('id', id);

      if (error) throw error;
      setIsSaved(true);
      Alert.alert('Saved!', 'Report saved to your history successfully.');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save report. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleShareText = async () => {
    try {
      const content = `Project X Health Report\nCondition: ${assessment.likely_condition}\nUrgency: ${assessment.urgency_level}\n\nSummary: ${assessment.ai_summary}`;
      await Share.share({ message: content });
    } catch (err) {
      console.error('Sharing failed:', err);
    }
  };

  const openSendToVet = async () => {
    // First ensure it's saved so the vet_shares FK works
    if (!isSaved) {
      Alert.alert(
        'Save First',
        'Please save this report to your history before sending it to a vet.',
        [{ text: 'OK' }]
      );
      return;
    }
    try {
      setLoadingVets(true);
      setVetModalVisible(true);
      const data = await vetService.getVets();
      setVets(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load veterinarians.');
    } finally {
      setLoadingVets(false);
    }
  };

  const handleSendToVet = async (vet: any) => {
    if (!user) return;
    const assessmentId = assessment?.id || route.params?.assessmentId;

    if (!assessmentId) {
      Alert.alert('Error', 'Could not find assessment ID. Please save the report first and try again.');
      return;
    }

    // vet_shares.vet_id references profiles.id (the auth user ID), not veterinarians.id
    const vetProfileId = vet.profile_id || vet.profile?.id;
    if (!vetProfileId) {
      Alert.alert('Error', 'Could not identify this veterinarian. Please try another.');
      return;
    }

    try {
      setSending(true);
      await assessmentService.shareWithVet(assessmentId, vetProfileId, user.id);
      setSentVetIds(prev => [...prev, vet.id]);
      Alert.alert(
        'Report Sent! ✅',
        `Your health report has been shared with Dr. ${vet.profile?.full_name}. They will be able to review it and get back to you.`,
        [{ text: 'Great!', onPress: () => setVetModalVisible(false) }]
      );
    } catch (err: any) {
      console.error('Send to vet error:', JSON.stringify(err));
      if (err.message?.includes('duplicate') || err.code === '23505') {
        Alert.alert('Already Sent', 'You have already shared this report with this vet.');
        setSentVetIds(prev => [...prev, vet.id]);
      } else {
        Alert.alert('Send Failed', `Error: ${err.message || 'Unknown error. Please try again.'}`);
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Preparing Medical Report...</Text>
      </View>
    );
  }

  const isReady = assessment &&
    assessment.likely_condition !== 'Analyzing...' &&
    assessment.ai_summary !== 'Initializing...' &&
    Array.isArray(assessment.possible_causes) && assessment.possible_causes.length > 0 &&
    Array.isArray(assessment.suggested_next_steps) && assessment.suggested_next_steps.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Report</Text>
        <TouchableOpacity onPress={handleShareText} disabled={!isReady}>
          <Ionicons name="share-outline" size={24} color={isReady ? colors.primary : colors.border} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DisclaimerCard />

        {/* Diagnosis Card */}
        <View style={styles.diagnosisCard}>
          <View style={styles.diagnosisHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="stethoscope" size={24} color={colors.textOnPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.diagnosisLabel}>Preliminary Diagnosis</Text>
              <Text style={styles.diagnosisName}>
                {assessment.likely_condition === 'Analyzing...' ? 'Gathering Evidence...' : assessment.likely_condition}
              </Text>
            </View>
            <StatusChip status={assessment.urgency_level} variant="urgency" />
          </View>
          <View style={styles.confidenceRow}>
            <Ionicons name="shield-checkmark" size={16} color={colors.success} />
            <Text style={styles.confidenceText}>
              {assessment.certainty_level === 'Analyzing...' ? 'Calculating...' : assessment.certainty_level} Confidence
            </Text>
          </View>
        </View>

        {/* Clinical Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinical Summary</Text>
          <Text style={styles.summaryText}>
            {assessment.ai_summary === 'Initializing...'
              ? 'The AI is currently analyzing the symptoms you described. Please continue the chat to refine this report.'
              : assessment.ai_summary}
          </Text>
        </View>

        {/* Differential Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Differential Diagnosis</Text>
          {Array.isArray(assessment.possible_causes) && assessment.possible_causes.length > 0 ? (
            assessment.possible_causes.map((cause: string, i: number) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{cause}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Further information needed to differentiate causes.</Text>
          )}
        </View>

        {/* Management Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Plan</Text>
          {Array.isArray(assessment.suggested_next_steps) && assessment.suggested_next_steps.length > 0 ? (
            assessment.suggested_next_steps.map((step: string, i: number) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{i + 1}</Text></View>
                <Text style={styles.listText}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Waiting for more clinical data to provide steps.</Text>
          )}
        </View>

        {/* Prevention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preventative Measures</Text>
          <View style={styles.preventionCard}>
            {Array.isArray(assessment.prevention_tips) && assessment.prevention_tips.length > 0 ? (
              assessment.prevention_tips.map((tip: string, i: number) => (
                <View key={i} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.listText}>{tip}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Prevention strategies will appear here.</Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          {/* Send to Vet - Primary Action */}
          <TouchableOpacity
            style={[styles.sendToVetBtn, !isReady && styles.btnDisabled]}
            onPress={isReady ? openSendToVet : () => Alert.alert('Hold on!', 'Complete the AI assessment first before sending to a vet.')}
            activeOpacity={0.85}
          >
            <Ionicons name="paper-plane" size={20} color="#fff" />
            <Text style={styles.sendToVetText}>Send to Vet</Text>
          </TouchableOpacity>

          <SecondaryButton
            title={isSaved ? 'Saved to History' : 'Save to History'}
            onPress={isReady ? handleSave : () => Alert.alert('Hold on!', 'This report is still being analyzed.')}
            loading={saving}
            icon={<Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={isReady ? colors.primary : colors.border} />}
            style={{ opacity: isReady || isSaved ? 1 : 0.6 }}
          />
        </View>
      </ScrollView>

      {/* Vet Picker Modal */}
      <Modal visible={vetModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose a Veterinarian</Text>
            <TouchableOpacity onPress={() => setVetModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Select a vet to send your health report to. They will be notified and can review it.
          </Text>

          {loadingVets ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading veterinarians...</Text>
            </View>
          ) : (
            <FlatList
              data={vets}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: spacing.xl, gap: spacing.md }}
              renderItem={({ item }) => {
                const alreadySent = sentVetIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.vetItem, alreadySent && styles.vetItemSent]}
                    onPress={() => !alreadySent && !sending && handleSendToVet(item)}
                    activeOpacity={alreadySent ? 1 : 0.8}
                  >
                    <Avatar size={48} url={item.profile?.avatar_url} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.vetName}>Dr. {item.profile?.full_name}</Text>
                      <Text style={styles.vetSpec}>
                        {item.specializations?.slice(0, 2).join(' · ') || 'General Practice'}
                      </Text>
                      {item.available_now && (
                        <View style={styles.availableBadge}>
                          <View style={styles.greenDot} />
                          <Text style={styles.availableText}>Available Now</Text>
                        </View>
                      )}
                    </View>
                    {alreadySent ? (
                      <View style={styles.sentBadge}>
                        <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                        <Text style={styles.sentText}>Sent</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.sendBtn}
                        onPress={() => handleSendToVet(item)}
                        disabled={sending}
                      >
                        {sending ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.sendBtnText}>Send</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.modalLoading}>
                  <Ionicons name="people-outline" size={48} color={colors.border} />
                  <Text style={styles.emptyText}>No veterinarians available.</Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: colors.surface,
  },
  headerTitle: { ...typography.h4 },
  backButton: { padding: 4 },
  scroll: { padding: spacing.xl, gap: spacing.lg },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { ...typography.body, color: colors.textSecondary },
  diagnosisCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  diagnosisHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  diagnosisLabel: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  diagnosisName: { ...typography.h2, color: colors.text },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.success + '10', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  confidenceText: { ...typography.caption, color: colors.success, fontWeight: '700' },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: 4 },
  summaryText: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.xs },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginTop: 8 },
  listText: { ...typography.body, color: colors.textSecondary, flex: 1, lineHeight: 22 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  preventionCard: { backgroundColor: colors.success + '05', padding: spacing.md, borderRadius: borderRadius.lg, borderLeftWidth: 4, borderLeftColor: colors.success },
  emptyText: { ...typography.bodySm, color: colors.textSecondary, fontStyle: 'italic' },
  footer: { gap: spacing.md, marginTop: spacing.lg },
  sendToVetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.primary,
    borderRadius: borderRadius.lg, paddingVertical: spacing.md + 2,
  },
  sendToVetText: { ...typography.bodyMedium, color: '#fff', fontWeight: '700' },
  btnDisabled: { opacity: 0.5 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  modalTitle: { ...typography.h3 },
  modalSubtitle: { ...typography.bodySm, color: colors.textSecondary, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  modalLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingTop: 60 },
  vetItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  vetItemSent: { borderColor: colors.success, backgroundColor: colors.success + '05' },
  vetName: { ...typography.bodyMedium, fontWeight: '700' },
  vetSpec: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  availableBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  greenDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  availableText: { ...typography.caption, color: colors.success, fontWeight: '600' },
  sentBadge: { alignItems: 'center', gap: 2 },
  sentText: { ...typography.caption, color: colors.success, fontWeight: '700' },
  sendBtn: {
    backgroundColor: colors.primary, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  sendBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
