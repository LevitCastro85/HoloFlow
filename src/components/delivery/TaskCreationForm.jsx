import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskCreationForm({ 
  newTaskData, 
  setNewTaskData, 
  onCreateTask 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-gray-50 rounded-lg p-4 space-y-4"
    >
      <h4 className="font-medium text-gray-900">Crear Tarea Rápida</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la tarea *
          </label>
          <input
            type="text"
            value={newTaskData.titulo}
            onChange={(e) => setNewTaskData(prev => ({ ...prev, titulo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Diseño de post promocional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca o cliente *
          </label>
          <input
            type="text"
            value={newTaskData.marca}
            onChange={(e) => setNewTaskData(prev => ({ ...prev, marca: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Marca XYZ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de entrega *
          </label>
          <select
            value={newTaskData.tipoContenido}
            onChange={(e) => setNewTaskData(prev => ({ ...prev, tipoContenido: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar tipo</option>
            <option value="diseño">Diseño Gráfico</option>
            <option value="reel">Reel / Video</option>
            <option value="fotografia">Fotografía</option>
            <option value="copywriting">Copywriting</option>
            <option value="social-media">Social Media</option>
            <option value="branding">Branding</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha estimada *
          </label>
          <input
            type="date"
            value={newTaskData.fechaEntrega}
            onChange={(e) => setNewTaskData(prev => ({ ...prev, fechaEntrega: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={onCreateTask} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-2" />
          Crear Tarea
        </Button>
      </div>
    </motion.div>
  );
}