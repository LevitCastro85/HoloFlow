import { useState } from 'react';
import { brandsService, clientsService } from '@/lib/supabaseHelpers';
import { toast } from '@/components/ui/use-toast';

export function useBrandHubData() {
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);

  const loadData = async () => {
    try {
      const [clientsData, brandsData] = await Promise.all([
        clientsService.getAll(),
        brandsService.getAll()
      ]);
      setClients(clientsData || []);
      setBrands(brandsData || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos del Brand Hub.", variant: "destructive" });
    }
  };

  const saveBrand = async (brandData) => {
    try {
      if (brandData.id) {
        await brandsService.update(brandData.id, brandData);
      } else {
        await brandsService.create(brandData);
      }
      loadData(); // Recargar todos los datos para reflejar los cambios
    } catch (error) {
      toast({ title: "Error al guardar la marca", description: error.message, variant: "destructive" });
    }
  };

  return {
    brands,
    clients,
    loadData,
    saveBrand
  };
}