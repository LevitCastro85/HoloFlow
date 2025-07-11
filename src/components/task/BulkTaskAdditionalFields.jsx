import React from 'react';
import { motion } from 'framer-motion';

export default function BulkTaskAdditionalFields({ tasks, onUpdateTask }) {
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campos Adicionales (Opcional)</h3>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border border-gray-200 rounded-lg p-4"
          >
            <h4 className="font-medium text-gray-900 mb-3">
              Tarea {index + 1}: {task.titulo || 'Sin título'}
            </h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={task.descripcion}
                  onChange={(e) => onUpdateTask(task.id, 'descripcion', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción del proyecto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema o Campaña
                </label>
                <input
                  type="text"
                  value={task.temaCampana}
                  onChange={(e) => onUpdateTask(task.id, 'temaCampana', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Campaña de verano"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encabezado
                </label>
                <input
                  type="text"
                  value={task.encabezado}
                  onChange={(e) => onUpdateTask(task.id, 'encabezado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Título principal del contenido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={task.cta}
                  onChange={(e) => onUpdateTask(task.id, 'cta', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Compra ahora, Visita nuestro sitio"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas y Observaciones
              </label>
              <textarea
                value={task.notasObservaciones}
                onChange={(e) => onUpdateTask(task.id, 'notasObservaciones', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apuntes internos, aclaraciones del cliente..."
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}