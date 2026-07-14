import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Vet = Database['public']['Tables']['veterinarians']['Row'] & { profile: any };
type Review = Database['public']['Tables']['reviews']['Row'] & { farmer: any };

export const vetService = {
  async getVets(region?: string, specialization?: string): Promise<Vet[]> {
    let query = supabase
      .from('veterinarians')
      .select('*, profiles(*)');

    if (region) query = query.eq('region', region);
    if (specialization) query = query.contains('specializations', [specialization]);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(v => ({
      ...v,
      profile: Array.isArray(v.profiles) ? v.profiles[0] : v.profiles
    }));
  },

  async getVetById(id: string): Promise<Vet> {
    const { data, error } = await supabase
      .from('veterinarians')
      .select('*, profiles(*)')
      .eq('profile_id', id)
      .single();

    if (error) throw error;
    return {
      ...data,
      profile: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
    };
  },

  async updateVetProfile(profileId: string, updates: any) {
    const { data, error } = await supabase
      .from('veterinarians')
      .update(updates)
      .eq('profile_id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSharedReports(vetId: string) {
    const { data, error } = await supabase
      .from('vet_shares')
      .select('*, assessments(*), profiles!vet_shares_farmer_id_fkey(*)')
      .eq('vet_id', vetId)
      .order('shared_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(s => ({
      ...s,
      farmer: Array.isArray(s.profiles) ? s.profiles[0] : s.profiles
    }));
  },

  async getReviews(vetId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles!reviews_farmer_id_fkey(*)')
      .eq('vet_id', vetId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(r => ({
      ...r,
      farmer: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
    }));
  },

  async getAvailability(vetId: string) {
    const { data, error } = await supabase
      .from('vet_availability')
      .select('*')
      .eq('vet_id', vetId);

    if (error) throw error;
    return data || [];
  },
};
