import { supabase } from '@/lib/customSupabaseClient';

    export const collaboratorsService = {
      async getAll(includeInactive = false) {
        let query = supabase
          .from('collaborators')
          .select('*')
          .order('created_at', { ascending: false });

        if (!includeInactive) {
          query = query.eq('is_active', true);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
      },

      async getById(id) {
        const { data, error } = await supabase
          .from('collaborators')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      },

      async create(collaboratorData) {
        const { data, error } = await supabase.functions.invoke('invite-collaborator', {
          body: { collaboratorData },
        });

        if (error) {
          const functionError = await error.context.json().catch(() => ({ error: error.message }));
          throw new Error(functionError.error || error.message);
        }

        return data;
      },

      async createProfile(profileData) {
        const { data, error } = await supabase
          .from('collaborators')
          .insert(profileData)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },

      async update(id, collaboratorData) {
        const { data, error } = await supabase
          .from('collaborators')
          .update(collaboratorData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },

      async updateCurrentUserProfile(collaboratorData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('collaborators')
          .update(collaboratorData)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
        return data;
      },

      async reject(collaboratorId) {
         const { data, error } = await supabase.functions.invoke('reject-collaborator', {
          body: { collaboratorId },
        });

        if (error) {
          const functionError = await error.context.json().catch(() => ({ error: error.message }));
          throw new Error(functionError.error || error.message);
        }

        return data;
      },

      async delete(id) {
        const { error } = await supabase
          .from('collaborators')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      },

      async sendPasswordReset(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}`,
        });
        if (error) throw error;
      }
    };