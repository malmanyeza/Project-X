import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { EmptyState } from '../../components';

const mockNotifications = [
  { id: '1', title: 'Assessment Saved', body: 'Your preliminary assessment for cattle has been saved.', type: 'system', is_read: true, created_at: '2026-03-10T10:00:00Z' },
  { id: '2', title: 'Dr. Moyo replied', body: 'You have a new message from Dr. Tendai Moyo.', type: 'chat_message', is_read: false, created_at: '2026-03-09T14:30:00Z' },
  { id: '3', title: 'Health Reminder', body: 'Time to check your cattle vaccination schedule.', type: 'reminder', is_read: false, created_at: '2026-03-08T08:00:00Z' },
];

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'chat_message': return 'chatbubble';
      case 'reminder': return 'alarm';
      case 'assessment_shared': return 'share-social';
      default: return 'notifications';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList
        data={mockNotifications}
        renderItem={({ item }) => (
          <View style={[styles.notifCard, !item.is_read && styles.unread]}>
            <View style={[styles.iconCircle, !item.is_read && styles.iconUnread]}>
              <Ionicons name={getIcon(item.type) as any} size={18} color={!item.is_read ? colors.textOnPrimary : colors.textSecondary} />
            </View>
            <View style={styles.notifInfo}>
              <Text style={[styles.notifTitle, !item.is_read && styles.notifTitleBold]}>{item.title}</Text>
              <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.notifTime}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            {!item.is_read && <View style={styles.dot} />}
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="No Notifications" message="You're all caught up!" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.sm },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1 },
  list: { paddingHorizontal: spacing.xl },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.borderLight },
  unread: { backgroundColor: '#F0F8F0', borderColor: colors.primaryLight + '30' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.chipBackground, alignItems: 'center', justifyContent: 'center' },
  iconUnread: { backgroundColor: colors.primary },
  notifInfo: { flex: 1, gap: 2 },
  notifTitle: { ...typography.bodyMedium, fontSize: 14 },
  notifTitleBold: { fontWeight: '700' },
  notifBody: { ...typography.caption, color: colors.textSecondary },
  notifTime: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
});
