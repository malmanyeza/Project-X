import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { Card, SectionHeader, InfoBanner } from '../../components';


const quickActions = [
  { id: 'assess', icon: 'chatbubble-ellipses', label: 'Start Assessment', subtitle: 'Describe symptoms to get AI advice', color: colors.primary, screen: 'AssistantChat' },
  { id: 'vet', icon: 'people', label: 'Find a Vet', subtitle: 'Browse and connect with vets nearby', color: colors.secondary, screen: 'Vets' },
  { id: 'saved', icon: 'document-text', label: 'My Assessments', subtitle: 'View your past health assessments', color: colors.accent, screen: 'SavedAssessments' },
];

const healthTips = [
  'Regular deworming helps prevent chronic weight loss in cattle.',
  'Ensure clean water access — most livestock diseases are water-borne.',
  'Isolate new animals for 2 weeks before mixing with your herd.',
  'Vaccinate livestock before the rainy season to prevent outbreaks.',
];

import { useAuth } from '../../context/AuthContext';


export const FarmerHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { profile, user } = useAuth();
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  const handleAction = (screen: string) => {
    if (!user && screen !== 'AssistantChat' && screen !== 'Vets') {
      navigation.navigate('Auth');
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {profile?.full_name?.split(' ')[0] || 'Guest'} 👋
            </Text>
            <Text style={styles.subGreeting}>How can we help your livestock today?</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => handleAction('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity
          style={styles.emergencyCard}
          onPress={() => navigation.navigate('Vets')}
          activeOpacity={0.8}
        >
          <View style={styles.emergencyIcon}>
            <Ionicons name="warning" size={22} color={colors.error} />
          </View>
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>Emergency?</Text>
            <Text style={styles.emergencyDesc}>Find a vet available now →</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionList}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleAction(action.screen)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Tip */}
        <SectionHeader title="Health Tip" />
        <InfoBanner message={randomTip} variant="tip" icon="bulb" />

        {/* Recent Activity */}
        <SectionHeader title="Recent Activity" />
        <Card>
          <View style={styles.emptyRecent}>
            <Ionicons name="time-outline" size={32} color={colors.textTertiary} />
            <Text style={styles.emptyRecentText}>No recent activity yet.</Text>
            <Text style={styles.emptyRecentSub}>Start your first preliminary assessment to see activity here.</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { ...typography.h1, marginBottom: 2 },
  subGreeting: { ...typography.bodySm, color: colors.textSecondary },
  notifButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', ...shadows.sm, position: 'relative',
  },
  notifDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error,
    position: 'absolute', top: 10, right: 12,
  },
  emergencyCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorLight,
    borderRadius: borderRadius.lg, padding: spacing.lg, gap: spacing.md,
    borderWidth: 1, borderColor: '#F5C5BC',
  },
  emergencyIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
  },
  emergencyText: { flex: 1 },
  emergencyTitle: { ...typography.h4, color: colors.error },
  emergencyDesc: { ...typography.caption, color: colors.error, marginTop: 2 },
  actionList: { gap: spacing.sm },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight, ...shadows.sm,
  },
  actionIconWrap: {
    width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  actionText: { flex: 1, gap: 2 },
  actionLabel: { ...typography.bodyMedium, fontSize: 14 },
  actionSubtitle: { ...typography.caption, color: colors.textSecondary, fontSize: 12 },
  emptyRecent: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  emptyRecentText: { ...typography.bodyMedium, color: colors.textSecondary },
  emptyRecentSub: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});
