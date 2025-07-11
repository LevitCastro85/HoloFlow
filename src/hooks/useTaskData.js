import { useState, useCallback } from 'react';
import { collaboratorsService, servicesService, clientsService } from '@/lib/supabaseHelpers';

export function useTaskData(brand, client) {
  const [collaborators, setCollaborators] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientPrices, setClientPrices] = useState({});
  const [taskLimitInfo, setTaskLimitInfo] = useState({ current: 0, limit: 50, canCreate: true });

  const loadData = useCallback(async () => {
    try {
      const [collaboratorsData, servicesData, clientsData] = await Promise.all([
        collaboratorsService.getAll(),
        servicesService.getAll(),
        clientsService.getAll()
      ]);

      const activeCollaborators = (collaboratorsData || []).filter(c => 
        c.availability !== 'no disponible'
      );
      
      setCollaborators(activeCollaborators);
      setServices(servicesData || []);
      setClients(clientsData || []);

    } catch (error) {
      console.error('Error loading task data:', error);
      setCollaborators([]);
      setServices([]);
      setClients([]);
    }
  }, []);

  const checkTaskLimits = useCallback(() => {
    const brandPlan = getBrandPlan(brand?.id);
    
    setTaskLimitInfo({
      current: 0,
      limit: brandPlan.taskLimit,
      canCreate: true
    });
  }, [brand?.id]);

  const getBrandPlan = (brandId) => {
    const plans = {
      basic: { name: 'Básico', taskLimit: 50 },
      premium: { name: 'Premium', taskLimit: 100 },
      enterprise: { name: 'Enterprise', taskLimit: 250 }
    };
    
    return plans.basic;
  };

  const getServicePrice = useCallback((serviceId) => {
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return 0;
    
    if (clientPrices[client?.id]?.[service.id] !== undefined) {
      return clientPrices[client.id][service.id];
    }
    
    return service.base_price || 0;
  }, [services, clientPrices, client?.id]);

  return {
    collaborators,
    services,
    clients,
    clientPrices,
    taskLimitInfo,
    loadData,
    checkTaskLimits,
    getServicePrice
  };
}