import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { EmptyState, Avatar } from '../../components';

import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chats';
import { ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

export const VetChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, profile } = useAuth();
  const [chats, setChats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      fetchChats();

      // Listen for updates to the chats table (like last_message_at changes)
      const subscription = supabase
        .channel('vet_chats_list')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chats',
            filter: `vet_id=eq.${user.id}`,
          },
          () => {
            fetchChats(); // Refresh the list when a chat is updated or created
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getChats(user!.id, 'vet');
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat: any) => {
    const recipient = chat.farmer;
    navigation.navigate('ChatWithFarmer', { 
      chatId: chat.id,
      recipientName: recipient?.full_name,
      recipientAvatar: recipient?.avatar_url,
      recipientPhone: recipient?.phone,
      farmerId: chat.farmer_id
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Chats</Text></View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.chatCard} 
              onPress={() => handleChatPress(item)} 
              activeOpacity={0.7}
            >
              <Avatar size={48} url={item.farmer?.avatar_url} />
              <View style={styles.chatInfo}>
                <View style={styles.chatTop}>
                  <Text style={styles.chatName}>{item.farmer?.full_name || 'Farmer'}</Text>
                  <Text style={styles.chatTime}>
                    {new Date(item.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.chatBottom}>
                  <Text style={styles.chatMsg} numberOfLines={1}>Tap to view conversation</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={<EmptyState icon="chatbubbles-outline" title="No Chats" message="Your farmer conversations will appear here." />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  title: { ...typography.h1 },
  list: { paddingHorizontal: spacing.xl },
  chatCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  chatInfo: { flex: 1, gap: 4 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { ...typography.h4, fontSize: 15 },
  chatTime: { ...typography.caption, color: colors.textTertiary },
  chatBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chatMsg: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  badgeText: { color: colors.textOnPrimary, fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.borderLight },
});
