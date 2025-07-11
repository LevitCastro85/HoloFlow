import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tiposContenido = [
  { value: 'diseño', label: 'Diseño Gráfico' },
  { value: 'reel', label: 'Reel / Video' },
  { value: 'fotografia', label: 'Fotografía' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'branding', label: 'Branding' },
  { value: 'web', label: 'Desarrollo Web' },
  { value: 'marketing', label: 'Marketing Digital' }
];

const prioridades = [
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' }
];

export default function BulkTaskTable({ 
  tasks, 
  errors, 
  collaborators, 
  onAddTask, 
  onRemoveTask, 
  onDuplicateTask, 
  onUpdateTask 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Tareas a Crear</h3>
          <Button onClick={onAddTask} disabled={tasks.length >= 10}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Tarea
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[200px]">Título *</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[150px]">Tipo *</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[120px]">Red Social</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[150px]">Responsable</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[120px]">Fecha Entrega *</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[100px]">Prioridad</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[100px]">Precio</th>
              <th className="text-left p-4 font-semibold text-gray-900 min-w-[120px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">
                  <input
                    type="text"
                    value={task.titulo}
                    onChange={(e) => onUpdateTask(task.id, 'titulo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[task.id]?.titulo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Título de la tarea"
                  />
                  {errors[task.id]?.titulo && (
                    <p className="text-red-500 text-xs mt-1">{errors[task.id].titulo}</p>
                  )}
                </td>

                <td className="p-4">
                  <select
                    value={task.tipoContenido}
                    onChange={(e) => onUpdateTask(task.id, 'tipoContenido', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[task.id]?.tipoContenido ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar</option>
                    {tiposContenido.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                  {errors[task.id]?.tipoContenido && (
                    <p className="text-red-500 text-xs mt-1">{errors[task.id].tipoContenido}</p>
                  )}
                </td>

                <td className="p-4">
                  <select
                    value={task.redSocial}
                    onChange={(e) => onUpdateTask(task.id, 'redSocial', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="web">Sitio Web</option>
                  </select>
                </td>

                <td className="p-4">
                  <select
                    value={task.responsable}
                    onChange={(e) => onUpdateTask(task.id, 'responsable', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sin asignar</option>
                    {collaborators.map(collaborator => (
                      <option key={collaborator.id} value={collaborator.nombre}>
                        {collaborator.nombre}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4">
                  <input
                    type="date"
                    value={task.fechaEntrega}
                    onChange={(e) => onUpdateTask(task.id, 'fechaEntrega', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[task.id]?.fechaEntrega ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[task.id]?.fechaEntrega && (
                    <p className="text-red-500 text-xs mt-1">{errors[task.id].fechaEntrega}</p>
                  )}
                </td>

                <td className="p-4">
                  <select
                    value={task.prioridad}
                    onChange={(e) => onUpdateTask(task.id, 'prioridad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {prioridades.map(prioridad => (
                      <option key={prioridad.value} value={prioridad.value}>
                        {prioridad.label}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={task.precioTarea}
                      onChange={(e) => onUpdateTask(task.id, 'precioTarea', parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDuplicateTask(index)}
                      title="Duplicar tarea"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemoveTask(task.id)}
                      disabled={tasks.length === 1}
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}