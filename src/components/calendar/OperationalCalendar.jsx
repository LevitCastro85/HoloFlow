import React from 'react';
import { motion } from 'framer-motion';
import { useOperationalCalendar } from '@/hooks/useOperationalCalendar';
import BrandTaskForm from '@/components/task/BrandTaskForm';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarFilters from '@/components/calendar/CalendarFilters';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import CalendarSummary from '@/components/calendar/CalendarSummary';
import CalendarTaskModal from '@/components/calendar/CalendarTaskModal';
import CalendarLegend from '@/components/calendar/CalendarLegend';

export default function OperationalCalendar() {
  const {
    state,
    actions,
    calendarData,
  } = useOperationalCalendar();

  const {
    viewMode,
    selectedBrand,
    tasks,
    brands,
    clients,
    showTaskModal,
    selectedTask,
    showTaskForm,
    selectedDate,
  } = state;

  const {
    handleTaskSave,
    handleCloseModals,
  } = actions;

  if (showTaskForm && selectedDate && selectedBrand) {
    const client = clients.find(c => c.id === selectedBrand.client_id);
    return (
      <BrandTaskForm
        brand={selectedBrand}
        client={client}
        editingTask={{
          due_date: selectedDate.toISOString().split('T')[0],
          request_date: new Date().toISOString().split('T')[0]
        }}
        onSave={handleTaskSave}
        onCancel={handleCloseModals}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CalendarHeader
        viewMode={viewMode}
        selectedBrand={selectedBrand}
        currentDate={calendarData.currentDate}
        calendarView={calendarData.calendarView}
        setCalendarView={calendarData.setCalendarView}
        onNavigate={calendarData.navigateDate}
        getWeekDays={calendarData.getWeekDays}
      />

      <CalendarFilters
        filters={state.filters}
        setFilters={actions.setFilters}
        brands={brands}
        responsibles={calendarData.uniqueResponsibles}
        types={calendarData.uniqueTypes}
        viewMode={viewMode}
        selectedBrand={selectedBrand}
        onBrandSelect={actions.handleBrandSelect}
      />

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">
          📅 Calendario Operativo - Planificación Temporal
        </h3>
        <p className="text-green-700 text-sm">
          Vista enfocada exclusivamente en fechas de entrega y planificación de carga de trabajo. 
          Ideal para visualizar distribución temporal y gestionar capacidad semanal/mensual.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        <CalendarGrid
          days={calendarData.days}
          calendarView={calendarData.calendarView}
          viewMode={viewMode}
          selectedBrand={selectedBrand}
          getTasksForDate={calendarData.getTasksForDate}
          isTaskOverdue={calendarData.isTaskOverdue}
          isTaskUrgent={calendarData.isTaskUrgent}
          onTaskClick={actions.handleTaskClick}
          onDateClick={actions.handleDateClick}
          onDragStart={actions.handleDragStart}
          onDragOver={actions.handleDragOver}
          onDrop={actions.handleDrop}
        />
      </motion.div>

      <CalendarSummary
        tasks={tasks}
        currentDate={calendarData.currentDate}
        calendarView={calendarData.calendarView}
        getWeekDays={calendarData.getWeekDays}
        isTaskOverdue={calendarData.isTaskOverdue}
        isTaskUrgent={calendarData.isTaskUrgent}
        viewMode={viewMode}
        selectedBrand={selectedBrand}
      />

      <CalendarLegend />

      {showTaskModal && selectedTask && (
        <CalendarTaskModal
          task={selectedTask}
          onClose={handleCloseModals}
          onEdit={() => {
            // Lógica para editar tarea
          }}
        />
      )}
    </div>
  );
}