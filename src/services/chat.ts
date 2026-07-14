import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Chat = Database['public']['Tables']['chats']['Row'] & { other_user: any };
type Message = Database['public']['Tables']['chat_messages']['Row'];

export const chatService = {
  async getChats(userId: string, role: 'farmer' | 'vet'): Promise<Chat[]> {
    const filterField = role === 'farmer' ? 'farmer_id' : 'vet_id';
    const otherUserField = role === 'farmer' ? 'vet_id' : 'farmer_id';

    const { data, error } = await supabase
      .from('chats')
      .select(`*, profiles!chats_${otherUserField}_fkey(*)`)
      .eq(filterField, userId)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(c => ({
      ...c,
      other_user: c.profiles
    }));
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

  async sendMessage(chatId: string, senderId: string, message: string, type: 'text' | 'assessment_share' | 'image' = 'text', assessmentId?: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        message,
        message_type: type,
        related_assessment_id: assessmentId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createChat(farmerId: string, vetId: string) {
    const { data, error } = await supabase
      .from('chats')
      .upsert({ farmer_id: farmerId, vet_id: vetId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToMessages(chatId: string, onNewMessage: (message: Message) => void) {
    return supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        onNewMessage(payload.new as Message);
      })
      .subscribe();
  },
};
