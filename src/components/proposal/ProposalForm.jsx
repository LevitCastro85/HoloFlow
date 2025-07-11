import React from 'react';
import { motion } from 'framer-motion';

export default function ProposalForm({ propuesta, setPropuesta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Proyecto</h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente *
          </label>
          <input
            type="text"
            value={propuesta.cliente}
            onChange={(e) => setPropuesta(prev => ({ ...prev, cliente: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del cliente"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proyecto *
          </label>
          <input
            type="text"
            value={propuesta.proyecto}
            onChange={(e) => setPropuesta(prev => ({ ...prev, proyecto: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del proyecto"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descuento (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={propuesta.descuento}
            onChange={(e) => setPropuesta(prev => ({ ...prev, descuento: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validez (días)
          </label>
          <input
            type="number"
            min="1"
            value={propuesta.validez}
            onChange={(e) => setPropuesta(prev => ({ ...prev, validez: parseInt(e.target.value) || 30 }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}