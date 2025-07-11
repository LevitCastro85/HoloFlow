import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, DollarSign, FileText, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

export default function ProposalSummary({ 
  propuesta, 
  totales, 
  generatedProposal, 
  onGenerarPropuesta 
}) {
  const exportarPropuesta = () => {
    toast({
      title: "🚧 Esta funcionalidad aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6 sticky top-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Subtotal</span>
          </div>
          <span className="font-medium">{formatCurrency(totales.subtotal)}</span>
        </div>
        
        {propuesta.descuento > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Descuento ({propuesta.descuento}%)</span>
            </div>
            <span className="font-medium text-red-600">-{formatCurrency(totales.descuentoAmount)}</span>
          </div>
        )}
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-900">Total</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(totales.total)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Tiempo estimado</span>
          </div>
          <span className="font-medium">{totales.tiempoTotal} días</span>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <Button
          onClick={onGenerarPropuesta}
          className="w-full"
          disabled={!propuesta.cliente || !propuesta.proyecto || propuesta.servicios.length === 0}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generar Propuesta
        </Button>
        
        {generatedProposal && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => toast({
                title: "🚧 Esta funcionalidad aún no está implementada",
                description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt 🚀"
              })}
            >
              <Eye className="w-3 h-3 mr-1" />
              Vista Previa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={exportarPropuesta}
            >
              <Download className="w-3 h-3 mr-1" />
              Exportar
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}