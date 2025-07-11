import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  servicesService, 
  serviceCategoriesService, 
  clientsService, 
  clientPricesService 
} from '@/lib/supabaseHelpers';

export function useServicesData() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientPrices, setClientPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingClientPrices, setEditingClientPrices] = useState(null);
  
  const [modalState, setModalState] = useState({
    service: false,
    category: false,
    clientPrice: false,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesData, categoriesData, clientsData] = await Promise.all([
        servicesService.getAll(),
        serviceCategoriesService.getAll(),
        clientsService.getAll()
      ]);

      const processedServices = (servicesData || []).map(service => ({
        id: service.id,
        nombre: service.name,
        descripcion: service.description,
        categoria: service.category?.name || 'Sin categoría',
        precioBase: service.base_price || 0,
        tiempoEstimado: service.estimated_days || 1,
        observaciones: service.notes || '',
        category_id: service.category_id,
        name: service.name,
        description: service.description,
        base_price: service.base_price,
        estimated_days: service.estimated_days,
        notes: service.notes
      }));

      const processedCategories = (categoriesData || []).map(category => ({
        id: category.id,
        nombre: category.name,
        descripcion: category.description,
        orden: category.display_order || 999,
        name: category.name,
        description: category.description,
        display_order: category.display_order
      }));

      setServices(processedServices);
      setCategories(processedCategories);
      setClients(clientsData || []);
      
      const pricesByClient = {};
      if (clientsData) {
        for (const client of clientsData) {
          try {
            const prices = await clientPricesService.getByClient(client.id);
            if (prices) {
              pricesByClient[client.id] = prices.reduce((acc, price) => {
                acc[price.service_id] = price.custom_price;
                return acc;
              }, {});
            }
          } catch (error) {
            console.warn(`Error loading prices for client ${client.id}:`, error);
          }
        }
      }
      setClientPrices(pricesByClient);

    } catch (error) {
      console.error('Error loading services data:', error);
      toast({ 
        title: "Error", 
        description: "No se pudieron cargar los datos de servicios.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openModal = (modal, data = null) => {
    if (modal === 'service') {
      const serviceData = data ? {
        id: data.id,
        name: data.name || data.nombre || '',
        description: data.description || data.descripcion || '',
        category_id: data.category_id || categories[0]?.id || null,
        estimated_days: data.estimated_days || data.tiempoEstimado || 1,
        base_price: data.base_price || data.precioBase || 0,
        notes: data.notes || data.observaciones || ''
      } : {
        name: '',
        description: '',
        category_id: categories[0]?.id || null,
        estimated_days: 1,
        base_price: 0,
        notes: ''
      };
      setEditingService(serviceData);
    }
    
    if (modal === 'category') {
      const categoryData = data ? {
        id: data.id,
        name: data.name || data.nombre || '',
        description: data.description || data.descripcion || '',
        display_order: data.display_order || data.orden || categories.length + 1
      } : {
        name: '',
        description: '',
        display_order: categories.length + 1
      };
      setEditingCategory(categoryData);
    }
    
    if (modal === 'clientPrice') setEditingClientPrices(data);
    setModalState(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal) => {
    setModalState(prev => ({ ...prev, [modal]: false }));
    setEditingService(null);
    setEditingCategory(null);
    setEditingClientPrices(null);
  };

  const handleSaveService = async () => {
    if (!editingService) return;
    
    try {
      const serviceData = {
        name: editingService.name,
        description: editingService.description,
        category_id: editingService.category_id,
        estimated_days: editingService.estimated_days,
        base_price: editingService.base_price,
        notes: editingService.notes
      };

      if (editingService.id) {
        await servicesService.update(editingService.id, serviceData);
        toast({ 
          title: "Servicio actualizado", 
          description: "El servicio ha sido actualizado correctamente." 
        });
      } else {
        await servicesService.create(serviceData);
        toast({ 
          title: "Servicio creado", 
          description: "El servicio ha sido creado correctamente." 
        });
      }
      
      loadData();
      closeModal('service');
    } catch (error) {
      console.error('Error saving service:', error);
      toast({ 
        title: "Error", 
        description: "No se pudo guardar el servicio.", 
        variant: "destructive" 
      });
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    
    try {
      const categoryData = {
        name: editingCategory.name,
        description: editingCategory.description,
        display_order: editingCategory.display_order
      };

      if (editingCategory.id) {
        await serviceCategoriesService.update(editingCategory.id, categoryData);
        toast({ 
          title: "Categoría actualizada", 
          description: "La categoría ha sido actualizada correctamente." 
        });
      } else {
        await serviceCategoriesService.create(categoryData);
        toast({ 
          title: "Categoría creada", 
          description: "La categoría ha sido creada correctamente." 
        });
      }
      
      loadData();
      closeModal('category');
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ 
        title: "Error", 
        description: "No se pudo guardar la categoría.", 
        variant: "destructive" 
      });
    }
  };

  const handleSaveClientPrices = async () => {
    if (!editingClientPrices) return;
    
    try {
      const { clientId, prices } = editingClientPrices;
      
      for (const serviceId in prices) {
        const custom_price = prices[serviceId];
        if (custom_price !== undefined && custom_price !== null && custom_price !== '') {
          await clientPricesService.upsert({ 
            client_id: clientId, 
            service_id: parseInt(serviceId), 
            custom_price: parseFloat(custom_price) 
          });
        }
      }
      
      loadData();
      closeModal('clientPrice');
      toast({ 
        title: "Precios actualizados", 
        description: "Los precios personalizados han sido guardados." 
      });
    } catch (error) {
      console.error('Error saving client prices:', error);
      toast({ 
        title: "Error", 
        description: "No se pudieron guardar los precios.", 
        variant: "destructive" 
      });
    }
  };

  const getClientPrice = useCallback((clientId, serviceId) => {
    const customPrice = clientPrices[clientId]?.[serviceId];
    if (customPrice !== undefined) return customPrice;
    
    const service = services.find(s => s.id === serviceId);
    return service?.base_price || service?.precioBase || 0;
  }, [clientPrices, services]);

  return {
    loading,
    services,
    categories,
    clients,
    clientPrices,
    modalState,
    editingService,
    setEditingService,
    editingCategory,
    setEditingCategory,
    editingClientPrices,
    setEditingClientPrices,
    openModal,
    closeModal,
    handleSaveService,
    handleSaveCategory,
    handleSaveClientPrices,
    getClientPrice,
  };
}