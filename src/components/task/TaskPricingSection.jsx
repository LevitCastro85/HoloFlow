import React from 'react';
import { DollarSign, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TaskPricingSection({ formData, onInputChange, getServicePrice }) {
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
            name="precioPersonalizado"
            checked={formData.precioPersonalizado}
            onChange={onInputChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Precio personalizado</span>
        </label>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio de esta tarea
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              name="precioTarea"
              min="0"
              step="0.01"
              value={formData.precioTarea}
              onChange={onInputChange}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          {formData.tipoContenido && (
            <div className="text-sm text-gray-600">
              <p>Precio sugerido: <span className="font-medium">{formatCurrency(getServicePrice(formData.tipoContenido))}</span></p>
              {formData.precioPersonalizado && formData.precioTarea !== getServicePrice(formData.tipoContenido) && (
                <p className="text-blue-600 mt-1">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Precio personalizado aplicado
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}