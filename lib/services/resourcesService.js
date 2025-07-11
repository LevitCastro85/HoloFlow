import { supabase } from '@/lib/customSupabaseClient';

export const resourcesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        task:tasks!resources_task_id_fkey(
          id, 
          title,
          brand:brands(id, name)
        ),
        uploaded_by_collaborator:collaborators!resources_uploaded_by_fkey(id, name)
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
        task:tasks!resources_task_id_fkey(
          id, 
          title,
          brand:brands(id, name)
        ),
        uploaded_by_collaborator:collaborators!resources_uploaded_by_fkey(id, name)
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

export const resourceReviewHistoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('resource_review_history')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getByResource(resourceId) {
    const { data, error } = await supabase
      .from('resource_review_history')
      .select('*')
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(historyData) {
    const { data, error } = await supabase
      .from('resource_review_history')
      .insert([historyData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};