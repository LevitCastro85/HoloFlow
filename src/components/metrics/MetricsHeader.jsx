import React from 'react';
import { RefreshCw, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MetricsHeader({ 
  lastUpdate, 
  chartView, 
  setChartView, 
  loading, 
  onRefresh, 
  onExport 
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Métricas Operativas</h1>
        <p className="text-gray-600 mt-1">
          Análisis integral de productividad, capacidad y cumplimiento
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Última actualización: {lastUpdate.toLocaleString('es-ES')}
        </p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={() => setChartView(chartView === 'bar' ? 'pie' : 'bar')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          {chartView === 'bar' ? 'Vista Circular' : 'Vista Barras'}
        </Button>
        
        <Button variant="outline" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        
        <Button onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
    </div>
  );
}