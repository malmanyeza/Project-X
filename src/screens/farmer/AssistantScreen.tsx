import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { ChatBubble, MessageComposer } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { aiService } from '../../services/ai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thought_process?: string;
  timestamp: string;
  assessmentData?: any;
}

export const AssistantScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I am Project X, your AI health assistant. Please describe the symptoms your livestock is experiencing, and I'll help with a preliminary assessment.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<'gathering' | 'analyzing' | 'finalizing'>('gathering');
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const prevUserRef = useRef(user);

  React.useEffect(() => {
    if (user && !prevUserRef.current) {
      setMessages((prev) => {
        const signInPromptIndex = prev.findIndex(m => m.assessmentData?.showSignInPrompt);
        if (signInPromptIndex !== -1) {
          const updatedMessages = prev.filter((_, idx) => idx !== signInPromptIndex);
          
          let lastUserMsgIndex = -1;
          for (let i = signInPromptIndex - 1; i >= 0; i--) {
            if (updatedMessages[i].role === 'user') {
              lastUserMsgIndex = i;
              break;
            }
          }

          if (lastUserMsgIndex !== -1) {
            const lastUserMsg = updatedMessages[lastUserMsgIndex];
            const historyUntilThen = updatedMessages.slice(0, lastUserMsgIndex);
            
            setTimeout(() => {
              processLoggedInMessage(lastUserMsg.content, historyUntilThen, user);
            }, 100);
          }
          return updatedMessages;
        }
        return prev;
      });
    }
    prevUserRef.current = user;
  }, [user]);

  const getOrCreateAssessment = async (initialText: string, currentUserOverride?: any) => {
    const activeUser = currentUserOverride || user;
    if (!activeUser) return 'guest'; // Bypass Supabase record creation for guest users
    if (assessmentId) return assessmentId;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = activeUser || session?.user;
      if (!currentUser) return 'guest'; // Safety fallback

      const { data, error } = await supabase
        .from('assessments')
        .insert({
          farmer_id: currentUser.id,
          raw_farmer_input: initialText,
          ai_summary: 'Initializing...',
          likely_condition: 'Analyzing...',
          urgency_level: 'low',
          is_saved: false
        })
        .select()
        .single();

      if (error) throw error;
      setAssessmentId(data.id);
      return data.id;
    } catch (err) {
      console.error('Error creating assessment:', err);
      return 'guest'; // Graceful fallback
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Check if the user is in guest mode (not signed in) and has already sent at least 1 message
    const userMsgCount = messages.filter(m => m.role === 'user').length;
    if (!user && userMsgCount >= 1) {
      setLoading(true);
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "You now need to log in to continue communicating with the assistant.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          assessmentData: { showSignInPrompt: true }
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
      }, 800);
      return;
    }

    setLoading(true);

    try {
      const id = await getOrCreateAssessment(text);
      const history = aiService.formatHistory([...messages, userMsg]);
      const response = await aiService.sendMessage(text, history, id, 'Livestock');

      const meta = response.metadata || {};
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content || "I've processed your information.",
        thought_process: meta.thought_process,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assessmentData: meta,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (meta.stage === 'assessment') {
        setCurrentStage('finalizing');
        setTimeout(() => {
          navigation.replace('AssessmentResult', { assessmentId: id, assessment: meta });
        }, 2000);
      } else {
        setCurrentStage('analyzing');
      }
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setLoading(false);
    }
  }, [messages, navigation, assessmentId, user]);

  const processLoggedInMessage = async (text: string, historyUntilThen: Message[], loggedInUser: any) => {
    setLoading(true);
    try {
      const id = await getOrCreateAssessment(text, loggedInUser);
      const history = aiService.formatHistory([...historyUntilThen, { role: 'user', content: text }]);
      const response = await aiService.sendMessage(text, history, id, 'Livestock');

      const meta = response.metadata || {};
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content || "I've processed your information.",
        thought_process: meta.thought_process,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        assessmentData: meta,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (meta.stage === 'assessment') {
        setCurrentStage('finalizing');
        setTimeout(() => {
          navigation.replace('AssessmentResult', { assessmentId: id, assessment: meta });
        }, 2000);
      } else {
        setCurrentStage('analyzing');
      }
    } catch (err) {
      console.error('AI Error processing logged-in message:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageWrapper}>
      {item.thought_process && item.role === 'assistant' && (
        <View style={styles.thoughtContainer}>
          <Ionicons name="bulb-outline" size={14} color={colors.primary} />
          <Text style={styles.thoughtText}>{item.thought_process}</Text>
        </View>
      )}
      <ChatBubble
        message={item.content}
        isUser={item.role === 'user'}
        timestamp={item.timestamp}
        onAction={
          item.assessmentData?.likely_condition
            ? () => {
                navigation.navigate('AssessmentResult', {
                  assessmentId: assessmentId,
                  assessment: item.assessmentData,
                });
              }
            : item.assessmentData?.showSignInPrompt
            ? () => {
                navigation.navigate('Auth');
              }
            : undefined
        }
        actionLabel={
          item.assessmentData?.likely_condition
            ? 'View Current Report'
            : item.assessmentData?.showSignInPrompt
            ? 'Sign In / Register'
            : undefined
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.aiInfo}>
          <View style={styles.avatar}>
            <Ionicons name="chatbubble-ellipses" size={22} color={colors.textOnPrimary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Project X Assistant</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: loading ? colors.warning : colors.success }]} />
              <Text style={styles.statusText}>{loading ? 'Thinking...' : 'Active'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.stageIndicator}>
        <View style={[styles.stageStep, currentStage !== 'gathering' && styles.stageActive]}>
          <Ionicons name="chatbubbles" size={16} color={currentStage !== 'gathering' ? colors.textOnPrimary : colors.textSecondary} />
        </View>
        <View style={[styles.stageLine, currentStage === 'finalizing' && styles.lineActive]} />
        <View style={[styles.stageStep, currentStage === 'analyzing' && styles.stageActive, currentStage === 'finalizing' && styles.stageActive]}>
          <Ionicons name="analytics" size={16} color={currentStage !== 'gathering' ? colors.textOnPrimary : colors.textSecondary} />
        </View>
        <View style={[styles.stageLine, currentStage === 'finalizing' && styles.lineActive]} />
        <View style={[styles.stageStep, currentStage === 'finalizing' && styles.stageActive]}>
          <Ionicons name="checkmark-done" size={16} color={currentStage === 'finalizing' ? colors.textOnPrimary : colors.textSecondary} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? (
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.typingText}>Analyzing health data...</Text>
            </View>
          ) : null}
        />

        <MessageComposer
          onSend={sendMessage}
          placeholder="e.g., My cow isn't eating and has a fever..."
          disabled={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md, backgroundColor: colors.surface, gap: spacing.md,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  aiInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { ...typography.caption, color: colors.textSecondary },
  stageIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  stageStep: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  stageActive: { backgroundColor: colors.primary },
  stageLine: { width: 40, height: 2, backgroundColor: colors.borderLight },
  lineActive: { backgroundColor: colors.primary },
  chatArea: { flex: 1 },
  messageList: { 
    paddingHorizontal: spacing.xl, 
    paddingTop: spacing.xl, 
    paddingBottom: 100, 
    gap: spacing.md 
  },
  messageWrapper: { gap: spacing.xs },
  thoughtContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.primary + '10', paddingHorizontal: spacing.sm,
    paddingVertical: 4, borderRadius: borderRadius.sm, alignSelf: 'flex-start',
    marginLeft: spacing.lg,
  },
  thoughtText: { ...typography.caption, color: colors.primary, fontStyle: 'italic' },
  typingContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  typingText: { ...typography.caption, color: colors.textSecondary },
});
