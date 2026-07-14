import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { EmptyState, Avatar, StatusChip } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export const SharedReportsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchSharedReports();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  // Real-time subscription — new reports appear instantly
  React.useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`vet_shares:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vet_shares',
          filter: `vet_id=eq.${user.id}`,
        },
        async (payload) => {
          // Fetch full details for the new share
          const { data } = await supabase
            .from('vet_shares')
            .select(`
              *,
              assessment:assessments(
                id, farmer_id, likely_condition, certainty_level, ai_summary,
                urgency_level, possible_causes, suggested_next_steps, prevention_tips,
                raw_farmer_input, created_at,
                animal:animals(*)
              ),
              farmer:profiles!vet_shares_farmer_id_fkey(full_name, avatar_url, phone)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setReports((prev) => [data, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchSharedReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vet_shares')
        .select(`
          *,
          assessment:assessments(
            id, likely_condition, certainty_level, ai_summary, urgency_level,
            possible_causes, suggested_next_steps, prevention_tips,
            farmer_id,
            animal:animals(*)
          ),
          farmer:profiles!vet_shares_farmer_id_fkey(full_name, avatar_url, phone)
        `)
        .eq('vet_id', user!.id)
        .order('shared_at', { ascending: false });

      if (error) {
        console.error('Fetch shared reports error:', JSON.stringify(error));
        throw error;
      }
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching shared reports:', err);
      Alert.alert('Error', 'Could not load shared reports.');
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (shareId: string) => {
    await supabase
      .from('vet_shares')
      .update({ status: 'viewed' })
      .eq('id', shareId);
  };

  const handleOpenReport = (item: any) => {
    markAsViewed(item.id);
    navigation.navigate('SharedReportDetail', {
      shareId: item.id,
      assessment: item.assessment,
      farmer: item.farmer,
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getUrgencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'medium': return '#EAB308';
      default: return colors.success;
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const assessment = item.assessment;
    const farmer = item.farmer;
    const isNew = item.status === 'pending';

    return (
      <TouchableOpacity
        style={[styles.card, isNew && styles.cardNew]}
        onPress={() => handleOpenReport(item)}
        activeOpacity={0.8}
      >
        {isNew && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}

        <View style={styles.cardHeader}>
          <Avatar size={44} url={farmer?.avatar_url} />
          <View style={{ flex: 1 }}>
            <Text style={styles.farmerName}>{farmer?.full_name || 'Farmer'}</Text>
            <Text style={styles.timeAgo}>{formatDate(item.shared_at)}</Text>
          </View>
          <View style={[styles.urgencyDot, { backgroundColor: getUrgencyColor(assessment?.urgency_level) }]} />
        </View>

        <View style={styles.conditionRow}>
          <MaterialCommunityIcons name="stethoscope" size={18} color={colors.primary} />
          <Text style={styles.conditionText} numberOfLines={1}>
            {assessment?.likely_condition || 'Preliminary Assessment'}
          </Text>
        </View>

        <Text style={styles.summaryText} numberOfLines={2}>
          {assessment?.ai_summary || 'No summary available.'}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.animalChip}>
            <Ionicons name="paw" size={12} color={colors.textSecondary} />
            <Text style={styles.animalText}>
              {assessment?.animal?.species || 'Livestock'}
              {assessment?.animal?.tag_number ? ` · ${assessment.animal.tag_number}` : ''}
            </Text>
          </View>
          <Text style={styles.viewText}>View Report →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Shared Reports</Text>
          <Text style={styles.subtitle}>{reports.length} report{reports.length !== 1 ? 's' : ''} received</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="No Shared Reports"
              message="Farmers haven't shared any health reports with you yet. Reports will appear here when farmers send them."
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  loadingText: { ...typography.bodySm, color: colors.textSecondary },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h2 },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  list: { padding: spacing.xl, flexGrow: 1 },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.borderLight, gap: spacing.sm, ...shadows.sm,
  },
  cardNew: { borderColor: colors.primary, borderWidth: 1.5 },
  newBadge: {
    position: 'absolute', top: -8, right: spacing.lg,
    backgroundColor: colors.primary, borderRadius: borderRadius.full,
    paddingHorizontal: 10, paddingVertical: 2,
  },
  newBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  farmerName: { ...typography.bodyMedium, fontWeight: '700' },
  timeAgo: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  urgencyDot: { width: 12, height: 12, borderRadius: 6 },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  conditionText: { ...typography.bodyMedium, color: colors.text, flex: 1, fontWeight: '600' },
  summaryText: { ...typography.bodySm, color: colors.textSecondary, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  animalChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.background, borderRadius: borderRadius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  animalText: { ...typography.caption, color: colors.textSecondary },
  viewText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
});
