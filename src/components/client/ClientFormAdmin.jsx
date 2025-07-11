import React from 'react';
import { Settings, Building2, User, CreditCard } from 'lucide-react';
import { paymentMethods, clientStatuses, clientTypes } from '@/lib/clientConstants';

export default function ClientFormAdmin({ formData, errors, onInputChange }) {
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-blue-600" />
        Configuración Administrativa
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de cliente
          </label>
          <div className="space-y-2">
            {clientTypes.map(type => (
              <label key={type.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="client_type"
                  value={type.value}
                  checked={formData.client_type === type.value}
                  onChange={(e) => onInputChange('client_type', e.target.value)}
                  className="text-blue-600"
                />
                {type.value === 'empresa' ? (
                  <Building2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
                <span className="font-medium">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Forma de pago
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="requires_invoice"
                value="false"
                checked={!formData.requires_invoice}
                onChange={() => onInputChange('requires_invoice', false)}
                className="text-blue-600"
              />
              <span className="font-medium">Efectivo (sin factura)</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="requires_invoice"
                value="true"
                checked={formData.requires_invoice}
                onChange={() => onInputChange('requires_invoice', true)}
                className="text-blue-600"
              />
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Factura</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {formData.requires_invoice && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFC/NIF *
            </label>
            <input
              type="text"
              value={formData.tax_id}
              onChange={(e) => onInputChange('tax_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tax_id ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="RFC123456789"
            />
            {errors.tax_id && (
              <p className="text-red-500 text-xs mt-1">{errors.tax_id}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de pago preferido
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) => onInputChange('payment_method', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {paymentMethods.map(method => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estatus del cliente
          </label>
          <select
            value={formData.status}
            onChange={(e) => onInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {clientStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}