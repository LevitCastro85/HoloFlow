import React from 'react';
import { Clock, AlertTriangle, UserX, Upload } from 'lucide-react';

export default function ProductionMetrics({ metrics }) {
  return (
    <div className="flex space-x-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-2xl font-bold text-blue-600">{metrics.enProceso}</div>
            <div className="text-sm text-gray-600">En Proceso</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-yellow-600" />
          <div>
            <div className="text-2xl font-bold text-yellow-600">{metrics.enRevision || 0}</div>
            <div className="text-sm text-gray-600">En Revisión</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <div className="text-2xl font-bold text-red-600">{metrics.vencidas}</div>
            <div className="text-sm text-gray-600">Vencidas</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-2">
          <UserX className="w-5 h-5 text-orange-600" />
          <div>
            <div className="text-2xl font-bold text-orange-600">{metrics.sinAsignar}</div>
            <div className="text-sm text-gray-600">Sin Asignar</div>
          </div>
        </div>
      </div>
    </div>
  );
}