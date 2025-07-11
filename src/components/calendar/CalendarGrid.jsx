import React from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertTriangle, User, Palette } from 'lucide-react';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const statusColors = {
  'en-fila': 'bg-gray-100 text-gray-800 border-gray-300',
  'en-proceso': 'bg-blue-100 text-blue-800 border-blue-300',
  'revision': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'entregado': 'bg-green-100 text-green-800 border-green-300',
  'requiere-atencion': 'bg-red-100 text-red-800 border-red-300'
};

const priorityColors = {
  'normal': 'border-l-gray-400',
  'alta': 'border-l-orange-400',
  'urgente': 'border-l-red-500'
};

export default function CalendarGrid({
  days,
  calendarView,
  viewMode,
  selectedBrand,
  getTasksForDate,
  isTaskOverdue,
  isTaskUrgent,
  onTaskClick,
  onDateClick,
  onDragStart,
  onDragOver,
  onDrop
}) {
  return (
    <>
      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map(day => (
          <div key={day} className="p-4 text-center font-medium text-gray-700 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Grilla del calendario */}
      <div className={`grid grid-cols-7 ${calendarView === 'week' ? 'min-h-[400px]' : ''}`}>
        {days.map((day, index) => {
          const dayTasks = getTasksForDate(day.date);
          const isToday = day.date.toDateString() === new Date().toDateString();
          const canCreateTask = viewMode === 'brand' && selectedBrand && day.isCurrentMonth;
          
          return (
            <div
              key={index}
              className={`${calendarView === 'month' ? 'min-h-[120px]' : 'min-h-[400px]'} p-2 border-r border-b last:border-r-0 ${
                !day.isCurrentMonth ? 'bg-gray-50' : ''
              } ${isToday ? 'bg-blue-50' : ''} ${canCreateTask ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={() => canCreateTask && onDateClick(day.date)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, day.date)}
            >
              <div className={`text-sm font-medium mb-2 flex items-center justify-between ${
                !day.isCurrentMonth ? 'text-gray-400' : 
                isToday ? 'text-blue-600' : 'text-gray-900'
              }`}>
                <span>{day.date.getDate()}</span>
                {canCreateTask && dayTasks.length === 0 && (
                  <Plus className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                )}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, calendarView === 'month' ? 3 : 10).map((task, taskIndex) => {
                  const isOverdue = isTaskOverdue(task);
                  const isUrgent = isTaskUrgent(task);
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: taskIndex * 0.1 }}
                      className={`text-xs p-2 rounded border-l-4 cursor-pointer hover:shadow-sm transition-all ${
                        statusColors[task.estado]
                      } ${priorityColors[task.prioridad]} ${
                        isOverdue ? 'bg-red-50 border-red-200' : ''
                      } ${isUrgent ? 'bg-orange-50 border-orange-200' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      draggable={viewMode === 'brand'}
                      onDragStart={(e) => onDragStart(e, task)}
                      title={`${task.titulo} - ${task.marcaNombre} - ${task.responsable || 'Sin asignar'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate flex-1">{task.titulo}</span>
                        {(isOverdue || isUrgent) && (
                          <AlertTriangle className={`w-3 h-3 ml-1 ${isOverdue ? 'text-red-500' : 'text-orange-500'}`} />
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        {viewMode === 'general' && (
                          <div className="flex items-center space-x-1">
                            <Palette className="w-2 h-2 text-purple-600" />
                            <span className="font-medium">{task.marcaNombre}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="bg-gray-200 px-1 rounded">{task.tipoContenido}</span>
                          {task.responsable && (
                            <span className="flex items-center">
                              <User className="w-2 h-2 mr-1" />
                              {task.responsable.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {dayTasks.length > (calendarView === 'month' ? 3 : 10) && (
                  <div className="text-xs text-gray-500 font-medium p-1">
                    +{dayTasks.length - (calendarView === 'month' ? 3 : 10)} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}