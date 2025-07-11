import { supabase } from '@/lib/customSupabaseClient';

export const clientsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(clientData) {
    const { id, ...dataToInsert } = clientData;
    const { data, error } = await supabase
      .from('clients')
      .insert([dataToInsert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, clientData) {
    const { id: clientId, ...dataToUpdate } = clientData;
    const { data, error } = await supabase
      .from('clients')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const clientPricesService = {
  async getByClient(clientId) {
    const { data, error } = await supabase
      .from('client_prices')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) throw error;
    return data;
  },

  async upsert(priceData) {
    const { data, error } = await supabase
      .from('client_prices')
      .upsert([priceData], { 
        onConflict: 'client_id,service_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(clientId, serviceId) {
    const { error } = await supabase
      .from('client_prices')
      .delete()
      .eq('client_id', clientId)
      .eq('service_id', serviceId);
    
    if (error) throw error;
  }
};