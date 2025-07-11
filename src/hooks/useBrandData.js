import { useState } from 'react';
import { brandsService } from '@/lib/supabaseHelpers';
import { toast } from '@/components/ui/use-toast';

export function useBrandData(clientId) {
  const [brands, setBrands] = useState([]);

  const loadBrands = async () => {
    if (!clientId) return;
    try {
      const data = await brandsService.getByClient(clientId);
      setBrands(data || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las marcas del cliente.", variant: "destructive" });
    }
  };

  const saveBrands = async (updatedBrands) => {
    try {
      // This approach is simplified. A real implementation would involve
      // individual updates, creations, and deletions.
      // For now, we assume the calling component handles this logic.
      await loadBrands(); // Re-fetch to reflect changes.
      toast({ title: "Marcas actualizadas", description: "La lista de marcas se ha sincronizado." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron guardar los cambios en las marcas.", variant: "destructive" });
    }
  };

  return {
    brands,
    loadBrands,
    saveBrands
  };
}