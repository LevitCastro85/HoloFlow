import { supabase } from '@/lib/customSupabaseClient';

export const storageService = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      return { data: null, error, publicURL: null };
    }

    const { data: publicUrlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);

    return { data, error: null, publicURL: publicUrlData.publicUrl };
  },

  async deleteFile(bucket, path) {
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .remove([path]);
    
    return { data, error };
  }
};