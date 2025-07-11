import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Clock, 
  CheckCircle, 
  BarChart3,
  Award,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

export default function CollaboratorMetrics({ collaborators }) {
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

  const getWorkloadStatus = (activeTasks) => {
    if (activeTasks === 0) return { label: 'Disponible', color: 'text-green-600 bg-green-100' };
    if (activeTasks <= 2) return { label: 'Carga ligera', color: 'text-yellow-600 bg-yellow-100' };
    if (activeTasks <= 4) return { label: 'Carga moderada', color: 'text-orange-600 bg-orange-100' };
    return { label: 'Carga alta', color: 'text-red-600 bg-red-100' };
  };

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Métricas por Colaborador
      </h3>

      <div className="space-y-4">
        {collaborators.map((collaborator, index) => {
          const workloadStatus = getWorkloadStatus(collaborator.activeTasks);
          
          return (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                    <p className="text-sm text-gray-600">{collaborator.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${workloadStatus.color}`}>
                    {workloadStatus.label}
                  </span>
                  <div className={`flex items-center ${getEfficiencyColor(collaborator.efficiency)}`}>
                    {getEfficiencyIcon(collaborator.efficiency)}
                    <span className="ml-1 text-sm font-medium">{collaborator.efficiency}%</span>
                  </div>
                </div>
              </div>

              {/* Métricas principales */}
              <div className="grid grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">{collaborator.totalAssigned}</div>
                  <div className="text-xs text-gray-600">Total Asignadas</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-orange-600">{collaborator.activeTasks}</div>
                  <div className="text-xs text-gray-600">Carga Actual</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-green-600">{collaborator.completedTasks}</div>
                  <div className="text-xs text-gray-600">Entregadas</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-purple-600">{collaborator.avgResponseTime}d</div>
                  <div className="text-xs text-gray-600">Tiempo Promedio</div>
                </div>
                
                <div>
                  <div className="text-lg font-bold text-indigo-600">{collaborator.onTimePercentage}%</div>
                  <div className="text-xs text-gray-600">Cumplimiento</div>
                </div>
              </div>

              {/* Barra de progreso de eficiencia */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Eficiencia General</span>
                  <span className={`text-xs font-medium ${getEfficiencyColor(collaborator.efficiency)}`}>
                    {collaborator.efficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${collaborator.efficiency}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-2 rounded-full ${
                      collaborator.efficiency >= 80 ? 'bg-green-500' :
                      collaborator.efficiency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Alertas de rendimiento */}
              {(collaborator.overdueTasks > 0 || collaborator.efficiency < 60) && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="flex items-center text-yellow-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    <span className="font-medium">Requiere atención</span>
                  </div>
                  <div className="text-yellow-700 mt-1 space-y-1">
                    {collaborator.overdueTasks > 0 && (
                      <div>• {collaborator.overdueTasks} tarea(s) vencida(s)</div>
                    )}
                    {collaborator.efficiency < 60 && (
                      <div>• Eficiencia por debajo del 60%</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tareas recientes */}
              {collaborator.recentTasks && collaborator.recentTasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Tareas Recientes</h5>
                  <div className="space-y-1">
                    {collaborator.recentTasks.slice(0, 2).map((task, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex justify-between">
                        <span className="truncate">{task.title}</span>
                        <span className={`px-1 rounded text-xs ${
                          task.status === 'entregado' ? 'text-green-600 bg-green-100' :
                          task.status === 'en-proceso' ? 'text-blue-600 bg-blue-100' :
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {collaborators.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay colaboradores con tareas asignadas</p>
        </div>
      )}
    </div>
  );
}