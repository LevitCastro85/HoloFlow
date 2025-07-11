import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RenewalAlerts({ renewalAlerts, onEditSale }) {
  if (renewalAlerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-orange-50 border border-orange-200 rounded-lg p-4"
    >
      <div className="flex items-center space-x-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-orange-900">Contratos próximos a vencer</h3>
      </div>
      <div className="space-y-2">
        {renewalAlerts.map(sale => {
          const endDate = new Date(sale.fechaFin);
          const today = new Date();
          const daysUntilEnd = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={sale.id} className="flex items-center justify-between bg-white p-3 rounded border">
              <div>
                <span className="font-medium text-gray-900">{sale.clienteNombre}</span>
                <span className="text-gray-600 ml-2">- {sale.servicioNombre}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-orange-600">
                  Vence en {daysUntilEnd} día{daysUntilEnd !== 1 ? 's' : ''}
                </span>
                <Button size="sm" variant="outline" onClick={() => onEditSale(sale)}>
                  <Edit className="w-3 h-3 mr-1" />
                  Renovar
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}