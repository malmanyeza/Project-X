import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Assessment = Database['public']['Tables']['assessments']['Row'];
type AssessmentInsert = Database['public']['Tables']['assessments']['Insert'];
type Message = Database['public']['Tables']['assessment_messages']['Row'];

export const assessmentService = {
  async createAssessment(farmerId: string, input: string, animalId?: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        farmer_id: farmerId,
        raw_farmer_input: input,
        animal_id: animalId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAssessments(farmerId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*, animals(*)')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAssessmentById(id: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .select('*, animals(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages(assessmentId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('assessment_messages')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async sendMessage(assessmentId: string, role: 'user' | 'assistant', message: string, metadata?: any) {
    const { data, error } = await supabase
      .from('assessment_messages')
      .insert({
        assessment_id: assessmentId,
        role,
        message,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async shareWithVet(assessmentId: string, vetId: string, farmerId: string) {
    const { data, error } = await supabase
      .from('vet_shares')
      .insert({
        assessment_id: assessmentId,
        vet_id: vetId,
        farmer_id: farmerId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
