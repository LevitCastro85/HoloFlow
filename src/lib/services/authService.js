import { supabase } from '@/lib/customSupabaseClient';

    export const authService = {
      async signInWithPassword(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error };
      },
      
      async signUpNewUser(name, email, password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });

        return { data, error };
      },
      
      async verifyOtp(token, type) {
        const { data, error } = await supabase.auth.verifyOtp({
          token,
          type,
        });
        return { data, error };
      },

      async updateUserPassword(password) {
        const { data, error } = await supabase.auth.updateUser({ password });
        return { data, error };
      },

      async adminUpdateUserPassword(userId, password) {
        const { data, error } = await supabase.functions.invoke('update-user-password', {
          body: { userId, password },
        });

        if (error) {
          const detailedError = error.context?.json ? await error.context.json().catch(() => null) : null;
          const errorMessage = detailedError?.error || error.message;
          return { data: null, error: { message: errorMessage } };
        }
        
        return { data, error };
      },

      async createUserWithPassword(email, password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { data, error };
      },

      async sendPasswordReset(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        return { data, error };
      },

      async getSession() {
        return supabase.auth.getSession();
      },

      async setSession(session) {
        const { data, error } = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        });
        return { data, error };
      },

      async cleanDatabase() {
        const { data, error } = await supabase.functions.invoke('clean-database');

        if (error) {
          const detailedError = error.context?.json ? await error.context.json().catch(() => null) : null;
          const errorMessage = detailedError?.error || error.message;
          return { data: null, error: { message: errorMessage } };
        }
        
        return { data, error };
      },
    };