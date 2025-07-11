import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BrandTaskForm from '@/components/task/BrandTaskForm';
import TaskMetrics from '@/components/task/TaskMetrics';
import TaskFilters from '@/components/task/TaskFilters';
import TaskTable from '@/components/task/TaskTable';
import { tasksService } from '@/lib/supabaseHelpers';

export default function BrandTasksPanel({ brand, client, onBack, onViewBranding }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    activas: 0,
    completadas: 0,
    tiempoPromedio: 0
  });

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const brandTasks = await tasksService.getByBrandId(brand.id);
      setTasks(brandTasks || []);
      calculateMetrics(brandTasks || []);
    } catch (error) {
      toast({
        title: "Error al cargar tareas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [brand.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const calculateMetrics = (taskList) => {
    const total = taskList.length;
    const activas = taskList.filter(t => ['en-fila', 'en-proceso', 'revision', 'requiere-atencion'].includes(t.status)).length;
    const completadas = taskList.filter(t => t.status === 'entregado').length;
    
    const tiempos = taskList
      .filter(t => t.status === 'entregado' && t.assignment_date && t.due_date)
      .map(t => (new Date(t.due_date) - new Date(t.assignment_date)) / (1000 * 60 * 60 * 24));
      
    const tiempoPromedio = tiempos.length > 0 ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : 0;
    
    setMetrics({ total, activas, completadas, tiempoPromedio });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = async (taskData, editingId) => {
    setIsLoading(true);
    try {
      if (editingId) {
        await tasksService.update(editingId, taskData);
        toast({ title: "Tarea actualizada", description: "La tarea se ha actualizado correctamente." });
      } else {
        await tasksService.create({ ...taskData, brand_id: brand.id, client_id: client.id });
        toast({ title: "Tarea creada", description: "La nueva tarea ha sido creada." });
      }
      setShowTaskForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      toast({
        title: "Error al guardar la tarea",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setIsLoading(true);
    try {
      await tasksService.update(taskId, { status: newStatus });
      toast({
        title: "Estado actualizado",
        description: "El estado de la tarea ha sido modificado correctamente"
      });
      await loadTasks();
    } catch (error) {
      toast({
        title: "Error al actualizar estado",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.service?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (task.assigned_collaborator?.name && task.assigned_collaborator.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  if (showTaskForm) {
    return (
      <BrandTaskForm
        brand={brand}
        client={client}
        editingTask={editingTask}
        onSave={handleSaveTask}
        onCancel={() => setShowTaskForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Brand Control
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tareas de {brand.name}</h1>
            <p className="text-gray-600">Cliente: {client.name} • {brand.industry}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onViewBranding}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Branding Control
          </Button>
          <Button onClick={handleAddTask}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      <TaskMetrics metrics={metrics} />

      <TaskFilters 
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        onFilterChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <TaskTable 
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onUpdateStatus={updateTaskStatus}
          onAddTask={handleAddTask}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
        />
      )}
    </div>
  );
}