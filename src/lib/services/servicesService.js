import { supabase } from '@/lib/customSupabaseClient';

export const servicesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        category:service_categories!fk_services_category_id(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        category:service_categories!fk_services_category_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(serviceData) {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, serviceData) {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const serviceCategoriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(categoryData) {
    const { data, error } = await supabase
      .from('service_categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, categoryData) {
    const { data, error } = await supabase
      .from('service_categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};