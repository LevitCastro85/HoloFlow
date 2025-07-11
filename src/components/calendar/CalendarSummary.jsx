import React from 'react';

export default function CalendarSummary({
  tasks,
  currentDate,
  calendarView,
  getWeekDays,
  isTaskOverdue,
  isTaskUrgent,
  viewMode,
  selectedBrand
}) {
  const getTasksInPeriod = () => {
    return tasks.filter(t => {
      if (!t.fechaEntrega) return false;
      const taskDate = new Date(t.fechaEntrega);
      const startOfPeriod = calendarView === 'month' 
        ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        : getWeekDays(currentDate)[0].date;
      const endOfPeriod = calendarView === 'month'
        ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        : getWeekDays(currentDate)[6].date;
      return taskDate >= startOfPeriod && taskDate <= endOfPeriod;
    });
  };

  const periodTasks = getTasksInPeriod();
  
  // Resúmenes por marca
  const brandSummary = {};
  periodTasks.forEach(task => {
    if (!brandSummary[task.marcaNombre]) {
      brandSummary[task.marcaNombre] = {
        total: 0,
        entregadas: 0,
        vencidas: 0,
        urgentes: 0
      };
    }
    brandSummary[task.marcaNombre].total++;
    if (task.estado === 'entregado') brandSummary[task.marcaNombre].entregadas++;
    if (isTaskOverdue(task)) brandSummary[task.marcaNombre].vencidas++;
    if (isTaskUrgent(task)) brandSummary[task.marcaNombre].urgentes++;
  });

  // Resúmenes por tipo
  const typeSummary = {};
  periodTasks.forEach(task => {
    if (!typeSummary[task.tipoContenido]) {
      typeSummary[task.tipoContenido] = 0;
    }
    typeSummary[task.tipoContenido]++;
  });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Estadísticas generales */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Resumen del Período</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total de tareas</span>
            <span className="font-semibold text-gray-900">{periodTasks.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tareas vencidas</span>
            <span className="font-semibold text-red-600">
              {periodTasks.filter(t => isTaskOverdue(t)).length}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tareas urgentes</span>
            <span className="font-semibold text-orange-600">
              {periodTasks.filter(t => isTaskUrgent(t)).length}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Completadas</span>
            <span className="font-semibold text-green-600">
              {periodTasks.filter(t => t.estado === 'entregado').length}
            </span>
          </div>
        </div>

        {viewMode === 'brand' && selectedBrand && (
          <div className="mt-4 pt-4 border-t">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>Tip:</strong> Haz clic en cualquier día para crear una nueva tarea. 
                Arrastra las tareas existentes para reprogramar fechas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resúmenes por marca o tipo */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          {viewMode === 'general' ? 'Resumen por Marca' : 'Resumen por Tipo de Contenido'}
        </h3>
        
        {viewMode === 'general' ? (
          <div className="space-y-3">
            {Object.entries(brandSummary).slice(0, 5).map(([marca, stats]) => (
              <div key={marca} className="border border-gray-200 rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-2">{marca}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entregadas:</span>
                    <span className="font-medium text-green-600">{stats.entregadas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vencidas:</span>
                    <span className="font-medium text-red-600">{stats.vencidas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgentes:</span>
                    <span className="font-medium text-orange-600">{stats.urgentes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(typeSummary).map(([tipo, count]) => (
              <div key={tipo} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{tipo}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}