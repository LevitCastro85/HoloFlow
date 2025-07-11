import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

export default function TaskLimitsValidation({ brandLimits }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'exceeded': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'exceeded': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2 text-blue-600" />
        Validación de Límites Operativos
      </h3>

      <div className="space-y-4">
        {brandLimits.map((brand, index) => {
          const percentage = (brand.activeTasks / brand.limit) * 100;
          const status = percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'ok';
          
          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStatusColor(status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{brand.name}</h4>
                    <p className="text-sm text-gray-600">{brand.clientName}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    status === 'exceeded' ? 'text-red-600' :
                    status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {brand.activeTasks} / {brand.limit}
                  </div>
                  <div className="text-xs text-gray-500">tareas activas</div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, percentage)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`h-2 rounded-full ${getProgressBarColor(percentage)}`}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Plan: {brand.planName}
                </span>
                <span className={`font-medium ${
                  status === 'exceeded' ? 'text-red-600' :
                  status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {percentage.toFixed(0)}% utilizado
                </span>
              </div>

              {/* Alertas específicas */}
              {status === 'exceeded' && (
                <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm">
                  <div className="flex items-center text-red-800">
                    <XCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Límite excedido</span>
                  </div>
                  <p className="text-red-700 mt-1">
                    Esta marca ha superado su límite de tareas activas. Se requiere autorización del Director General para nuevas tareas.
                  </p>
                </div>
              )}

              {status === 'warning' && (
                <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-sm">
                  <div className="flex items-center text-yellow-800">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Cerca del límite</span>
                  </div>
                  <p className="text-yellow-700 mt-1">
                    Esta marca está cerca de alcanzar su límite de tareas activas.
                  </p>
                </div>
              )}

              {/* Tareas por estado */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                  <div className="font-semibold text-blue-600">{brand.tasksByStatus.enFila}</div>
                  <div className="text-gray-600">En Fila</div>
                </div>
                <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                  <div className="font-semibold text-orange-600">{brand.tasksByStatus.enProceso}</div>
                  <div className="text-gray-600">En Proceso</div>
                </div>
                <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                  <div className="font-semibold text-yellow-600">{brand.tasksByStatus.revision}</div>
                  <div className="text-gray-600">Revisión</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {brandLimits.length === 0 && (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay marcas registradas para validar límites</p>
        </div>
      )}
    </div>
  );
}