import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  TrendingUp, 
  User, 
  Calendar,
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function TaskAssignmentMetrics({ collaboratorName, showDetailed = false }) {
  const [metrics, setMetrics] = useState({
    totalAssigned: 0,
    activeTasks: 0,
    completedTasks: 0,
    avgResponseTime: 0,
    efficiency: 0,
    onTimeDeliveries: 0,
    overdueCount: 0,
    assignmentHistory: []
  });

  useEffect(() => {
    if (collaboratorName) {
      calculateMetrics();
    }
  }, [collaboratorName]);

  const calculateMetrics = () => {
    const savedTasks = localStorage.getItem('brandTasks');
    const assignmentHistory = JSON.parse(localStorage.getItem('assignmentHistory') || '[]');
    
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

      // Calcular entregas a tiempo
      const onTimeDeliveries = completedTasks.filter(t => {
        if (!t.fechaEntregaReal || !t.fechaEntrega) return false;
        const deliveryDate = new Date(t.fechaEntregaReal);
        const dueDate = new Date(t.fechaEntrega);
        return deliveryDate <= dueDate;
      }).length;

      // Contar tareas vencidas
      const overdueCount = activeTasks.filter(t => {
        const today = new Date();
        const taskDate = new Date(t.fechaEntrega);
        return taskDate < today;
      }).length;

      // Calcular eficiencia
      const totalTasks = collaboratorTasks.length;
      const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
      const onTimeRate = completedTasks.length > 0 ? (onTimeDeliveries / completedTasks.length) * 100 : 0;
      const efficiency = Math.round((completionRate + onTimeRate) / 2);

      // Historial de asignaciones del colaborador
      const collaboratorAssignments = assignmentHistory.filter(a => a.collaborator === collaboratorName);

      setMetrics({
        totalAssigned: totalTasks,
        activeTasks: activeTasks.length,
        completedTasks: completedTasks.length,
        avgResponseTime,
        efficiency,
        onTimeDeliveries,
        overdueCount,
        assignmentHistory: collaboratorAssignments.slice(-5) // Últimas 5 asignaciones
      });
    }
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyIcon = (efficiency) => {
    if (efficiency >= 80) return <Award className="w-4 h-4" />;
    if (efficiency >= 60) return <TrendingUp className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  if (!collaboratorName) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Selecciona un colaborador para ver métricas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Tareas Activas</p>
              <p className="text-lg font-bold text-blue-600">{metrics.activeTasks}</p>
            </div>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Completadas</p>
              <p className="text-lg font-bold text-green-600">{metrics.completedTasks}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Tiempo Promedio</p>
              <p className="text-lg font-bold text-purple-600">{metrics.avgResponseTime}d</p>
            </div>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Eficiencia</p>
              <p className={`text-lg font-bold ${getEfficiencyColor(metrics.efficiency)}`}>
                {metrics.efficiency}%
              </p>
            </div>
            <div className={getEfficiencyColor(metrics.efficiency)}>
              {getEfficiencyIcon(metrics.efficiency)}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Métricas detalladas */}
      {showDetailed && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Estadísticas de rendimiento */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
              Rendimiento
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total asignadas:</span>
                <span className="font-medium text-gray-900">{metrics.totalAssigned}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Entregas a tiempo:</span>
                <span className="font-medium text-green-600">{metrics.onTimeDeliveries}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tareas vencidas:</span>
                <span className={`font-medium ${metrics.overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {metrics.overdueCount}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tasa de finalización:</span>
                <span className="font-medium text-blue-600">
                  {metrics.totalAssigned > 0 ? Math.round((metrics.completedTasks / metrics.totalAssigned) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Historial reciente */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Asignaciones Recientes
            </h4>
            
            <div className="space-y-2">
              {metrics.assignmentHistory.length > 0 ? (
                metrics.assignmentHistory.map((assignment, index) => (
                  <div key={assignment.id} className="text-sm border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="font-medium text-gray-900 truncate">
                      {assignment.taskTitle}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {assignment.brandName} • {new Date(assignment.assignmentDate).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Asignado por: {assignment.assignedBy}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No hay asignaciones recientes</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alertas de rendimiento */}
      {(metrics.overdueCount > 0 || metrics.efficiency < 60) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium text-sm">Atención requerida</p>
              <div className="text-yellow-700 text-xs mt-1 space-y-1">
                {metrics.overdueCount > 0 && (
                  <p>• {metrics.overdueCount} tarea(s) vencida(s)</p>
                )}
                {metrics.efficiency < 60 && (
                  <p>• Eficiencia por debajo del 60%</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}