import React from 'react';

export default function FieldProductionDetails({ formData, handleInputChange, collaborators }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locación (zona general) *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Ej: Centro de la ciudad, Zona industrial"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección exacta
          </label>
          <input
            type="text"
            name="exact_address"
            value={formData.exact_address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Dirección completa del lugar"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de la sesión
          </label>
          <input
            type="date"
            name="session_date"
            value={formData.session_date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horario de la sesión
          </label>
          <input
            type="time"
            name="session_time"
            value={formData.session_time}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable asignado
          </label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Sin asignar</option>
            {collaborators.map(collaborator => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name} - {collaborator.specialty}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}