import React from 'react';
import { Palette, ExternalLink, AlertTriangle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskHeader({ brand, client, taskLimitInfo, onOpenBranding }) {
  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{brand.name || brand.nombre}</h2>
            <div className="flex items-center space-x-2 text-gray-600">
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
            <div className={`text-sm font-medium ${taskLimitInfo.canCreate ? 'text-green-600' : 'text-red-600'}`}>
              {taskLimitInfo.current} / {taskLimitInfo.limit} tareas activas
            </div>
            <div className="text-xs text-gray-500">Plan actual</div>
          </div>
        </div>
      </div>
      
      {!taskLimitInfo.canCreate && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 text-sm">
            Esta marca ha alcanzado el límite de tareas activas. Contacta al administrador para autorización manual.
          </span>
        </div>
      )}
    </div>
  );
}