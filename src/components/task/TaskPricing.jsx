import React from 'react';
import { DollarSign } from 'lucide-react';

export default function TaskPricing({ formData, setFormData, getServicePrice }) {
  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Precio de la Tarea</h3>
        </div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.precioPersonalizado}
            onChange={(e) => setFormData(prev => ({ ...prev, precioPersonalizado: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Precio personalizado</span>
        </label>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio de esta tarea (€)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.precioTarea}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              precioTarea: parseFloat(e.target.value) || 0,
              precioPersonalizado: true
            }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        
        <div className="flex flex-col justify-center">
          {formData.cliente && formData.tipo && (
            <div className="text-sm text-gray-600">
              <p>Precio sugerido: <span className="font-medium">€{getServicePrice(formData.tipo, formData.cliente)}</span></p>
              {formData.precioPersonalizado && formData.precioTarea !== getServicePrice(formData.tipo, formData.cliente) && (
                <p className="text-blue-600 mt-1">
                  ✓ Precio personalizado para esta tarea
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}