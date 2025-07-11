import React from 'react';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';

export default function BrandingLogo({ brandingData, handleInputChange, isEditing }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Image className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Logotipo</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción del logotipo
        </label>
        <textarea
          value={brandingData.logotipo?.descripcion || ''}
          onChange={(e) => handleInputChange('logotipo', 'descripcion', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Describe el logotipo, sus elementos, significado..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Archivos del logotipo
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">Sube archivos PNG y SVG del logotipo</p>
          <p className="text-sm text-gray-500">Formatos recomendados: .PNG, .SVG, .AI</p>
          {isEditing && (
            <input
              type="file"
              multiple
              accept=".png,.svg,.ai"
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
          Usos y aplicaciones
        </label>
        <textarea
          value={brandingData.logotipo?.usos || ''}
          onChange={(e) => handleInputChange('logotipo', 'usos', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Especifica dónde y cómo se debe usar el logotipo..."
        />
      </div>
    </motion.div>
  );
}