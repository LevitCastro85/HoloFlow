import { supabase } from '@/lib/customSupabaseClient';

export const resourcesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        brand:brands!fk_resources_brand_id(id, name),
        task:tasks!fk_resources_task_id(
          id, 
          title,
          brand:brands!fk_tasks_brand_id(id, name)
        ),
        uploaded_by:collaborators!fk_resources_uploaded_by(id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        brand:brands!fk_resources_brand_id(id, name),
        task:tasks!fk_resources_task_id(
          id, 
          title,
          brand:brands!fk_tasks_brand_id(id, name)
        ),
        uploaded_by:collaborators!fk_resources_uploaded_by(id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(resourceData) {
    const { data, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, resourceData) {
    const { data, error } = await supabase
      .from('resources')
      .update(resourceData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};