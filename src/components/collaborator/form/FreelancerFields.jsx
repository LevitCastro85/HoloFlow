import React from 'react';
import { DollarSign } from 'lucide-react';

export default function FreelancerFields({ formData, errors, onInputChange, onBlur }) {
  return (
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
      <h4 className="font-medium text-purple-900 mb-3 flex items-center">
        <DollarSign className="w-4 h-4 mr-2" />
        Configuración de Tarifas - Freelancer
      </h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tarifa base por actividad (MXN) *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            name="base_activity_rate"
            min="0"
            step="0.01"
            value={formData.base_activity_rate}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.base_activity_rate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="500.00"
          />
        </div>
        {errors.base_activity_rate && <p className="text-red-500 text-xs mt-1">{errors.base_activity_rate}</p>}
        <p className="text-xs text-purple-700 mt-1">
          Tarifa base por actividad. El monto final se definirá al asignar cada tarea específica.
        </p>
      </div>
    </div>
  );
}