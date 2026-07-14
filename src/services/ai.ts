import { supabase } from '../lib/supabase';

export interface AIResponse {
  message: string;
  is_complete: boolean;
  assessment?: {
    likely_condition: string;
    urgency_level: 'low' | 'medium' | 'high' | 'critical';
    ai_summary: string;
    certainty_level: string;
    possible_causes: string[];
    suggested_next_steps: string[];
    prevention_tips: string[];
  };
}

export const aiService = {
  /**
   * Sends a message to the AI assistant
   */
  async sendMessage(
    symptoms: string, 
    history: { role: string; content: string }[], 
    assessmentId: string, 
    species: string = 'Cattle'
  ): Promise<AIResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const { data, error } = await supabase.functions.invoke('ai-assistant', {
      body: { symptoms, history, assessment_id: assessmentId, species },
      headers,
    });

    if (error) {
      console.error('AI Service Error:', error);
      throw error;
    }

    return data;
  },

  /**
   * Helper to format chat history for the AI
   */
  formatHistory(messages: any[]) {
    return messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role,
        content: m.content || m.message || '',
      }));
  }
};
