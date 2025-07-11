import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/lib/permissions';

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (user) {
      setRole(ROLES.DIRECTOR);
      setLoading(false);
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  return { role, loading };
}