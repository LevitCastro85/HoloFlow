import { supabase } from '@/lib/customSupabaseClient';

const TABLE_NAME = 'tasks';
const SELECT_QUERY = `
  *,
  brand:brands!fk_tasks_brand_id(
    id,
    name,
    client:clients!fk_brands_client_id(name)
  ),
  assigned_collaborator:collaborators!fk_tasks_assigned_to(id, name, email),
  service:services!fk_tasks_service_id(id, name, description),
  related_resource:resources!fk_tasks_related_resource_id(id, name, file_url)
`;

export const taskOperations = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(SELECT_QUERY)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error in taskOperations.getAll:', error);
      throw error;
    }
    return data || [];
  },

  async getByBrandId(brandId) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(SELECT_QUERY)
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error in taskOperations.getByBrandId for brand ${brandId}:`, error);
      throw error;
    }
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(SELECT_QUERY)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(taskData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([taskData])
      .select(SELECT_QUERY)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, taskData) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(taskData)
      .eq('id', id)
      .select(SELECT_QUERY)
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};