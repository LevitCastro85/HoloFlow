import { supabase } from '@/lib/customSupabaseClient';

    export const contractsService = {
      async getAll() {
        const { data, error } = await supabase
          .from('contracts')
          .select(`
            *,
            client:clients!fk_contracts_client_id(id, name),
            service:services!fk_contracts_service_id(id, name)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      },

      async create(contractData) {
        const { data, error } = await supabase
          .from('contracts')
          .insert([contractData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },

      async update(id, contractData) {
        const { data, error } = await supabase
          .from('contracts')
          .update(contractData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },

      async delete(id) {
        const { error } = await supabase
          .from('contracts')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      }
    };