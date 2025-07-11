import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function ServiceCatalog({ services, categories, onEditService, onAddService, onAddCategory }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Catálogo de Servicios</h2>
          <p className="text-gray-600">Precios base oficiales de la agencia</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onAddCategory}>
            <Settings className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
          <Button onClick={onAddService}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-6 border"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{service.nombre}</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {service.categoria}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEditService(service)}
              >
                <Edit className="w-3 h-3" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{service.descripcion}</p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio base:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(service.precioBase)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tiempo estimado:</span>
                <span className="font-medium text-gray-900">
                  {service.tiempoEstimado} días
                </span>
              </div>
              {service.observaciones && (
                <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                  {service.observaciones}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}