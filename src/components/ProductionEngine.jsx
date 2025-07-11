import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Palette,
  UserX,
  Edit3,
  List,
  Calendar,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ProductionCalendarView from '@/components/production/ProductionCalendarView';
import ProductionTaskActions from '@/components/production/ProductionTaskActions';
import ProductionFilters from '@/components/production/ProductionFilters';
import ProductionMetrics from '@/components/production/ProductionMetrics';
import { useProductionEngine } from '@/hooks/useProductionEngine';

const estadosTarea = {
  'en-fila': { label: 'En Fila', color: 'text-gray-600 bg-gray-100' },
  'en-proceso': { label: 'En Proceso', color: 'text-blue-600 bg-blue-100' },
  'revision': { label: 'En Revisión', color: 'text-yellow-600 bg-yellow-100' },
  'entregado': { label: 'Entregado', color: 'text-green-600 bg-green-100' },
  'requiere-atencion': { label: 'Requiere Atención', color: 'text-red-600 bg-red-100' }
};

const prioridades = {
  'baja': { label: 'Baja', color: 'text-gray-500', icon: '⚪' },
  'normal': { label: 'Normal', color: 'text-blue-600', icon: '🔵' },
  'alta': { label: 'Alta', color: 'text-orange-600', icon: '🟠' },
  'urgente': { label: 'Urgente', color: 'text-red-600', icon: '🔴' }
};

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
    loading
  } = useProductionEngine();
  
  const updateTaskStatus = (taskId, newStatus) => {
    actions.updateTask(taskId, { status: newStatus });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (viewMode === 'calendar') {
    return (
      <ProductionCalendarView
        tasks={tasks}
        brands={brands}
        onBackToTable={() => setViewMode('table')}
        onTaskUpdate={actions.updateTask}
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
        filterStatus={filters.status}
        setFilterStatus={(value) => handleFilterChange('status', value)}
        filterBrand={filters.brand}
        setFilterBrand={(value) => handleFilterChange('brand', value)}
        filterResponsible={filters.responsible}
        setFilterResponsible={(value) => handleFilterChange('responsible', value)}
        filterType={filters.type}
        setFilterType={(value) => handleFilterChange('type', value)}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Tarea</th>
                <th className="text-left p-4 font-semibold text-gray-900">Marca</th>
                <th className="text-left p-4 font-semibold text-gray-900">Tipo</th>
                <th className="text-left p-4 font-semibold text-gray-900">Responsable</th>
                <th className="text-left p-4 font-semibold text-gray-900">Estado</th>
                <th className="text-left p-4 font-semibold text-gray-900">Prioridad</th>
                <th className="text-left p-4 font-semibold text-gray-900">Entrega</th>
                <th className="text-left p-4 font-semibold text-gray-900">Automatización IA</th>
                <th className="text-left p-4 font-semibold text-gray-900">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{task.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-900">{task.brand?.name}</div>
                        <div className="text-sm text-gray-600">{task.brand?.client?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {task.service?.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{task.assigned_collaborator?.name || 'Sin asignar'}</span>
                      {!task.assigned_collaborator && (
                        <UserX className="w-4 h-4 text-orange-500" title="Sin asignar" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 ${estadosTarea[task.status]?.color || 'text-gray-600 bg-gray-100'}`}
                    >
                      {Object.entries(estadosTarea).map(([key, estado]) => (
                        <option key={key} value={key}>{estado.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${prioridades[task.priority]?.color || 'text-gray-600'}`}>
                      {prioridades[task.priority]?.icon} {prioridades[task.priority]?.label || 'Normal'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {new Date(task.due_date).toLocaleDateString('es-ES')}
                      </div>
                      {task.status !== 'entregado' && new Date(task.due_date) < new Date() && (
                        <div className="text-red-600 text-xs font-medium">Vencida</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {task.ai_automation ? (
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-700 line-clamp-1">{task.ai_automation}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sin automatización</span>
                    )}
                  </td>
                  <td className="p-4">
                    <ProductionTaskActions
                      task={task}
                      collaborators={collaborators}
                      onAddAI={() => actions.updateTask(task.id, { ai_automation: 'IA: Edición de color' })}
                      onReschedule={(newDate) => actions.updateTask(task.id, { due_date: newDate })}
                      onReassign={(newResponsibleId) => actions.updateTask(task.id, { assigned_to: newResponsibleId })}
                      onDuplicate={() => actions.duplicateTask(task.id)}
                      onOpenBranding={() => toast({ title: "Navegación a Branding Control no implementada" })}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
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