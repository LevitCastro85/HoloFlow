import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import MetricsHeader from '@/components/metrics/MetricsHeader';
import MetricsFilters from '@/components/metrics/MetricsFilters';
import MetricsSummary from '@/components/metrics/MetricsSummary';
import TaskLimitsValidation from '@/components/metrics/TaskLimitsValidation';
import ControlIndicators from '@/components/metrics/ControlIndicators';
import CollaboratorMetrics from '@/components/metrics/CollaboratorMetrics';
import TaskStatusChart from '@/components/metrics/TaskStatusChart';
import { MetricsCalculator } from '@/components/metrics/MetricsCalculator';

export default function MetricsPanel() {
  const [filters, setFilters] = useState({
    period: '30',
    clientId: '',
    brandId: '',
    collaborator: '',
    taskStatus: '',
    priority: '',
    contentType: ''
  });

  const [metrics, setMetrics] = useState({
    taskStats: {},
    brandLimits: [],
    indicators: {},
    collaborators: [],
    summary: {}
  });

  const [chartView, setChartView] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [baseData, setBaseData] = useState({
    clients: [],
    brands: [],
    collaborators: []
  });

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [filters, baseData]);

  const loadBaseData = () => {
    const savedClients = localStorage.getItem('creativeClients');
    const clients = savedClients ? JSON.parse(savedClients) : [];

    const savedBrands = localStorage.getItem('clientBrands');
    const brands = savedBrands ? JSON.parse(savedBrands) : [];

    const savedFreelancers = localStorage.getItem('creativeFreelancers');
    const collaborators = savedFreelancers ? JSON.parse(savedFreelancers) : [];

    setBaseData({ clients, brands, collaborators });
  };

  const calculateMetrics = () => {
    setLoading(true);
    
    try {
      const savedTasks = localStorage.getItem('brandTasks');
      const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
      
      const calculator = new MetricsCalculator(baseData);
      
      const filteredTasks = calculator.applyFilters(allTasks, filters);
      const taskStats = calculator.calculateTaskStats(filteredTasks);
      const brandLimits = calculator.calculateBrandLimits();
      const indicators = calculator.calculateControlIndicators(filteredTasks);
      const collaboratorMetrics = calculator.calculateCollaboratorMetrics(filteredTasks);
      const summary = calculator.calculateSummary(filteredTasks);

      setMetrics({
        taskStats,
        brandLimits,
        indicators,
        collaborators: collaboratorMetrics,
        summary
      });
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error calculating metrics:', error);
      toast({
        title: "Error al calcular métricas",
        description: "Hubo un problema al procesar los datos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadBaseData();
    calculateMetrics();
    toast({
      title: "Métricas actualizadas",
      description: "Los datos han sido recalculados correctamente"
    });
  };

  const handleExport = () => {
    toast({
      title: "🚧 Exportación de métricas",
      description: "Esta funcionalidad se implementará para exportar reportes en PDF/Excel"
    });
  };

  return (
    <div className="space-y-6">
      <MetricsHeader
        lastUpdate={lastUpdate}
        chartView={chartView}
        setChartView={setChartView}
        loading={loading}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      <MetricsFilters
        filters={filters}
        onFiltersChange={setFilters}
        brands={baseData.brands}
        clients={baseData.clients}
        collaborators={baseData.collaborators}
      />

      <MetricsSummary summary={metrics.summary} />

      <ControlIndicators indicators={metrics.indicators} />

      <TaskLimitsValidation brandLimits={metrics.brandLimits} />

      <div className="grid lg:grid-cols-2 gap-6">
        <TaskStatusChart taskStats={metrics.taskStats} viewType={chartView} />
        <CollaboratorMetrics collaborators={metrics.collaborators} />
      </div>
    </div>
  );
}