import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { tasksService } from '@/lib/services/tasksService';
import { brandsService } from '@/lib/services/brandsService';
import { collaboratorsService } from '@/lib/services/collaboratorsService';

export function useProductionEngine() {
  const [tasks, setTasks] = useState([]);
  const [brands, setBrands] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    status: 'all',
    brand: 'all',
    responsible: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksData, brandsData, collaboratorsData] = await Promise.all([
        tasksService.getAll(),
        brandsService.getAll(),
        collaboratorsService.getAll()
      ]);
      setTasks(tasksData || []);
      setBrands(brandsData || []);
      setCollaborators(collaboratorsData || []);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "No se pudieron cargar los datos de producción.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const brandName = task.brand?.name || '';
      const responsibleName = task.assigned_collaborator?.name || '';
      const serviceName = task.service?.name || '';

      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesBrand = filters.brand === 'all' || task.brand_id?.toString() === filters.brand;
      const matchesResponsible = filters.responsible === 'all' || responsibleName === filters.responsible;
      const matchesType = filters.type === 'all' || serviceName === filters.type;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = task.title.toLowerCase().includes(searchLower) ||
                          (serviceName && serviceName.toLowerCase().includes(searchLower)) ||
                          (brandName && brandName.toLowerCase().includes(searchLower)) ||
                          (responsibleName && responsibleName.toLowerCase().includes(searchLower));
      
      return matchesStatus && matchesBrand && matchesResponsible && matchesType && matchesSearch;
    });
  }, [tasks, filters, searchTerm]);

  const metrics = useMemo(() => ({
    total: tasks.length,
    enProceso: tasks.filter(t => t.status === 'en-proceso').length,
    enRevision: tasks.filter(t => t.status === 'revision').length,
    urgentes: tasks.filter(t => t.priority === 'urgente').length,
    vencidas: tasks.filter(t => t.status !== 'entregado' && t.due_date && new Date(t.due_date) < new Date()).length,
    sinAsignar: tasks.filter(t => !t.assigned_to).length
  }), [tasks]);

  const uniqueResponsibles = useMemo(() => 
    [...new Set(tasks.map(t => t.assigned_collaborator?.name).filter(Boolean))], 
    [tasks]
  );
  
  const uniqueTypes = useMemo(() => 
    [...new Set(tasks.map(t => t.service?.name).filter(Boolean))], 
    [tasks]
  );

  const updateTask = async (taskId, updates) => {
    try {
      await tasksService.update(taskId, updates);
      await loadData();
      toast({ 
        title: "Tarea actualizada", 
        description: "Los cambios se guardaron correctamente." 
      });
    } catch (error) {
      toast({ 
        title: "Error al actualizar", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const actions = {
    updateTask,
    duplicateTask: async (taskId) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const { id, created_at, brand, assigned_collaborator, service, related_resource, ...taskToDuplicate } = task;

      const duplicateData = {
        ...taskToDuplicate,
        title: `${task.title} (Copia)`,
        status: 'en-fila',
        assignment_date: null,
        assigned_to: null,
      };
      
      await tasksService.create(duplicateData);
      await loadData();
      toast({ 
        title: "Tarea duplicada", 
        description: "Se creó una copia de la tarea." 
      });
    },
    cancelTask: async (taskId, reason) => {
      try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) throw new Error("Tarea no encontrada");

        const newNotes = `${task.notes || ''}\n\n[CANCELADA] Motivo (${new Date().toLocaleDateString('es-ES')}): ${reason}`.trim();
        
        await tasksService.update(taskId, { 
          status: 'cancelado', 
          notes: newNotes 
        });

        await loadData();

        toast({
          title: "Tarea Cancelada",
          description: `La tarea "${task.title}" ha sido cancelada.`,
        });
      } catch (error) {
        toast({ 
          title: "Error al cancelar", 
          description: error.message, 
          variant: "destructive" 
        });
      }
    },
  };

  return {
    tasks: filteredTasks,
    viewMode,
    setViewMode,
    filters,
    handleFilterChange,
    searchTerm,
    setSearchTerm,
    metrics,
    brands,
    collaborators,
    uniqueResponsibles,
    uniqueTypes,
    actions,
    loading,
  };
}