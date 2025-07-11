import React from 'react';

export default function ResourceMetadataForm({
  formData,
  onFormChange,
  availableTasks,
  availableServices,
  availableClients,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vincular con tarea (opcional)
          </label>
          <select
            name="taskId"
            value={formData.taskId}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sin vincular a tarea</option>
            {availableTasks.map(task => (
              <option key={task.id} value={task.id}>
                {task.titulo} - {task.marcaNombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de servicio (opcional)
          </label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sin especificar servicio</option>
            {availableServices.map(service => (
              <option key={service.id} value={service.id}>
                {service.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cliente asociado (opcional)
        </label>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={onFormChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Sin cliente específico</option>
          {availableClients.map(client => (
            <option key={client.id} value={client.id}>
              {client.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="logos">Logos</option>
            <option value="plantillas">Plantillas</option>
            <option value="entregables">Entregables</option>
            <option value="fotografias">Fotografías</option>
            <option value="videos">Videos</option>
            <option value="audio">Audio/Jingles</option>
            <option value="documentos">Documentos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas (separadas por comas)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={onFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="diseño, instagram, promocional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas de entrega (opcional)
        </label>
        <textarea
          name="deliveryNotes"
          value={formData.deliveryNotes}
          onChange={onFormChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Información adicional, instrucciones de uso, etc."
        />
      </div>
    </div>
  );
}