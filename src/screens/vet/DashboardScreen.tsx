import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { StatusChip, Avatar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export const VetDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sharedReports: 0,
    unreadReports: 0,
    unreadChats: 0,
    totalReviews: 0,
    avgRating: 0,
    farmerRequests: 0,
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchDashboardData();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);

      const [sharesRes, chatsRes, reviewsRes, requestsRes] = await Promise.all([
        // Shared reports
        supabase
          .from('vet_shares')
          .select('id, status, shared_at, assessment:assessments(likely_condition, urgency_level, ai_summary, farmer_id), farmer:profiles!vet_shares_farmer_id_fkey(full_name, avatar_url)')
          .eq('vet_id', user.id)
          .order('shared_at', { ascending: false })
          .limit(50),

        // Unread chats
        supabase
          .from('chats')
          .select('id')
          .eq('vet_id', user.id),

        // Reviews
        supabase
          .from('reviews')
          .select('rating')
          .eq('vet_id', user.id),

        // Farmer requests
        supabase
          .from('farmer_requests')
          .select('id', { count: 'exact', head: true })
          .eq('vet_id', user.id)
          .eq('status', 'pending'),
      ]);

      const shares = sharesRes.data || [];
      const unread = shares.filter((s: any) => s.status === 'pending').length;
      const reviews = reviewsRes.data || [];
      const avgRating = reviews.length > 0
        ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length)
        : 0;

      setStats({
        sharedReports: shares.length,
        unreadReports: unread,
        unreadChats: (chatsRes.data || []).length,
        totalReviews: reviews.length,
        avgRating: Math.round(avgRating * 10) / 10,
        farmerRequests: requestsRes.count || 0,
      });

      setRecentReports(shares.slice(0, 4));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ label, value, icon, color, badge }: any) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Dr. {profile?.full_name?.split(' ')[0] || 'Doctor'} 👋</Text>
            <Text style={styles.subGreeting}>Here's your practice overview</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('SharedReports')} style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            {stats.unreadReports > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{stats.unreadReports}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            <StatCard
              label="Shared Reports"
              value={stats.sharedReports}
              icon="document-text"
              color={colors.primary}
              badge={stats.unreadReports}
            />
            <StatCard
              label="Chats"
              value={stats.unreadChats}
              icon="chatbubbles"
              color={colors.accent}
              badge={0}
            />
            <StatCard
              label="Reviews"
              value={stats.totalReviews}
              icon="star"
              color={colors.warning}
              badge={0}
            />
            <StatCard
              label="Avg Rating"
              value={stats.avgRating > 0 ? `${stats.avgRating}★` : 'N/A'}
              icon="ribbon"
              color={colors.success}
              badge={0}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {[
              { label: 'Shared Reports', icon: 'document-text', screen: 'SharedReports', count: stats.unreadReports },
              { label: 'Messages', icon: 'chatbubbles', screen: 'Chats', count: 0 },
              { label: 'Reviews', icon: 'star', screen: 'VetReviews', count: 0 },
            ].map((a) => (
              <TouchableOpacity
                key={a.label}
                style={styles.actionChip}
                onPress={() => navigation.navigate(a.screen)}
                activeOpacity={0.75}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons name={a.icon as any} size={20} color={colors.primary} />
                  {a.count > 0 && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.badgeText}>{a.count}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Shared Reports */}
        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            {recentReports.length > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('SharedReports')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? null : recentReports.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialCommunityIcons name="file-document-outline" size={36} color={colors.border} />
              <Text style={styles.emptyText}>No shared reports yet.</Text>
              <Text style={styles.emptySubtext}>When farmers share health reports with you, they'll appear here.</Text>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {recentReports.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.reportCard, item.status === 'pending' && styles.reportCardNew]}
                  onPress={() => navigation.navigate('SharedReportDetail', {
                    shareId: item.id,
                    assessment: item.assessment,
                    farmer: item.farmer,
                  })}
                  activeOpacity={0.8}
                >
                  {item.status === 'pending' && (
                    <View style={styles.newPill}><Text style={styles.newPillText}>NEW</Text></View>
                  )}
                  <View style={styles.reportRow}>
                    <Avatar size={40} url={item.farmer?.avatar_url} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reportFarmer}>{item.farmer?.full_name || 'Farmer'}</Text>
                      <Text style={styles.reportCondition} numberOfLines={1}>
                        {item.assessment?.likely_condition || 'Preliminary Report'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <View style={[styles.urgencyDot, { backgroundColor: getUrgencyColor(item.assessment?.urgency_level) }]} />
                      <Text style={styles.reportTime}>{formatTime(item.shared_at)}</Text>
                    </View>
                  </View>
                  <Text style={styles.reportSummary} numberOfLines={2}>
                    {item.assessment?.ai_summary || 'No summary available.'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { ...typography.h1, marginBottom: 2 },
  subGreeting: { ...typography.bodySm, color: colors.textSecondary },
  notifBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  notifBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.error, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  notifBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  loadingCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
  loadingText: { ...typography.bodySm, color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    padding: spacing.lg, alignItems: 'center', gap: spacing.sm,
    borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  statIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.error, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  statValue: { ...typography.h2 },
  statLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  seeAll: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  actionChip: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    backgroundColor: colors.surface, paddingVertical: spacing.md,
    borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.borderLight,
  },
  actionIconWrap: { position: 'relative' },
  actionBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: colors.error, borderRadius: 7, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  actionLabel: { ...typography.caption, color: colors.text, fontWeight: '600', textAlign: 'center', fontSize: 11 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xxl, alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.borderLight },
  emptyText: { ...typography.bodyMedium, color: colors.textSecondary },
  emptySubtext: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  reportsList: { gap: spacing.md },
  reportCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    gap: spacing.sm, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  reportCardNew: { borderColor: colors.primary, borderWidth: 1.5 },
  newPill: { position: 'absolute', top: -8, right: spacing.md, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingHorizontal: 10, paddingVertical: 2 },
  newPillText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reportFarmer: { ...typography.bodyMedium, fontWeight: '700' },
  reportCondition: { ...typography.caption, color: colors.primary, marginTop: 1 },
  urgencyDot: { width: 10, height: 10, borderRadius: 5 },
  reportTime: { ...typography.caption, color: colors.textSecondary, fontSize: 10 },
  reportSummary: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
