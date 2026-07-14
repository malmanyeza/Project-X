import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type Animal = Database['public']['Tables']['animals']['Row'];
type AnimalInsert = Database['public']['Tables']['animals']['Insert'];

export const animalService = {
  async getAnimals(farmerId: string): Promise<Animal[]> {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createAnimal(animal: AnimalInsert) {
    const { data, error } = await supabase
      .from('animals')
      .insert(animal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAnimal(id: string, updates: Partial<Animal>) {
    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAnimal(id: string) {
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
