import React from 'react';
import { Palette, ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BulkTaskHeader({ brand, client, tasks, taskLimitInfo, onOpenBranding }) {
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Creación Masiva de Tareas</h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>Marca: {brand.name || brand.nombre}</span>
              <span>•</span>
              <Building2 className="w-4 h-4" />
              <span>Cliente: {client?.name || client?.nombre || 'No asignado'}</span>
              <span>•</span>
              <span>{brand.industry || brand.industria}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenBranding}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Branding Control
          </Button>
          
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">
              {tasks.length} tarea{tasks.length !== 1 ? 's' : ''} en este lote
            </div>
            <div className="text-xs text-gray-500">
              {taskLimitInfo.current + tasks.length} / {taskLimitInfo.limit} total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}