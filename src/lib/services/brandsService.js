import { supabase } from '@/lib/customSupabaseClient';

export const brandsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        client:clients!fk_brands_client_id(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByClient(clientId) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        client:clients!fk_brands_client_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(brandData) {
    const { data, error } = await supabase
      .from('brands')
      .insert([brandData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, brandData) {
    const { client, ...restOfData } = brandData;
    const { data, error } = await supabase
      .from('brands')
      .update(restOfData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};