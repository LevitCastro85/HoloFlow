import React from 'react';
import { technicalRequirements, equipment } from './FieldProductionConstants';

export default function FieldProductionRequirements({ formData, handleMultiSelectChange }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Requerimientos técnicos
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {technicalRequirements.map(requirement => (
            <label key={requirement.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.technical_requirements.includes(requirement.value)}
                onChange={() => handleMultiSelectChange('technical_requirements', requirement.value)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{requirement.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Equipo necesario
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {equipment.map(item => (
            <label key={item.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.equipment_needed.includes(item.value)}
                onChange={() => handleMultiSelectChange('equipment_needed', item.value)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}