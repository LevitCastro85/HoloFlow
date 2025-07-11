import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function BrandingIdentity({ brandingData, handleSimpleInputChange, isEditing }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Heart className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Misión, Visión y Valores</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Misión
        </label>
        <textarea
          value={brandingData.mision}
          onChange={(e) => handleSimpleInputChange('mision', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="¿Cuál es el propósito de la marca?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visión
        </label>
        <textarea
          value={brandingData.vision}
          onChange={(e) => handleSimpleInputChange('vision', e.target.value)}
          disabled={!isEditing}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="¿Hacia dónde se dirige la marca?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valores
        </label>
        <textarea
          value={brandingData.valores}
          onChange={(e) => handleSimpleInputChange('valores', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          placeholder="¿Qué principios guían a la marca?"
        />
      </div>
    </motion.div>
  );
}