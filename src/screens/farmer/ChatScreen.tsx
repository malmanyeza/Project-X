import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../constants/theme';
import { ChatBubble, MessageComposer, Avatar } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chats';

export const ChatScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { user, profile } = useAuth();
  const { chatId: initialChatId, vetId, farmerId, recipientName, recipientAvatar, recipientPhone } = route.params;
  
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(initialChatId);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let subscription: any;

    const initChat = async () => {
      try {
        let currentChatId = initialChatId;

        if (!currentChatId && user && profile) {
          const targetFarmerId = profile.role === 'farmer' ? user.id : farmerId;
          const targetVetId = profile.role === 'vet' ? user.id : vetId;

          if (targetFarmerId && targetVetId) {
            const chat = await chatService.getOrCreateChat(targetFarmerId, targetVetId);
            currentChatId = chat.id;
            setChatId(chat.id);
          }
        }

        if (currentChatId) {
          const history = await chatService.getMessages(currentChatId);
          setMessages(history);

          subscription = chatService.subscribeToMessages(currentChatId, (newMsg) => {
            setMessages((prev) => {
              // 1. If we already have this exact ID, ignore it
              if (prev.some(m => m.id === newMsg.id)) return prev;
              
              // 2. If it's our own message, find the "temp" version and replace it
              if (newMsg.sender_id === user?.id) {
                const tempIndex = prev.findIndex(m => m.temp && m.message === newMsg.message);
                if (tempIndex !== -1) {
                  const updated = [...prev];
                  updated[tempIndex] = newMsg; // Replace temp with real server message
                  return updated;
                }
              }
              
              // 3. If it's from the other person, or we missed the temp, just add it
              return [...prev, newMsg];
            });
          });
        }
      } catch (error) {
        console.error('Chat init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [initialChatId, vetId, farmerId, user, profile?.role]);

  const handleSend = async (text: string) => {
    if (!chatId || !user) return;
    
    const messageText = text.trim();
    if (!messageText) return;

    try {
      // Optimistically add message with a 'temp' flag
      const tempId = `temp-${Date.now()}`;
      const newMsg = {
        id: tempId,
        message: messageText,
        sender_id: user.id,
        created_at: new Date().toISOString(),
        temp: true
      };
      setMessages((prev) => [...prev, newMsg]);

      await chatService.sendMessage(chatId, user.id, messageText);
    } catch (error) {
      console.error('Send error:', error);
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter(m => !m.temp));
      Alert.alert('Error', 'Message failed to send. Please try again.');
    }
  };

  const handleCall = () => {
    if (recipientPhone) {
      Linking.openURL(`tel:${recipientPhone}`);
    } else {
      Alert.alert('Phone Number Not Available', 'This user has not provided a phone number.');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Avatar size={36} url={recipientAvatar} />
        <View>
          <Text style={styles.headerName}>{recipientName || 'Conversation'}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleCall}>
        <Ionicons name="call-outline" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <ChatBubble 
              message={item.message} 
              isUser={item.sender_id === user?.id} 
              timestamp={new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <MessageComposer onSend={handleSend} placeholder="Type a message..." />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1, marginLeft: spacing.md },
  headerName: { ...typography.h4, fontSize: 15 },
  headerStatus: { ...typography.caption, color: colors.success },
  messageList: { 
    paddingHorizontal: spacing.lg, 
    paddingTop: spacing.lg, 
    paddingBottom: 100, 
    gap: spacing.xs 
  },
});
