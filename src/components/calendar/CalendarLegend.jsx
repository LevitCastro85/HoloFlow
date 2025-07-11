import React from 'react';

export default function CalendarLegend() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Leyenda de Estados y Prioridades</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Estados de Tareas</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border bg-gray-100 border-gray-300"></div>
              <span className="text-sm text-gray-700">En fila</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border bg-blue-100 border-blue-300"></div>
              <span className="text-sm text-gray-700">En proceso</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border bg-yellow-100 border-yellow-300"></div>
              <span className="text-sm text-gray-700">En revisión</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border bg-green-100 border-green-300"></div>
              <span className="text-sm text-gray-700">Entregado</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border bg-red-100 border-red-300"></div>
              <span className="text-sm text-gray-700">Requiere atención</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Prioridades</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-l-4 border-l-gray-400 bg-gray-100"></div>
              <span className="text-sm text-gray-700">Normal</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-l-4 border-l-orange-400 bg-orange-100"></div>
              <span className="text-sm text-gray-700">Alta</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-l-4 border-l-red-500 bg-red-100"></div>
              <span className="text-sm text-gray-700">Urgente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}