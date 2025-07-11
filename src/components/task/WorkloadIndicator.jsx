import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function WorkloadIndicator({ 
  collaboratorName, 
  compact = false, 
  showTrend = false 
}) {
  const [workload, setWorkload] = useState({
    activeTasks: 0,
    completedTasks: 0,
    avgResponseTime: 0,
    efficiency: 0,
    trend: 'stable',
    status: 'available'
  });

  useEffect(() => {
    if (collaboratorName) {
      calculateWorkload();
    }
  }, [collaboratorName]);

  const calculateWorkload = () => {
    const savedTasks = localStorage.getItem('brandTasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const collaboratorTasks = allTasks.filter(t => t.responsable === collaboratorName);
      
      const activeTasks = collaboratorTasks.filter(t => 
        ['en-fila', 'en-proceso', 'revision'].includes(t.estado)
      );
      
      const completedTasks = collaboratorTasks.filter(t => t.estado === 'entregado');
      
      // Calcular tiempo promedio de respuesta
      const tasksWithResponseTime = completedTasks.filter(t => t.tiempoRespuesta);
      const avgResponseTime = tasksWithResponseTime.length > 0 
        ? Math.round(tasksWithResponseTime.reduce((sum, t) => sum + t.tiempoRespuesta, 0) / tasksWithResponseTime.length)
        : 0;

      // Calcular eficiencia
      const efficiency = calculateEfficiency(activeTasks, completedTasks);
      
      // Determinar estado de disponibilidad
      const status = getAvailabilityStatus(activeTasks.length);
      
      // Calcular tendencia (comparar últimas 2 semanas vs 2 semanas anteriores)
      const trend = calculateTrend(collaboratorTasks);

      setWorkload({
        activeTasks: activeTasks.length,
        completedTasks: completedTasks.length,
        avgResponseTime,
        efficiency,
        trend,
        status
      });
    }
  };

  const calculateEfficiency = (activeTasks, completedTasks) => {
    const total = activeTasks.length + completedTasks.length;
    if (total === 0) return 100;
    
    const completionRate = (completedTasks.length / total) * 100;
    const overdueTasks = activeTasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.fechaEntrega);
      return taskDate < today;
    }).length;
    
    const overdueRate = activeTasks.length > 0 ? (overdueTasks / activeTasks.length) * 100 : 0;
    
    return Math.max(0, Math.round(completionRate - overdueRate));
  };

  const getAvailabilityStatus = (activeTasks) => {
    if (activeTasks === 0) return 'available';
    if (activeTasks <= 2) return 'light';
    if (activeTasks <= 4) return 'moderate';
    return 'heavy';
  };

  const calculateTrend = (tasks) => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
    const fourWeeksAgo = new Date(now.getTime() - (28 * 24 * 60 * 60 * 1000));

    const recentTasks = tasks.filter(t => {
      const taskDate = new Date(t.fechaCreacion || t.fechaSolicitud);
      return taskDate >= twoWeeksAgo;
    }).length;

    const previousTasks = tasks.filter(t => {
      const taskDate = new Date(t.fechaCreacion || t.fechaSolicitud);
      return taskDate >= fourWeeksAgo && taskDate < twoWeeksAgo;
    }).length;

    if (recentTasks > previousTasks) return 'increasing';
    if (recentTasks < previousTasks) return 'decreasing';
    return 'stable';
  };

  const getStatusConfig = (status) => {
    const configs = {
      available: {
        label: 'Disponible',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle
      },
      light: {
        label: 'Carga ligera',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: Clock
      },
      moderate: {
        label: 'Carga moderada',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: BarChart3
      },
      heavy: {
        label: 'Carga alta',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertTriangle
      }
    };
    return configs[status] || configs.available;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'decreasing': return <TrendingDown className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  const statusConfig = getStatusConfig(workload.status);
  const StatusIcon = statusConfig.icon;

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig.bgColor}`}>
          <StatusIcon className="w-3 h-3" />
        </div>
        <div className="text-xs">
          <span className={`font-medium ${statusConfig.color}`}>
            {workload.activeTasks}
          </span>
          <span className="text-gray-500 ml-1">activas</span>
        </div>
        {showTrend && getTrendIcon(workload.trend)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-gray-200 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 flex items-center">
          <User className="w-4 h-4 mr-2 text-gray-600" />
          Carga de Trabajo
        </h4>
        
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
            <StatusIcon className="w-3 h-3 inline mr-1" />
            {statusConfig.label}
          </div>
          {showTrend && getTrendIcon(workload.trend)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-blue-600">{workload.activeTasks}</p>
          <p className="text-xs text-gray-600">Activas</p>
        </div>
        
        <div>
          <p className="text-lg font-bold text-green-600">{workload.completedTasks}</p>
          <p className="text-xs text-gray-600">Completadas</p>
        </div>
        
        <div>
          <p className="text-lg font-bold text-purple-600">{workload.avgResponseTime}d</p>
          <p className="text-xs text-gray-600">Promedio</p>
        </div>
      </div>

      {workload.efficiency < 70 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-center text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Eficiencia: {workload.efficiency}% - Requiere atención
          </div>
        </div>
      )}
    </motion.div>
  );
}