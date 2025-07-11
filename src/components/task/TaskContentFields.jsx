import React from 'react';
import { MessageSquare } from 'lucide-react';
import { socialNetworks } from '@/lib/resourceConstants';

export default function TaskContentFields({ formData, onInputChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
        Contenido y Publicación
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Red Social
          </label>
          <select
            name="social_network"
            value={formData.social_network}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {socialNetworks.map(network => (
              <option key={network.value} value={network.value}>{network.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaña o Tema
          </label>
          <input
            type="text"
            name="campaign_theme"
            value={formData.campaign_theme}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Campaña de verano, Black Friday..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Encabezado o Título Principal
        </label>
        <input
          type="text"
          name="header_text"
          value={formData.header_text}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Título o copy principal del contenido"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Texto Descriptivo
        </label>
        <textarea
          name="descriptive_text"
          value={formData.descriptive_text}
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descripción detallada del contenido a publicar..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Call to Action (CTA)
        </label>
        <input
          type="text"
          name="call_to_action"
          value={formData.call_to_action}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Compra ahora, Visita nuestro sitio, Contáctanos..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas y Observaciones
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Apuntes internos, aclaraciones del cliente, instrucciones especiales..."
        />
      </div>
    </div>
  );
}