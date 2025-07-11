import { supabase } from '@/lib/customSupabaseClient';

export const taskUtils = {
  async getTaskLimits(brandId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .eq('brand_id', brandId)
        .in('status', ['en-fila', 'en-proceso', 'revision', 'requiere-atencion']);

      if (error) {
        console.error('Error getting task limits:', error);
        throw error;
      }

      const currentTasks = data?.length || 0;
      const limit = 50;

      return {
        current: currentTasks,
        limit: limit,
        canCreate: currentTasks < limit,
        remaining: limit - currentTasks
      };
    } catch (error) {
      console.error('Error in taskUtils.getTaskLimits:', error);
      return {
        current: 0,
        limit: 50,
        canCreate: true,
        remaining: 50
      };
    }
  },

  validateTaskData(taskData) {
    const errors = {};

    if (!taskData.title?.trim()) {
      errors.title = 'El título es obligatorio';
    }

    if (!taskData.brand_id) {
      errors.brand_id = 'La marca es obligatoria';
    }

    if (!taskData.service_id) {
      errors.service_id = 'El servicio es obligatorio';
    }

    if (!taskData.due_date) {
      errors.due_date = 'La fecha de entrega es obligatoria';
    } else {
      const dueDate = new Date(taskData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        errors.due_date = 'La fecha de entrega debe ser futura';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  formatTaskForDisplay(task) {
    return {
      ...task,
      formattedDueDate: task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'Sin fecha',
      formattedCreatedAt: task.created_at ? new Date(task.created_at).toLocaleDateString('es-ES') : '',
      isOverdue: task.due_date && task.status !== 'entregado' && new Date(task.due_date) < new Date(),
      isUrgent: task.due_date && task.status !== 'entregado' && 
                (new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24) <= 2,
      brandName: task.brand?.name || 'Sin marca',
      clientName: task.brand?.client?.name || 'Sin cliente',
      serviceName: task.service?.name || 'Sin servicio',
      collaboratorName: task.assigned_collaborator?.name || 'Sin asignar'
    };
  }
};