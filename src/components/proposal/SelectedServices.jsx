import React from 'react';
import { motion } from 'framer-motion';
import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function SelectedServices({ propuesta, setPropuesta }) {
  const actualizarServicio = (index, campo, valor) => {
    setPropuesta(prev => ({
      ...prev,
      servicios: prev.servicios.map((servicio, i) => 
        i === index ? { ...servicio, [campo]: valor } : servicio
      )
    }));
  };

  const eliminarServicio = (index) => {
    setPropuesta(prev => ({
      ...prev,
      servicios: prev.servicios.filter((_, i) => i !== index)
    }));
  };

  if (propuesta.servicios.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios Seleccionados</h2>
      
      <div className="space-y-4">
        {propuesta.servicios.map((servicio, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{servicio.nombre}</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => eliminarServicio(index)}
              >
                <Minus className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={servicio.cantidad}
                  onChange={(e) => actualizarServicio(index, 'cantidad', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Precio Unitario
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={servicio.precioUnitario}
                    onChange={(e) => actualizarServicio(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tiempo (días)
                </label>
                <input
                  type="number"
                  min="1"
                  value={servicio.tiempoEstimado}
                  onChange={(e) => actualizarServicio(index, 'tiempoEstimado', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <div className="mt-3 text-right">
              <span className="text-sm font-medium text-gray-900">
                Subtotal: {formatCurrency(servicio.cantidad * servicio.precioUnitario)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}