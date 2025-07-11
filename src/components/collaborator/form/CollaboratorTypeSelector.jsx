import React from 'react';
import { User, Users } from 'lucide-react';

const collaboratorTypes = [
  {
    value: 'interno',
    label: 'Colaborador Interno',
    icon: Users,
    description: 'Empleado con salario fijo semanal',
    color: 'border-blue-500 bg-blue-50'
  },
  {
    value: 'freelancer',
    label: 'Freelancer',
    icon: User,
    description: 'Colaborador externo con pago por actividad',
    color: 'border-purple-500 bg-purple-50'
  }
];

export default function CollaboratorTypeSelector({ collaboratorType, onInputChange }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-900 mb-2">Tipos de Colaborador</h4>
      <p className="text-sm text-blue-800 mb-3">
        Selecciona el tipo de colaborador para configurar correctamente la estructura de pagos.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {collaboratorTypes.map(type => {
          const Icon = type.icon;
          const isSelected = collaboratorType === type.value;
          
          return (
            <label
              key={type.value}
              className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected ? type.color : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="collaborator_type"
                value={type.value}
                checked={isSelected}
                onChange={onInputChange}
                className="sr-only"
              />
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-white' : 'bg-gray-100'
              }`}>
                <Icon className={`w-4 h-4 ${
                  isSelected ? (type.value === 'interno' ? 'text-blue-600' : 'text-purple-600') : 'text-gray-600'
                }`} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-xs text-gray-600">{type.description}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}