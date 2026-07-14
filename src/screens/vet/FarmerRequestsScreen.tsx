import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { StatusChip, EmptyState, Avatar } from '../../components';

const mockRequests = [
  { id: '1', farmer_name: 'John Farmer', animal: 'Cattle', condition: 'Upper Respiratory Infection', urgency: 'medium', time: '2 hours ago' },
  { id: '2', farmer_name: 'Mary Chikwanha', animal: 'Goats', condition: 'Internal Parasites', urgency: 'high', time: '5 hours ago' },
  { id: '3', farmer_name: 'Peter Nyika', animal: 'Poultry', condition: 'Newcastle Disease', urgency: 'critical', time: '1 day ago' },
];

import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { VetShare } from '../../types';

export const FarmerRequestsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [requests, setRequests] = React.useState<VetShare[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vet_shares')
        .select(`
          *,
          farmer:profiles!farmer_id(*),
          assessment:assessments!assessment_id(*, animal:animals(*))
        `)
        .eq('vet_id', user!.id)
        .order('shared_at', { ascending: false });

      if (error) throw error;
      setRequests(data as any);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffInMs = now.getTime() - then.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const handleRespond = (request: VetShare) => {
    navigation.navigate('ChatWithFarmer', { 
      chatId: null, // Chat screen should handle finding/creating chat
      farmerId: request.farmer_id,
      recipientName: request.farmer?.full_name,
      recipientAvatar: request.farmer?.avatar_url
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Farmer Requests</Text>
        <Text style={styles.subtitle}>{requests.length} pending</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SharedReportDetail', { shareId: item.id })}
            >
              <View style={styles.cardHeader}>
                <Avatar size={40} url={item.farmer?.avatar_url} />
                <View style={styles.cardInfo}>
                  <Text style={styles.farmerName}>{item.farmer?.full_name || 'Farmer'}</Text>
                  <Text style={styles.timeText}>{getTimeAgo(item.shared_at)}</Text>
                </View>
                <StatusChip status={item.assessment?.urgency_level || 'low'} variant="urgency" />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.detailRow}>
                  <Ionicons name="paw" size={14} color={colors.secondary} />
                  <Text style={styles.detail}>{item.assessment?.animal?.species || 'Unknown Animal'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="medical" size={14} color={colors.primary} />
                  <Text style={styles.detail} numberOfLines={1}>{item.assessment?.likely_condition || 'No symptoms provided'}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => navigation.navigate('SharedReportDetail', { shareId: item.id })}
                >
                  <Ionicons name="eye" size={16} color={colors.primary} />
                  <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionPrimary]}
                  onPress={() => handleRespond(item)}
                >
                  <Ionicons name="chatbubble" size={16} color={colors.textOnPrimary} />
                  <Text style={[styles.actionText, { color: colors.textOnPrimary }]}>Respond</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={<EmptyState icon="mail-open-outline" title="No Requests" message="You don't have any pending farmer requests." />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  backButton: { marginBottom: spacing.md },
  title: { ...typography.h1 },
  subtitle: { ...typography.bodySm, color: colors.textSecondary },
  list: { padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardInfo: { flex: 1 },
  farmerName: { ...typography.h4, fontSize: 15 },
  timeText: { ...typography.caption, color: colors.textTertiary },
  cardBody: { gap: spacing.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  detail: { ...typography.bodySm },
  cardActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.sm, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.primary },
  actionPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionText: { ...typography.buttonSm, color: colors.primary },
});
