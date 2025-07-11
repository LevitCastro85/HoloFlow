import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart } from 'lucide-react';

export default function TaskStatusChart({ taskStats, viewType = 'bar' }) {
  const statusConfig = {
    'en-fila': { label: 'En Fila', color: 'bg-gray-500', textColor: 'text-gray-600' },
    'en-proceso': { label: 'En Proceso', color: 'bg-blue-500', textColor: 'text-blue-600' },
    'revision': { label: 'En Revisión', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    'requiere-atencion': { label: 'Requiere Atención', color: 'bg-red-500', textColor: 'text-red-600' },
    'entregado': { label: 'Entregado', color: 'bg-green-500', textColor: 'text-green-600' }
  };

  const total = Object.values(taskStats).reduce((sum, count) => sum + count, 0);
  const maxCount = Math.max(...Object.values(taskStats));

  if (viewType === 'pie') {
    return (
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-blue-600" />
          Estado General de Tareas (Vista Circular)
        </h3>
        
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Simulación de gráfico circular con CSS */}
            <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
              {Object.entries(taskStats).map(([status, count], index) => {
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const config = statusConfig[status];
                
                return (
                  <motion.div
                    key={status}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className={`absolute inset-0 ${config.color} opacity-80`}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + percentage * 0.5}% 0%, ${50 + percentage * 0.5}% 100%, 50% 100%)`
                    }}
                  />
                );
              })}
            </div>
            
            {/* Centro del círculo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center border-4 border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{total}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {Object.entries(taskStats).map(([status, count]) => {
            const config = statusConfig[status];
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            
            return (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{config.label}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        Estado General de Tareas
      </h3>
      
      <div className="space-y-4">
        {Object.entries(taskStats).map(([status, count], index) => {
          const config = statusConfig[status];
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={status} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  <span className="text-sm font-medium text-gray-700">{config.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                  <span className="text-xs text-gray-500">
                    ({total > 0 ? ((count / total) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-full rounded-full ${config.color} relative`}
                >
                  {count > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{count}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total de Tareas</span>
          <span className="text-lg font-bold text-gray-900">{total}</span>
        </div>
        
        {/* Indicadores de estado crítico */}
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Activas:</span>
            <span className="font-medium text-blue-600">
              {(taskStats['en-fila'] || 0) + (taskStats['en-proceso'] || 0) + (taskStats['revision'] || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Críticas:</span>
            <span className="font-medium text-red-600">
              {taskStats['requiere-atencion'] || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}