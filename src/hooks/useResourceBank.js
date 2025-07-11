import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { resourcesService, tasksService } from '@/lib/supabaseHelpers';
import { resourceStatusLabels } from '@/lib/resourceConstants';
import { useAuth } from '@/contexts/AuthContext';

export function useResourceBank() {
  const { profile } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    marca: '',
    tipo: '',
    categoria: '',
    status: ''
  });
  const [activeTab, setActiveTab] = useState('table');
  const [modalState, setModalState] = useState({ view: null, resource: null });

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await resourcesService.getAll();
      const mappedData = (data || []).map(resource => ({
        ...resource,
        id: resource.id,
        nombre: resource.name || resource.file_name || 'Sin nombre',
        descripcion: resource.description || '',
        tipo: resource.file_type || 'unknown',
        categoria: resource.category || 'general',
        marca: resource.brand?.name || resource.task?.brand?.name || 'Sin marca',
        url: resource.file_url || null,
        tamaño: formatFileSize(resource.size),
        fechaSubida: resource.upload_date || resource.created_at,
        tags: resource.tags || [],
        status: resource.status || resource.approval_status || 'pendiente-revision',
        taskTitle: resource.task?.title || resource.taskTitle || '',
        taskId: resource.task?.id || resource.task_id || null,
        submittedBy: resource.submitted_by || resource.uploaded_by_collaborator?.name || 'Sistema',
        reviewedAt: resource.reviewed_at,
      }));
      setResources(mappedData);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast({
        title: "Error al cargar recursos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const searchSource = `${resource.nombre || ''} ${resource.descripcion || ''} ${resource.tags ? resource.tags.join(' ') : ''}`.toLowerCase();
      const matchesSearch = searchSource.includes(searchTerm.toLowerCase());
      
      const matchesMarca = !filters.marca || resource.marca === filters.marca;
      const matchesTipo = !filters.tipo || resource.tipo === filters.tipo;
      const matchesCategoria = !filters.categoria || resource.categoria === filters.categoria;
      const matchesStatus = !filters.status || resource.status === filters.status;
      
      return matchesSearch && matchesMarca && matchesTipo && matchesCategoria && matchesStatus;
    });
  }, [resources, searchTerm, filters]);

  const uniqueValues = useMemo(() => {
    const marcas = [...new Set(resources.map(r => r.marca).filter(Boolean))];
    const tipos = [...new Set(resources.map(r => r.tipo).filter(Boolean))];
    const categorias = [...new Set(resources.map(r => r.categoria).filter(Boolean))];
    const statuses = [...new Set(resources.map(r => r.status).filter(Boolean))];
    return { marcas, tipos, categorias, statuses };
  }, [resources]);

  const handleCloseModals = () => setModalState({ view: null, resource: null });

  const handleResourceUpload = async (newResourcesData) => {
    if (!profile?.id) {
       toast({
        title: "Error de autenticación",
        description: "No se encontró tu perfil de colaborador. No se puede subir.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resourcesWithUploader = newResourcesData.map(res => ({
        ...res,
        uploaded_by: profile.id,
        submitted_by: profile.name,
      }));

      const createdResources = await Promise.all(
        resourcesWithUploader.map(res => resourcesService.create(res))
      );
      loadResources();
      toast({
        title: "Recursos subidos exitosamente",
        description: `${createdResources.length} recurso(s) agregado(s). Estado: Pendiente de aprobación`
      });
    } catch (error) {
      toast({
        title: "Error al subir recursos",
        description: error.message,
        variant: "destructive",
      });
    }
    handleCloseModals();
  };

  const handleStatusChange = async (resourceId, newStatus, observations) => {
    if (!profile) {
      toast({ title: "No autorizado", description: "Perfil no encontrado.", variant: "destructive" });
      return;
    }
    
    try {
      const originalResource = resources.find(r => r.id === resourceId);
      const reviewerName = profile.name;

      const updateData = {
        status: newStatus,
        approval_status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerName,
        review_notes: observations
      };
      
      await resourcesService.update(resourceId, updateData);
      
      if (['necesita-cambios', 'rechazado'].includes(newStatus)) {
        await createReviewTask(originalResource, observations, newStatus);
      }
      
      toast({
        title: "Estado actualizado",
        description: `El recurso "${originalResource.nombre}" ahora está ${resourceStatusLabels[newStatus]}.`
      });
      loadResources();
    } catch (error) {
      toast({
        title: "Error al actualizar estado",
        description: error.message,
        variant: "destructive"
      });
    }
    handleCloseModals();
  };
  
  const createReviewTask = async (resource, observations, action) => {
    const taskTitle = `${action === 'rechazado' ? 'Corrección' : 'Revisión'} requerida: ${resource.nombre}`;
    const taskDescription = `Se requiere tu atención en el recurso "${resource.nombre}".\n\n**Observaciones:**\n${observations}`;
    
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      brand_id: resource.brand_id || 1, 
      status: 'requiere-atencion',
      priority: 'urgente',
      assigned_to: resource.uploaded_by,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      related_resource_id: resource.id,
      notes: `Tarea generada automáticamente por revisión de recurso.`,
    };

    await tasksService.create(newTask);
    toast({ title: "Tarea de revisión creada", description: `Se ha asignado una tarea prioritaria para ${action === 'rechazado' ? 'corregir' : 'revisar'} el recurso.` });
  };
  
  const handleUseAsInput = (resource) => setModalState({ view: 'taskForm', resource });

  const handleTaskWithResourceSave = async (taskData) => {
    try {
      const newTask = await tasksService.create(taskData);
      
      const resource = resources.find(r => r.id === taskData.related_resource_id);
      await resourcesService.update(taskData.related_resource_id, {
        related_tasks: [...(resource.related_tasks || []), newTask.id]
      });

      loadResources();
      toast({ title: "¡Tarea con recurso creada!", description: `Nueva tarea "${newTask.title}" creada.` });
    } catch (error) {
      toast({ title: "Error al crear tarea", description: error.message, variant: "destructive" });
    }
    handleCloseModals();
  };

  const handleTaskLink = async (resourceId, taskIdOrAction, selectedTask) => {
    try {
      if (taskIdOrAction === 'create-new') {
        const resource = resources.find(r => r.id === resourceId);
        setModalState({ view: 'taskForm', resource });
        return;
      }

      const resource = resources.find(r => r.id === resourceId);
      const updateData = {
        task_id: parseInt(taskIdOrAction),
        taskTitle: selectedTask.title,
        related_tasks: [...(resource.related_tasks || []), parseInt(taskIdOrAction)]
      };

      await resourcesService.update(resourceId, updateData);
      loadResources();
      toast({ title: "Recurso vinculado", description: `El recurso se ha vinculado a la tarea "${selectedTask.title}".` });
      handleCloseModals();
    } catch (error) {
      toast({ title: "Error al vincular recurso", description: error.message, variant: "destructive" });
    }
  };

  const forceDownload = (url, filename) => {
    fetch(url, { mode: 'cors' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(err => {
        console.error("Error de descarga:", err);
        toast({
          title: "Error de descarga",
          description: "No se pudo descargar el archivo. Intentando abrir en una nueva pestaña.",
          variant: "destructive",
        });
        window.open(url, '_blank');
      });
  };

  const handleResourceAction = (action, resource) => {
    const isValidUrl = resource.url && typeof resource.url === 'string' && resource.url.startsWith('http');

    if (action === 'preview') {
      if (!isValidUrl) {
        toast({
          title: "No se puede previsualizar",
          description: "El recurso no tiene una URL válida.",
          variant: "destructive",
        });
        return;
      }
      setModalState({ view: action, resource });
    } else if (action === 'download') {
      if (!isValidUrl) {
        toast({
          title: "URL no válida",
          description: "Este recurso no tiene un archivo descargable.",
          variant: "destructive",
        });
        return;
      }
      forceDownload(resource.url, resource.nombre);
    } else if (action === 'statusChange' || action === 'linkTask') {
      setModalState({ view: action, resource });
    } else if (action === 'useAsInput') {
      handleUseAsInput(resource);
    }
  };

  const handleOpenUploadModal = () => setModalState({ view: 'upload', resource: null });

  return {
    resources,
    loading,
    filteredResources,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    uniqueMarcas: uniqueValues.marcas,
    uniqueTipos: uniqueValues.tipos,
    uniqueCategorias: uniqueValues.categorias,
    uniqueStatuses: uniqueValues.statuses,
    activeTab,
    setActiveTab,
    modalState,
    handleCloseModals,
    handleResourceUpload,
    handleStatusChange,
    handleUseAsInput,
    handleTaskWithResourceSave,
    handleResourceAction,
    handleOpenUploadModal,
    handleTaskLink,
  };
}