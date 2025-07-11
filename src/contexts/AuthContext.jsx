import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext(undefined);

    export const AuthProvider = ({ children }) => {
      const { toast } = useToast();

      const [user, setUser] = useState(null);
      const [session, setSession] = useState(null);
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [loadingProfile, setLoadingProfile] = useState(true);

      const loadUserProfile = useCallback(async (user) => {
        if (!user) return null;

        let { data: collaboratorProfile, error: selectError } = await supabase
            .from('collaborators')
            .select('*')
            .eq('user_id', user.id)
            .single();
        
        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }

        if (!collaboratorProfile) {
            await new Promise(res => setTimeout(res, 1000));
            const { data: retryData, error: retryError } = await supabase
                .from('collaborators')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (retryError && retryError.code !== 'PGRST116') {
                throw retryError;
            }
            collaboratorProfile = retryData;
        }

        if (!collaboratorProfile) {
            console.warn('Collaborator profile not found. Attempting to create one.');
            const { data: newProfile, error: createError } = await supabase
                .from('collaborators')
                .insert({
                    user_id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email,
                    status: 'pending_profile_completion',
                    is_active: true,
                    has_system_access: true,
                    role: 'freelance',
                    availability: 'disponible',
                    rating: 5.0,
                    notes: 'Perfil autogenerado por sistema debido a ausencia.'
                })
                .select()
                .single();

            if (createError) {
                console.error('Failed to create self-healing profile:', createError);
                throw new Error(`Failed to create self-healing profile: ${createError.message}`);
            }
            
            console.log('Successfully created self-healing profile.');
            collaboratorProfile = newProfile;
        }

        return collaboratorProfile;
      }, []);
      
      const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          toast({
            variant: "destructive",
            title: "Sign out Failed",
            description: error.message || "Something went wrong",
          });
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
        return { error };
      }, [toast]);

      const handleSession = useCallback(async (newSession) => {
        console.log('[Auth] handleSession invoked:', newSession);
        if (newSession?.access_token === session?.access_token) {
          console.log('[Auth] Session token unchanged');
          if (!newSession) {
            setLoading(false);
            setLoadingProfile(false);
          }
          return;
        }

        if (!newSession) {
          console.log('[Auth] No active session');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          setLoadingProfile(false);
          return;
        }

        if (newSession) {
          const { error } = await supabase.auth.setSession({
            access_token: newSession.access_token,
            refresh_token: newSession.refresh_token,
          });

          if (error) {
            console.error("Critical session error:", error);
            toast({
                variant: "destructive",
                title: "Error de Sesión Crítico",
                description: "No se pudo establecer la sesión de autenticación. Se cerrará la sesión.",
            });
            await signOut();
            return;
          }
        }
        
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);

        if (!currentUser) {
            setProfile(null);
            setLoading(false);
            setLoadingProfile(false);
            return;
        }
        
        setLoadingProfile(true);
        try {
            const profileData = await loadUserProfile(currentUser);
            setProfile(profileData);
        } catch (error) {
            console.error("Error during profile loading:", error);
            toast({
                variant: "destructive",
                title: "Error de autenticación",
                description: "Hubo un problema al cargar tu perfil. Se cerrará la sesión.",
            });
            await signOut();
        } finally {
            setLoading(false);
            setLoadingProfile(false);
        }
      }, [session, loadUserProfile, signOut, toast]);

      const refreshProfile = useCallback(async () => {
        if (!user) {
            setProfile(null);
            return null;
        }
        setLoadingProfile(true);
        try {
            const profileData = await loadUserProfile(user);
            setProfile(profileData);
            return profileData;
        } catch (error) {
            console.error("Failed to refresh profile:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo refrescar el perfil. Se cerrará la sesión." });
            await signOut();
            return null;
        } finally {
            setLoadingProfile(false);
        }
      }, [user, loadUserProfile, signOut, toast]);

      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('[Auth] Initial session:', session);
          handleSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('[Auth] Auth state change:', event, session);
            handleSession(session);
          }
        );

        return () => subscription.unsubscribe();
      }, [handleSession]);
      
      const value = useMemo(() => ({
        user,
        session,
        profile,
        loading,
        loadingProfile,
        signOut,
        refreshProfile,
      }), [user, session, profile, loading, loadingProfile, signOut, refreshProfile]);

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };