import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Image } from 'lucide-react';

export default function BrandingVisualStyle({ brandingData, handleInputChange, isEditing }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Eye className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Estilo Visual</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del estilo visual
        </label>
        <textarea
          value={brandingData.estiloVisual?.descripcion || ''}
          onChange={(e) => handleInputChange('estiloVisual', 'descripcion', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Describe el estilo visual general de la marca..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Referencias visuales
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Sube imágenes de referencia o mockups</p>
          <p className="text-sm text-gray-500">Ejemplos de composición, estilo, referencias</p>
          {isEditing && (
            <input
              type="file"
              multiple
              accept="image/*"
              className="mt-3"
              onChange={() => {
                // Funcionalidad de subida de archivos
              }}
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas adicionales
        </label>
        <textarea
          value={brandingData.estiloVisual?.notas || ''}
          onChange={(e) => handleInputChange('estiloVisual', 'notas', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Notas adicionales sobre el estilo visual..."
        />
      </div>
    </motion.div>
  );
}