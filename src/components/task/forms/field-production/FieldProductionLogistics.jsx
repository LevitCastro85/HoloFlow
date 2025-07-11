import React from 'react';

export default function FieldProductionLogistics({ formData, handleInputChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Personal involucrado
        </label>
        <textarea
          name="involved_personnel"
          value={formData.involved_personnel}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Modelos, entrevistados, staff adicional, coordinadores..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material de referencia previo
        </label>
        <textarea
          name="reference_material"
          value={formData.reference_material}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enlaces, archivos de referencia, ejemplos de estilo..."
        />
      </div>
    </>
  );
}