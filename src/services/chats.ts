import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Chat = Database['public']['Tables']['chats']['Row'] & {
  farmer?: any;
  vet?: any;
};

type Message = Database['public']['Tables']['chat_messages']['Row'];

export const chatService = {
  async getChats(userId: string, role: 'farmer' | 'vet'): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        farmer:profiles!chats_farmer_id_fkey(*),
        vet:profiles!chats_vet_id_fkey(*)
      `)
      .or(`farmer_id.eq.${userId},vet_id.eq.${userId}`)
      .not('last_message_at', 'is', null)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(chat => ({
      ...chat,
      farmer: Array.isArray(chat.farmer) ? chat.farmer[0] : chat.farmer,
      vet: Array.isArray(chat.vet) ? chat.vet[0] : chat.vet,
    }));
  },

  async getOrCreateChat(farmerId: string, vetId: string): Promise<Chat> {
    const { data: existingChat } = await supabase
      .from('chats')
      .select('*')
      .eq('farmer_id', farmerId)
      .eq('vet_id', vetId)
      .single();

    if (existingChat) return existingChat;

    const { data: newChat, error: createError } = await supabase
      .from('chats')
      .insert({
        farmer_id: farmerId,
        vet_id: vetId,
        // We leave last_message_at as null initially
      })
      .select()
      .single();

    if (createError) throw createError;
    return newChat;
  },

  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(chatId: string, senderId: string, message: string, relatedAssessmentId?: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        message,
        related_assessment_id: relatedAssessmentId,
        message_type: 'text'
      })
      .select()
      .single();

    if (error) throw error;

    // Update last_message_at in chats table
    await supabase
      .from('chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatId);

    return data;
  },

  subscribeToMessages(chatId: string, onMessage: (message: Message) => void) {
    // Using a more unique channel name to avoid conflicts
    const channelId = `chat_room_${chatId}_${Math.random().toString(36).substring(7)}`;
    
    return supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          onMessage(payload.new as Message);
        }
      )
      .subscribe();
  },
};
