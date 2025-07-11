import React from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function SalesOverview({ 
  activeSales, 
  getContractStatus, 
  frequencyConfig, 
  periodTypeConfig, 
  onEditSale 
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Contratos Activos</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeSales.map((sale, index) => {
          const status = getContractStatus(sale);
          const frequency = frequencyConfig[sale.frecuencia];
          const periodType = periodTypeConfig[sale.tipoPeriodo];
          const FrequencyIcon = frequency.icon;
          const PeriodIcon = periodType.icon;
          
          return (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-6 border"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{sale.clienteNombre}</h3>
                  <p className="text-sm text-gray-600">{sale.servicioNombre}</p>
                </div>
                <div className="flex space-x-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(sale.precioFinal)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frecuencia:</span>
                  <div className="flex items-center space-x-1">
                    <FrequencyIcon className={`w-3 h-3 ${frequency.color}`} />
                    <span className="font-medium">{frequency.label}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Período:</span>
                  <div className="flex items-center space-x-1">
                    <PeriodIcon className={`w-3 h-3 ${periodType.color}`} />
                    <span className="font-medium">{periodType.label}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inicio:</span>
                  <span className="font-medium">
                    {new Date(sale.fechaInicio).toLocaleDateString('es-MX')}
                  </span>
                </div>
                
                {sale.fechaFin && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fin:</span>
                    <span className="font-medium">
                      {new Date(sale.fechaFin).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                )}
              </div>

              {sale.notas && (
                <div className="mt-4 text-xs text-gray-500 bg-white p-3 rounded border">
                  {sale.notas}
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => onEditSale(sale)}>
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}