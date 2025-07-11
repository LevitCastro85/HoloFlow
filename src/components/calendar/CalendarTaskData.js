// Estructura de datos para tareas del calendario operativo
export const taskDataStructure = {
  // Campos básicos existentes
  id: null,
  titulo: '',
  tipoContenido: '', // diseño, reel, video, fotografia, copy, historia, carrusel
  descripcion: '',
  brief: '',
  fechaSolicitud: '',
  fechaEntrega: '',
  responsable: '',
  estado: '', // en-fila, en-proceso, revision, entregado, requiere-atencion
  prioridad: '', // normal, alta, urgente
  precioTarea: 0,
  archivos: [],
  notas: '',
  origen: '', // individual, calendario
  
  // Datos de vinculación
  marcaId: null,
  marcaNombre: '',
  clienteId: null,
  clienteNombre: '',
  
  // Campos específicos del calendario operativo
  redSocial: '', // facebook, instagram, tiktok, youtube, linkedin, web
  temaCampana: '', // campaña asociada si aplica
  encabezado: '', // título o copy principal
  textoDescriptivo: '', // detalle del contenido a publicar
  cta: '', // llamado a la acción principal
  notasObservaciones: '', // apuntes internos, aclaraciones del cliente
  
  // Metadatos adicionales
  fechaCreacion: '',
  tiempoEstimado: '', // tiempo estimado de ejecución
  archivosReferencia: [], // archivos de referencia específicos
  entregables: [], // archivos entregados
  
  // Campos de seguimiento
  fechaAsignacion: '', // cuando se asignó al responsable
  fechaInicio: '', // cuando se empezó a trabajar
  fechaEntregaReal: '', // cuando se entregó realmente
  tiempoReal: '', // tiempo real invertido
  
  // Campos de revisión
  requiereRevision: false,
  comentariosRevision: '',
  aprobadoPor: '',
  fechaAprobacion: ''
};

// Funciones utilitarias para el calendario operativo
export const calendarUtils = {
  // Verificar si una tarea está vencida
  isTaskOverdue: (task) => {
    if (!task.fechaEntrega || task.estado === 'entregado') return false;
    const today = new Date();
    const taskDate = new Date(task.fechaEntrega);
    return taskDate < today;
  },

  // Verificar si una tarea es urgente (2 días o menos)
  isTaskUrgent: (task) => {
    if (!task.fechaEntrega || task.estado === 'entregado') return false;
    const today = new Date();
    const taskDate = new Date(task.fechaEntrega);
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  },

  // Obtener el color de estado
  getStatusColor: (status) => {
    const colors = {
      'en-fila': 'bg-gray-100 text-gray-800 border-gray-300',
      'en-proceso': 'bg-blue-100 text-blue-800 border-blue-300',
      'revision': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'entregado': 'bg-green-100 text-green-800 border-green-300',
      'requiere-atencion': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || colors['en-fila'];
  },

  // Obtener el color de prioridad
  getPriorityColor: (priority) => {
    const colors = {
      'normal': 'border-l-gray-400',
      'alta': 'border-l-orange-400',
      'urgente': 'border-l-red-500'
    };
    return colors[priority] || colors['normal'];
  },

  // Filtrar tareas por fecha
  getTasksForDate: (tasks, date, filters = {}) => {
    return tasks.filter(task => {
      if (!task.fechaEntrega) return false;
      const taskDate = new Date(task.fechaEntrega);
      const isSameDate = taskDate.toDateString() === date.toDateString();
      
      if (!isSameDate) return false;

      // Aplicar filtros adicionales
      if (filters.marca && task.marcaId !== filters.marca) return false;
      if (filters.responsable && task.responsable !== filters.responsable) return false;
      if (filters.tipoContenido && task.tipoContenido !== filters.tipoContenido) return false;
      if (filters.estado && task.estado !== filters.estado) return false;
      if (filters.prioridad && task.prioridad !== filters.prioridad) return false;

      return true;
    });
  },

  // Obtener estadísticas del período
  getPeriodStats: (tasks, startDate, endDate) => {
    const periodTasks = tasks.filter(task => {
      if (!task.fechaEntrega) return false;
      const taskDate = new Date(task.fechaEntrega);
      return taskDate >= startDate && taskDate <= endDate;
    });

    return {
      total: periodTasks.length,
      overdue: periodTasks.filter(t => calendarUtils.isTaskOverdue(t)).length,
      urgent: periodTasks.filter(t => calendarUtils.isTaskUrgent(t)).length,
      completed: periodTasks.filter(t => t.estado === 'entregado').length,
      inProgress: periodTasks.filter(t => t.estado === 'en-proceso').length,
      pending: periodTasks.filter(t => t.estado === 'en-fila').length
    };
  },

  // Validar estructura de tarea
  validateTaskData: (taskData) => {
    const errors = {};

    if (!taskData.titulo?.trim()) {
      errors.titulo = 'El título es obligatorio';
    }

    if (!taskData.tipoContenido) {
      errors.tipoContenido = 'El tipo de contenido es obligatorio';
    }

    if (!taskData.fechaEntrega) {
      errors.fechaEntrega = 'La fecha de entrega es obligatoria';
    }

    if (!taskData.redSocial) {
      errors.redSocial = 'La red social es obligatoria';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Crear tarea completa con estructura
  createCompleteTask: (basicData, brandData, clientData) => {
    return {
      ...taskDataStructure,
      ...basicData,
      id: Date.now(),
      fechaCreacion: new Date().toISOString(),
      marcaId: brandData.id,
      marcaNombre: brandData.nombre,
      clienteId: clientData.id,
      clienteNombre: clientData.nombre,
      encabezado: basicData.encabezado || basicData.titulo,
      notasObservaciones: basicData.notasObservaciones || basicData.notas || ''
    };
  }
};

// Configuración de redes sociales
export const socialNetworks = {
  instagram: { name: 'Instagram', icon: 'Instagram', color: 'text-pink-600' },
  facebook: { name: 'Facebook', icon: 'Facebook', color: 'text-blue-600' },
  tiktok: { name: 'TikTok', icon: 'Hash', color: 'text-black' },
  youtube: { name: 'YouTube', icon: 'Youtube', color: 'text-red-600' },
  linkedin: { name: 'LinkedIn', icon: 'Linkedin', color: 'text-blue-700' },
  web: { name: 'Sitio Web', icon: 'Globe', color: 'text-gray-600' }
};

// Tipos de contenido disponibles
export const contentTypes = {
  diseño: { name: 'Diseño', description: 'Diseños gráficos, posts, banners' },
  reel: { name: 'Reel', description: 'Videos cortos para Instagram/TikTok' },
  video: { name: 'Video', description: 'Videos largos, promocionales' },
  fotografia: { name: 'Fotografía', description: 'Sesiones fotográficas, producto' },
  copy: { name: 'Copy', description: 'Textos, captions, artículos' },
  historia: { name: 'Historia', description: 'Stories para redes sociales' },
  carrusel: { name: 'Carrusel', description: 'Posts con múltiples imágenes' }
};

export default {
  taskDataStructure,
  calendarUtils,
  socialNetworks,
  contentTypes
};