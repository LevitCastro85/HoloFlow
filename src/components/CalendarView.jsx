import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Calendar as CalendarIcon,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const statusColors = {
  'en-fila': 'bg-gray-200 text-gray-800',
  'en-proceso': 'bg-blue-200 text-blue-800',
  'entregado': 'bg-green-200 text-green-800',
  'revision': 'bg-yellow-200 text-yellow-800',
  'requiere-atencion': 'bg-red-200 text-red-800'
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    client: '',
    type: '',
    responsible: ''
  });

  useEffect(() => {
    // This component appears to be using legacy localStorage data.
    // It should be updated to use the supabaseHelpers.
    const savedTasks = localStorage.getItem('creativeTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Días del siguiente mes para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return taskDate.toDateString() === date.toDateString();
    }).filter(task => {
      if (filters.client && !task.client?.name.toLowerCase().includes(filters.client.toLowerCase())) return false;
      if (filters.type && task.service?.name !== filters.type) return false;
      if (filters.responsible && !task.assigned_collaborator?.name.toLowerCase().includes(filters.responsible.toLowerCase())) return false;
      return true;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const uniqueClients = [...new Set(tasks.map(t => t.client?.name).filter(Boolean))];
  const uniqueTypes = [...new Set(tasks.map(t => t.service?.name).filter(Boolean))];
  const uniqueResponsibles = [...new Set(tasks.map(t => t.assigned_collaborator?.name).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Entregas</h1>
          <p className="text-gray-600 mt-1">Vista mensual de tareas programadas</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={filters.client}
              onChange={(e) => setFilters(prev => ({ ...prev, client: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos los clientes</option>
              {uniqueClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos los tipos</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filters.responsible}
              onChange={(e) => setFilters(prev => ({ ...prev, responsible: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Todos los responsables</option>
              {uniqueResponsibles.map(resp => (
                <option key={resp} value={resp}>{resp}</option>
              ))}
            </select>
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
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
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
                      className={`text-xs p-1 rounded truncate ${statusColors[task.status]}`}
                      title={`${task.title} - ${task.client?.name} - ${task.assigned_collaborator?.name || 'Sin asignar'}`}
                    >
                      {task.title}
                    </motion.div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayTasks.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Leyenda */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Leyenda de Estados</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, colorClass]) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded ${colorClass}`}></div>
              <span className="text-sm text-gray-700 capitalize">
                {status.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}