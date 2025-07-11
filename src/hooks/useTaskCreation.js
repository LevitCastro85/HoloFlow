import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { resourcesService, tasksService, brandsService, clientsService, collaboratorsService } from '@/lib/supabaseHelpers';

export function useTaskCreation() {
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [resources, setResources] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [currentStep, setCurrentStep] = useState('type-selection');
  const [isLoading, setIsLoading] = useState(true);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clientsData, brandsData, resourcesData, collaboratorsData] = await Promise.all([
        clientsService.getAll(),
        brandsService.getAll(),
        resourcesService.getAll(),
        collaboratorsService.getAll()
      ]);
      setClients(clientsData || []);
      setBrands(brandsData || []);
      const approvedResources = (resourcesData || []).filter(r => r.status === 'approved');
      setResources(approvedResources);
      setCollaborators(collaboratorsData || []);
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos iniciales.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleTypeSelect = (taskType) => {
    if (!selectedBrand) {
      toast({
        title: "Selecciona una marca primero",
        description: "Debes elegir una marca para poder seleccionar un tipo de tarea.",
        variant: "destructive",
      });
      return;
    }
    setSelectedTaskType(taskType);
    setCurrentStep('form');
  };

  const handleTaskSave = async (taskData, editingId = null) => {
    try {
      let savedTask;
      if (editingId) {
        savedTask = await tasksService.update(editingId, taskData);
      } else {
        savedTask = await tasksService.create(taskData);
      }

      if (taskData.related_resource_id) {
        const resource = await resourcesService.getById(taskData.related_resource_id);
        if (resource) {
          await resourcesService.update(resource.id, {
            related_tasks: [...(resource.related_tasks || []), savedTask.id]
          });
        }
      }
      
      resetForm();
      toast({
        title: `¡Tarea ${editingId ? 'actualizada' : 'creada'}!`,
        description: `La tarea "${savedTask.title}" se guardó correctamente.`
      });
    } catch (error) {
      toast({ title: "Error al guardar la tarea", description: error.message, variant: "destructive" });
    }
  };

  const handleBulkTasksSave = async (tasksData) => {
    try {
      const creationPromises = tasksData.map(task => tasksService.create(task));
      const createdTasks = await Promise.all(creationPromises);
      
      resetForm();
      toast({
        title: "¡Tareas creadas exitosamente!",
        description: `${createdTasks.length} tareas creadas para la marca ${selectedBrand.name}.`
      });
    } catch (error) {
      toast({ title: "Error al crear tareas en lote", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setSelectedBrand(null);
    setSelectedTaskType(null);
    setCurrentStep('type-selection');
  };

  const getClientForBrand = useCallback((brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return clients.find(c => c.id === brand?.client_id);
  }, [brands, clients]);

  return {
    brands,
    clients,
    resources,
    collaborators,
    selectedBrand,
    selectedTaskType,
    currentStep,
    isLoading,
    handleBrandSelect,
    handleTypeSelect,
    handleTaskSave,
    handleBulkTasksSave,
    resetForm,
    getClientForBrand,
  };
}