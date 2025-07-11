import React from 'react';
import { productionTypes, productionObjectives } from './FieldProductionConstants';

export default function FieldProductionType({ formData, handleInputChange }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de producción *
        </label>
        <select
          name="production_type"
          value={formData.production_type}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        >
          <option value="">Seleccionar tipo</option>
          {productionTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Objetivo de la producción
        </label>
        <select
          name="production_objective"
          value={formData.production_objective}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Seleccionar objetivo</option>
          {productionObjectives.map(objective => (
            <option key={objective.value} value={objective.value}>{objective.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}