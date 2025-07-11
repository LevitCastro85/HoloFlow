import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Palette, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const statusColors = {
  'en-fila': 'bg-gray-100 text-gray-800 border-gray-300',
  'en-proceso': 'bg-blue-100 text-blue-800 border-blue-300',
  'revision': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'entregado': 'bg-green-100 text-green-800 border-green-300',
  'requiere-atencion': 'bg-red-100 text-red-800 border-red-300'
};

export default function ProductionCalendarView({ tasks, brands, onBackToTable, onTaskUpdate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.fechaEntrega) return false;
      const taskDate = new Date(task.fechaEntrega);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const hasDelivery = (task) => {
    const savedDeliveries = localStorage.getItem('taskDeliveries');
    if (savedDeliveries) {
      const allDeliveries = JSON.parse(savedDeliveries);
      return allDeliveries.some(d => d.taskId === task.id);
    }
    return false;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBackToTable}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Tabla
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vista Calendario - Motor de Producción</h1>
            <p className="text-gray-600">Gestión visual de tareas por fecha de entrega con entregables</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        {/* Header del calendario */}
        <div className="flex items-center justify-between p-6 border-b">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center font-medium text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Grilla del calendario */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayTasks = getTasksForDate(day.date);
            const isToday = day.date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  !day.isCurrentMonth ? 'text-gray-400' : 
                  isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: taskIndex * 0.1 }}
                      className={`text-xs p-2 rounded border cursor-pointer hover:shadow-sm transition-all ${
                        statusColors[task.estado]
                      }`}
                      title={`${task.titulo} - ${task.marcaNombre} - ${task.responsable || 'Sin asignar'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <Palette className="w-2 h-2 text-purple-600" />
                          <span className="font-medium truncate flex-1">{task.titulo}</span>
                        </div>
                        {hasDelivery(task) && (
                          <div className="flex space-x-1">
                            <Eye className="w-2 h-2 text-green-600" title="Tiene entregables" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>{task.marcaNombre}</div>
                        <div className="flex items-center justify-between">
                          <span>{task.tipoContenido}</span>
                          {task.responsable && ['en-proceso', 'requiere-atencion'].includes(task.estado) && (
                            <Upload className="w-2 h-2 text-blue-600" title="Puede subir entregables" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium p-1">
                      +{dayTasks.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Información */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">
          📅 Vista Calendario del Motor de Producción Conectado
        </h3>
        <p className="text-purple-700 text-sm">
          Esta vista te permite visualizar las tareas por fecha de entrega con indicadores de entregables. 
          Los iconos muestran si una tarea tiene entregables subidos o si puede recibir nuevos entregables.
        </p>
      </div>
    </div>
  );
}