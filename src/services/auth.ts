import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Role = 'farmer' | 'vet';

export const authService = {
  async signUp(email: string, password: string, fullName: string, role: Role, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed');

    return data.user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getProfile(userId: string): Promise<(Profile & { is_vet_complete?: boolean }) | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, veterinarians(id)')
      .eq('id', userId)
      .single();
    
    if (error) return null;

    // Robust check for vet completeness
    const hasVetRecord = Array.isArray(data.veterinarians) 
      ? data.veterinarians.length > 0 
      : !!data.veterinarians;

    const is_vet_complete = data.role === 'vet' ? hasVetRecord : true;

    return {
      ...data,
      is_vet_complete
    };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
