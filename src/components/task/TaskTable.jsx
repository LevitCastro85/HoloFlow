import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const estadosTarea = {
  'en-fila': { label: 'En Fila', color: 'text-gray-600 bg-gray-100' },
  'en-proceso': { label: 'En Proceso', color: 'text-blue-600 bg-blue-100' },
  'revision': { label: 'En Revisión', color: 'text-yellow-600 bg-yellow-100' },
  'entregado': { label: 'Entregado', color: 'text-green-600 bg-green-100' },
  'requiere-atencion': { label: 'Requiere Atención', color: 'text-red-600 bg-red-100' }
};

const prioridades = {
  'normal': { label: 'Normal', color: 'text-gray-600' },
  'alta': { label: 'Alta', color: 'text-orange-600' },
  'urgente': { label: 'Urgente', color: 'text-red-600' }
};

export default function TaskTable({ 
  tasks, 
  onEditTask, 
  onUpdateStatus, 
  onAddTask, 
  searchTerm, 
  filterStatus 
}) {
  const getPriorityIcon = (prioridad) => {
    switch (prioridad) {
      case 'urgente': return '🔴';
      case 'alta': return '🟠';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900">Tarea</th>
              <th className="text-left p-4 font-semibold text-gray-900">Tipo</th>
              <th className="text-left p-4 font-semibold text-gray-900">Responsable</th>
              <th className="text-left p-4 font-semibold text-gray-900">Estado</th>
              <th className="text-left p-4 font-semibold text-gray-900">Prioridad</th>
              <th className="text-left p-4 font-semibold text-gray-900">Entrega</th>
              <th className="text-left p-4 font-semibold text-gray-900">Precio</th>
              <th className="text-left p-4 font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-900">{task.titulo}</div>
                    <div className="text-sm text-gray-600 line-clamp-1">{task.descripcion}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {task.tipoContenido}
                  </span>
                </td>
                <td className="p-4 text-gray-900">{task.responsable || 'Sin asignar'}</td>
                <td className="p-4">
                  <select
                    value={task.estado}
                    onChange={(e) => onUpdateStatus(task.id, e.target.value)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 ${estadosTarea[task.estado]?.color || 'text-gray-600 bg-gray-100'}`}
                  >
                    {Object.entries(estadosTarea).map(([key, estado]) => (
                      <option key={key} value={key}>{estado.label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${prioridades[task.prioridad]?.color || 'text-gray-600'}`}>
                    {getPriorityIcon(task.prioridad)} {prioridades[task.prioridad]?.label || 'Normal'}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(task.fechaEntrega).toLocaleDateString('es-ES')}
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  €{task.precioTarea}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditTask(task)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No se encontraron tareas' : 'No hay tareas registradas'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea la primera tarea para esta marca'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Button onClick={onAddTask}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Tarea
            </Button>
          )}
        </div>
      )}
    </div>
  );
}