import React from 'react';
    import { motion } from 'framer-motion';
    import { 
      Edit3, 
      Bot, 
      Calendar,
      UserX,
      List
    } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import ProductionCalendarView from '@/components/production/ProductionCalendarView';
    import ProductionTaskActions from '@/components/production/ProductionTaskActions';
    import ProductionFilters from '@/components/production/ProductionFilters';
    import ProductionMetrics from '@/components/production/ProductionMetrics';
    import ProductionTaskTable from '@/components/production/ProductionTaskTable';
    import { useProductionEngine } from '@/hooks/useProductionEngine';

    export default function ProductionEngine() {
      const {
        tasks,
        viewMode,
        setViewMode,
        filters,
        handleFilterChange,
        searchTerm,
        setSearchTerm,
        metrics,
        brands,
        collaborators,
        uniqueResponsibles,
        uniqueTypes,
        actions,
        loading,
      } = useProductionEngine();

      if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      if (viewMode === 'calendar') {
        return (
          <ProductionCalendarView
            tasks={tasks}
            brands={brands}
            onBackToTable={() => setViewMode('table')}
            onTaskUpdate={(taskId, updates) => actions.updateTask(taskId, updates)}
          />
        );
      }

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Motor de Producción</h1>
              <p className="text-gray-600 mt-1">Centro operativo para gestión por marca, automatización IA y responsables</p>
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

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">
              🎯 Centro Operativo de Producción
            </h3>
            <p className="text-purple-700 text-sm">
              Gestiona el flujo de trabajo por marca, tipo de tarea, automatización IA y responsables. 
              Incluye acciones rápidas como reprogramar, reasignar y duplicar tareas.
            </p>
          </div>

          <ProductionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            brands={brands}
            responsibles={uniqueResponsibles}
            types={uniqueTypes}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden"
          >
            <ProductionTaskTable
              tasks={tasks}
              collaborators={collaborators}
              onUpdateTask={actions.updateTask}
              onDuplicateTask={actions.duplicateTask}
              onCancelTask={actions.cancelTask}
            />
            
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit3 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filters.status !== 'all' || filters.brand !== 'all' 
                    ? 'No se encontraron tareas' 
                    : 'No hay tareas en producción'
                  }
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filters.status !== 'all' || filters.brand !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Las tareas aparecerán aquí cuando se creen desde las marcas'
                  }
                </p>
              </div>
            )}
          </motion.div>
        </div>
      );
    }