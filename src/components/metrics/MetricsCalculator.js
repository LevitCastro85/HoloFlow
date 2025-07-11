export class MetricsCalculator {
  constructor(baseData) {
    this.baseData = baseData;
  }

  applyFilters(tasks, filters) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(filters.period));

    return tasks.filter(task => {
      const taskDate = new Date(task.fechaCreacion || task.fechaSolicitud);
      if (taskDate < cutoffDate) return false;

      if (filters.clientId && task.clienteId.toString() !== filters.clientId) return false;
      if (filters.brandId && task.brandId.toString() !== filters.brandId) return false;
      if (filters.collaborator && task.responsable !== filters.collaborator) return false;
      if (filters.taskStatus && task.estado !== filters.taskStatus) return false;
      if (filters.priority && task.prioridad !== filters.priority) return false;
      if (filters.contentType && task.tipoContenido !== filters.contentType) return false;

      return true;
    });
  }

  calculateTaskStats(tasks) {
    const stats = {
      'en-fila': 0,
      'en-proceso': 0,
      'revision': 0,
      'requiere-atencion': 0,
      'entregado': 0
    };

    tasks.forEach(task => {
      if (stats.hasOwnProperty(task.estado)) {
        stats[task.estado]++;
      }
    });

    return stats;
  }

  calculateBrandLimits() {
    const savedTasks = localStorage.getItem('brandTasks');
    const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    return this.baseData.brands.map(brand => {
      const brandTasks = allTasks.filter(task => task.brandId === brand.id);
      const activeTasks = brandTasks.filter(task => 
        ['en-fila', 'en-proceso', 'revision'].includes(task.estado)
      );

      const plan = this.getBrandPlan(brand.id);
      
      const tasksByStatus = {
        enFila: brandTasks.filter(t => t.estado === 'en-fila').length,
        enProceso: brandTasks.filter(t => t.estado === 'en-proceso').length,
        revision: brandTasks.filter(t => t.estado === 'revision').length
      };

      const client = this.baseData.clients.find(c => c.id === brand.clienteId);

      return {
        id: brand.id,
        name: brand.nombre,
        clientName: client?.nombre || 'Cliente desconocido',
        activeTasks: activeTasks.length,
        limit: plan.taskLimit,
        planName: plan.name,
        tasksByStatus
      };
    });
  }

  calculateControlIndicators(tasks) {
    const today = new Date();
    
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.fechaEntrega);
      return dueDate < today && !['entregado'].includes(task.estado);
    });

    const urgentTasks = tasks.filter(task => task.prioridad === 'urgente');

    const overLimitTasks = [];
    this.baseData.brands.forEach(brand => {
      const brandTasks = tasks.filter(task => 
        task.brandId === brand.id && 
        ['en-fila', 'en-proceso', 'revision'].includes(task.estado)
      );
      const plan = this.getBrandPlan(brand.id);
      if (brandTasks.length > plan.taskLimit) {
        overLimitTasks.push(...brandTasks.slice(plan.taskLimit));
      }
    });

    const attentionTasks = tasks.filter(task => task.estado === 'requiere-atencion');

    return {
      overdue: {
        count: overdueTasks.length,
        details: overdueTasks.map(task => ({
          taskTitle: task.titulo,
          brandName: task.marcaNombre,
          daysOverdue: Math.ceil((today - new Date(task.fechaEntrega)) / (1000 * 60 * 60 * 24))
        })),
        trend: Math.floor(Math.random() * 3)
      },
      urgent: {
        count: urgentTasks.length,
        details: urgentTasks.map(task => ({
          taskTitle: task.titulo,
          brandName: task.marcaNombre,
          dueDate: task.fechaEntrega
        })),
        trend: Math.floor(Math.random() * 2)
      },
      overLimit: {
        count: overLimitTasks.length,
        details: overLimitTasks.map(task => ({
          taskTitle: task.titulo,
          brandName: task.marcaNombre,
          excess: 'Fuera de límite'
        })),
        trend: 0
      },
      attention: {
        count: attentionTasks.length,
        details: attentionTasks.map(task => ({
          taskTitle: task.titulo,
          brandName: task.marcaNombre,
          reason: 'Requiere atención'
        })),
        trend: Math.floor(Math.random() * 2)
      }
    };
  }

  calculateCollaboratorMetrics(tasks) {
    return this.baseData.collaborators.map(collaborator => {
      const collaboratorTasks = tasks.filter(task => task.responsable === collaborator.nombre);
      const activeTasks = collaboratorTasks.filter(task => 
        ['en-fila', 'en-proceso', 'revision'].includes(task.estado)
      );
      const completedTasks = collaboratorTasks.filter(task => task.estado === 'entregado');
      
      const tasksWithResponseTime = completedTasks.filter(t => t.tiempoRespuesta);
      const avgResponseTime = tasksWithResponseTime.length > 0 
        ? Math.round(tasksWithResponseTime.reduce((sum, t) => sum + t.tiempoRespuesta, 0) / tasksWithResponseTime.length)
        : 0;

      const onTimeTasks = completedTasks.filter(task => {
        if (!task.fechaEntregaReal || !task.fechaEntrega) return false;
        return new Date(task.fechaEntregaReal) <= new Date(task.fechaEntrega);
      });

      const totalTasks = collaboratorTasks.length;
      const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
      const onTimeRate = completedTasks.length > 0 ? (onTimeTasks.length / completedTasks.length) * 100 : 0;
      const efficiency = Math.round((completionRate + onTimeRate) / 2);

      const today = new Date();
      const overdueTasks = activeTasks.filter(task => {
        return new Date(task.fechaEntrega) < today;
      });

      return {
        id: collaborator.id,
        name: collaborator.nombre,
        specialty: collaborator.especialidad,
        totalAssigned: totalTasks,
        activeTasks: activeTasks.length,
        completedTasks: completedTasks.length,
        avgResponseTime,
        onTimePercentage: completedTasks.length > 0 ? Math.round((onTimeTasks.length / completedTasks.length) * 100) : 0,
        efficiency,
        overdueTasks: overdueTasks.length,
        recentTasks: collaboratorTasks.slice(-3).map(task => ({
          title: task.titulo,
          status: task.estado
        }))
      };
    }).filter(collaborator => collaborator.totalAssigned > 0);
  }

  calculateSummary(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.estado === 'entregado').length;
    const active = tasks.filter(t => ['en-fila', 'en-proceso', 'revision'].includes(t.estado)).length;
    const overdue = tasks.filter(t => {
      const today = new Date();
      const dueDate = new Date(t.fechaEntrega);
      return dueDate < today && !['entregado'].includes(t.estado);
    }).length;

    return {
      total,
      completed,
      active,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }

  getBrandPlan(brandId) {
    const plans = {
      basic: { name: 'Básico', taskLimit: 3 },
      premium: { name: 'Premium', taskLimit: 10 },
      enterprise: { name: 'Enterprise', taskLimit: 25 }
    };
    
    return plans.basic;
  }
}