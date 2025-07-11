import React from 'react';
import { motion } from 'framer-motion';
import { Palette, UserX } from 'lucide-react';
import { taskStatusColors, priorityColors } from '@/lib/resourceConstants';
import ProductionTaskActions from '@/components/production/ProductionTaskActions';

const statusLabels = {
  'en-fila': 'En Fila',
  'en-proceso': 'En Proceso',
  'revision': 'En Revisión',
  'requiere-atencion': 'Requiere Atención',
  'entregado': 'Entregado',
  'cancelado': 'Cancelado'
};

const priorityLabels = {
  'baja': 'Baja',
  'normal': 'Normal',
  'media': 'Media',
  'alta': 'Alta',
  'urgente': 'Urgente'
};

const priorityIcons = {
  'baja': '⚪',
  'normal': '🔵',
  'media': '🟡',
  'alta': '🟠',
  'urgente': '🔴'
};

export default function ProductionTaskTable({ tasks, collaborators, actions }) {
  const updateTaskStatus = (taskId, newStatus) => {
    actions.updateTask(taskId, { status: newStatus });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-900">Tarea</th>
            <th className="text-left p-4 font-semibold text-gray-900">Marca</th>
            <th className="text-left p-4 font-semibold text-gray-900">Tipo</th>
            <th className="text-left p-4 font-semibold text-gray-900">Responsable</th>
            <th className="text-left p-4 font-semibold text-gray-900">Estado</th>
            <th className="text-left p-4 font-semibold text-gray-900">Prioridad</th>
            <th className="text-left p-4 font-semibold text-gray-900">Entrega</th>
            <th className="text-left p-4 font-semibold text-gray-900">Acciones Rápidas</th>
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
                  <div className="font-medium text-gray-900">{task.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">{task.description}</div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">{task.brand?.name || 'Sin marca'}</div>
                    <div className="text-sm text-gray-600">{task.brand?.client?.name || 'Sin cliente'}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {task.service?.name || 'Sin servicio'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{task.assigned_collaborator?.name || 'Sin asignar'}</span>
                  {!task.assigned_collaborator && (
                    <UserX className="w-4 h-4 text-orange-500" title="Sin asignar" />
                  )}
                </div>
              </td>
              <td className="p-4">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 ${taskStatusColors[task.status] || 'text-gray-600 bg-gray-100'}`}
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </td>
              <td className="p-4">
                <span className={`text-sm font-medium ${priorityColors[task.priority] || 'text-gray-600'}`}>
                  {priorityIcons[task.priority] || '⚪'} {priorityLabels[task.priority] || 'Normal'}
                </span>
              </td>
              <td className="p-4">
                <div className="text-sm">
                  <div className="text-gray-900">
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </div>
                  {task.status !== 'entregado' && task.due_date && new Date(task.due_date) < new Date() && (
                    <div className="text-red-600 text-xs font-medium">Vencida</div>
                  )}
                </div>
              </td>
              <td className="p-4">
                <ProductionTaskActions
                  task={task}
                  collaborators={collaborators}
                  onReschedule={(newDate) => actions.rescheduleTask(task.id, newDate)}
                  onReassign={(newResponsibleId) => actions.reassignTask(task.id, newResponsibleId)}
                  onDuplicate={() => actions.duplicateTask(task.id)}
                  onOpenBranding={() => actions.openBrandingControl(task)}
                  onCancelTask={(reason) => actions.cancelTask(task.id, reason)}
                />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}