import React from 'react';
import { DollarSign } from 'lucide-react';

export default function InternalCollaboratorFields({ formData, errors, onInputChange, onBlur }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-900 mb-3 flex items-center">
        <DollarSign className="w-4 h-4 mr-2" />
        Configuración Salarial - Colaborador Interno
      </h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Salario semanal (MXN) *
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              name="weekly_salary"
              min="0"
              step="0.01"
              value={formData.weekly_salary}
              onChange={onInputChange}
              onBlur={onBlur}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.weekly_salary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="6250.00"
            />
        </div>
        {errors.weekly_salary && <p className="text-red-500 text-xs mt-1">{errors.weekly_salary}</p>}
        <p className="text-xs text-blue-700 mt-1">
          Salario fijo semanal que se incluirá en los costos de producción.
        </p>
      </div>
    </div>
  );
}