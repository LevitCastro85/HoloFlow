import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function BrandingCommunication({ brandingData, handleInputChange, isEditing }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Tono de Comunicación</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personalidad de la marca
          </label>
          <textarea
            value={brandingData.tonoComunicacion.personalidad}
            onChange={(e) => handleInputChange('tonoComunicacion', 'personalidad', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            placeholder="Ej: Amigable, profesional, innovadora..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voz de la marca
          </label>
          <textarea
            value={brandingData.tonoComunicacion.voz}
            onChange={(e) => handleInputChange('tonoComunicacion', 'voz', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            placeholder="Ej: Cercana, experta, motivadora..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estilo de comunicación
        </label>
        <textarea
          value={brandingData.tonoComunicacion.estilo}
          onChange={(e) => handleInputChange('tonoComunicacion', 'estilo', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Formal/informal, técnico/simple, directo/descriptivo..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ejemplos de comunicación
        </label>
        <textarea
          value={brandingData.tonoComunicacion.ejemplos}
          onChange={(e) => handleInputChange('tonoComunicacion', 'ejemplos', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Frases ejemplo, palabras clave, expresiones típicas..."
        />
      </div>
    </motion.div>
  );
}