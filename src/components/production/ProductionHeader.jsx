import React from 'react';
import { List, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductionMetrics from '@/components/production/ProductionMetrics';

export default function ProductionHeader({ metrics, viewMode, setViewMode }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Motor de Producción</h1>
        <p className="text-gray-600 mt-1">Centro operativo para gestión por marca y responsables</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <ProductionMetrics metrics={metrics} />
        
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4 mr-1" />
            Tabla
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Calendario
          </Button>
        </div>
      </div>
    </div>
  );
}