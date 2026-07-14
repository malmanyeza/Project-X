import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { EmptyState, Avatar, PrimaryButton } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chats';
import { supabase } from '../../lib/supabase';

export const FarmerChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, loading: authLoading } = useAuth();
  const [chats, setChats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      fetchChats();

      const subscription = supabase
        .channel('farmer_chats_list')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chats',
            filter: `farmer_id=eq.${user.id}`,
          },
          () => {
            fetchChats();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getChats(user!.id, 'farmer');
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat: any) => {
    const recipient = chat.vet;
    navigation.navigate('ChatWithVet', { 
      chatId: chat.id,
      recipientName: recipient?.full_name,
      recipientAvatar: recipient?.avatar_url,
      recipientPhone: recipient?.phone,
      vetId: chat.vet_id
    });
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
        <EmptyState 
          icon="chatbubbles-outline" 
          title="Sign In Required" 
          message="Please sign in to start chatting with verified veterinarians." 
          action={
            <PrimaryButton 
              title="Sign In" 
              onPress={() => navigation.navigate('Auth')} 
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}><Text style={styles.title}>Messages</Text></View>
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
              <Avatar size={56} url={item.vet?.avatar_url} />
              <View style={styles.chatInfo}>
                <View style={styles.chatTop}>
                  <Text style={styles.chatName}>{item.vet?.full_name || 'Veterinarian'}</Text>
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
          ListEmptyComponent={
            <EmptyState 
              icon="chatbubbles-outline" 
              title="No Messages" 
              message="Your conversations with veterinarians will appear here." 
            />
          }
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
  chatCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  chatInfo: { flex: 1, gap: 4 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { ...typography.h4, fontSize: 16 },
  chatTime: { ...typography.caption, color: colors.textTertiary },
  chatBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chatMsg: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  divider: { height: 1, backgroundColor: colors.borderLight },
});
