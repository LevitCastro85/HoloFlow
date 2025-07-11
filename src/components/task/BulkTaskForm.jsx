import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useTaskData } from '@/hooks/useTaskData';
import BulkTaskHeader from '@/components/task/BulkTaskHeader';
import BulkTaskTable from '@/components/task/BulkTaskTable';
import BulkTaskAdditionalFields from '@/components/task/BulkTaskAdditionalFields';
import BulkTaskSummary from '@/components/task/BulkTaskSummary';

export default function BulkTaskForm({ brand, client, onSave, onCancel }) {
  const [tasks, setTasks] = useState([createEmptyTask()]);
  const [errors, setErrors] = useState({});

  const {
    collaborators,
    services,
    taskLimitInfo,
    loadData,
    checkTaskLimits,
    getServicePrice
  } = useTaskData(brand, client);

  useEffect(() => {
    loadData();
    checkTaskLimits();
  }, []);

  function createEmptyTask() {
    return {
      id: Date.now() + Math.random(),
      title: '',
      service_id: '',
      description: '',
      due_date: '',
      assigned_to: '',
      priority: 'media',
      price: 0,
      social_network: 'instagram',
      campaign_theme: '',
      header_text: '',
      call_to_action: '',
      notes: ''
    };
  }

  const addTask = () => {
    if (tasks.length >= 10) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 10 tareas por lote. Guarda este lote y crea otro.",
        variant: "destructive"
      });
      return;
    }

    setTasks([...tasks, createEmptyTask()]);
  };

  const removeTask = (taskId) => {
    if (tasks.length === 1) {
      toast({
        title: "No se puede eliminar",
        description: "Debe haber al menos una tarea",
        variant: "destructive"
      });
      return;
    }

    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const duplicateTask = (taskIndex) => {
    const taskToDuplicate = tasks[taskIndex];
    const duplicatedTask = {
      ...taskToDuplicate,
      id: Date.now() + Math.random(),
      title: `${taskToDuplicate.title} (copia)`
    };
    
    const newTasks = [...tasks];
    newTasks.splice(taskIndex + 1, 0, duplicatedTask);
    setTasks(newTasks);
  };

  const updateTask = (taskId, field, value) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, [field]: value };
        
        if (field === 'service_id') {
          updatedTask.price = getServicePrice(value);
        }
        
        return updatedTask;
      }
      return task;
    }));

    if (errors[taskId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          [field]: undefined
        }
      }));
    }
  };

  const validateTasks = () => {
    const newErrors = {};
    let hasErrors = false;

    tasks.forEach(task => {
      const taskErrors = {};

      if (!task.title.trim()) {
        taskErrors.title = 'Título obligatorio';
        hasErrors = true;
      }
      if (!task.service_id) {
        taskErrors.service_id = 'Tipo obligatorio';
        hasErrors = true;
      }
      if (!task.due_date) {
        taskErrors.due_date = 'Fecha obligatoria';
        hasErrors = true;
      } else {
        const fechaEntrega = new Date(task.due_date);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaEntrega < hoy) {
          taskErrors.due_date = 'Fecha debe ser futura';
          hasErrors = true;
        }
      }
      if (Object.keys(taskErrors).length > 0) newErrors[task.id] = taskErrors;
    });

    if (tasks.length + taskLimitInfo.current > taskLimitInfo.limit) {
      newErrors.general = `Estas ${tasks.length} tareas excederían el límite de ${taskLimitInfo.limit} tareas activas`;
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = () => {
    if (!validateTasks()) {
      toast({ title: "Errores en el formulario", description: "Corrige los errores antes de continuar", variant: "destructive" });
      return;
    }

    const tasksData = tasks.map(task => ({
      title: task.title,
      description: task.description || task.notes,
      brand_id: brand.id,
      status: 'en-fila',
      priority: task.priority,
      due_date: task.due_date,
      assigned_to: task.assigned_to || null,
      price: task.price,
      notes: task.notes,
      service_id: task.service_id
    }));

    onSave(tasksData);
  };

  const openBrandingControl = () => {
    toast({
      title: "🎨 Branding Control",
      description: "Accede al Branding Control desde el Brand Hub para consultar elementos de marca"
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <BulkTaskHeader 
        brand={brand}
        client={client}
        tasks={tasks}
        taskLimitInfo={taskLimitInfo}
        onOpenBranding={openBrandingControl}
      />

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{errors.general}</p>
        </div>
      )}

      <BulkTaskTable 
        tasks={tasks}
        errors={errors}
        collaborators={collaborators}
        services={services}
        onAddTask={addTask}
        onRemoveTask={removeTask}
        onDuplicateTask={duplicateTask}
        onUpdateTask={updateTask}
      />

      <BulkTaskAdditionalFields 
        tasks={tasks}
        onUpdateTask={updateTask}
      />

      <BulkTaskSummary 
        tasks={tasks}
        brand={brand}
        client={client}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}