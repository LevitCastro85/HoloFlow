import React from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function BulkTaskSummary({ tasks, brand, client, onSubmit, onCancel }) {
  const totalPrice = tasks.reduce((sum, task) => sum + (task.precioTarea || 0), 0);

  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">Resumen del Lote</h3>
          <div className="space-y-1 text-blue-700 text-sm">
            <p>• {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} a crear</p>
            <p>• Precio total estimado: {formatCurrency(totalPrice)}</p>
            <p>• Marca: {brand.nombre}</p>
            <p>• Cliente: {client.nombre}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Crear {tasks.length} Tarea{tasks.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}