import React from 'react';
import { motion } from 'framer-motion';
import { Type } from 'lucide-react';

export default function BrandingTypography({ brandingData, handleInputChange, isEditing }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Type className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Tipografías</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipografía Principal
          </label>
          <input
            type="text"
            value={brandingData.tipografias.principal}
            onChange={(e) => handleInputChange('tipografias', 'principal', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            placeholder="Ej: Montserrat, Arial, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipografía Secundaria
          </label>
          <input
            type="text"
            value={brandingData.tipografias.secundaria}
            onChange={(e) => handleInputChange('tipografias', 'secundaria', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            placeholder="Ej: Open Sans, Helvetica, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas sobre tipografías
        </label>
        <textarea
          value={brandingData.tipografias.notas}
          onChange={(e) => handleInputChange('tipografias', 'notas', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="Usos específicos, combinaciones, tamaños recomendados..."
        />
      </div>

      {/* Vista previa de tipografías */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h5 className="font-medium text-gray-900 mb-3">Vista previa</h5>
        <div className="space-y-3">
          {brandingData.tipografias.principal && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipografía Principal:</p>
              <p className="text-2xl font-bold" style={{ fontFamily: brandingData.tipografias.principal }}>
                {brandingData.tipografias.principal}
              </p>
            </div>
          )}
          {brandingData.tipografias.secundaria && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Tipografía Secundaria:</p>
              <p className="text-lg" style={{ fontFamily: brandingData.tipografias.secundaria }}>
                {brandingData.tipografias.secundaria}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}