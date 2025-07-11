import React from 'react';
import { Clock, User, Flag } from 'lucide-react';
import { taskStatuses, taskPriorities } from '@/lib/resourceConstants';

export default function TaskBasicFields({ formData, errors, collaborators, services, clients, onInputChange }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la tarea *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Post promocional verano 2025"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicio Requerido *
          </label>
          <select
            name="service_id"
            value={formData.service_id}
            onChange={onInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.service_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.category?.name || 'Sin categoría'}
              </option>
            ))}
          </select>
          {errors.service_id && (
            <p className="text-red-500 text-xs mt-1">{errors.service_id}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Responsable asignado
          </label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sin asignar</option>
            {collaborators.map(collaborator => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name} - {collaborator.specialty} ({collaborator.collaborator_type === 'interno' ? 'Interno' : 'Freelancer'})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Fecha de solicitud
          </label>
          <input
            type="date"
            name="request_date"
            value={formData.request_date}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Fecha de entrega *
          </label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={onInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.due_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.due_date && (
            <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Flag className="w-4 h-4 inline mr-1" />
            Prioridad
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {taskPriorities.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {taskStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del proyecto
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe brevemente el proyecto y sus objetivos..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brief creativo
        </label>
        <textarea
          name="brief"
          value={formData.brief}
          onChange={onInputChange}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Incluye referencias, estilo, colores, mensaje clave, público objetivo, especificaciones técnicas..."
        />
      </div>
    </>
  );
}